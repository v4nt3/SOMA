"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false)

  useEffect(() => {
    // Comprobar si el usuario ya ha dado su consentimiento
    const hasConsent = localStorage.getItem("cookieConsent")
    if (!hasConsent) {
      setShowConsent(true)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "true")
    setShowConsent(false)
  }

  if (!showConsent) return null

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 z-50"
    >
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <p className="text-sm text-muted-foreground mb-4 md:mb-0">
          Este sitio utiliza cookies para mejorar tu experiencia y analizar el tráfico. Puedes leer más sobre nuestras
          políticas de privacidad.
        </p>
        <div className="flex space-x-4">
          <button
            onClick={acceptCookies}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium"
          >
            Aceptar
          </button>
        </div>
      </div>
    </motion.div>
  )
}
