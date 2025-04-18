import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Verificar si tenemos una URL configurada para el PDF
    if (!process.env.GUIDE_PDF_URL) {
      return NextResponse.json(
        {
          success: false,
          error: "URL del PDF no configurada",
        },
        { status: 500 },
      )
    }

    // Redirigir al PDF
    return NextResponse.redirect(process.env.GUIDE_PDF_URL)
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      { status: 500 },
    )
  }
}
