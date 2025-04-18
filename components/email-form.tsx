"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Send, Check, AlertCircle, Download } from "lucide-react"
import { motion } from "framer-motion"
import { sendWelcomeEmail } from "@/components/actions/email-action"
import { useAnalytics } from "@/hooks/use-analytics"

export function EmailForm() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "direct-download">("idle")
  const [message, setMessage] = useState("")
  const [mounted, setMounted] = useState(false)
  const { trackEvent } = useAnalytics?.() || { trackEvent: () => {} }

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setStatus("error")
      setMessage("Por favor, ingresa tu correo electrónico")
      trackEvent?.("Email Submission", "Form", "Failure")
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setStatus("error")
      setMessage("Por favor, ingresa un correo electrónico válido")
      trackEmailSubmission?.(false)
      return
    }

    setStatus("loading")

    try {
      // Llamar a la acción del servidor para enviar el correo
      const result = await sendWelcomeEmail(email)

      if (result.success) {
        setStatus("success")
        setMessage(result.message)
        trackEvent?.("Email Submission", "Form", "Success")
      } else if (result.directDownload) {
        // Si no se pudo enviar el correo pero ofrecemos descarga directa
        setStatus("direct-download")
        setMessage(result.message)
        trackEmailSubmission?.(true) // Consideramos esto como un éxito para analytics
      } else {
        setStatus("error")
        setMessage(result.message)
        trackEmailSubmission?.(false)
      }
    } catch (error) {
      console.error("Error sending email:", error)
      setStatus("error")
      setMessage("Error al enviar el correo. Por favor, intenta de nuevo.")
      trackEmailSubmission?.(false)
    }
  }

  if (!mounted) {
    return (
      <div className="max-w-md mx-auto">
        <form className="bg-card text-card-foreground p-6 rounded-xl shadow-md transition-colors duration-500 border border-border">
          <div className="mb-4">
            <label htmlFor="email-static" className="block text-sm font-medium mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email-static"
              placeholder="tu@email.com"
              className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-500"
            />
          </div>

          <button
            type="button"
            className="w-full flex items-center justify-center py-3 px-4 rounded-lg font-medium transition-colors duration-300 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Send className="mr-2 h-4 w-4" />
            Recibir guía gratuita
          </button>

          <p className="mt-3 text-xs text-muted-foreground text-center">
            Al enviar tu correo, aceptas recibir comunicaciones de SOMA. Puedes darte de baja en cualquier momento.
          </p>
        </form>
      </div>
    )
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
              href={process.env.NEXT_PUBLIC_GUIDE_PDF_URL || "/api/download-guide"}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
            >
              <Download className="mr-2 h-4 w-4" />
              Descargar Guía PDF
            </a>
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
              Enviado
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
function trackEmailSubmission(arg0: boolean) {
  throw new Error("Function not implemented.")
}

