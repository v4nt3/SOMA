"use client"

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import { ThumbsUp, ThumbsDown } from "lucide-react"
import { motion } from "framer-motion"

type VoteType = "like" | "dislike"

export function ClientVote({ featureId }: { featureId: string }) {
  const [likes, setLikes] = useState(0)
  const [dislikes, setDislikes] = useState(0)
  const [hasVoted, setHasVoted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Create Supabase client
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseAnonKey) {
          throw new Error("Missing Supabase environment variables")
        }

        const supabase = createClient(supabaseUrl, supabaseAnonKey)

        // Fetch votes
        const { data, error } = await supabase
          .from("image_votes")
          .select("likes, dislikes")
          .eq("feature_id", featureId)
          .single()

        if (error && error.code !== "PGRST116") {
          throw error
        }

        setLikes(data?.likes || 0)
        setDislikes(data?.dislikes || 0)
      } catch (err) {
        console.error("Failed to fetch votes:", err)
        setError("No se pudieron cargar los votos")
      } finally {
        setIsLoading(false)
      }
    }

    fetchVotes()
  }, [featureId])

  const handleVote = async (voteType: VoteType) => {
    if (hasVoted || isLoading) return

    try {
      setIsLoading(true)
      setError(null)

      // Create Supabase client
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Missing Supabase environment variables")
      }

      const supabase = createClient(supabaseUrl, supabaseAnonKey)

      // Get current votes
      const { data, error: fetchError } = await supabase
        .from("image_votes")
        .select("likes, dislikes")
        .eq("feature_id", featureId)
        .single()

      if (fetchError && fetchError.code !== "PGRST116") {
        throw fetchError
      }

      const currentLikes = data?.likes || 0
      const currentDislikes = data?.dislikes || 0

      // Update votes
      const updates = voteType === "like" ? { likes: currentLikes + 1 } : { dislikes: currentDislikes + 1 }

      const { error: updateError } = await supabase.from("image_votes").upsert(
        {
          feature_id: featureId,
          ...updates,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "feature_id" },
      )

      if (updateError) {
        throw updateError
      }

      // Update state
      if (voteType === "like") {
        setLikes(currentLikes + 1)
      } else {
        setDislikes(currentDislikes + 1)
      }

      setHasVoted(true)
    } catch (err) {
      console.error("Failed to update vote:", err)
      setError("No se pudo registrar tu voto")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      {error && <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-md text-sm">{error}</div>}

      <div className="flex justify-center space-x-8">
        <motion.button
          onClick={() => handleVote("like")}
          className={`flex items-center space-x-2 ${(hasVoted || isLoading) && "opacity-50 cursor-not-allowed"}`}
          disabled={hasVoted || isLoading}
          whileHover={{ scale: hasVoted || isLoading ? 1 : 1.1 }}
          whileTap={{ scale: hasVoted || isLoading ? 1 : 0.9 }}
        >
          <ThumbsUp className={`h-6 w-6 ${hasVoted || isLoading ? "text-muted-foreground" : "text-primary"}`} />
          <span>{likes}</span>
        </motion.button>
        <motion.button
          onClick={() => handleVote("dislike")}
          className={`flex items-center space-x-2 ${(hasVoted || isLoading) && "opacity-50 cursor-not-allowed"}`}
          disabled={hasVoted || isLoading}
          whileHover={{ scale: hasVoted || isLoading ? 1 : 1.1 }}
          whileTap={{ scale: hasVoted || isLoading ? 1 : 0.9 }}
        >
          <ThumbsDown className={`h-6 w-6 ${hasVoted || isLoading ? "text-muted-foreground" : "text-foreground"}`} />
          <span>{dislikes}</span>
        </motion.button>
      </div>
    </div>
  )
}
