"use client"

import { motion } from "framer-motion"
import { useAnalytics } from "@/hooks/use-analytics"

export function HeroSection() {
  const { trackEvent } = useAnalytics()

  const handleExploreClick = () => {
    // Rastrear el evento de clic en el botón "Descubre cómo funciona"
    trackEvent("click", "hero_section", "explore_button")

    // Scroll a la sección de características
    const featuresSection = document.getElementById("features-section")
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section id="home" className="relative h-[100vh] flex items-center justify-center overflow-hidden pt-16">
      {/* ... resto del código del hero ... */}

      <motion.button
        className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
        onClick={handleExploreClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Descubre cómo funciona
      </motion.button>

      {/* ... */}
    </section>
  )
}
