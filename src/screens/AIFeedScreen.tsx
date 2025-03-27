"use client"

import { useRef, useState } from "react"
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity } from "react-native"
import VideoItem from "../components/VideoItem"
import { Brain, ThumbsUp, ThumbsDown } from "react-native-feather"
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"

const { height: windowHeight } = Dimensions.get("window")

// Sample AI recommended videos
const AI_VIDEOS = [
  {
    id: "ai1",
    videoUri:
      "https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smart-watch-with-health-metrics-32808-large.mp4",
    user: {
      id: "ai1",
      username: "tech_review",
      profilePicture: "https://randomuser.me/api/portraits/men/22.jpg",
    },
    description: "Latest smartwatch features explained #tech #wearables #review",
    likes: 45600,
    comments: 1200,
    shares: 890,
    aiRecommended: true,
    aiConfidence: 0.92,
    aiReason: "Based on your interest in technology and gadget reviews",
    category: "Technology",
  },
  {
    id: "ai2",
    videoUri:
      "https://assets.mixkit.co/videos/preview/mixkit-going-down-a-curved-highway-down-a-mountain-41576-large.mp4",
    user: {
      id: "ai2",
      username: "adventure_time",
      profilePicture: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    description: "Mountain road trip adventures #travel #mountains #roadtrip",
    likes: 89700,
    comments: 3400,
    shares: 2100,
    aiRecommended: true,
    aiConfidence: 0.85,
    aiReason: "Similar to outdoor content you've engaged with",
    category: "Travel",
  },
  {
    id: "ai3",
    videoUri: "https://assets.mixkit.co/videos/preview/mixkit-man-under-multicolored-lights-1237-large.mp4",
    user: {
      id: "ai3",
      username: "cinema_magic",
      profilePicture: "https://randomuser.me/api/portraits/men/36.jpg",
    },
    description: "Behind the scenes: lighting techniques for film #filmmaking #cinematography",
    likes: 34500,
    comments: 980,
    shares: 450,
    aiRecommended: true,
    aiConfidence: 0.78,
    aiReason: "Recommended because you watched similar creative content",
    category: "Film & Animation",
  },
  {
    id: "ai4",
    videoUri:
      "https://assets.mixkit.co/videos/preview/mixkit-woman-running-above-the-camera-on-a-running-track-32807-large.mp4",
    user: {
      id: "ai4",
      username: "fitness_pro",
      profilePicture: "https://randomuser.me/api/portraits/women/45.jpg",
    },
    description: "Sprint training techniques to improve your speed #fitness #running #training",
    likes: 67800,
    comments: 2300,
    shares: 1800,
    aiRecommended: true,
    aiConfidence: 0.88,
    aiReason: "Matches your interest in fitness content",
    category: "Sports",
  },
  {
    id: "ai5",
    videoUri: "https://assets.mixkit.co/videos/preview/mixkit-white-sand-beach-and-palm-trees-1564-large.mp4",
    user: {
      id: "ai5",
      username: "travel_diary",
      profilePicture: "https://randomuser.me/api/portraits/women/32.jpg",
    },
    description: "Hidden beach paradise in Southeast Asia #travel #beach #tropical",
    likes: 98700,
    comments: 4500,
    shares: 3200,
    aiRecommended: true,
    aiConfidence: 0.95,
    aiReason: "Highly relevant to your travel interests",
    category: "Travel",
  },
]

interface AIFeedScreenProps {
  onSaveVideo?: (videoId: string) => void
  onOpenArticle?: (videoId: string) => void
  onShowRelated?: (videoId: string) => void
}

const AIFeedScreen = ({ onSaveVideo, onOpenArticle, onShowRelated }: AIFeedScreenProps) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [videos, setVideos] = useState(AI_VIDEOS)
  const [userPreferences, setUserPreferences] = useState({
    categories: {},
    creators: {},
    interactions: [],
  })

  const flatListRef = useRef<FlatList>(null)
  const opacity = useSharedValue(1)
  const feedbackOpacity = useSharedValue(0)
  const [showingFeedback, setShowingFeedback] = useState(false)
  const [currentFeedback, setCurrentFeedback] = useState({ message: "", isPositive: true })

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index)
    }
  }).current

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    }
  })

  const feedbackAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: feedbackOpacity.value,
    }
  })

  const handleLikeRecommendation = () => {
    const currentVideo = videos[activeIndex]

    // Update user preferences
    const updatedPreferences = { ...userPreferences }

    // Increase category preference
    if (currentVideo.category) {
      updatedPreferences.categories[currentVideo.category] =
        (updatedPreferences.categories[currentVideo.category] || 0) + 1
    }

    // Increase creator preference
    if (currentVideo.user.username) {
      updatedPreferences.creators[currentVideo.user.username] =
        (updatedPreferences.creators[currentVideo.user.username] || 0) + 1
    }

    // Add interaction
    updatedPreferences.interactions.push({
      videoId: currentVideo.id,
      action: "like",
      timestamp: new Date().toISOString(),
    })

    setUserPreferences(updatedPreferences)

    // Show feedback
    setCurrentFeedback({
      message: "Thanks! We'll show more like this",
      isPositive: true,
    })
    showFeedback()

    // In a real app, this would trigger a re-ranking of recommendations
    console.log("Liked recommendation:", currentVideo.id)
  }

  const handleDislikeRecommendation = () => {
    const currentVideo = videos[activeIndex]

    // Update user preferences
    const updatedPreferences = { ...userPreferences }

    // Decrease category preference
    if (currentVideo.category) {
      updatedPreferences.categories[currentVideo.category] =
        (updatedPreferences.categories[currentVideo.category] || 0) - 1
    }

    // Add interaction
    updatedPreferences.interactions.push({
      videoId: currentVideo.id,
      action: "dislike",
      timestamp: new Date().toISOString(),
    })

    setUserPreferences(updatedPreferences)

    // Show feedback
    setCurrentFeedback({
      message: "Got it! We'll show fewer like this",
      isPositive: false,
    })
    showFeedback()

    // In a real app, this would trigger a re-ranking of recommendations
    console.log("Disliked recommendation:", currentVideo.id)
  }

  const showFeedback = () => {
    if (showingFeedback) return

    setShowingFeedback(true)
    feedbackOpacity.value = withTiming(1, { duration: 300 })

    setTimeout(() => {
      feedbackOpacity.value = withTiming(0, { duration: 300 })
      setTimeout(() => {
        setShowingFeedback(false)
      }, 300)
    }, 2000)
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.feedContainer, animatedStyle]}>
        <FlatList
          ref={flatListRef}
          data={videos}
          renderItem={({ item, index }) => (
            <View style={styles.videoWrapper}>
              <VideoItem
                video={item}
                isActive={index === activeIndex}
                onSaveVideo={onSaveVideo}
                onOpenArticle={onOpenArticle}
                onShowRelated={onShowRelated}
              />

              {/* AI Recommendation Badge */}
              <View style={styles.aiBadge}>
                <Brain width={16} height={16} color="white" />
                <Text style={styles.aiBadgeText}>AI Recommended</Text>
              </View>

              {/* AI Confidence Meter */}
              <View style={styles.confidenceMeter}>
                <View style={styles.confidenceLabel}>
                  <Text style={styles.confidenceLabelText}>AI Confidence</Text>
                </View>
                <View style={styles.confidenceBarContainer}>
                  <View
                    style={[
                      styles.confidenceBar,
                      { width: `${item.aiConfidence * 100}%` },
                      item.aiConfidence > 0.9
                        ? styles.highConfidence
                        : item.aiConfidence > 0.7
                          ? styles.mediumConfidence
                          : styles.lowConfidence,
                    ]}
                  />
                </View>
                <Text style={styles.confidencePercentage}>{Math.round(item.aiConfidence * 100)}%</Text>
              </View>

              {/* AI Reason */}
              <View style={styles.aiReason}>
                <Text style={styles.aiReasonText}>{item.aiReason}</Text>
              </View>

              {/* Feedback Buttons */}
              <View style={styles.feedbackButtons}>
                <TouchableOpacity style={[styles.feedbackButton, styles.likeButton]} onPress={handleLikeRecommendation}>
                  <ThumbsUp width={20} height={20} color="white" />
                  <Text style={styles.feedbackButtonText}>More like this</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.feedbackButton, styles.dislikeButton]}
                  onPress={handleDislikeRecommendation}
                >
                  <ThumbsDown width={20} height={20} color="white" />
                  <Text style={styles.feedbackButtonText}>Less like this</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
          snapToInterval={windowHeight}
          snapToAlignment="start"
          decelerationRate="fast"
          viewabilityConfig={viewabilityConfig}
          onViewableItemsChanged={onViewableItemsChanged}
          showsVerticalScrollIndicator={false}
          pagingEnabled
        />
      </Animated.View>

      {/* Feedback Toast */}
      <Animated.View
        style={[
          styles.feedbackToast,
          feedbackAnimatedStyle,
          currentFeedback.isPositive ? styles.positiveFeedback : styles.negativeFeedback,
        ]}
      >
        <Text style={styles.feedbackToastText}>{currentFeedback.message}</Text>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  feedContainer: {
    flex: 1,
  },
  videoWrapper: {
    height: windowHeight,
    position: "relative",
  },
  aiBadge: {
    position: "absolute",
    top: 110,
    left: 10,
    backgroundColor: "rgba(123, 97, 255, 0.8)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 10,
  },
  aiBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 6,
  },
  confidenceMeter: {
    position: "absolute",
    top: 155,
    left: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    zIndex: 10,
    maxWidth: 200,
  },
  confidenceLabel: {
    marginRight: 8,
  },
  confidenceLabelText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 10,
  },
  confidenceBarContainer: {
    height: 6,
    width: 80,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 3,
    overflow: "hidden",
  },
  confidenceBar: {
    height: "100%",
    borderRadius: 3,
  },
  highConfidence: {
    backgroundColor: "#4CAF50",
  },
  mediumConfidence: {
    backgroundColor: "#FFC107",
  },
  lowConfidence: {
    backgroundColor: "#F44336",
  },
  confidencePercentage: {
    color: "white",
    fontSize: 10,
    marginLeft: 8,
  },
  aiReason: {
    position: "absolute",
    top: 190,
    left: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    zIndex: 10,
    maxWidth: 250,
  },
  aiReasonText: {
    color: "white",
    fontSize: 12,
    fontStyle: "italic",
  },
  feedbackButtons: {
    position: "absolute",
    bottom: 170,
    left: 10,
    flexDirection: "row",
    zIndex: 10,
  },
  feedbackButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  likeButton: {
    backgroundColor: "rgba(76, 175, 80, 0.8)",
  },
  dislikeButton: {
    backgroundColor: "rgba(244, 67, 54, 0.8)",
  },
  feedbackButtonText: {
    color: "white",
    fontSize: 12,
    marginLeft: 6,
  },
  feedbackToast: {
    position: "absolute",
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  positiveFeedback: {
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  negativeFeedback: {
    borderLeftWidth: 4,
    borderLeftColor: "#F44336",
  },
  feedbackToastText: {
    color: "white",
    fontSize: 14,
  },
})

export default AIFeedScreen

