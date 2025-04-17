"use client"

import { useState } from "react"
import { testServerEnvironment } from "./actions/test-env"

export function SupabaseTest() {
  const [clientResult, setClientResult] = useState<string | null>(null)
  const [serverResult, setServerResult] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testClientEnv = () => {
    try {
      // Test if environment variables are accessible client-side
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      setClientResult(
        `Client-side environment variables:
        NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? "✅ Available" : "❌ Missing"}
        NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? "✅ Available" : "❌ Missing"}`,
      )
    } catch (err) {
      setError(`Error testing client environment variables: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  const testServerEnv = async () => {
    try {
      setIsLoading(true)
      const result = await testServerEnvironment()

      if (result.success) {
        setServerResult(
          `Server-side environment variables (${result.environment}):
          NEXT_PUBLIC_SUPABASE_URL: ${result.variables?.NEXT_PUBLIC_SUPABASE_URL}
          SUPABASE_SERVICE_ROLE_KEY: ${result.variables?.SUPABASE_SERVICE_ROLE_KEY ?? "❌ Missing"}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${result.variables?.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        )
      } else {
        setError(`Server error: ${result.error}`)
      }
    } catch (err) {
      setError(`Error testing server environment variables: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setIsLoading(false)
    }
  }

  const runAllTests = async () => {
    setIsLoading(true)
    setError(null)
    setClientResult(null)
    setServerResult(null)

    testClientEnv()
    await testServerEnv()

    setIsLoading(false)
  }

  return (
    <div className="p-4 bg-card rounded-lg border border-border">
      <h3 className="text-lg font-medium mb-4">Supabase Environment Test</h3>

      <button
        onClick={runAllTests}
        disabled={isLoading}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50"
      >
        {isLoading ? "Testing..." : "Test Environment Variables"}
      </button>

      {clientResult && (
        <div className="mt-4 p-3 bg-muted rounded-md">
          <pre className="whitespace-pre-wrap text-sm">{clientResult}</pre>
        </div>
      )}

      {serverResult && (
        <div className="mt-4 p-3 bg-muted rounded-md">
          <pre className="whitespace-pre-wrap text-sm">{serverResult}</pre>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md">
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  )
}
