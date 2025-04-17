"use server"

import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendWelcomeEmailWithLink(email: string) {
  try {
    // Validar el email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { success: false, message: "Correo electrónico inválido" }
    }

    // URL de descarga del PDF
    const downloadUrl = process.env.GUIDE_PDF_URL

    // Enviar el correo con enlace de descarga
    const { data, error } = await resend.emails.send({
      from: "SOMA <no-reply@tudominio.com>",
      to: email,
      subject: "Tu guía gratuita de SOMA",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #6366F1;">¡Gracias por unirte a SOMA!</h1>
          <p>Nos alegra que estés interesado en mejorar tu bienestar digital.</p>
          <p>Puedes descargar tu guía haciendo clic en el siguiente botón:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${downloadUrl}" 
               style="background-color: #6366F1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Descargar Guía PDF
            </a>
          </div>
          
          <p>Si tienes problemas con el botón, copia y pega este enlace en tu navegador:</p>
          <p style="word-break: break-all;">${downloadUrl}</p>
          
          <div style="margin-top: 30px; padding: 20px; background-color: #F3F4F6; border-radius: 8px;">
            <p style="margin: 0; font-weight: bold;">El equipo de SOMA</p>
          </div>
        </div>
      `,
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
