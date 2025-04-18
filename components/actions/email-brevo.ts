"use server"

const SibApiV3Sdk = require('sib-api-v3-sdk');


export async function sendWelcomeEmail(email: string) {
  try {
    // Validar el email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { success: false, message: "Correo electrónico inválido" }
    }

    // Configurar el cliente de Brevo
    const defaultClient = SibApiV3Sdk.ApiClient.instance
    const apiKey = defaultClient.authentications["api-key"]
    apiKey.apiKey = process.env.BREVO_API_KEY

    // Crear la instancia de la API
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()

    // Crear el objeto de envío
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail()

    sendSmtpEmail.subject = "Tu guía gratuita de SOMA"
    sendSmtpEmail.htmlContent = `
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
    `
    sendSmtpEmail.sender = { name: "SOMA", email: process.env.BREVO_FROM_EMAIL || "noreply@example.com" }
    sendSmtpEmail.to = [{ email }]

    // Enviar el correo
    await apiInstance.sendTransacEmail(sendSmtpEmail)

    return { success: true, message: "¡Gracias! Hemos enviado la guía a tu correo electrónico." }
  } catch (error) {
    console.error("Error sending email:", error)
    return { success: false, message: "Error al enviar el correo. Por favor, intenta de nuevo." }
  }
}
