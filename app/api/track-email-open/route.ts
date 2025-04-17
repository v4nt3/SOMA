import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const email = searchParams.get("email")

    if (!id || !email) {
      return new NextResponse("Missing parameters", { status: 400 })
    }

    // Registrar la apertura en la base de datos
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    await supabase
      .from("email_logs")
      .update({ opened: true, opened_at: new Date().toISOString() })
      .match({ email_id: id, email })

    // Devolver una imagen transparente de 1x1 pixel
    const pixel = Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64")

    return new NextResponse(pixel, {
      headers: {
        "Content-Type": "image/gif",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  } catch (error) {
    console.error("Error tracking email open:", error)
    return new NextResponse("Error", { status: 500 })
  }
}
