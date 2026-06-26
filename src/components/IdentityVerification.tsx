import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  User, 
  Calendar, 
  CreditCard, 
  Sparkles, 
  ShieldCheck, 
  ShieldAlert, 
  ShieldQuestion, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  RotateCcw,
  Sliders,
  Database
} from "lucide-react";

// Preset configurations for testing
const PRESETS = [
  {
    id: "perfect_match",
    label: "Scenario A: Perfect Match",
    description: "Fully matching data & high confidence selfie.",
    profile: { name: "Thabo Ndlovu", dob: "1993-08-15" },
    idDocument: { name: "Thabo Ndlovu", idNumber: "9308155123085", dob: "1993-08-15" },
    faceMatch: { match: true, confidence: 92 },
    clarity: 98
  },
  {
    id: "name_mismatch",
    label: "Scenario B: Name Mismatch",
    description: "Profile name differs entirely from ID card name.",
    profile: { name: "Lerato Khumalo", dob: "1996-04-23" },
    idDocument: { name: "Lebogang Khumalo", idNumber: "9604230124083", dob: "1996-04-23" },
    faceMatch: { match: true, confidence: 87 },
    clarity: 95
  },
  {
    id: "dob_mismatch",
    label: "Scenario C: DOB Mismatch",
    description: "Date of Birth on profile does not align with ID.",
    profile: { name: "John William Smith", dob: "1988-12-05" },
    idDocument: { name: "John William Smith", idNumber: "8512055123089", dob: "1985-12-05" },
    faceMatch: { match: true, confidence: 95 },
    clarity: 92
  },
  {
    id: "low_confidence",
    label: "Scenario D: Low Face Confidence",
    description: "Face match score (72%) is below the 80% limit.",
    profile: { name: "Sarah Jane Govender", dob: "1991-10-30" },
    idDocument: { name: "Sarah Jane Govender", idNumber: "9110300124087", dob: "1991-10-30" },
    faceMatch: { match: true, confidence: 72 },
    clarity: 90
  },
  {
    id: "missing_fields",
    label: "Scenario E: Missing Fields",
    description: "ID OCR failed to extract the name correctly.",
    profile: { name: "Pieter de Wet", dob: "1982-01-14" },
    idDocument: { name: "", idNumber: "8201145123081", dob: "1982-01-14" },
    faceMatch: { match: true, confidence: 85 },
    clarity: 88
  },
  {
    id: "unclear_doc",
    label: "Scenario F: Unclear Document",
    description: "ID image quality is too low for auto-approval.",
    profile: { name: "Busi Cele", dob: "1994-07-02" },
    idDocument: { name: "Busi Cele", idNumber: "9407025123082", dob: "1994-07-02" },
    faceMatch: { match: true, confidence: 88 },
    clarity: 45
  }
];

