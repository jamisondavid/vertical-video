"use client"

import { useEffect, useState } from "react"
import { ActivityIndicator, StyleSheet, View } from "react-native"

interface VideoLoaderProps {
  videoUri: string
  onLoaded: () => void
}

const VideoLoader = ({ videoUri, onLoaded }: VideoLoaderProps) => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate video preloading
    const preloadVideo = async () => {
      try {
        // In a real app, you would use a library like react-native-video-cache
        // to preload the video. This is a simplified simulation.
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setLoading(false)
        onLoaded()
      } catch (error) {
        console.error("Error preloading video:", error)
        setLoading(false)
        onLoaded()
      }
    }

    preloadVideo()
  }, [videoUri, onLoaded])

  if (!loading) return null

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#FFF" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
})

export default VideoLoader

