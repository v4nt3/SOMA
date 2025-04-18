"use server"

import { getSimpleTemplate } from "@/lib/email-templates"

export async function sendWelcomeEmail(email: string) {
  try {
    const htmlContent = getSimpleTemplate(email)

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY!,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: "SOMA",
          email: "noreply@brevo.com", // Usar un remitente de Brevo para pruebas
        },
        to: [{ email }],
        subject: "Tu guía gratuita",
        htmlContent,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Error de Brevo:", errorText)
      return { success: false, error: errorText }
    }

    return { success: true }
  } catch (error) {
    console.error("Error:", error)
    return { success: false, error: String(error) }
  }
}
