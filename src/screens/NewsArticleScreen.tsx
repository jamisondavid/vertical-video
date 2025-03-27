"use client"

import { useRef } from "react"
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Animated } from "react-native"
import { ArrowLeft, Share2, Bookmark, ThumbsUp } from "react-native-feather"

const { width: windowWidth, height: windowHeight } = Dimensions.get("window")

interface NewsArticleScreenProps {
  article: {
    id: string
    title: string
    content: string
    imageUrl: string
    source: string
    date: string
    author: string
  }
  onClose: () => void
  animatedValue: Animated.Value
}

const NewsArticleScreen = ({ article, onClose, animatedValue }: NewsArticleScreenProps) => {
  const scrollY = useRef(new Animated.Value(0)).current

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: "clamp",
  })

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [windowHeight, 0],
  })

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
      {/* Header */}
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <ArrowLeft width={24} height={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {article.title}
        </Text>
        <View style={{ width: 24 }} />
      </Animated.View>

      {/* Article Content */}
      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
      >
        <TouchableOpacity style={styles.closeBar} onPress={onClose}>
          <View style={styles.closeBarIndicator} />
        </TouchableOpacity>

        <Image source={{ uri: article.imageUrl }} style={styles.heroImage} />

        <View style={styles.articleContent}>
          <Text style={styles.articleTitle}>{article.title}</Text>

          <View style={styles.articleMeta}>
            <Text style={styles.articleSource}>{article.source}</Text>
            <Text style={styles.articleDate}>{article.date}</Text>
          </View>

          <Text style={styles.articleAuthor}>By {article.author}</Text>

          <View style={styles.divider} />

          <Text style={styles.articleBody}>{article.content}</Text>

          <View style={styles.actionBar}>
            <TouchableOpacity style={styles.actionButton}>
              <ThumbsUp width={20} height={20} color="#333" />
              <Text style={styles.actionText}>Like</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Bookmark width={20} height={20} color="#333" />
              <Text style={styles.actionText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Share2 width={20} height={20} color="#333" />
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.ScrollView>
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
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
    zIndex: 1000,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: "#fff",
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  closeBar: {
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  closeBarIndicator: {
    width: 40,
    height: 5,
    backgroundColor: "#ddd",
    borderRadius: 3,
  },
  heroImage: {
    width: windowWidth,
    height: 250,
    resizeMode: "cover",
  },
  articleContent: {
    padding: 20,
  },
  articleTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  articleMeta: {
    flexDirection: "row",
    marginBottom: 5,
  },
  articleSource: {
    fontSize: 14,
    color: "#F00",
    fontWeight: "bold",
    marginRight: 10,
  },
  articleDate: {
    fontSize: 14,
    color: "#666",
  },
  articleAuthor: {
    fontSize: 14,
    color: "#333",
    marginBottom: 15,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 15,
  },
  articleBody: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  actionBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 30,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: {
    marginLeft: 5,
    color: "#333",
  },
})

export default NewsArticleScreen

