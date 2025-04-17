"use client"

import { motion } from "framer-motion"
import { Brain, Sparkles, Moon } from "lucide-react"
import { useState, useEffect } from "react"

export function AboutSoma() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const facts = [
    {
      title: "¿Por qué SOMA?",
      description:
        "SOMA toma su nombre del soma neuronal, el cuerpo celular de la neurona donde se procesa la información. Así como el soma es el núcleo de la neurona, nuestra app es el núcleo del equilibrio entre la tecnología y tu bienestar.",
      icon: "brain",
    },
    {
      title: "Tecnología y ciencia",
      description:
        "Combinamos la neurociencia del sueño con tecnología avanzada para ayudarte a desarrollar hábitos saludables de uso del celular que transforman tu descanso y bienestar general.",
      icon: "sparkles",
    },
    {
      title: "Equilibrio digital",
      description:
        "SOMA no busca que dejes de usar tu celular, sino que lo uses de manera más consciente y saludable, especialmente en las horas previas a dormir, cuando más afecta a tu ciclo de sueño.",
      icon: "moon",
    },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  if (!mounted) {
    return (
      <section className="py-16 bg-secondary/5 text-foreground">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Descubre SOMA</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {facts.map((fact, index) => (
              <div
                key={index}
                className="bg-card text-card-foreground rounded-xl shadow-md p-8 hover:shadow-xl transition-all duration-500 border border-border"
              >
                <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-secondary/20 mx-auto">
                  {fact.icon === "brain" && <Brain className="h-6 w-6 text-primary" />}
                  {fact.icon === "sparkles" && <Sparkles className="h-6 w-6 text-secondary" />}
                  {fact.icon === "moon" && <Moon className="h-6 w-6 text-foreground" />}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">{fact.title}</h3>
                <p className="text-muted-foreground text-center">{fact.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-xl text-foreground mb-8 max-w-3xl mx-auto">
              SOMA te ayuda a encontrar el equilibrio entre el uso de la tecnología y tu bienestar, regulando el consumo
              de contenido digital mediante estímulos visuales y sonoros para mejorar tu descanso.
            </p>
            <button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold py-3 px-8 rounded-full text-lg transition-all shadow-lg hover:shadow-xl">
              Conoce más
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-secondary/5 text-foreground">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          layout
          transition={{ duration: 0.5, type: "spring" }}
        >
          Descubre SOMA
        </motion.h2>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {facts.map((fact, index) => (
            <motion.div
              key={index}
              variants={item}
              className="bg-card text-card-foreground rounded-xl shadow-md p-8 hover:shadow-xl transition-all duration-500 border border-border"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <motion.div
                className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-secondary/20 mx-auto"
                whileHover={{ rotate: 5, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {fact.icon === "brain" && <Brain className="h-6 w-6 text-primary" />}
                {fact.icon === "sparkles" && <Sparkles className="h-6 w-6 text-secondary" />}
                {fact.icon === "moon" && <Moon className="h-6 w-6 text-foreground" />}
              </motion.div>
              <h3 className="text-xl font-semibold mb-3 text-center">{fact.title}</h3>
              <p className="text-muted-foreground text-center">{fact.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-16 text-center">
          <motion.p className="text-xl text-foreground mb-8 max-w-3xl mx-auto" layout transition={{ duration: 0.5 }}>
            SOMA te ayuda a encontrar el equilibrio entre el uso de la tecnología y tu bienestar, regulando el consumo
            de contenido digital mediante estímulos visuales y sonoros para mejorar tu descanso.
          </motion.p>
          <motion.button
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold py-3 px-8 rounded-full text-lg transition-all shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Conoce más
          </motion.button>
        </div>
      </div>
    </section>
  )
}
