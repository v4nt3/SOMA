"use server"

import { emailTemplates } from "@/lib/email-templates"

export async function sendWelcomeEmail(email: string) {
  console.log("🚀 Iniciando envío de correo con adjunto a:", email)

  try {
    // Validar el email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log("❌ Email inválido:", email)
      return { success: false, message: "Correo electrónico inválido" }
    }

    // Verificar variables de entorno
    if (!process.env.BREVO_API_KEY) {
      console.error("❌ Error: BREVO_API_KEY no está configurada")
      return {
        success: false,
        message: "Error de configuración del servidor. Contacta al administrador.",
        error: "BREVO_API_KEY missing",
      }
    }

    if (!process.env.GUIDE_PDF_URL) {
      console.warn("❌ Advertencia: GUIDE_PDF_URL no está configurada, no se podrá adjuntar el PDF")
      return {
        success: false,
        message: "Error: No se ha configurado la URL del PDF.",
        error: "GUIDE_PDF_URL missing",
      }
    }

    // Obtener el template HTML personalizado
    const userName = email.split("@")[0]
    const downloadUrl = process.env.GUIDE_PDF_URL || ""

    console.log("📝 Generando template con:", { userName, downloadUrl })

    const htmlContent = emailTemplates.welcome({
      userName,
      downloadUrl,
    })

    // Descargar el PDF para adjuntarlo
    console.log("📥 Descargando PDF desde:", downloadUrl)

    let pdfBuffer: ArrayBuffer
    try {
      const pdfResponse = await fetch(downloadUrl)
      if (!pdfResponse.ok) {
        throw new Error(`Error al descargar el PDF: ${pdfResponse.status} ${pdfResponse.statusText}`)
      }
      pdfBuffer = await pdfResponse.arrayBuffer()
    } catch (downloadError) {
      console.error("❌ Error al descargar el PDF:", downloadError)
      return {
        success: false,
        message: "No pudimos adjuntar la guía. Por favor, usa el enlace de descarga en el correo.",
        error: String(downloadError),
      }
    }

    // Convertir el buffer a base64
    const pdfBase64 = Buffer.from(pdfBuffer).toString("base64")

    // Obtener el nombre del archivo de la URL
    const pdfFileName = downloadUrl.split("/").pop() || "guia-soma.pdf"

    console.log("📎 Preparando adjunto:", pdfFileName)

    // Preparar el payload para Brevo con el adjunto
    const payload = {
      sender: {
        name: "SOMA",
        email: process.env.BREVO_FROM_EMAIL || "noreply@example.com",
      },
      to: [{ email }],
      subject: "Tu guía gratuita de SOMA",
      htmlContent,
      attachment: [
        {
          name: pdfFileName,
          content: pdfBase64,
        },
      ],
    }

    console.log("📤 Enviando solicitud a Brevo API con payload y adjunto")

    // Realizar la petición a la API de Brevo
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    })

    // Manejar la respuesta
    if (!response.ok) {
      let errorDetails = "Error desconocido"

      try {
        const errorJson = await response.json()
        errorDetails = JSON.stringify(errorJson)
        console.error("❌ Error detallado de Brevo:", errorDetails)
      } catch (parseError) {
        const errorText = await response.text()
        errorDetails = errorText || `HTTP Error: ${response.status}`
        console.error("❌ Error de Brevo (texto):", errorDetails)
      }

      return {
        success: false,
        message: "No pudimos enviar el correo. Por favor, intenta de nuevo más tarde.",
        error: errorDetails,
      }
    }

    console.log("✅ Correo enviado exitosamente con adjunto a:", email)
    return { success: true, message: "¡Gracias! Hemos enviado la guía a tu correo electrónico." }
  } catch (error) {
    console.error("❌ Error inesperado al enviar correo:", error)
    return {
      success: false,
      message: "Error al enviar el correo. Por favor, intenta de nuevo.",
      error: String(error),
    }
  }
}