export const IdentityVerification = () => {
  // Input fields state
  const [profileName, setProfileName] = useState(PRESETS[0].profile.name);
  const [profileDob, setProfileDob] = useState(PRESETS[0].profile.dob);
  
  const [idName, setIdName] = useState(PRESETS[0].idDocument.name);
  const [idDob, setIdDob] = useState(PRESETS[0].idDocument.dob);
  const [idNumber, setIdNumber] = useState(PRESETS[0].idDocument.idNumber);
  const [idClarity, setIdClarity] = useState(PRESETS[0].clarity);
  
  const [faceMatchResult, setFaceMatchResult] = useState(PRESETS[0].faceMatch.match);
  const [faceConfidence, setFaceConfidence] = useState(PRESETS[0].faceMatch.confidence);

  // Verification results state
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Apply a preset
  const handleApplyPreset = (preset: typeof PRESETS[0]) => {
    setProfileName(preset.profile.name);
    setProfileDob(preset.profile.dob);
    setIdName(preset.idDocument.name);
    setIdDob(preset.idDocument.dob);
    setIdNumber(preset.idDocument.idNumber);
    setIdClarity(preset.clarity);
    setFaceMatchResult(preset.faceMatch.match);
    setFaceConfidence(preset.faceMatch.confidence);
    setResult(null);
  };

  // Run the validation
  const handleVerify = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/verify-identity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          profileData: {
            name: profileName,
            dob: profileDob
          },
          idData: {
            name: idName,
            idNumber: idNumber,
            dob: idDob,
            clarity: idClarity
          },
          faceMatch: {
            match: faceMatchResult,
            confidence: faceConfidence
          }
        })
      });

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error("Verification failed:", err);
      // Client-side fallback in case server fails
      const n1 = profileName.toLowerCase().replace(/[^a-z0-9]/g, "").trim();
      const n2 = idName.toLowerCase().replace(/[^a-z0-9]/g, "").trim();
      const namesMatch = n1 === n2 && n1.length > 0;
      const dobsMatch = profileDob === idDob && profileDob.length > 0;
      const faceMatches = faceMatchResult && faceConfidence > 80;
      const isClear = idClarity > 70;

      let status = "approved";
      let reason = "All identity verification checks passed successfully.";

      if (!profileName || !profileDob || !idName || !idDob) {
        status = "pending";
        reason = "Missing required data fields to complete verification.";
      } else if (!isClear) {
        status = "pending";
        reason = `ID document image quality is low (${idClarity}%). Status: PENDING REVIEW for manual inspection.`;
      } else if (!namesMatch || !dobsMatch || !faceMatches) {
        status = "rejected";
        const fails = [];
        if (!namesMatch) fails.push("Names do not match");
        if (!dobsMatch) fails.push("DOB does not match");
        if (!faceMatches) fails.push("Face match fails or confidence <= 80%");
        reason = `REJECTED: ${fails.join(", ")}.`;
      }

      setResult({
        verification_status: status,
        reason: reason,
        confidence_score: status === "approved" ? 95 : (status === "pending" ? 50 : 15)
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    handleApplyPreset(PRESETS[0]);
    setResult(null);
  };

  return (
    <div className="bg-slate-50 p-4 sm:p-6 rounded-[2rem] border border-slate-100 shadow-xl max-w-5xl mx-auto my-4 font-sans text-slate-800">
      {/* System Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-200/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-gradient-to-tr from-red-600 to-indigo-600 rounded-xl text-white shadow-md">
              <ShieldCheck size={20} />
            </span>
            <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">
              Identity Verification Engine
            </h2>
          </div>
          <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest leading-relaxed">
            Automatic KYC cross-check validator comparing Profile Data, ID Document OCR & biometric selfies
          </p>
        </div>
        <button
          onClick={handleReset}
          className="self-start md:self-auto flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 active:scale-95 transition text-[10px] font-black uppercase tracking-wider text-slate-500 shadow-sm"
        >
          <RotateCcw size={12} /> Reset to Defaults
        </button>
      </div>

      {/* Preset Scenarios Grid */}
      <div className="mb-6">
        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2.5 block">
          Select a Testing Preset Scenario:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleApplyPreset(preset)}
              className="p-3 bg-white border border-slate-200/80 rounded-2xl hover:border-indigo-500 hover:shadow-md hover:shadow-indigo-50/20 active:scale-[0.98] transition text-left flex flex-col justify-between h-full group"
            >
              <div>
                <p className="font-black text-slate-800 text-[11px] group-hover:text-indigo-600 transition leading-tight mb-1">
                  {preset.label.split(": ")[1]}
                </p>
                <p className="text-[9px] text-slate-400 font-medium leading-snug">
                  {preset.description}
                </p>
              </div>
              <span className="mt-2 text-[8px] font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-600/70">
                Apply Presets
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Forms Column */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Module 1: User Profile Data */}
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-md">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
              <span className="p-1 bg-amber-50 rounded-lg text-amber-500">
                <User size={14} />
              </span>
              <h3 className="font-black text-xs text-slate-800 uppercase tracking-wider">
                1. User Profile Data
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1 block">Full Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  placeholder="e.g. Thabo Ndlovu"
                />
              </div>
              <div>
                <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1 block">Date of Birth</label>
                <input
                  type="date"
                  value={profileDob}
                  onChange={(e) => setProfileDob(e.target.value)}
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Module 2: ID Document OCR Data */}
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-md">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
              <span className="p-1 bg-rose-50 rounded-lg text-rose-500">
                <CreditCard size={14} />
              </span>
              <h3 className="font-black text-xs text-slate-800 uppercase tracking-wider">
                2. OCR Extracted ID Document Data
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="sm:col-span-2">
                <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1 block">Name on ID Document</label>
                <input
                  type="text"
                  value={idName}
                  onChange={(e) => setIdName(e.target.value)}
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  placeholder="Leave empty to simulate extraction failure"
                />
              </div>
              <div>
                <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1 block">Date of Birth on ID</label>
                <input
                  type="date"
                  value={idDob}
                  onChange={(e) => setIdDob(e.target.value)}
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
              <div className="sm:col-span-3">
                <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1 block">National ID Number (OCR)</label>
                <input
                  type="text"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  placeholder="e.g. 9308155123085"
                />
              </div>

              <div className="sm:col-span-3">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[9px] font-black uppercase tracking-wider text-slate-400">ID Image Clarity & Validity</label>
                  <span className={`text-[11px] font-black ${idClarity > 70 ? "text-emerald-500" : "text-amber-500"}`}>{idClarity}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={idClarity}
                  onChange={(e) => setIdClarity(Number(e.target.value))}
                  className="w-full accent-rose-500 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tight mt-1 block">Must be &gt;70% for auto-approval. Below 70% triggers PENDING REVIEW.</span>
              </div>
            </div>
          </div>

          {/* Module 3: Face Match Biometrics */}
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-md">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
              <span className="p-1 bg-indigo-50 rounded-lg text-indigo-500">
                <Sliders size={14} />
              </span>
              <h3 className="font-black text-xs text-slate-800 uppercase tracking-wider">
                3. Face Match Result
              </h3>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setFaceMatchResult(!faceMatchResult)}
                  className={`w-12 h-6.5 rounded-full relative transition-colors duration-300 flex items-center px-1 shrink-0 ${
                    faceMatchResult ? "bg-emerald-500" : "bg-slate-200"
                  }`}
                >
                  <span className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${
                    faceMatchResult ? "translate-x-5" : "translate-x-0"
                  }`} />
                </button>
                <div>
                  <p className="text-xs font-black text-slate-800 leading-tight">Face Matches Selfie?</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Biometric facial verification</p>
                </div>
              </div>

              <div className="flex-1 w-full sm:max-w-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Match Confidence Score</span>
                  <span className={`text-[11px] font-black ${faceConfidence > 80 ? "text-emerald-500" : "text-rose-500"}`}>{faceConfidence}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={faceConfidence}
                  onChange={(e) => setFaceConfidence(Number(e.target.value))}
                  className="w-full accent-indigo-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tight mt-1 block">Must be &gt;80% for auto-approval</span>
              </div>
            </div>
          </div>

          {/* Trigger Button */}
          <button
            onClick={handleVerify}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-red-600 to-indigo-600 hover:from-red-700 hover:to-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 transition duration-150 active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em]"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Evaluating verification rules...
              </>
            ) : (
              <>
                <Sparkles size={14} /> Run System Verification
              </>
            )}
          </button>

        </div>

        {/* Results & Code Panel Column */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Main Visual Result Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-md flex flex-col justify-between h-full min-h-[300px]">
            <div>
              <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-4 pb-2 border-b border-slate-100">
                Verification Report
              </h3>

              {!result && !loading && (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                    <ShieldQuestion size={32} />
                  </div>
                  <p className="font-black text-slate-800 text-sm tracking-tight">System Ready</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 px-4 leading-normal">
                    Provide or adjust input values, then click 'Run Verification' to evaluate.
                  </p>
                </div>
              )}

              {loading && (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4 animate-pulse">
                    <Database size={24} className="text-indigo-600" />
                  </div>
                  <p className="font-black text-indigo-600 text-xs uppercase tracking-widest">Calling API Endpoints...</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 leading-normal px-6">
                    Parsing OCR data, comparing user profiles & computing face match accuracy
                  </p>
                </div>
              )}

              {result && !loading && (
                <div className="space-y-4">
                  {/* Status Indicator */}
                  <div className="flex items-center gap-3">
                    {result.verification_status === "approved" && (
                      <>
                        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner shrink-0 text-xl border-4 border-white">
                          ✓
                        </div>
                        <div>
                          <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                            APPROVED
                          </span>
                          <h4 className="font-black text-slate-800 text-base leading-tight mt-0.5">Approved System Validation</h4>
                        </div>
                      </>
                    )}

                    {result.verification_status === "rejected" && (
                      <>
                        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shadow-inner shrink-0 text-xl border-4 border-white">
                          ✗
                        </div>
                        <div>
                          <span className="bg-rose-100 text-rose-700 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                            REJECTED
                          </span>
                          <h4 className="font-black text-slate-800 text-base leading-tight mt-0.5">Verification Failed</h4>
                        </div>
                      </>
                    )}

                    {result.verification_status === "pending" && (
                      <>
                        <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shadow-inner shrink-0 text-xl border-4 border-white">
                          ?
                        </div>
                        <div>
                          <span className="bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                            PENDING REVIEW
                          </span>
                          <h4 className="font-black text-slate-800 text-base leading-tight mt-0.5">Manual Inspection Required</h4>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Reasons & Detail */}
                  <div className="bg-slate-50/75 p-3.5 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                      Reason / Analysis
                    </p>
                    <p className="text-xs font-bold text-slate-700 leading-relaxed">
                      {result.reason}
                    </p>
                  </div>

                  {/* Score */}
                  <div className="flex items-center justify-between p-3.5 bg-slate-50/75 rounded-2xl border border-slate-100">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Confidence Score
                      </p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">
                        Biometric & OCR Match Level
                      </p>
                    </div>
                    <span className={`text-2xl font-black ${
                      result.verification_status === "approved" ? "text-emerald-500" : (result.verification_status === "pending" ? "text-amber-500" : "text-rose-500")
                    }`}>
                      {result.confidence_score}%
                    </span>
                  </div>

                  {/* Summary Check checklist */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">
                      Checklist Breakdown
                    </p>
                    
                    {/* Check 1: Name match */}
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <User size={13} className="opacity-70" /> Name Match (Profile vs ID)
                      </span>
                      {profileName.toLowerCase().replace(/[^a-z0-9]/g, "").trim() === idName.toLowerCase().replace(/[^a-z0-9]/g, "").trim() && profileName.length > 0 ? (
                        <span className="text-emerald-600 flex items-center gap-0.5 font-bold"><CheckCircle size={12} /> Match</span>
                      ) : (
                        <span className="text-rose-500 flex items-center gap-0.5 font-bold"><XCircle size={12} /> Mismatch</span>
                      )}
                    </div>

                    {/* Check 2: DOB match */}
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Calendar size={13} className="opacity-70" /> DOB Match (Profile vs ID)
                      </span>
                      {profileDob === idDob && profileDob.length > 0 ? (
                        <span className="text-emerald-600 flex items-center gap-0.5 font-bold"><CheckCircle size={12} /> Match</span>
                      ) : (
                        <span className="text-rose-500 flex items-center gap-0.5 font-bold"><XCircle size={12} /> Mismatch</span>
                      )}
                    </div>

                    {/* Check 3: Face match and confidence */}
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Sliders size={13} className="opacity-70" /> Selfie Biometric Match &gt;80%
                      </span>
                      {faceMatchResult && faceConfidence > 80 ? (
                        <span className="text-emerald-600 flex items-center gap-0.5 font-bold"><CheckCircle size={12} /> High ({faceConfidence}%)</span>
                      ) : (
                        <span className="text-rose-500 flex items-center gap-0.5 font-bold"><XCircle size={12} /> {faceMatchResult ? "Low" : "Failed"} ({faceConfidence}%)</span>
                      )}
                    </div>

                    {/* Check 4: ID Clarity */}
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Sparkles size={13} className="opacity-70" /> ID Document Clarity &gt;70%
                      </span>
                      {idClarity > 70 ? (
                        <span className="text-emerald-600 flex items-center gap-0.5 font-bold"><CheckCircle size={12} /> Valid ({idClarity}%)</span>
                      ) : (
                        <span className="text-amber-500 flex items-center gap-0.5 font-bold"><AlertCircle size={12} /> Unclear ({idClarity}%)</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* JSON Output Viewer - ALWAYS DISPLAYED when result exists */}
            {result && !loading && (
              <div className="mt-5 pt-3 border-t border-slate-100">
                <p className="text-[9px] font-black uppercase tracking-widest text-indigo-500 mb-1.5 flex items-center gap-1.5">
                  <span>●</span> Exact JSON Response Output:
                </p>
                <div className="p-3 bg-slate-900 rounded-xl font-mono text-[9px] text-indigo-300 overflow-x-auto shadow-inner border border-slate-800">
                  <pre>{JSON.stringify(result, null, 2)}</pre>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
