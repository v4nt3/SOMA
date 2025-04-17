"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Send, Check, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import { sendWelcomeEmail } from "./actions/email-action"

export function EmailForm() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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

    try {
      // Llamar al Server Action para enviar el correo
      const result = await sendWelcomeEmail(email)

      if (result.success) {
        setStatus("success")
        setMessage(result.message)
      } else {
        setStatus("error")
        setMessage(result.message)
      }
    } catch (error) {
      console.error("Error sending email:", error)
      setStatus("error")
      setMessage("Error al enviar el correo. Por favor, intenta de nuevo.")
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
            disabled={status === "loading" || status === "success"}
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

        <motion.button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className={`w-full flex items-center justify-center py-3 px-4 rounded-lg font-medium transition-colors duration-300 ${
            status === "loading" || status === "success"
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "bg-primary hover:bg-primary/90 text-primary-foreground"
          }`}
          whileHover={{ scale: status === "loading" || status === "success" ? 1 : 1.02 }}
          whileTap={{ scale: status === "loading" || status === "success" ? 1 : 0.98 }}
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
          ) : status === "success" ? (
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
