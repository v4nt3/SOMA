"use server"

import nodemailer from "nodemailer"
import getWelcomeEmailTemplate from "../../lib/email-template"

export async function sendWelcomeEmailGmail(email: string) {
  try {
    // Validar el email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { success: false, message: "Correo electrónico inválido" }
    }

    // URL de descarga del PDF
    const downloadUrl = process.env.GUIDE_PDF_URL || ""

    // Configurar el transporter con Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // Tu dirección de Gmail
        pass: process.env.GMAIL_APP_PASSWORD, // Contraseña de aplicación
      },
    })

    // Enviar el correo
    await transporter.sendMail({
      from: `"SOMA" <${process.env.GMAIL_USER}>`, // Tu dirección de Gmail
      to: email,
      subject: "Tu guía gratuita de SOMA",
      html: getWelcomeEmailTemplate(downloadUrl),
    })

    return { success: true, message: "¡Gracias! Hemos enviado la guía a tu correo electrónico." }
  } catch (error) {
    console.error("Error sending email:", error)
    return { success: false, message: "Error al enviar el correo. Por favor, intenta de nuevo." }
  }
}
