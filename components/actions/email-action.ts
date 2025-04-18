"use server"

import { Resend } from "resend"
import { emailTemplates } from "@/lib/email-templates"
import { createClient } from "@supabase/supabase-js"

// Inicializar Resend con la API key
const resend = new Resend(process.env.RESEND_API_KEY)

// Función para registrar los envíos de correo en Supabase
async function logEmailSent(email: string, success: boolean, errorMessage?: string) {
  try {
    // Verificar que las variables de entorno estén disponibles
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Missing Supabase environment variables")
      return
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

    // Insertar registro en la tabla email_logs
    const { error } = await supabase.from("email_logs").insert([
      {
        email,
        type: "welcome_guide",
        sent_at: new Date().toISOString(),
        success,
        error_message: errorMessage || null,
      },
    ])

    if (error) {
      console.error("Error inserting email log:", error)
    }
  } catch (logError) {
    console.error("Error logging email:", logError)
  }
}

export async function sendWelcomeEmail(email: string) {
  try {
    // Validar el email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.error("Invalid email format:", email)
      return { success: false, message: "Correo electrónico inválido" }
    }

    // Verificar que las variables de entorno estén disponibles
    if (!process.env.RESEND_API_KEY) {
      console.error("Missing RESEND_API_KEY environment variable")
      return { success: false, message: "Error de configuración del servidor. Contacta al administrador." }
    }

    if (!process.env.GUIDE_PDF_URL) {
      console.error("Missing GUIDE_PDF_URL environment variable")
      return { success: false, message: "Error de configuración del servidor. Contacta al administrador." }
    }

    // Extraer el nombre del usuario del email
    const userName = email.split("@")[0]

    // Verificar si ya se envió un correo a esta dirección (opcional)
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

        const { data } = await supabase
          .from("email_logs")
          .select("*")
          .eq("email", email)
          .eq("type", "welcome_guide")
          .eq("success", true)
          .limit(1)

        if (data && data.length > 0) {
          console.log("Email already sent to:", email)
          return { success: true, message: "¡Ya te enviamos la guía anteriormente! Revisa tu correo electrónico." }
        }
      } catch (checkError) {
        console.error("Error checking previous emails:", checkError)
      }
    }

    // Intentar enviar el correo sin adjuntos primero
    try {
      const { data, error } = await resend.emails.send({
        from: "SOMA <onboarding@resend.dev>",
        to: email,
        subject: "Tu guía gratuita de SOMA",
        html: emailTemplates.welcome(userName),
        // Sin adjuntos por ahora
      })

      if (error) {
        console.error("Error sending email with Resend:", error)
        await logEmailSent(email, false, error.message)
        return { success: false, message: "Error al enviar el correo. Por favor, intenta de nuevo." }
      }

      console.log("Email sent successfully:", data)

      // Registrar el envío exitoso
      await logEmailSent(email, true)

      return { success: true, message: "¡Gracias! Hemos enviado la guía a tu correo electrónico." }
    } catch (error) {
      console.error("Unexpected error in sendWelcomeEmail:", error)
      await logEmailSent(email, false, (error as Error).message)
      return { success: false, message: "Error inesperado. Por favor, intenta de nuevo." }
    }
  } catch (error) {
    console.error("Unexpected error in sendWelcomeEmail:", error)
    return { success: false, message: "Error inesperado. Por favor, intenta de nuevo." }
  }
}

// Versión simplificada para pruebas
export async function sendSimpleEmail(email: string) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return { success: false, message: "Falta RESEND_API_KEY" }
    }

    const resend = new Resend(process.env.RESEND_API_KEY)

    const { data, error } = await resend.emails.send({
      from: "SOMA <onboarding@resend.dev>",
      to: email,
      subject: "Prueba de SOMA",
      html: "<p>Este es un correo de prueba.</p>",
    })

    if (error) {
      return { success: false, message: `Error: ${error.message}` }
    }

    return { success: true, message: "Correo enviado correctamente" }
  } catch (error) {
    return { success: false, message: `Error: ${error instanceof Error ? error.message : String(error)}` }
  }
}
