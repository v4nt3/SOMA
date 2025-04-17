"use server"

export async function testServerEnvironment() {
  try {
    // Check for environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    return {
      success: true,
      environment: process.env.NODE_ENV,
      variables: {
        NEXT_PUBLIC_SUPABASE_URL: supabaseUrl ? "✅ Available" : "❌ Missing",
        SUPABASE_SERVICE_ROLE_KEY: supabaseKey ? "✅ Available" : "❌ Missing",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey ? "✅ Available" : "❌ Missing",
      },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
