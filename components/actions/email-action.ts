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

// Función para crear un contacto en Resend
async function createResendContact(email: string): Promise<boolean> {
  try {
    console.log("Creating contact in Resend:", email)

    // Extraer nombre del correo (parte antes del @)
    const firstName = email.split("@")[0]

    // ID de la audiencia en Resend (reemplaza con tu ID real)
    const audienceId = process.env.RESEND_AUDIENCE_ID

    if (!audienceId) {
      console.error("Missing RESEND_AUDIENCE_ID environment variable")
      return false
    }

    // Crear el contacto en Resend
    const { error } = await resend.contacts.create({
      email: email,
      firstName: firstName,
      unsubscribed: false,
      audienceId: audienceId,
    })

    if (error) {
      // Si el error es porque el contacto ya existe, consideramos que es un éxito
      if (error.message?.includes("already exists")) {
        console.log("Contact already exists in Resend:", email)
        return true
      }

      console.error("Error creating contact in Resend:", error)
      return false
    }

    console.log("Contact created successfully in Resend:", email)
    return true
  } catch (error) {
    console.error("Unexpected error creating contact:", error)
    return false
  }
}

// Función para descargar el PDF y convertirlo a Buffer
async function downloadPDF(url: string): Promise<Buffer | null> {
  try {
    console.log("Downloading PDF from:", url)

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Vercel Serverless Function)",
      },
    })

    if (!response.ok) {
      console.error(`Failed to download PDF: ${response.status} ${response.statusText}`)
      return null
    }

    const arrayBuffer = await response.arrayBuffer()
    return Buffer.from(arrayBuffer)
  } catch (error) {
    console.error("Error downloading PDF:", error)
    return null
  }
}

export async function sendWelcomeEmail(email: string) {
  try {
    console.log("==== EMAIL SENDING DEBUG ====")
    console.log("Email address:", email)
    console.log("RESEND_API_KEY exists:", !!process.env.RESEND_API_KEY)
    console.log("GUIDE_PDF_URL exists:", !!process.env.GUIDE_PDF_URL)
    console.log("RESEND_AUDIENCE_ID exists:", !!process.env.RESEND_AUDIENCE_ID)
    console.log("===========================")

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

    // Crear el contacto en Resend antes de enviar el correo
    const contactCreated = await createResendContact(email)

    if (!contactCreated) {
      console.log("Failed to create contact in Resend, but will try to send email anyway")
    }

    console.log("Preparing to send email...")

    // Intentar descargar el PDF
    let pdfBuffer = null
    const attachments = []

    if (process.env.GUIDE_PDF_URL) {
      pdfBuffer = await downloadPDF(process.env.GUIDE_PDF_URL)

      if (pdfBuffer) {
        console.log("PDF downloaded successfully, size:", pdfBuffer.length, "bytes")
        attachments.push({
          filename: "guia-soma-bienestar-digital.pdf",
          content: pdfBuffer,
        })
      } else {
        console.log("Failed to download PDF, sending email without attachment")
        // Añadir un enlace al PDF en el correo
        const pdfLink = `<p style="margin-top: 20px; text-align: center;">
          <a href="${process.env.GUIDE_PDF_URL}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
            Descargar Guía PDF
          </a>
        </p>`

        // Modificar la plantilla para incluir el enlace
        const modifiedTemplate = emailTemplates.welcome(userName) + pdfLink

        // Enviar el correo con el enlace en lugar del adjunto
        const { data, error } = await resend.emails.send({
          from: "SOMA <onboarding@resend.dev>", // Usa el dominio compartido de Resend
          to: email,
          subject: "Tu guía gratuita de SOMA",
          html: modifiedTemplate,
        })

        if (error) {
          console.error("Error sending email with link:", error)
          await logEmailSent(email, false, error.message)

          // Si el error es porque el correo no está verificado a pesar de crear el contacto
          if (error.message?.includes("not a verified email") || error.message?.includes("Email not verified")) {
            return {
              success: false,
              message:
                "No pudimos enviar el correo automáticamente. Por favor, descarga la guía directamente desde el siguiente enlace.",
              directDownload: true,
            }
          }

          return { success: false, message: "Error al enviar el correo. Por favor, intenta de nuevo." }
        }

        console.log("Email with link sent successfully:", data)
        await logEmailSent(email, true)
        return { success: true, message: "¡Gracias! Hemos enviado el enlace a la guía a tu correo electrónico." }
      }
    }

    // Enviar el correo con el PDF adjunto si se pudo descargar
    try {
      const { data, error } = await resend.emails.send({
        from: "SOMA <onboarding@resend.dev>", // Usa el dominio compartido de Resend
        to: email,
        subject: "Tu guía gratuita de SOMA",
        html: emailTemplates.welcome(userName),
        attachments: attachments,
      })

      if (error) {
        console.error("Error sending email with attachment:", error)

        // Si el error es porque el correo no está verificado a pesar de crear el contacto
        if (error.message?.includes("not a verified email") || error.message?.includes("Email not verified")) {
          return {
            success: false,
            message:
              "No pudimos enviar el correo automáticamente. Por favor, descarga la guía directamente desde el siguiente enlace.",
            directDownload: true,
          }
        }

        // Si falla con adjunto, intentar sin adjunto pero con enlace
        if (attachments.length > 0) {
          console.log("Trying to send email with link instead of attachment...")

          const pdfLink = `<p style="margin-top: 20px; text-align: center;">
            <a href="${process.env.GUIDE_PDF_URL}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
              Descargar Guía PDF
            </a>
          </p>`

          const modifiedTemplate = emailTemplates.welcome(userName) + pdfLink

          const fallbackResult = await resend.emails.send({
            from: "SOMA <onboarding@resend.dev>", // Usa el dominio compartido de Resend
            to: email,
            subject: "Tu guía gratuita de SOMA",
            html: modifiedTemplate,
          })

          if (fallbackResult.error) {
            console.error("Error sending fallback email:", fallbackResult.error)
            await logEmailSent(email, false, fallbackResult.error.message)

            // Si el error es porque el correo no está verificado a pesar de crear el contacto
            if (
              fallbackResult.error.message?.includes("not a verified email") ||
              fallbackResult.error.message?.includes("Email not verified")
            ) {
              return {
                success: false,
                message:
                  "No pudimos enviar el correo automáticamente. Por favor, descarga la guía directamente desde el siguiente enlace.",
                directDownload: true,
              }
            }

            return { success: false, message: "Error al enviar el correo. Por favor, intenta de nuevo." }
          }

          console.log("Fallback email with link sent successfully:", fallbackResult.data)
          await logEmailSent(email, true)
          return { success: true, message: "¡Gracias! Hemos enviado el enlace a la guía a tu correo electrónico." }
        }

        await logEmailSent(email, false, error.message)
        return { success: false, message: "Error al enviar el correo. Por favor, intenta de nuevo." }
      }

      console.log("Email sent successfully with attachment:", data)
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
