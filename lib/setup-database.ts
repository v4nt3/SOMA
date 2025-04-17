/**
 * Supabase Database Setup Script
 *
 * Run this SQL in the Supabase SQL Editor to set up your database:
 *
 * -- Create the image_votes table
 * CREATE TABLE IF NOT EXISTS public.image_votes (
 *   feature_id TEXT PRIMARY KEY,
 *   likes INTEGER DEFAULT 0,
 *   dislikes INTEGER DEFAULT 0,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
 * );
 *
 * -- Enable RLS
 * ALTER TABLE public.image_votes ENABLE ROW LEVEL SECURITY;
 *
 * -- Create policy for reading votes (anyone can read)
 * CREATE POLICY "Anyone can read votes"
 *   ON public.image_votes FOR SELECT
 *   USING (true);
 *
 * -- Create policy for inserting/updating votes (anyone can insert/update)
 * CREATE POLICY "Anyone can insert/update votes"
 *   ON public.image_votes FOR ALL
 *   USING (true);
 *
 * -- Grant access to anon and authenticated roles
 * GRANT ALL ON public.image_votes TO anon, authenticated;
 */

export {}
