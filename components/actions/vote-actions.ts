"use server"

import { createServerSupabaseClient } from "@/lib/supabase-server"

type VoteType = "like" | "dislike"

export async function getVotes(featureId: string) {
  try {
    console.log("Getting votes for feature:", featureId)
    const supabase = createServerSupabaseClient()

    // Test connection
    const { data: testData, error: testError } = await supabase.from("image_votes").select("count(*)").limit(1)
    if (testError) {
      console.error("Supabase connection test failed:", testError)
      return { likes: 0, dislikes: 0 }
    }
    console.log("Supabase connection test succeeded:", testData)

    const { data, error } = await supabase
      .from("image_votes")
      .select("likes, dislikes")
      .eq("feature_id", featureId)
      .single()

    if (error) {
      console.error("Error fetching votes:", error.message, error.details, error.hint)
      // If no rows found, return zeros
      if (error.code === "PGRST116") {
        console.log("No votes found for feature, returning zeros")
        return { likes: 0, dislikes: 0 }
      }
      return { likes: 0, dislikes: 0 }
    }

    console.log("Successfully fetched votes:", data)
    return { likes: data?.likes || 0, dislikes: data?.dislikes || 0 }
  } catch (err) {
    console.error("Unexpected error fetching votes:", err)
    return { likes: 0, dislikes: 0 }
  }
}

export async function updateVote(featureId: string, voteType: VoteType) {
  try {
    console.log("Updating vote for feature:", featureId, "type:", voteType)
    const supabase = createServerSupabaseClient()

    // First check if the feature exists
    const { data: existingData, error: checkError } = await supabase
      .from("image_votes")
      .select("likes, dislikes")
      .eq("feature_id", featureId)
      .maybeSingle()

    console.log("Check for existing feature result:", existingData, checkError)

    let currentLikes = 0
    let currentDislikes = 0

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error checking for existing feature:", checkError.message, checkError.details, checkError.hint)
      return {
        success: false,
        message: `Error checking for existing feature: ${checkError.message}`,
        likes: 0,
        dislikes: 0,
      }
    }

    if (existingData) {
      currentLikes = existingData.likes || 0
      currentDislikes = existingData.dislikes || 0
    }

    // Prepare the update data
    const updates = {
      feature_id: featureId,
      likes: voteType === "like" ? currentLikes + 1 : currentLikes,
      dislikes: voteType === "dislike" ? currentDislikes + 1 : currentDislikes,
      updated_at: new Date().toISOString(),
    }

    console.log("Updates prepared:", updates)
    // Update the votes
    const { data: updateData, error: updateError } = await supabase.from("image_votes").upsert(updates).select()

    if (updateError) {
      console.error("Error updating votes:", updateError.message, updateError.details, updateError.hint)
      return {
        success: false,
        message: `Error updating votes: ${updateError.message}`,
        likes: currentLikes,
        dislikes: currentDislikes,
      }
    }

    console.log("Successfully updated votes:", updateData)

    // Return the updated counts
    return {
      success: true,
      likes: voteType === "like" ? currentLikes + 1 : currentLikes,
      dislikes: voteType === "dislike" ? currentDislikes + 1 : currentDislikes,
    }
  } catch (err) {
    console.error("Unexpected error updating votes:", err)
    return {
      success: false,
      message: `Unexpected error: ${err instanceof Error ? err.message : String(err)}`,
      likes: 0,
      dislikes: 0,
    }
  }
}
