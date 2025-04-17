"use server"

import { Resend } from "resend"
import { createClient } from "@supabase/supabase-js"
import fs from "fs"
import path from "path"

const resend = new Resend(process.env.RESEND_API_KEY)

// Función para registrar los envíos de correo en Supabase
async function logEmailSent(email: string, success: boolean, errorMessage?: string) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    await supabase.from("email_logs").insert([
      {
        email,
        type: "welcome_guide",
        sent_at: new Date().toISOString(),
        success,
        error_message: errorMessage || null,
      },
    ])
  } catch (logError) {
    // Solo registramos el error pero no interrumpimos el flujo
    console.error("Error logging email:", logError)
  }
}

export async function sendWelcomeEmail(email: string) {
  try {
    // Validar el email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { success: false, message: "Correo electrónico inválido" }
    }

    // Verificar si ya se envió un correo a esta dirección (opcional)
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )

      const { data } = await supabase
        .from("email_logs")
        .select("*")
        .eq("email", email)
        .eq("type", "welcome_guide")
        .eq("success", true)
        .limit(1)

      if (data && data.length > 0) {
        // Ya se envió un correo exitoso a esta dirección
        return { success: true, message: "¡Ya te enviamos la guía anteriormente! Revisa tu correo electrónico." }
      }
    } catch (checkError) {
      // Si hay un error al verificar, continuamos con el envío
      console.error("Error checking previous emails:", checkError)
    }

    const pdfPath = path.join(process.cwd(), "public/Doc2.pdf")
    const fileBuffer = fs.readFileSync(pdfPath)

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
          content: fileBuffer.toString("base64"),
        },
      ],
    })

    if (error) {
      console.error("Error sending email:", error)
      await logEmailSent(email, false, error.message)
      return { success: false, message: "Error al enviar el correo. Por favor, intenta de nuevo." }
    }

    // Registrar el envío exitoso
    await logEmailSent(email, true)

    return { success: true, message: "¡Gracias! Hemos enviado la guía a tu correo electrónico." }
  } catch (error) {
    console.error("Unexpected error:", error)
    await logEmailSent(email, false, (error as Error).message)
    return { success: false, message: "Error inesperado. Por favor, intenta de nuevo." }
  }
}

