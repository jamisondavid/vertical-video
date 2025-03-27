import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions, Animated } from "react-native"
import { ArrowLeft, Play } from "react-native-feather"

const { width: windowWidth } = Dimensions.get("window")

interface RelatedVideo {
  id: string
  title: string
  thumbnail: string
  duration: string
  views: string
  username: string
  userAvatar: string
}

interface RelatedVideosScreenProps {
  videoId: string
  relatedVideos: RelatedVideo[]
  onClose: () => void
  onPlayVideo: (videoId: string) => void
  animatedValue: Animated.Value
}

const RelatedVideosScreen = ({
  videoId,
  relatedVideos,
  onClose,
  onPlayVideo,
  animatedValue,
}: RelatedVideosScreenProps) => {
  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [windowWidth, 0],
  })

  return (
    <Animated.View style={[styles.container, { transform: [{ translateX }] }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <ArrowLeft width={24} height={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Related Videos</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={relatedVideos}
        numColumns={3}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.videoItem} onPress={() => onPlayVideo(item.id)}>
            <View style={styles.thumbnailContainer}>
              <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>{item.duration}</Text>
              </View>
              <View style={styles.playButton}>
                <Play width={15} height={15} color="white" fill="white" />
              </View>
            </View>
            <Text style={styles.videoTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <View style={styles.videoMeta}>
              <Image source={{ uri: item.userAvatar }} style={styles.userAvatar} />
              <Text style={styles.username} numberOfLines={1}>
                {item.username}
              </Text>
            </View>
            <Text style={styles.viewCount}>{item.views} views</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000",
    zIndex: 1000,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  listContainer: {
    padding: 10,
  },
  videoItem: {
    width: (windowWidth - 40) / 3,
    marginHorizontal: 5,
    marginBottom: 20,
  },
  thumbnailContainer: {
    position: "relative",
    width: "100%",
    aspectRatio: 9 / 16,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 5,
  },
  thumbnail: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  durationBadge: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: "white",
    fontSize: 10,
  },
  playButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 30,
    height: 30,
    marginLeft: -15,
    marginTop: -15,
    borderRadius: 15,
    backgroundColor: "rgba(255, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.8,
  },
  videoTitle: {
    color: "white",
    fontSize: 12,
    marginBottom: 3,
  },
  videoMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  userAvatar: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 5,
  },
  username: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 10,
    flex: 1,
  },
  viewCount: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 10,
  },
})

export default RelatedVideosScreen

