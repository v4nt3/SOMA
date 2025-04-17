import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for server-side usage
export const createServerSupabaseClient = () => {
  // Check for environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  // Log environment variable status (for debugging)
  console.log("Environment variables check:", {
    hasSupabaseUrl: !!supabaseUrl,
    hasServiceRoleKey: !!supabaseKey,
    nodeEnv: process.env.NODE_ENV,
  })

  // Fallback to hardcoded values if environment variables are missing
  // IMPORTANT: Remove this in production once environment variables are working
  const url = supabaseUrl || "https://your-project-id.supabase.co" // Replace with your actual Supabase URL
  const key = supabaseKey || "your-service-role-key" // Replace with your actual service role key

  return createClient(url, key, {
    auth: {
      persistSession: false,
    },
    db: {
      schema: "public",
    },
  })
}
