"use client"

import { useEffect, useRef, useState } from "react"
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from "react-native"
import Video from "react-native-video"
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withSpring, runOnJS } from "react-native-reanimated"
import { Heart, MessageCircle, Music, Bookmark, ExternalLink, Grid } from "react-native-feather"
import VideoLoader from "./VideoLoader"
import { Gesture, GestureDetector } from "react-native-gesture-handler"

const { width: windowWidth, height: windowHeight } = Dimensions.get("window")

interface VideoItemProps {
  video: {
    id: string
    videoUri: string
    user: {
      id: string
      username: string
      profilePicture: string
    }
    description: string
    likes: number
    comments: number
    shares: number
    hasArticle?: boolean
    articleUrl?: string
    aiRecommended?: boolean
    aiConfidence?: number
    aiReason?: string
    category?: string
  }
  isActive: boolean
  onSaveVideo?: (videoId: string) => void
  onOpenArticle?: (videoId: string) => void
  onShowRelated?: (videoId: string) => void
}

const VideoItem = ({ video, isActive, onSaveVideo, onOpenArticle, onShowRelated }: VideoItemProps) => {
  const videoRef = useRef<Video>(null)
  const opacity = useSharedValue(0)
  const translateX = useSharedValue(0)
  const scale = useSharedValue(1)
  const heartScale = useSharedValue(0)
  const saveScale = useSharedValue(0)

  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    if (isActive && isVideoLoaded) {
      videoRef.current?.seek(0)
      opacity.value = withTiming(1, { duration: 200 })
    } else {
      opacity.value = withTiming(0, { duration: 200 })
    }
  }, [isActive, opacity, isVideoLoaded])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateX: translateX.value }, { scale: scale.value }],
    }
  })

  const heartAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: heartScale.value }],
      opacity: heartScale.value,
    }
  })

  const saveAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: saveScale.value }],
      opacity: saveScale.value,
    }
  })

  const handleVideoLoad = () => {
    setIsVideoLoaded(true)
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  const toggleLike = () => {
    setIsLiked(!isLiked)
    if (!isLiked) {
      heartScale.value = withSpring(1, { damping: 10, stiffness: 100 })
      setTimeout(() => {
        heartScale.value = withTiming(0, { duration: 500 })
      }, 1000)
    }
  }

  const saveVideo = () => {
    if (!isSaved && onSaveVideo) {
      setIsSaved(true)
      onSaveVideo(video.id)
      saveScale.value = withSpring(1, { damping: 10, stiffness: 100 })
      setTimeout(() => {
        saveScale.value = withTiming(0, { duration: 500 })
      }, 1000)
    }
  }

  const handleOpenArticle = () => {
    if (video.hasArticle && onOpenArticle) {
      onOpenArticle(video.id)
    }
  }

  const handleShowRelated = () => {
    if (onShowRelated) {
      onShowRelated(video.id)
    }
  }

  // Swipe gesture handler
  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationX > 0) {
        // Only allow right swipes
        translateX.value = event.translationX
        scale.value = 1 - Math.min(event.translationX / 500, 0.1)
      }
    })
    .onEnd((event) => {
      if (event.translationX > windowWidth * 0.3) {
        // Threshold to trigger save
        runOnJS(saveVideo)()
        translateX.value = withTiming(windowWidth, { duration: 300 })
        setTimeout(() => {
          translateX.value = withTiming(0)
          scale.value = withTiming(1)
        }, 300)
      } else {
        translateX.value = withTiming(0)
        scale.value = withTiming(1)
      }
    })

  return (
    <GestureDetector gesture={gesture}>
      <View style={styles.container}>
        <Animated.View style={[styles.videoContainer, animatedStyle]}>
          <Video
            ref={videoRef}
            source={{ uri: video.videoUri }}
            style={styles.video}
            resizeMode="cover"
            repeat
            paused={!isActive}
            muted={false}
            onLoad={() => handleVideoLoad()}
          />
        </Animated.View>

        {!isVideoLoaded && <VideoLoader videoUri={video.videoUri} onLoaded={handleVideoLoad} />}

        {/* Heart animation overlay */}
        <Animated.View style={[styles.heartOverlay, heartAnimatedStyle]}>
          <Heart width={150} height={150} color="#F00" fill="#F00" />
        </Animated.View>

        {/* Save animation overlay */}
        <Animated.View style={[styles.saveOverlay, saveAnimatedStyle]}>
          <Bookmark width={150} height={150} color="#FFF" fill="#FFF" />
        </Animated.View>

        {/* Swipe instruction hint */}
        {isActive && (
          <View style={styles.swipeHint}>
            <Text style={styles.swipeHintText}>Swipe right to save</Text>
          </View>
        )}

        {/* Related Videos CTA Button */}
        <TouchableOpacity style={styles.relatedButton} onPress={handleShowRelated}>
          <Grid width={24} height={24} color="white" />
        </TouchableOpacity>

        <View style={styles.bottomContainer}>
          <View style={styles.bottomLeftContainer}>
            <Text style={styles.username}>@{video.user.username}</Text>
            <Text style={styles.description}>{video.description}</Text>
            <View style={styles.musicContainer}>
              <Music width={15} height={15} color="white" />
              <Text style={styles.musicText}>Original Sound</Text>
            </View>
          </View>
        </View>

        <View style={styles.rightContainer}>
          <View style={styles.profilePictureContainer}>
            <Image source={{ uri: video.user.profilePicture }} style={styles.profilePicture} />
            <View style={styles.followButton}>
              <Text style={styles.plusIcon}>+</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.iconContainer} onPress={toggleLike}>
            <Heart width={35} height={35} color={isLiked ? "#F00" : "white"} fill={isLiked ? "#F00" : "transparent"} />
            <Text style={styles.iconText}>{formatNumber(isLiked ? video.likes + 1 : video.likes)}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconContainer}>
            <MessageCircle width={35} height={35} color="white" />
            <Text style={styles.iconText}>{formatNumber(video.comments)}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconContainer} onPress={saveVideo}>
            <Bookmark
              width={35}
              height={35}
              color={isSaved ? "#FFF" : "white"}
              fill={isSaved ? "#FFF" : "transparent"}
            />
            <Text style={styles.iconText}>Save</Text>
          </TouchableOpacity>

          {video.hasArticle && (
            <TouchableOpacity style={styles.iconContainer} onPress={handleOpenArticle}>
              <ExternalLink width={35} height={35} color="white" />
              <Text style={styles.iconText}>Article</Text>
            </TouchableOpacity>
          )}

          <View style={styles.recordContainer}>
            <Image source={{ uri: video.user.profilePicture }} style={styles.recordImage} />
          </View>
        </View>
      </View>
    </GestureDetector>
  )
}

