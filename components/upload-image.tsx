"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { ThumbsUp, ThumbsDown, Upload } from "lucide-react"
import { motion } from "framer-motion"
import { getVotes, updateVote } from "./actions/vote-actions"

const FEATURE_ID = "grayscale-feature"
const VOTE_STORAGE_KEY = "image-grayscale-voted"

export function UploadImage() {
  const [image, setImage] = useState<string | null>(null)
  const [isGrayscale, setIsGrayscale] = useState(false)
  const [likes, setLikes] = useState(0)
  const [dislikes, setDislikes] = useState(0)
  const [hasVoted, setHasVoted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [mounted, setMounted] = useState(false)

  // Check if user has already voted
  useEffect(() => {
    const checkVoteStatus = () => {
      const hasVotedBefore = localStorage.getItem(VOTE_STORAGE_KEY) === "true"
      setHasVoted(hasVotedBefore)
    }

    // Fetch initial vote counts
    const fetchVotes = async () => {
      try {
        const votesData = await getVotes(FEATURE_ID)
        setLikes(votesData.likes)
        setDislikes(votesData.dislikes)
      } catch (error) {
        console.error("Error fetching votes:", error)
      } finally {
        setIsLoading(false)
      }
    }

    setMounted(true)
    if (typeof window !== "undefined") {
      checkVoteStatus()
      fetchVotes()
    }
  }, [])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImage(event.target?.result as string)
        setIsGrayscale(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const toggleGrayscale = () => {
    setIsGrayscale(!isGrayscale)
  }

  const handleLike = async () => {
    if (!hasVoted && !isLoading) {
      try {
        setIsLoading(true)
        const result = await updateVote(FEATURE_ID, "like")

        if (result.success) {
          setLikes(result.likes || likes + 1)
          setDislikes(result.dislikes || dislikes)
          setHasVoted(true)
          localStorage.setItem(VOTE_STORAGE_KEY, "true")
        }
      } catch (error) {
        console.error("Error updating like:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleDislike = async () => {
    if (!hasVoted && !isLoading) {
      try {
        setIsLoading(true)
        const result = await updateVote(FEATURE_ID, "dislike")

        if (result.success) {
          setLikes(result.likes || likes)
          setDislikes(result.dislikes || dislikes + 1)
          setHasVoted(true)
          localStorage.setItem(VOTE_STORAGE_KEY, "true")
        }
      } catch (error) {
        console.error("Error updating dislike:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  if (!mounted) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-card text-card-foreground rounded-xl shadow-lg overflow-hidden border border-border transition-colors duration-500">
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
          <div className="relative w-full h-96 bg-muted flex items-center justify-center cursor-pointer transition-colors duration-500">
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
        className="bg-card text-card-foreground rounded-xl shadow-lg overflow-hidden border border-border transition-colors duration-500"
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
          className="relative w-full h-96 bg-muted flex items-center justify-center cursor-pointer transition-colors duration-500"
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

              <motion.div
                className="flex justify-center space-x-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <motion.button
                  onClick={handleLike}
                  className={`flex items-center space-x-2 ${(hasVoted || isLoading) && "opacity-50 cursor-not-allowed"}`}
                  disabled={hasVoted || isLoading}
                  whileHover={{ scale: hasVoted || isLoading ? 1 : 1.1 }}
                  whileTap={{ scale: hasVoted || isLoading ? 1 : 0.9 }}
                >
                  <ThumbsUp className={`h-6 w-6 ${hasVoted ? "text-muted-foreground" : "text-primary"}`} />
                  <span>{likes}</span>
                </motion.button>
                <motion.button
                  onClick={handleDislike}
                  className={`flex items-center space-x-2 ${(hasVoted || isLoading) && "opacity-50 cursor-not-allowed"}`}
                  disabled={hasVoted || isLoading}
                  whileHover={{ scale: hasVoted || isLoading ? 1 : 1.1 }}
                  whileTap={{ scale: hasVoted || isLoading ? 1 : 0.9 }}
                >
                  <ThumbsDown className={`h-6 w-6 ${hasVoted ? "text-muted-foreground" : "text-foreground"}`} />
                  <span>{dislikes}</span>
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </motion.div>

      <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
    </div>
  )
}
