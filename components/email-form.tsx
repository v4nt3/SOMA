"use client"

import type React from "react"

import { useState } from "react"
import { Send, Check, AlertCircle, Download } from "lucide-react"
import { motion } from "framer-motion"
import { sendWelcomeEmail } from "@/components/actions/email-brevo"
import { sendSimpleEmail } from "@/components/actions/email-brevo-simple"

export function EmailForm() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "direct-download">("idle")
  const [message, setMessage] = useState("")
  const [debugInfo, setDebugInfo] = useState<string | null>(null)
  const [showDebug, setShowDebug] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setStatus("error")
      setMessage("Por favor, ingresa tu correo electrónico")
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setStatus("error")
      setMessage("Por favor, ingresa un correo electrónico válido")
      return
    }

    setStatus("loading")
    setDebugInfo(null)

    try {
      // Primero intentamos con el email completo
      const result = await sendWelcomeEmail(email)

      if (result.success) {
        setStatus("success")
        setMessage(result.message)
      } else {
        console.log("Primer intento fallido, probando con email simple")

        // Si falla, intentamos con el email simple
        const simpleResult = await sendSimpleEmail(email)

        if (simpleResult.success) {
          setStatus("success")
          setMessage("¡Gracias! Hemos enviado la guía a tu correo electrónico.")
        } else {
          // Si ambos fallan, mostramos opción de descarga directa
          setStatus("direct-download")
          setMessage("No pudimos enviar el correo, pero puedes descargar la guía directamente:")

          if (simpleResult.error) {
            setDebugInfo(simpleResult.error)
          }
        }
      }
    } catch (error) {
      console.error("Error sending email:", error)
      setStatus("direct-download")
      setMessage("Error al enviar el correo. Puedes descargar la guía directamente:")
      setDebugInfo(String(error))
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <motion.form
        onSubmit={handleSubmit}
        className="bg-card text-card-foreground p-6 rounded-xl shadow-md transition-colors duration-500 border border-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-4">
          <motion.label
            htmlFor="email"
            className="block text-sm font-medium mb-1"
            layout
            transition={{ duration: 0.3 }}
          >
            Correo electrónico
          </motion.label>
          <motion.input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-500"
            disabled={status === "loading" || status === "success" || status === "direct-download"}
            layout
            transition={{ duration: 0.3 }}
          />
        </div>

        {status === "error" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
            className="mb-4 p-3 bg-destructive/10 text-destructive rounded-lg flex items-center overflow-hidden"
          >
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{message}</span>
          </motion.div>
        )}

        {status === "success" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
            className="mb-4 p-3 bg-primary/10 text-primary rounded-lg flex items-center overflow-hidden"
          >
            <Check className="h-5 w-5 mr-2" />
            <span>{message}</span>
          </motion.div>
        )}

        {status === "direct-download" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
            className="mb-4 p-3 bg-primary/10 text-primary rounded-lg flex flex-col items-center overflow-hidden"
          >
            <p className="mb-3 text-center">{message}</p>
            <a
              href={process.env.GUIDE_PDF_URL || "/guia.pdf"}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
              onClick={() => {
                // Aquí podrías registrar la descarga directa si tienes analytics
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Descargar Guía PDF
            </a>

            {debugInfo && (
              <div className="mt-4 w-full">
                <button
                  type="button"
                  onClick={() => setShowDebug(!showDebug)}
                  className="text-xs underline text-muted-foreground"
                >
                  {showDebug ? "Ocultar detalles técnicos" : "Mostrar detalles técnicos"}
                </button>

                {showDebug && (
                  <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto max-h-40 text-muted-foreground">
                    {debugInfo}
                  </pre>
                )}
              </div>
            )}
          </motion.div>
        )}

        <motion.button
          type="submit"
          disabled={status === "loading" || status === "success" || status === "direct-download"}
          className={`w-full flex items-center justify-center py-3 px-4 rounded-lg font-medium transition-colors duration-300 ${
            status === "loading" || status === "success" || status === "direct-download"
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "bg-primary hover:bg-primary/90 text-primary-foreground"
          }`}
          whileHover={{
            scale: status === "loading" || status === "success" || status === "direct-download" ? 1 : 1.02,
          }}
          whileTap={{ scale: status === "loading" || status === "success" || status === "direct-download" ? 1 : 0.98 }}
          layout
        >
          {status === "loading" ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Enviando...
            </>
          ) : status === "success" || status === "direct-download" ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              {status === "success" ? "Enviado" : "Descarga disponible"}
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Recibir guía gratuita
            </>
          )}
        </motion.button>

        <motion.p className="mt-3 text-xs text-muted-foreground text-center" layout transition={{ duration: 0.3 }}>
          Al enviar tu correo, aceptas recibir comunicaciones de SOMA. Puedes darte de baja en cualquier momento.
        </motion.p>
      </motion.form>
    </div>
  )
}