const styles = StyleSheet.create({
  container: {
    width: windowWidth,
    height: windowHeight,
    position: "relative",
  },
  videoContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
  },
  video: {
    ...StyleSheet.absoluteFillObject,
  },
  heartOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  saveOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  swipeHint: {
    position: "absolute",
    top: 70,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  swipeHintText: {
    color: "white",
    fontSize: 12,
  },
  relatedButton: {
    position: "absolute",
    right: 15,
    top: windowHeight / 2 - 25,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 100,
    left: 10,
    width: windowWidth * 0.7,
  },
  bottomLeftContainer: {
    padding: 10,
  },
  username: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
  },
  description: {
    color: "white",
    fontSize: 14,
    marginBottom: 8,
  },
  musicContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  musicText: {
    color: "white",
    fontSize: 14,
    marginLeft: 5,
  },
  rightContainer: {
    position: "absolute",
    right: 10,
    bottom: 100,
    alignItems: "center",
  },
  profilePictureContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "white",
    marginBottom: 15,
  },
  profilePicture: {
    width: "100%",
    height: "100%",
    borderRadius: 25,
  },
  followButton: {
    position: "absolute",
    bottom: -8,
    left: 15,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#F00",
    alignItems: "center",
    justifyContent: "center",
  },
  plusIcon: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  iconText: {
    color: "white",
    marginTop: 5,
  },
  recordContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 10,
    borderColor: "#333",
    backgroundColor: "#F00",
    overflow: "hidden",
  },
  recordImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
})

export default VideoItem

