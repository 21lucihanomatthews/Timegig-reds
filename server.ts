import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import * as dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

// Lazy initialize Gemini API client to prevent crash if key is missing
let aiClient: GoogleGenAI | null = null;
function getAI() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      aiClient = new GoogleGenAI({ apiKey });
    }
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase payload limit for base64 images
  app.use(express.json({ limit: '10mb' }));

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Identity Verification System API Route
  app.post("/api/verify-identity", async (req, res) => {
    try {
      const { profileData, idData, faceMatch } = req.body;

      const profileName = profileData?.name;
      const profileDob = profileData?.dob;
      const idName = idData?.name;
      const idDob = idData?.dob;
      const idNumber = idData?.idNumber;
      const faceMatchResult = faceMatch?.match;
      const faceMatchConfidence = faceMatch?.confidence !== undefined ? Number(faceMatch.confidence) : NaN;

      // Deterministic validation based on strict user rules
      let deterministicStatus: "approved" | "rejected" | "pending" = "approved";
      const reasons: string[] = [];

      const clarity = req.body.idData?.clarity !== undefined ? Number(req.body.idData.clarity) : 100;
      const isMissing = !profileName?.trim() || !profileDob?.trim() || !idName?.trim() || !idDob?.trim() || faceMatchResult === undefined || isNaN(faceMatchConfidence);

      if (isMissing) {
        deterministicStatus = "pending";
        reasons.push("Missing required data (Full Name, Date of Birth, ID OCR name, ID OCR DOB, or Face Match data) to complete verification.");
      } else if (clarity < 70) {
        deterministicStatus = "pending";
        reasons.push(`ID document image quality is low (${clarity}%). Status: PENDING REVIEW for manual inspection.`);
      } else {
        // Compare names (normalize: lowercase, strip non-alphanumeric)
        const n1 = profileName.toLowerCase().replace(/[^a-z0-9]/g, "").trim();
        const n2 = idName.toLowerCase().replace(/[^a-z0-9]/g, "").trim();
        const namesMatch = n1 === n2;

        // Compare date of birth
        const d1 = new Date(profileDob);
        const d2 = new Date(idDob);
        let dobsMatch = false;
        if (!isNaN(d1.getTime()) && !isNaN(d2.getTime())) {
          dobsMatch = d1.getUTCFullYear() === d2.getUTCFullYear() &&
                      d1.getUTCMonth() === d2.getUTCMonth() &&
                      d1.getUTCDate() === d2.getUTCDate();
        } else {
          dobsMatch = String(profileDob).trim().toLowerCase() === String(idDob).trim().toLowerCase();
        }

        // Check face match
        const isFaceMatched = faceMatchResult === true || String(faceMatchResult).toLowerCase() === "true";
        const isFaceConfidenceHigh = faceMatchConfidence > 80;

        if (!namesMatch) {
          deterministicStatus = "rejected";
          reasons.push("Full Name on profile does not match the name extracted from the ID document.");
        }
        if (!dobsMatch) {
          deterministicStatus = "rejected";
          reasons.push("Date of Birth on profile does not match the Date of Birth on the ID document.");
        }
        if (!isFaceMatched || !isFaceConfidenceHigh) {
          deterministicStatus = "rejected";
          if (!isFaceMatched) {
            reasons.push("Selfie face match comparison returned negative (does not match the ID photo).");
          } else {
            reasons.push(`Selfie face match confidence is ${faceMatchConfidence}%, which is not above the required 80% threshold.`);
          }
        }
      }

      if (deterministicStatus === "approved" && reasons.length === 0) {
        reasons.push("All comparison rules passed successfully (Name match, DOB match, and Selfie match confidence > 80%).");
      }

      // Try AI-powered verification if Gemini API is available
      const ai = getAI();
      if (ai) {
        try {
          const prompt = `
You are an admin verifying user identity.

Check the uploaded ID document and selfie against the user’s profile information.

Verify:
- Does the full name on the ID match the profile name?
- Does the photo on the ID match the selfie?
- Is the ID document clear and valid? (Image Clarity: ${clarity}%)

Input Data to analyze:
1. User Profile Data:
- Full Name: "${profileName || 'Missing'}"
- Date of Birth: "${profileDob || 'Missing'}"

2. OCR Extracted Data from ID Document:
- Name on ID: "${idName || 'Missing'}"
- ID Number: "${idNumber || 'Missing'}"
- Date of Birth on ID: "${idDob || 'Missing'}"

3. Face Match Result:
- Face matches? ${faceMatchResult !== undefined ? faceMatchResult : 'Missing'}
- Confidence score: ${!isNaN(faceMatchConfidence) ? faceMatchConfidence : 'Missing'}%

Rules to strictly follow:
- If everything matches (Name, DOB, Face Match > 80%, Clarity > 70%) → mark as "APPROVED"
- If anything does not match → mark as "REJECTED"
- If unclear or data is missing → mark as "PENDING REVIEW"

Output ONLY this JSON schema format:
{
  "verification_status": "approved | rejected | pending",
  "reason": "short explanation",
  "confidence_score": number
}
`;

          const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json"
            }
          });

          const resText = response.text?.trim() || "";
          const parsed = JSON.parse(resText);

          // Force the deterministic checks to safeguard compliance to strict rules
          let finalStatus = parsed.verification_status || deterministicStatus;
          let finalReason = parsed.reason || reasons.join(" ");
          let finalConfidence = typeof parsed.confidence_score === "number" ? parsed.confidence_score : (deterministicStatus === "approved" ? 95 : 10);

          if (deterministicStatus === "rejected") {
            finalStatus = "rejected";
            if (!finalReason.toLowerCase().includes("fail") && !finalReason.toLowerCase().includes("match")) {
              finalReason = `REJECTED: ${reasons.join(" ")}`;
            }
            finalConfidence = Math.min(finalConfidence, 40);
          } else if (deterministicStatus === "pending") {
            finalStatus = "pending";
            finalConfidence = Math.min(finalConfidence, 50);
          }

          return res.json({
            verification_status: finalStatus,
            reason: finalReason,
            confidence_score: finalConfidence
          });
        } catch (aiErr) {
          console.error("Gemini Verification Error, falling back to local:", aiErr);
          // Fall through to deterministic response
        }
      }

      // Local Deterministic Response
      return res.json({
        verification_status: deterministicStatus,
        reason: reasons.join(" "),
        confidence_score: deterministicStatus === "approved" ? 95 : (deterministicStatus === "pending" ? 50 : 15)
      });

    } catch (err: any) {
      console.error("Verify Identity route error:", err);
      res.status(500).json({
        verification_status: "pending",
        reason: "Internal server error running identity verification: " + err.message,
        confidence_score: 0
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
