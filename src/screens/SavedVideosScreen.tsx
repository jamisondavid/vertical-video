import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions } from "react-native"
import { ArrowLeft, Play } from "react-native-feather"

const { width: windowWidth } = Dimensions.get("window")

interface SavedVideosScreenProps {
  savedVideos: any[]
  onBack: () => void
  onPlayVideo: (videoId: string) => void
}

const SavedVideosScreen = ({ savedVideos, onBack, onPlayVideo }: SavedVideosScreenProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft width={24} height={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Videos</Text>
        <View style={{ width: 24 }} />
      </View>

      {savedVideos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No saved videos yet</Text>
          <Text style={styles.emptySubtext}>Swipe right on videos you like to save them for later</Text>
        </View>
      ) : (
        <FlatList
          data={savedVideos}
          numColumns={2}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.videoItem} onPress={() => onPlayVideo(item.id)}>
              <Image source={{ uri: item.thumbnail || item.user.profilePicture }} style={styles.thumbnail} />
              <View style={styles.videoInfo}>
                <Text style={styles.videoTitle} numberOfLines={2}>
                  {item.description}
                </Text>
                <Text style={styles.videoUsername}>@{item.user.username}</Text>
              </View>
              <View style={styles.playButton}>
                <Play width={20} height={20} color="white" fill="white" />
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  emptySubtext: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    textAlign: "center",
  },
  listContainer: {
    padding: 10,
  },
  videoItem: {
    width: (windowWidth - 30) / 2,
    marginHorizontal: 5,
    marginBottom: 15,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#111",
  },
  thumbnail: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  videoInfo: {
    padding: 10,
  },
  videoTitle: {
    color: "white",
    fontSize: 14,
    marginBottom: 5,
  },
  videoUsername: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
  },
  playButton: {
    position: "absolute",
    right: 10,
    bottom: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
})

export default SavedVideosScreen

