"use server"

import sgMail from "@sendgrid/mail"
import  getWelcomeEmailTemplate  from "../../lib/email-template"

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "")

export async function sendWelcomeEmailSendGrid(email: string) {
  try {
    // Validar el email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { success: false, message: "Correo electrónico inválido" }
    }

    // URL de descarga del PDF
    const downloadUrl = process.env.GUIDE_PDF_URL || ""

    const msg = {
      to: email,
      from: "noreply@sendgrid.net", // Usa el dominio compartido de SendGrid
      subject: "Tu guía gratuita de SOMA",
      html: getWelcomeEmailTemplate(downloadUrl),
    }

    await sgMail.send(msg)
    return { success: true, message: "¡Gracias! Hemos enviado la guía a tu correo electrónico." }
  } catch (error) {
    console.error("Error sending email:", error)
    return { success: false, message: "Error al enviar el correo. Por favor, intenta de nuevo." }
  }
}
