-- GIGS SA SUPABASE DATABASE SCHEMA
-- This SQL script sets up the full database schema required for Gigs SA.
-- Run this in your Supabase SQL Editor (https://supabase.com) to create or update your tables.

-- =====================================================================
-- 1. EXTENSIONS (If not already enabled)
-- =====================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================================
-- 2. USER PROFILES TABLE
-- =====================================================================
-- This table stores public and system-level profile information for users.
-- It links directly to the Supabase auth.users table.
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name TEXT,
    surname TEXT,
    phone TEXT,
    email TEXT,
    dob TEXT DEFAULT '1995-05-12', -- User's Date of Birth (Required for Identity Verification)
    face_picture TEXT DEFAULT '', -- URL or base64 of user's face picture / selfie
    is_verified BOOLEAN DEFAULT FALSE, -- Set to TRUE once verified (Default: FALSE)
    balance NUMERIC DEFAULT 500.00, -- User's wallet balance in Coins
    pin TEXT, -- Security lock PIN code
    is_disabled BOOLEAN DEFAULT FALSE, -- Account suspension flag
    certificate_document TEXT, -- URL or name of certificate document
    province TEXT DEFAULT 'Gauteng', -- South African Province
    location TEXT DEFAULT 'Johannesburg', -- City/Suburb
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profile
CREATE POLICY "Users can view their own profile" 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert their own profile" 
    ON public.profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- =====================================================================
-- 3. AUTOMATIC PROFILE CREATION TRIGGER
-- =====================================================================
-- This trigger automatically inserts a corresponding profile row whenever
-- a new user signs up in Supabase Auth.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name, email, balance, is_verified, dob)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'name', ''),
        new.email,
        500.00, -- Starting sign-up bonus balance
        TRUE, -- Verified by default for testing purposes
        '1995-05-12' -- Default date of birth
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger if it doesn't exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================================
-- 4. GIGS TABLE
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.gigs (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    description TEXT,
    price TEXT, -- Stored as text to accommodate custom rates (e.g., "R150/hr")
    province TEXT,
    location TEXT,
    category TEXT,
    owner_id UUID REFERENCES auth.users(id),
    owner_name TEXT,
    owner_avatar TEXT,
    media JSONB DEFAULT '[]'::jsonb, -- Array of media objects: [{type: "image", url: "..."}]
    interested_count INTEGER DEFAULT 0,
    applied_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on gigs
ALTER TABLE public.gigs ENABLE ROW LEVEL SECURITY;

-- Allow anyone (even anonymous/non-logged-in) to read gigs
CREATE POLICY "Anyone can view gigs" 
    ON public.gigs FOR SELECT 
    USING (true);

-- Allow authenticated users to insert gigs
CREATE POLICY "Authenticated users can post gigs" 
    ON public.gigs FOR INSERT 
    WITH CHECK (auth.uid() IS NOT NULL);

-- Allow owners to update/delete their own gigs
CREATE POLICY "Owners can update their own gigs" 
    ON public.gigs FOR UPDATE 
    USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their own gigs" 
    ON public.gigs FOR DELETE 
    USING (auth.uid() = owner_id);

-- =====================================================================
-- 5. SEEKERS TABLE (Talented Gig Seekers)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.seekers (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id UUID REFERENCES auth.users(id),
    name TEXT NOT NULL,
    bio TEXT,
    location TEXT,
    province TEXT,
    rate TEXT,
    portfolio JSONB DEFAULT '[]'::jsonb, -- Array of portfolio assets: [{type: "image", url: "..."}]
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on seekers
ALTER TABLE public.seekers ENABLE ROW LEVEL SECURITY;

-- Allow general reading
CREATE POLICY "Anyone can view seekers" 
    ON public.seekers FOR SELECT 
    USING (true);

-- Allow authenticated users to create a seeker profile
CREATE POLICY "Authenticated users can create a seeker profile" 
    ON public.seekers FOR INSERT 
    WITH CHECK (auth.uid() IS NOT NULL);

-- Allow owners to update their own seeker profile
CREATE POLICY "Users can update their own seeker profile" 
    ON public.seekers FOR UPDATE 
    USING (auth.uid() = user_id);

-- =====================================================================
-- 6. MARKET ITEMS TABLE (Buy & Sell Marketplace)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.market_items (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC DEFAULT 0.00,
    portfolio JSONB DEFAULT '[]'::jsonb, -- Array of media assets
    type TEXT CHECK (type IN ('sale', 'wanted')),
    province TEXT,
    location TEXT,
    owner_id UUID REFERENCES auth.users(id),
    owner_name TEXT,
    interested_count INTEGER DEFAULT 0,
    applied_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on market_items
ALTER TABLE public.market_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view market items" 
    ON public.market_items FOR SELECT 
    USING (true);

CREATE POLICY "Authenticated users can insert market items" 
    ON public.market_items FOR INSERT 
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Owners can update their own market items" 
    ON public.market_items FOR UPDATE 
    USING (auth.uid() = owner_id);

-- =====================================================================
-- 7. CONTACTS TABLE (Chat Connections)
-- =====================================================================
-- Each user has their own contact list
CREATE TABLE IF NOT EXISTS public.contacts (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    avatar TEXT,
    bio TEXT,
    province TEXT,
    location TEXT,
    picture TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on contacts
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own contacts" 
    ON public.contacts FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own contacts" 
    ON public.contacts FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- =====================================================================
-- 8. MESSAGES TABLE (Chat Messages)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.messages (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    sender TEXT CHECK (sender IN ('user', 'contact')),
    liked BOOLEAN DEFAULT FALSE,
    reactions JSONB DEFAULT '[]'::jsonb,
    contact_id TEXT,
    file_url TEXT,
    file_type TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own messages" 
    ON public.messages FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own messages" 
    ON public.messages FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- =====================================================================
-- 9. TRANSACTIONS TABLE
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.transactions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('sent', 'received')),
    amount NUMERIC NOT NULL,
    recipient TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own transactions" 
    ON public.transactions FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions" 
    ON public.transactions FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- =====================================================================
-- 10. PROOF OF PAYMENTS TABLE
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.proof_of_payments (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    user_name TEXT,
    amount NUMERIC NOT NULL,
    document_url TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.proof_of_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own proofs" 
    ON public.proof_of_payments FOR SELECT 
    USING (auth.uid() = user_id OR auth.jwt() ->> 'email' = '21lucihanomatthews@gmail.com');

CREATE POLICY "Users can insert their own proofs" 
    ON public.proof_of_payments FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin can update proofs"
    ON public.proof_of_payments FOR UPDATE
    USING (auth.jwt() ->> 'email' = '21lucihanomatthews@gmail.com');

-- =====================================================================
-- 11. SAMPLE SEED DATA (Global/Public only)
-- =====================================================================
-- Seed Seekers (Now public)
INSERT INTO public.seekers (id, name, bio, location, province, rate, portfolio)
VALUES 
('seeker_1', 'Bongiwe Mkhize', 'I construct ultra-modern websites, mobile apps, and e-commerce stores using React, Tailwind CSS, and Node.js. Fast delivery, clean South-African-crafted code.', 'Sandton', 'Gauteng', 'R350/hr', '[{"type":"image","url":"https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80"}]'::jsonb),
('seeker_2', 'Sibusiso Dlamini', 'Expert plumbing, pipe repair, leak detection, and appliance installation. Reliable, certified, and fully equipped with professional industrial tools.', 'Cape Town', 'Western Cape', 'R180/hr', '[{"type":"image","url":"https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80"}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Seed Gigs
INSERT INTO public.gigs (id, title, description, price, province, location, category, owner_name, media, interested_count, applied_count)
VALUES 
('gig_1', 'React Developer Needed', 'Looking for a skilled developer to build a modern responsive dashboard for a logistics firm. Must have experience with charts and REST APIs.', 'R 12,000', 'Gauteng', 'Midrand', 'Tech & Design', 'GIGS SA Admin', '[{"type":"image","url":"https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80"}]'::jsonb, 4, 1),
('gig_2', 'Bathroom Renovation Handyman', 'Need assistance with re-tiling and pipe laying for a medium-sized guest bathroom. Materials are already bought and on-site.', 'R 4,500', 'Western Cape', 'Stellenbosch', 'Home Services', 'GIGS SA Admin', '[{"type":"image","url":"https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80"}]'::jsonb, 2, 0)
ON CONFLICT (id) DO NOTHING;
