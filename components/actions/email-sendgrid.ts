"use server"

import sgMail from "@sendgrid/mail"

// Configurar la API key de SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY || "")

export async function sendWelcomeEmail(email: string) {
  try {
    // Validar el email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { success: false, message: "Correo electrónico inválido" }
    }

    // Crear el mensaje
    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL || "noreply@example.com", // Puedes usar cualquier dirección aquí
      subject: "Tu guía gratuita de SOMA",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #6366F1;">¡Gracias por unirte a SOMA!</h1>
          <p>Nos alegra que estés interesado en mejorar tu bienestar digital.</p>
          <p>Puedes descargar tu guía haciendo clic en el siguiente botón:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.GUIDE_PDF_URL}" 
               style="background-color: #6366F1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Descargar Guía PDF
            </a>
          </div>
          
          <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
          <div style="margin-top: 30px; padding: 20px; background-color: #F3F4F6; border-radius: 8px;">
            <p style="margin: 0; font-weight: bold;">El equipo de SOMA</p>
          </div>
        </div>
      `,
    }

    // Enviar el correo
    await sgMail.send(msg)
    return { success: true, message: "¡Gracias! Hemos enviado la guía a tu correo electrónico." }
  } catch (error) {
    console.error("Error sending email:", error)
    return { success: false, message: "Error al enviar el correo. Por favor, intenta de nuevo." }
  }
}
