"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Eye, Clock, BarChart2, BookOpen } from "lucide-react"

export function Features() {
  const [mounted, setMounted] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)

  useEffect(() => {
    setMounted(true)

    // Auto-rotate features every 5 seconds
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      title: "Filtrado de contenido",
      description:
        "Detecta automáticamente contenido de determinadas categorías y lo muestra en escala de grises para reducir su impacto visual y disminuir la estimulación excesiva.",
      icon: <Eye className="h-6 w-6 text-primary" />,
    },
    {
      title: "Asistente de lectura",
      description:
        "Cuando estás viendo contenido con texto, SOMA reproduce un sonido relajante y ajusta la luz de tu teléfono a un tono cálido para mejorar la experiencia de lectura.",
      icon: <BookOpen className="h-6 w-6 text-primary" />,
    },
    {
      title: "Gestión del tiempo",
      description:
        "Implementa recordatorios o límites de tiempo personalizados para evitar el consumo excesivo de contenido digital en horas que deberías estar descansando.",
      icon: <Clock className="h-6 w-6 text-primary" />,
    },
    {
      title: "Análisis de hábitos",
      description:
        "Proporciona estadísticas sobre el tiempo de uso y patrones de consumo, con recomendaciones para optimizar el tiempo en pantalla y mejorar tu descanso.",
      icon: <BarChart2 className="h-6 w-6 text-primary" />,
    },
  ]

  if (!mounted) {
    return (
      <section className="py-16 bg-card text-card-foreground">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Funcionalidades principales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-background rounded-xl p-6 shadow-md border border-border hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-primary/10 mr-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                </div>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-card text-card-foreground">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Funcionalidades principales
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className={`bg-background rounded-xl p-6 shadow-md border border-border hover:shadow-lg transition-all duration-300 ${
                activeFeature === index ? "ring-2 ring-primary" : ""
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              onClick={() => setActiveFeature(index)}
            >
              <div className="flex items-center mb-4">
                <motion.div
                  className="p-3 rounded-full bg-primary/10 mr-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  animate={{ scale: activeFeature === index ? [1, 1.1, 1] : 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
              </div>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
