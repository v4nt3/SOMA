"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Upload, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import { ClientVote } from "./client-vote"
import { useAnalytics } from "@/hooks/use-analytics"

export function UploadImage() {
  const [image, setImage] = useState<string | null>(null)
  const [isGrayscale, setIsGrayscale] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [mounted, setMounted] = useState(false)
  const featureId = "soma-image-upload"
  const { trackEvent } = useAnalytics()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImage(event.target?.result as string)
        setIsGrayscale(false)

        // Rastrear evento de carga de imagen exitosa
        trackEvent("image_upload", JSON.stringify({
                  category: "engagement",
                  label: "success",
                  file_type: file.type,
                  file_size: Math.round(file.size / 1024), // tamaño en KB
                }))
      }

      reader.onerror = () => {
        setError("Error al cargar la imagen. Intenta con otra imagen.")

        // Rastrear evento de error en carga de imagen
        trackEvent("image_upload", JSON.stringify({
                  category: "engagement",
                  label: "error",
                  error_type: "file_read_error",
                }))
      }

      reader.readAsDataURL(file)
    }
  }

  const toggleGrayscale = () => {
    setIsGrayscale(!isGrayscale)

    // Rastrear evento de conversión a escala de grises
    trackEvent("grayscale_toggle", JSON.stringify({
          category: "feature_usage",
          label: isGrayscale ? "disabled" : "enabled",
          image_present: !!image,
        }))
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  if (!mounted) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-card text-card-foreground rounded-xl shadow-lg overflow-hidden border border-border">
          {/* Instagram-like header */}
          <div className="p-4 border-b border-border flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold">
              S
            </div>
            <div className="ml-3">
              <p className="font-semibold">SOMA</p>
              <p className="text-xs text-muted-foreground">Mejora tu sueño</p>
            </div>
          </div>

          {/* Image display area */}
          <div className="relative w-full h-96 bg-muted flex items-center justify-center cursor-pointer">
            <div className="text-center p-6">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">Haz clic para subir una imagen</p>
            </div>
          </div>

          {/* Controls */}
          <div className="p-4"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      <motion.div
        className="bg-card text-card-foreground rounded-xl shadow-lg overflow-hidden border border-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Instagram-like header */}
        <motion.div className="p-4 border-b border-border flex items-center" layout transition={{ duration: 0.3 }}>
          <motion.div
            className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            S
          </motion.div>
          <div className="ml-3">
            <p className="font-semibold">SOMA</p>
            <p className="text-xs text-muted-foreground">Mejora tu sueño</p>
          </div>
        </motion.div>

        {/* Image display area */}
        <motion.div
          className="relative w-full h-96 bg-muted flex items-center justify-center cursor-pointer"
          onClick={triggerFileInput}
          layout
          transition={{ duration: 0.3 }}
        >
          {image ? (
            <motion.div
              className="w-full h-full relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt="Uploaded image"
                fill
                className={`object-cover ${isGrayscale ? "grayscale" : ""} transition-all duration-700`}
              />
            </motion.div>
          ) : (
            <motion.div
              className="text-center p-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">Haz clic para subir una imagen</p>
            </motion.div>
          )}
        </motion.div>

        {/* Error message */}
        {error && (
          <motion.div
            className="p-3 bg-destructive/10 text-destructive mx-4 mt-4 rounded-lg flex items-center"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
          >
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Controls */}
        <div className="p-4">
          {image && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between mb-4">
                <motion.button
                  onClick={toggleGrayscale}
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-medium py-2 px-4 rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isGrayscale ? "Ver original" : "Convertir a escala de grises"}
                </motion.button>
              </div>

              {/* Use the client-side vote component */}
              <ClientVote featureId={featureId} />
            </motion.div>
          )}
        </div>
      </motion.div>

      <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
    </div>
  )
}
