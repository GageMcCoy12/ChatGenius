import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { text } = await req.json()
    if (!text) {
      return new NextResponse("Text is required", { status: 400 })
    }

    // Fish.audio API endpoint - using v1 API as per docs
    const response = await fetch("https://api.fish.audio/v1/tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.FISH_AUDIO_API_KEY}`,
      },
      body: JSON.stringify({
        text,
        latency: "normal",
        format: "mp3",
        reference_id: "0e100a87075f4a8f810a0ad3811e3d17", // Your model ID
        prosody: {
          speed: 1.0,
          volume: 0
        }
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => null)
      console.error("Fish.audio API error:", error)
      throw new Error(error?.message || "Failed to generate speech")
    }

    const audioData = await response.arrayBuffer()
    
    // Convert the audio data to base64
    const audioBase64 = Buffer.from(audioData).toString('base64')
    const audioUrl = `data:audio/mp3;base64,${audioBase64}`

    return NextResponse.json({ audioUrl })
  } catch (error) {
    console.error("[TTS_ERROR]:", error)
    return new NextResponse(
      JSON.stringify({ 
        message: error instanceof Error ? error.message : "Failed to generate speech" 
      }), 
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
} 