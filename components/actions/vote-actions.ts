"use server"

//import { createServerSupabaseClient } from "@/lib/supabase"
import { createServerSupabaseClient } from "@/lib/supabase-server"


type VoteType = "like" | "dislike"

export async function getVotes(featureId: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("image_votes")
    .select("likes, dislikes")
    .eq("feature_id", featureId)
    .single()

  if (error) {
    console.error("Error fetching votes:", error)
    return { likes: 0, dislikes: 0 }
  }

  return { likes: data?.likes || 0, dislikes: data?.dislikes || 0 }
}

export async function updateVote(featureId: string, voteType: VoteType) {
  const supabase = createServerSupabaseClient()

  // First get current votes
  const { data: currentData, error: fetchError } = await supabase
    .from("image_votes")
    .select("likes, dislikes")
    .eq("feature_id", featureId)
    .single()

  if (fetchError && fetchError.code !== "PGRST116") {
    // PGRST116 is "no rows returned" error
    console.error("Error fetching current votes:", fetchError)
    return { success: false, message: `Error fetching current votes: ${fetchError.message}` }
  }

  const currentLikes = currentData?.likes || 0
  const currentDislikes = currentData?.dislikes || 0

  // Update the votes
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
    console.error("Error updating votes:", updateError)
    return { success: false, message: `Error updating votes: ${updateError.message}` }
  }

  // Return the updated counts
  return {
    success: true,
    likes: voteType === "like" ? currentLikes + 1 : currentLikes,
    dislikes: voteType === "dislike" ? currentDislikes + 1 : currentDislikes,
  }
}
