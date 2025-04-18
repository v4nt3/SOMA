"use server"

import { emailTemplates } from "@/lib/email-templates"

export async function sendWelcomeEmail(email: string) {

  try {
    // Validar el email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { success: false, message: "Correo electrónico inválido" }
    }

    // Obtener el template HTML personalizado
    const htmlContent = emailTemplates.welcome({
        userName: email.split("@")[0], // Extraer nombre del email como ejemplo
        downloadUrl: process.env.GUIDE_PDF_URL || "",
      })

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY!,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        sender: {
          name: "SOMA",
          email: process.env.BREVO_FROM_EMAIL || "noreply@example.com"
        },
        to: [{ email }],
        subject: "Tu guía gratuita de SOMA",
        htmlContent
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Respuesta de Brevo:", errorText)
      throw new Error("Error en la API de Brevo")
    }

    return { success: true, message: "¡Gracias! Hemos enviado la guía a tu correo electrónico." }
  } catch (error) {
    console.error("Error al enviar correo:", error)
    return { success: false, message: "Error al enviar el correo. Por favor, intenta de nuevo." }
  }
}
