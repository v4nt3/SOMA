"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { UploadImage } from "@/components/upload-image"
import { EmailForm } from "@/components/email-form"
import { SleepStats } from "@/components/sleep-stats"
import { AboutSoma } from "@/components/about-soma"
import { OpinionSection } from "@/components/opinion-section"
import { Navbar } from "@/components/navbar"
import { Features } from "@/components/features"

export default function Home() {
  const [mounted, setMounted] = useState(false)

  // Prevent transitions on initial load
  useEffect(() => {
    // Add prevent-transition class to prevent transitions on initial load
    document.documentElement.classList.add("prevent-transition")

    // Remove the class after a short delay to allow transitions after initial render
    const timeout = setTimeout(() => {
      document.documentElement.classList.remove("prevent-transition")
      setMounted(true)
    }, 300) // Increased timeout to ensure complete hydration

    return () => clearTimeout(timeout)
  }, [])

  return (
    <main className="min-h-screen bg-background">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="relative h-[100vh] flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <Image
            src="/icon.png"
            alt="Fondo de SOMA"
            fill
            className="object-cover opacity-10"
            priority
          />
        </div>
        <div className="container mx-auto px-4 z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-[#FFECCC] bg-clip-text text-transparent">
            SOMA
          </h1>
          <p className="text-2xl md:text-3xl font-medium text-foreground mb-4">
            Equilibrio digital para un mejor descanso
          </p>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Regula el uso de tu celular en la noche y mejora tus hábitos de sueño con estímulos visuales y sonoros
          </p>
          <button
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            onClick={() => {
              const featuresSection = document.getElementById("features-section")
              if (featuresSection) {
                featuresSection.scrollIntoView({ behavior: "smooth" })
              }
            }}
          >
            Descubre cómo funciona
          </button>
        </div>
      </section>

      {/* Sleep Statistics Section */}
      <SleepStats />

      {/* Features Section */}
      <section id="features-section">
        <Features />
      </section>

      {/* About SOMA Section */}
      <section id="about-section">
        <AboutSoma />
      </section>

      {/* Interactive Image Experience */}
      <section id="experience-section" className="py-16 bg-background text-foreground">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">Experimenta la calma visual</h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-10">
            Prueba cómo SOMA transforma el contenido a escala de grises para reducir la estimulación visual y ayudarte a
            relajarte antes de dormir.
          </p>
          <UploadImage />
        </div>
      </section>

      {/* Call to Action - Email Form */}
      <section id="contact-section" className="py-16 bg-accent text-accent-foreground">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">Únete a la lista de espera</h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-10">
            Sé de los primeros en probar SOMA y recibe nuestra guía gratuita sobre cómo mejorar tus hábitos digitales
            para un mejor descanso.
          </p>
          <EmailForm />
        </div>
      </section>

      {/* Opinion Section */}
      <OpinionSection />

      {/* Footer */}
      <footer className="bg-muted text-muted-foreground py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-4">© 2025 SOMA. Todos los derechos reservados.</p>
          <div className="flex justify-center space-x-4">
            <a href="#" className="hover:text-primary transition-colors duration-300">
              Términos
            </a>
            <a href="#" className="hover:text-primary transition-colors duration-300">
              Privacidad
            </a>
            <a href="#" className="hover:text-primary transition-colors duration-300">
              Contacto
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}
