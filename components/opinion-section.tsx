"use client"

import { useState, useEffect } from "react"
import { MessageSquare } from "lucide-react"
import { motion } from "framer-motion"

export function OpinionSection() {
  const [isHovered, setIsHovered] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <section className="py-16 bg-primary/10 text-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ayúdanos a mejorar SOMA</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-10">
            Estamos desarrollando SOMA para ayudarte a mejorar tu relación con la tecnología. Tu feedback nos permite
            crear una mejor herramienta que realmente impacte en tu bienestar digital.
          </p>

          <a
            href="https://forms.gle/exampleSurveyLink"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <div
              className={`
                bg-gradient-to-r from-primary via-secondary to-[#FFECCC]
                p-[3px] rounded-xl
              `}
            >
              <div className="bg-card px-8 py-4 rounded-lg flex items-center">
                <MessageSquare className="h-6 w-6 mr-3 text-secondary" />
                <span className="font-semibold text-lg bg-gradient-to-r from-primary via-secondary to-[#FFECCC] bg-clip-text text-transparent">
                  Comparte tu opinión
                </span>
              </div>
            </div>
          </a>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-primary/10 text-foreground">
      <div className="container mx-auto px-4 text-center">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-6"
          layout
          transition={{ duration: 0.5, type: "spring" }}
        >
          Ayúdanos a mejorar SOMA
        </motion.h2>
        <motion.p className="text-muted-foreground max-w-2xl mx-auto mb-10" layout transition={{ duration: 0.5 }}>
          Estamos desarrollando SOMA para ayudarte a mejorar tu relación con la tecnología. Tu feedback nos permite
          crear una mejor herramienta que realmente impacte en tu bienestar digital.
        </motion.p>

        <motion.a
          href="https://forms.gle/exampleSurveyLink"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className={`
              bg-gradient-to-r from-primary via-secondary to-[#FFECCC]
              p-[3px] rounded-xl
            `}
            animate={{
              scale: isHovered ? 1.05 : 1,
              boxShadow: isHovered ? "0px 10px 25px rgba(0, 0, 0, 0.1)" : "0px 4px 10px rgba(0, 0, 0, 0.05)",
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-card px-8 py-4 rounded-lg flex items-center">
              <MessageSquare className="h-6 w-6 mr-3 text-secondary" />
              <span className="font-semibold text-lg bg-gradient-to-r from-primary via-secondary to-[#FFECCC] bg-clip-text text-transparent">
                Comparte tu opinión
              </span>
            </div>
          </motion.div>
        </motion.a>
      </div>
    </section>
  )
}
