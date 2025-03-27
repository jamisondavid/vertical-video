import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Home, Search, PlusSquare, User, Bookmark, Brain } from "react-native-feather"

interface NavigationBarProps {
  activeTab?: "home" | "discover" | "create" | "inbox" | "profile" | "ai"
  onSavedPress?: () => void
  savedCount?: number
  onAiPress?: () => void
}

const NavigationBar = ({ activeTab = "home", onSavedPress, savedCount = 0, onAiPress }: NavigationBarProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.tabItem}>
        <Home width={24} height={24} color={activeTab === "home" ? "#FFF" : "rgba(255, 255, 255, 0.6)"} />
        <Text style={[styles.tabText, activeTab === "home" && styles.activeTabText]}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem}>
        <Search width={24} height={24} color={activeTab === "discover" ? "#FFF" : "rgba(255, 255, 255, 0.6)"} />
        <Text style={[styles.tabText, activeTab === "discover" && styles.activeTabText]}>Discover</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem}>
        <View style={styles.plusButton}>
          <PlusSquare width={40} height={40} color="white" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem} onPress={onSavedPress}>
        <View style={styles.savedContainer}>
          <Bookmark width={24} height={24} color="rgba(255, 255, 255, 0.6)" />
          {savedCount > 0 && (
            <View style={styles.savedBadge}>
              <Text style={styles.savedBadgeText}>{savedCount > 99 ? "99+" : savedCount}</Text>
            </View>
          )}
        </View>
        <Text style={styles.tabText}>Saved</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem} onPress={onAiPress}>
        <Brain width={24} height={24} color={activeTab === "ai" ? "#FFF" : "rgba(255, 255, 255, 0.6)"} />
        <Text style={[styles.tabText, activeTab === "ai" && styles.activeTabText]}>AI Feed</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem}>
        <User width={24} height={24} color={activeTab === "profile" ? "#FFF" : "rgba(255, 255, 255, 0.6)"} />
        <Text style={[styles.tabText, activeTab === "profile" && styles.activeTabText]}>Profile</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 60,
    backgroundColor: "#000",
    borderTopWidth: 1,
    borderTopColor: "#333",
    paddingHorizontal: 10,
  },
  tabItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 10,
    marginTop: 3,
  },
  activeTabText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  plusButton: {
    backgroundColor: "#F00",
    borderRadius: 8,
    padding: 2,
  },
  savedContainer: {
    position: "relative",
  },
  savedBadge: {
    position: "absolute",
    top: -5,
    right: -8,
    backgroundColor: "#F00",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  savedBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
})

export default NavigationBar

