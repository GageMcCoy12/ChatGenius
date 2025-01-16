"use client"

import * as React from "react"
import { Volume2, VolumeOff } from "lucide-react"
import { Button } from "./button"
import { useToast } from "./use-toast"

interface TTSButtonProps {
  text: string;
  className?: string;
}

export function TTSButton({ text, className }: TTSButtonProps) {
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [audio, setAudio] = React.useState<HTMLAudioElement | null>(null)
  const { toast } = useToast()

  const handleTTS = async () => {
    try {
      if (isPlaying && audio) {
        audio.pause()
        setIsPlaying(false)
        return
      }

      // Show loading state
      toast({
        title: "Generating speech...",
        description: "Please wait while we process your request.",
      })

      // Call our TTS API endpoint
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to generate speech')
      }

      const { audioUrl } = await response.json()
      
      // Create and play audio
      const newAudio = new Audio(audioUrl)
      setAudio(newAudio)
      
      newAudio.onended = () => {
        setIsPlaying(false)
        setAudio(null)
      }

      newAudio.onerror = (e) => {
        console.error('Audio playback error:', e)
        setIsPlaying(false)
        setAudio(null)
        toast({
          title: "Error",
          description: "Failed to play audio",
          variant: "destructive",
        })
      }

      // Play the audio
      try {
        await newAudio.play()
        setIsPlaying(true)
        toast({
          title: "Success",
          description: "Playing audio...",
        })
      } catch (playError) {
        console.error('Play error:', playError)
        toast({
          title: "Error",
          description: "Failed to play audio. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('TTS error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate speech",
        variant: "destructive",
      })
    }
  }

  React.useEffect(() => {
    return () => {
      if (audio) {
        audio.pause()
        setIsPlaying(false)
      }
    }
  }, [audio])

  return (
    <Button
      onClick={handleTTS}
      variant="ghost"
      size="icon"
      className={className}
      disabled={isPlaying}
    >
      {isPlaying ? (
        <VolumeOff className="h-4 w-4" />
      ) : (
        <Volume2 className="h-4 w-4" />
      )}
    </Button>
  )
} 