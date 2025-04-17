import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const email = searchParams.get("email")
    const redirect = searchParams.get("redirect")

    if (!id || !email || !redirect) {
      return new NextResponse("Missing parameters", { status: 400 })
    }

    // Registrar el clic en la base de datos
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    await supabase
      .from("email_logs")
      .update({ clicked: true, clicked_at: new Date().toISOString() })
      .match({ email_id: id, email })

    // Redirigir al usuario a la URL del PDF
    return NextResponse.redirect(redirect)
  } catch (error) {
    console.error("Error tracking download:", error)
    return new NextResponse("Error", { status: 500 })
  }
}
