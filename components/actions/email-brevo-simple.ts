"use server"

export async function sendSimpleEmail(email: string) {
  console.log("🚀 Iniciando envío simple a:", email)

  try {
    // Verificar API key
    if (!process.env.BREVO_API_KEY) {
      console.error("❌ BREVO_API_KEY no configurada")
      return { success: false, message: "Error de configuración del servidor" }
    }

    // HTML muy simple para descartar problemas con el template
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1>Hola ${email.split("@")[0]}</h1>
        <p>Gracias por suscribirte a SOMA.</p>
        <p><a href="https://soma-landing-page.vercel.app">Visitar SOMA</a></p>
      </div>
    `

    // Payload mínimo
    const payload = {
      sender: {
        name: "SOMA",
        email: "noreply@brevo.com", // Usar un remitente de Brevo para pruebas
      },
      to: [{ email }],
      subject: "Prueba de SOMA",
      htmlContent,
    }

    console.log("📤 Enviando solicitud simple a Brevo")

    // Solicitud con timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000)

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    console.log("📥 Respuesta de Brevo - Status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ Error de Brevo:", errorText)
      return {
        success: false,
        message: "No pudimos enviar el correo. Por favor, intenta de nuevo más tarde.",
        error: errorText,
      }
    }

    return { success: true, message: "¡Correo enviado correctamente!" }
  } catch (error) {
    console.error("❌ Error:", error)
    return {
      success: false,
      message: "Error al enviar el correo. Por favor, intenta de nuevo.",
      error: String(error),
    }
  }
}
