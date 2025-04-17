"use server"

import { Resend } from "resend"
import { nanoid } from "nanoid"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendWelcomeEmailWithTracking(email: string) {
  try {
    // Validar el email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { success: false, message: "Correo electrónico inválido" }
    }

    // Generar un ID único para este correo
    const emailId = nanoid()

    // URL base de tu aplicación
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://tudominio.com"

    // URL de seguimiento para registrar cuando se abre el correo
    const trackingPixel = `${baseUrl}/api/track-email-open?id=${emailId}&email=${encodeURIComponent(email)}`

    // URL de descarga con seguimiento
    const downloadUrl = `${baseUrl}/api/track-download?id=${emailId}&email=${encodeURIComponent(email)}&redirect=${encodeURIComponent(process.env.GUIDE_PDF_URL || "")}`

    // Enviar el correo con pixel de seguimiento y enlace de descarga
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
          
          <div style="margin-top: 30px; padding: 20px; background-color: #F3F4F6; border-radius: 8px;">
            <p style="margin: 0; font-weight: bold;">El equipo de SOMA</p>
          </div>
          
          <!-- Pixel de seguimiento invisible -->
          <img src="${trackingPixel}" alt="" width="1" height="1" style="display: none;" />
        </div>
      `,
    })

    if (error) {
      console.error("Error sending email:", error)
      return { success: false, message: "Error al enviar el correo. Por favor, intenta de nuevo." }
    }

    // Registrar el envío en la base de datos
    await logEmailSent(email, emailId)

    return { success: true, message: "¡Gracias! Hemos enviado el enlace de descarga a tu correo electrónico." }
  } catch (error) {
    console.error("Unexpected error:", error)
    return { success: false, message: "Error inesperado. Por favor, intenta de nuevo." }
  }
}

// Función para registrar el envío en la base de datos
async function logEmailSent(email: string, emailId: string) {
  try {
    const { createClient } = await import("@supabase/supabase-js")

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    await supabase.from("email_logs").insert([
      {
        email,
        email_id: emailId,
        type: "welcome",
        sent_at: new Date().toISOString(),
        opened: false,
        clicked: false,
      },
    ])
  } catch (error) {
    console.error("Error logging email:", error)
  }
}
