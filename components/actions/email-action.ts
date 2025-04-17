"use server"

import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendWelcomeEmail(email: string) {
  try {
    // Validar el email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { success: false, message: "Correo electrónico inválido" }
    }

    // Enviar el correo usando el dominio compartido de Resend
    const { data, error } = await resend.emails.send({
      from: "SOMA <onboarding@resend.dev>", // Usa el dominio que te proporciona Resend
      to: email,
      subject: "Tu guía gratuita de SOMA",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #6366F1;">¡Gracias por unirte a SOMA!</h1>
          <p>Nos alegra que estés interesado en mejorar tu bienestar digital.</p>
          <p>Adjunto encontrarás la guía que te prometimos para comenzar a mejorar tu relación con la tecnología.</p>
          <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
          <div style="margin-top: 30px; padding: 20px; background-color: #F3F4F6; border-radius: 8px;">
            <p style="margin: 0; font-weight: bold;">El equipo de SOMA</p>
          </div>
        </div>
      `,
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

    return { success: true, message: "¡Gracias! Hemos enviado la guía a tu correo electrónico." }
  } catch (error) {
    console.error("Unexpected error:", error)
    return { success: false, message: "Error inesperado. Por favor, intenta de nuevo." }
  }
}
