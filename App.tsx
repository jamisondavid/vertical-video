import { SafeAreaView, StatusBar, StyleSheet, View } from "react-native"
import FeedScreen from "./src/screens/FeedScreen"
import { GestureHandlerRootView } from "react-native-gesture-handler"

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <SafeAreaView style={styles.safeArea}>
          <FeedScreen />
        </SafeAreaView>
      </View>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  safeArea: {
    flex: 1,
  },
})

export default App

