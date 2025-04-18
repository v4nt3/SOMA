"use server"

import { Resend } from "resend"

// Función simplificada para depuración
export async function debugSendEmail(email: string) {
  try {
    console.log("==== EMAIL DEBUG ====")
    console.log("Email address:", email)
    console.log("RESEND_API_KEY exists:", !!process.env.RESEND_API_KEY)
    console.log("GUIDE_PDF_URL exists:", !!process.env.GUIDE_PDF_URL)
    console.log("GUIDE_PDF_URL value:", process.env.GUIDE_PDF_URL)

    // Validar el email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { success: false, message: "Correo electrónico inválido", step: "validation" }
    }

    // Verificar variables de entorno
    if (!process.env.RESEND_API_KEY) {
      return { success: false, message: "Falta RESEND_API_KEY", step: "env_check" }
    }

    if (!process.env.GUIDE_PDF_URL) {
      return { success: false, message: "Falta GUIDE_PDF_URL", step: "env_check" }
    }

    // Inicializar Resend
    const resend = new Resend(process.env.RESEND_API_KEY)
    console.log("Resend initialized")

    // Probar conexión con Resend (sin enviar correo)
    try {
      // Verificar que la API key es válida obteniendo dominios
      const { data: domains, error: domainsError } = await resend.domains.list()

      if (domainsError) {
        return {
          success: false,
          message: `Error al conectar con Resend: ${domainsError.message}`,
          step: "resend_connection",
        }
      }

      console.log("Resend connection successful, domains:", domains)
    } catch (resendError) {
      return {
        success: false,
        message: `Error al inicializar Resend: ${resendError instanceof Error ? resendError.message : String(resendError)}`,
        step: "resend_init",
      }
    }

    // Probar acceso al PDF
    try {
      const pdfResponse = await fetch(process.env.GUIDE_PDF_URL, { method: "HEAD" })

      if (!pdfResponse.ok) {
        return {
          success: false,
          message: `Error al acceder al PDF: ${pdfResponse.status} ${pdfResponse.statusText}`,
          step: "pdf_access",
        }
      }

      console.log("PDF access successful, content type:", pdfResponse.headers.get("content-type"))
    } catch (pdfError) {
      return {
        success: false,
        message: `Error al acceder al PDF: ${pdfError instanceof Error ? pdfError.message : String(pdfError)}`,
        step: "pdf_access",
      }
    }

    // Enviar un correo simple sin adjuntos
    try {
      const { data, error } = await resend.emails.send({
        from: "SOMA <onboarding@resend.dev>",
        to: email,
        subject: "Prueba de SOMA",
        html: "<p>Este es un correo de prueba para depurar el envío de correos.</p>",
      })

      if (error) {
        return {
          success: false,
          message: `Error al enviar correo simple: ${error.message}`,
          step: "simple_email",
        }
      }

      console.log("Simple email sent successfully:", data)
      return { success: true, message: "Correo de prueba enviado correctamente", step: "simple_email" }
    } catch (emailError) {
      return {
        success: false,
        message: `Error al enviar correo simple: ${emailError instanceof Error ? emailError.message : String(emailError)}`,
        step: "simple_email",
      }
    }
  } catch (error) {
    return {
      success: false,
      message: `Error inesperado: ${error instanceof Error ? error.message : String(error)}`,
      step: "unexpected",
    }
  }
}
