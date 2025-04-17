"use server"

import nodemailer from "nodemailer"
import fs from "fs/promises"
import path from "path"

export async function sendWelcomeEmailNodemailer(email: string) {
  try {
    // Validar el email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { success: false, message: "Correo electrónico inválido" }
    }

    // Configurar el transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD, // Contraseña de aplicación, no tu contraseña normal
      },
    })

    // Descargar el PDF si está en una URL externa
    let pdfPath = process.env.GUIDE_PDF_URL
    let pdfBuffer

    if (pdfPath?.startsWith("http")) {
      const response = await fetch(pdfPath)
      pdfBuffer = Buffer.from(await response.arrayBuffer())
    } else {
      // Si es una ruta local
      pdfPath = path.join(process.cwd(), "public", "guia-soma-bienestar-digital.pdf")
      pdfBuffer = await fs.readFile(pdfPath)
    }

    // Enviar el correo
    const info = await transporter.sendMail({
      from: '"SOMA" <tu-email@gmail.com>',
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
          content: pdfBuffer,
        },
      ],
    })

    console.log("Message sent: %s", info.messageId)
    return { success: true, message: "¡Gracias! Hemos enviado la guía a tu correo electrónico." }
  } catch (error) {
    console.error("Error sending email:", error)
    return { success: false, message: "Error al enviar el correo. Por favor, intenta de nuevo." }
  }
}
