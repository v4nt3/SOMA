import { SupabaseTest } from "../supabase-test"

export default function TestPage() {
  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-2xl font-bold mb-8">Environment Variables Test</h1>
      <SupabaseTest />
    </div>
  )
}
