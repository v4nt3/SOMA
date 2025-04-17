"use server"

import { Resend } from "resend"
import  getWelcomeEmailTemplate  from "../../lib/email-template"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendWelcomeEmailWithDownloadLink(email: string) {
  try {
    // Validar el email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { success: false, message: "Correo electrónico inválido" }
    }

    // URL de descarga del PDF
    const downloadUrl = process.env.GUIDE_PDF_URL || ""

    // Enviar el correo con enlace de descarga
    const { data, error } = await resend.emails.send({
      from: "SOMA <onboarding@resend.dev>", // Usa tu dominio compartido de Resend
      to: email,
      subject: "Tu guía gratuita de SOMA",
      html: getWelcomeEmailTemplate(downloadUrl),
    })

    if (error) {
      console.error("Error sending email:", error)
      return { success: false, message: "Error al enviar el correo. Por favor, intenta de nuevo." }
    }

    return { success: true, message: "¡Gracias! Hemos enviado el enlace de descarga a tu correo electrónico." }
  } catch (error) {
    console.error("Unexpected error:", error)
    return { success: false, message: "Error inesperado. Por favor, intenta de nuevo." }
  }
}
