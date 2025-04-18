import { NextResponse } from "next/server"

export async function GET() {
  try {
    const pdfUrl = process.env.GUIDE_PDF_URL

    if (!pdfUrl) {
      return NextResponse.json({ success: false, error: "PDF URL not configured" }, { status: 500 })
    }

    console.log("Checking PDF URL:", pdfUrl)

    // Intentar acceder al PDF
    const response = await fetch(pdfUrl, {
      method: "HEAD",
      headers: {
        "User-Agent": "Mozilla/5.0 (Vercel Serverless Function)",
      },
    })

    const headers = Object.fromEntries(response.headers.entries())

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: `Failed to access PDF: ${response.status} ${response.statusText}`,
          url: pdfUrl,
          headers,
        },
        { status: 500 },
      )
    }

    const contentType = response.headers.get("content-type")
    const contentLength = response.headers.get("content-length")

    return NextResponse.json({
      success: true,
      url: pdfUrl,
      contentType,
      size: contentLength ? `${Math.round(Number.parseInt(contentLength) / 1024)} KB` : "Unknown",
      headers,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: `Error accessing PDF: ${(error as Error).message}` },
      { status: 500 },
    )
  }
}
