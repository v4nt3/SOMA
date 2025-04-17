"use server"

import { Resend } from "resend"
import { emailTemplates } from "../../lib/email-templates"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendWelcomeEmail(email: string, name?: string) {
  try {
    // Validar el email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { success: false, message: "Correo electrónico inválido" }
    }

    // Extraer el nombre del usuario del email si no se proporciona
    const userName = name || email.split("@")[0]

    // Enviar el correo usando la plantilla
    const { data, error } = await resend.emails.send({
      from: "SOMA <onboarding@resend.dev>",
      to: email,
      subject: "Tu guía gratuita de SOMA",
      html: emailTemplates.welcome(userName),
      attachments: [
        {
          filename: "guia-soma-bienestar-digital.pdf",
          path: process.env.GUIDE_PDF_URL,
        },
      ],
    })

    if (error) {
      console.error("Error sending email:", error)
      return { success: false, message: "Error al enviar el correo. Por favor, intenta de nuevo." }
    }

    // Registrar el envío en la base de datos
    await logEmailSent(email)

    return { success: true, message: "¡Gracias! Hemos enviado la guía a tu correo electrónico." }
  } catch (error) {
    console.error("Unexpected error:", error)
    return { success: false, message: "Error inesperado. Por favor, intenta de nuevo." }
  }
}

// Función para registrar el envío en la base de datos
async function logEmailSent(email: string) {
  try {
    const { createClient } = await import("@supabase/supabase-js")

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    await supabase.from("email_logs").insert([
      {
        email,
        type: "welcome",
        sent_at: new Date().toISOString(),
      },
    ])
  } catch (error) {
    // Solo registramos el error pero no interrumpimos el flujo
    console.error("Error logging email:", error)
  }
}
