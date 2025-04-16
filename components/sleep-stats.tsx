"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function SleepStats() {
  const [isVisible, setIsVisible] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      const element = document.getElementById("stats-section")
      if (element) {
        const position = element.getBoundingClientRect()
        if (position.top < window.innerHeight * 0.75) {
          setIsVisible(true)
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Check on initial load

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const stats = [
    { value: "70%", description: "de los jóvenes reportan problemas para dormir" },
    { value: "6.5h", description: "es el promedio de sueño en jóvenes (recomendado: 8h)" },
    { value: "45%", description: "usan el celular justo antes de dormir" },
    { value: "3x", description: "mayor riesgo de depresión con mal sueño" },
  ]

  if (!mounted) {
    return (
      <section id="stats-section" className="py-16 bg-primary/5 text-foreground">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            El insomnio en jóvenes: una realidad alarmante
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-card text-card-foreground rounded-xl shadow-lg p-8 text-center">
                <p className="text-4xl md:text-5xl font-bold mb-4 text-primary">{stat.value}</p>
                <p className="text-muted-foreground">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="stats-section" className="py-16 bg-primary/5 text-foreground">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          layout
          transition={{ duration: 0.5, type: "spring" }}
        >
          El insomnio en jóvenes: una realidad alarmante
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card text-card-foreground rounded-xl shadow-lg p-8 text-center border border-border"
            >
              <p className="text-4xl md:text-5xl font-bold mb-4 text-primary">{stat.value}</p>
              <p className="text-muted-foreground">{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
