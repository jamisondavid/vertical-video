"use client"

import { useRef, useState } from "react"
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View, Animated } from "react-native"
import VideoItem from "../components/VideoItem"
import DiscoverVideoItem from "../components/DiscoverVideoItem"
import NavigationBar from "../components/NavigationBar"
import SavedVideosScreen from "./SavedVideosScreen"
import NewsArticleScreen from "./NewsArticleScreen"
import RelatedVideosScreen from "./RelatedVideosScreen"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
// Add AIFeedScreen import at the top with other imports
import AIFeedScreen from "./AIFeedScreen"

// Sample related videos data
const RELATED_VIDEOS = {
  "1": [
    {
      id: "r1",
      title: "Summer Pool Party Highlights",
      thumbnail:
        "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      duration: "2:45",
      views: "1.2M",
      username: "user_one",
      userAvatar: "https://randomuser.me/api/portraits/women/81.jpg",
    },
    {
      id: "r2",
      title: "Beach Day Vlog | Summer Vibes",
      thumbnail:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      duration: "5:12",
      views: "876K",
      username: "beach_lover",
      userAvatar: "https://randomuser.me/api/portraits/women/32.jpg",
    },
    {
      id: "r3",
      title: "How to Take Underwater Photos",
      thumbnail:
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      duration: "8:24",
      views: "543K",
      username: "photo_tips",
      userAvatar: "https://randomuser.me/api/portraits/men/45.jpg",
    },
    {
      id: "r4",
      title: "Summer Makeup Tutorial",
      thumbnail:
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      duration: "10:05",
      views: "1.5M",
      username: "beauty_guru",
      userAvatar: "https://randomuser.me/api/portraits/women/22.jpg",
    },
    {
      id: "r5",
      title: "Pool Exercises for Beginners",
      thumbnail:
        "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      duration: "15:30",
      views: "324K",
      username: "fitness_coach",
      userAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: "r6",
      title: "DIY Pool Party Decorations",
      thumbnail:
        "https://images.unsplash.com/photo-1563900905-a6b8568ff726?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      duration: "7:18",
      views: "212K",
      username: "diy_queen",
      userAvatar: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    {
      id: "r7",
      title: "Summer Cocktail Recipes",
      thumbnail:
        "https://images.unsplash.com/photo-1536935338788-846bb9981813?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      duration: "4:55",
      views: "678K",
      username: "mixology_master",
      userAvatar: "https://randomuser.me/api/portraits/men/36.jpg",
    },
    {
      id: "r8",
      title: "Pool Safety Tips for Kids",
      thumbnail:
        "https://images.unsplash.com/photo-1562553481-2a83e9a34056?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      duration: "6:42",
      views: "432K",
      username: "safety_first",
      userAvatar: "https://randomuser.me/api/portraits/women/15.jpg",
    },
    {
      id: "r9",
      title: "Summer Hair Care Routine",
      thumbnail:
        "https://images.unsplash.com/photo-1519699047748-de8e457a634e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      duration: "9:15",
      views: "765K",
      username: "hair_stylist",
      userAvatar: "https://randomuser.me/api/portraits/women/28.jpg",
    },
  ],
  "2": [
    {
      id: "r10",
      title: "Rare Flowers in Bloom",
      thumbnail:
        "https://images.unsplash.com/photo-1490750967868-88aa4486c946?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      duration: "3:21",
      views: "543K",
      username: "nature_lover",
      userAvatar: "https://randomuser.me/api/portraits/men/70.jpg",
    },
    {
      id: "r11",
      title: "Spring Garden Tour 2023",
      thumbnail:
        "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      duration: "12:45",
      views: "876K",
      username: "garden_guru",
      userAvatar: "https://randomuser.me/api/portraits/women/42.jpg",
    },
    {
      id: "r12",
      title: "How to Grow Yellow Flowers",
      thumbnail:
        "https://images.unsplash.com/photo-1504567961542-e24d9439a724?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      duration: "8:32",
      views: "432K",
      username: "plant_whisperer",
      userAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: "r13",
      title: "Macro Photography: Flowers",
      thumbnail:
        "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      duration: "6:18",
      views: "321K",
      username: "photo_pro",
      userAvatar: "https://randomuser.me/api/portraits/women/28.jpg",
    },
    {
      id: "r14",
      title: "Medicinal Properties of Flowers",
      thumbnail:
        "https://images.unsplash.com/photo-1464820453369-31d2c0b651af?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      duration: "15:24",
      views: "765K",
      username: "herbal_healer",
      userAvatar: "https://randomuser.me/api/portraits/men/45.jpg",
    },
    {
      id: "r15",
      title: "DIY Flower Arrangements",
      thumbnail:
        "https://images.unsplash.com/photo-1487530811176-3780de880c2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      duration: "7:55",
      views: "543K",
      username: "craft_lover",
      userAvatar: "https://randomuser.me/api/portraits/women/22.jpg",
    },
  ],
  // Add more related videos for other video IDs
}

// Update FYP videos to include hasArticle property
const FYP_VIDEOS = [
  {
    id: "1",
    videoUri: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-waving-her-hair-in-a-pool-1229-large.mp4",
    user: {
      id: "1",
      username: "user_one",
      profilePicture: "https://randomuser.me/api/portraits/women/81.jpg",
    },
    description: "Having fun at the pool! #summer #pool",
    likes: 1234,
    comments: 123,
    shares: 45,
    hasArticle: false,
  },
  {
    id: "2",
    videoUri: "https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4",
    user: {
      id: "2",
      username: "nature_lover",
      profilePicture: "https://randomuser.me/api/portraits/men/70.jpg",
    },
    description: "Beautiful nature scenes #nature #peaceful",
    likes: 8765,
    comments: 432,
    shares: 89,
    hasArticle: true,
    articleId: "article1",
  },
  {
    id: "3",
    videoUri:
      "https://assets.mixkit.co/videos/preview/mixkit-mother-with-her-little-daughter-eating-a-marshmallow-in-nature-39764-large.mp4",
    user: {
      id: "3",
      username: "family_time",
      profilePicture: "https://randomuser.me/api/portraits/women/42.jpg",
    },
    description: "Family picnic day! #family #outdoors",
    likes: 5432,
    comments: 321,
    shares: 67,
    hasArticle: false,
  },
  {
    id: "4",
    videoUri: "https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4",
    user: {
      id: "4",
      username: "ocean_vibes",
      profilePicture: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    description: "Ocean waves are so calming #ocean #waves #relax",
    likes: 9876,
    comments: 678,
    shares: 123,
    hasArticle: true,
    articleId: "article2",
  },
  {
    id: "5",
    videoUri: "https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4",
    user: {
      id: "5",
      username: "neon_dreams",
      profilePicture: "https://randomuser.me/api/portraits/women/28.jpg",
    },
    description: "Night vibes in the city #neon #nightlife",
    likes: 7654,
    comments: 345,
    shares: 76,
    hasArticle: false,
  },
]

// Update Discover videos to include hasArticle property
const DISCOVER_VIDEOS = [
  {
    id: "d1",
    videoUri: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-11-large.mp4",
    user: {
      id: "d1",
      username: "city_explorer",
      profilePicture: "https://randomuser.me/api/portraits/men/45.jpg",
    },
    description: "City lights from above #cityscape #nightview #aerial",
    likes: 45600,
    comments: 1200,
    shares: 890,
    category: "Travel",
    hasArticle: true,
    articleId: "article3",
  },
  {
    id: "d2",
    videoUri: "https://assets.mixkit.co/videos/preview/mixkit-top-aerial-shot-of-seashore-with-rocks-1090-large.mp4",
    user: {
      id: "d2",
      username: "drone_master",
      profilePicture: "https://randomuser.me/api/portraits/women/22.jpg",
    },
    description: "Breathtaking coastline views #drone #coast #aerial",
    likes: 89700,
    comments: 3400,
    shares: 2100,
    category: "Nature",
    hasArticle: false,
  },
  {
    id: "d3",
    videoUri: "https://assets.mixkit.co/videos/preview/mixkit-woman-running-through-a-park-in-autumn-41709-large.mp4",
    user: {
      id: "d3",
      username: "fitness_journey",
      profilePicture: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    description: "Morning run in the park #fitness #running #motivation",
    likes: 34500,
    comments: 980,
    shares: 450,
    category: "Fitness",
    hasArticle: true,
    articleId: "article4",
  },
  {
    id: "d4",
    videoUri: "https://assets.mixkit.co/videos/preview/mixkit-cooking-with-a-pan-on-a-stove-2753-large.mp4",
    user: {
      id: "d4",
      username: "chef_delights",
      profilePicture: "https://randomuser.me/api/portraits/men/36.jpg",
    },
    description: "Quick and easy stir fry recipe #cooking #recipe #foodie",
    likes: 67800,
    comments: 2300,
    shares: 1800,
    category: "Food",
    hasArticle: false,
  },
  {
    id: "d5",
    videoUri: "https://assets.mixkit.co/videos/preview/mixkit-dj-playing-music-in-a-disco-club-4430-large.mp4",
    user: {
      id: "d5",
      username: "music_vibes",
      profilePicture: "https://randomuser.me/api/portraits/women/15.jpg",
    },
    description: "Weekend vibes at the club #dj #music #nightlife",
    likes: 98700,
    comments: 4500,
    shares: 3200,
    category: "Music",
    hasArticle: true,
    articleId: "article5",
  },
]

// Sample news articles
const ARTICLES = {
  article1: {
    id: "article1",
    title: "The Healing Power of Nature: How Green Spaces Improve Mental Health",
    content: `Research has consistently shown that spending time in nature can have profound effects on mental health and well-being. A recent study published in the Journal of Environmental Psychology found that just 20 minutes of contact with nature can significantly lower stress hormone levels.\n\nThe study, conducted across multiple urban parks, monitored participants' cortisol levels before and after nature exposure. Results showed a marked decrease in stress biomarkers regardless of whether participants actively exercised or simply sat in a natural environment.\n\n"What's remarkable is that the effect size was comparable to what we see in some therapeutic interventions," says Dr. Maria Chen, lead researcher on the study. "This suggests that regular contact with natural environments could be prescribed as a cost-effective health intervention."\n\nThe mechanism behind nature's healing effect appears to be multifaceted. Visual exposure to natural landscapes activates parasympathetic nervous system responses, effectively countering the fight-or-flight stress response. Additionally, many natural environments contain phytoncides—antimicrobial compounds released by plants—which have been linked to enhanced immune function.\n\nUrban planners are taking note of these findings. Cities worldwide are increasingly incorporating green spaces into their development plans, recognizing that access to nature is not merely an amenity but a public health necessity.\n\nFor individuals seeking to improve their mental health, the prescription is simple: find time to connect with nature regularly, whether through visits to local parks, gardening, or even tending to houseplants. The research suggests that these small actions can yield significant benefits for psychological well-being.`,
    imageUrl:
      "https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    source: "Nature Health",
    date: "May 15, 2023",
    author: "Dr. James Wilson",
  },
  article2: {
    id: "article2",
    title: "Ocean Conservation Efforts Show Promising Results in Coastal Regions",
    content: `Marine biologists are reporting encouraging signs of recovery in several coastal ecosystems following targeted conservation efforts. The initiatives, which combine strict fishing regulations, pollution control, and habitat restoration, have led to measurable increases in marine biodiversity.\n\nIn the Pacific Northwest, kelp forest restoration projects have successfully reestablished these underwater ecosystems, which serve as crucial habitats for hundreds of marine species. "We're seeing the return of species that hadn't been documented in these areas for decades," explains marine ecologist Dr. Sarah Johnson.\n\nSimilarly, coral reef rehabilitation programs in the Caribbean have shown promising results. Using innovative techniques such as coral farming and transplantation, conservationists have increased live coral cover by up to 35% in some protected areas.\n\nThese success stories come at a critical time. A recent global assessment found that ocean health has declined precipitously over the past century due to overfishing, pollution, and climate change. However, the report also highlighted that targeted conservation efforts can reverse this trend when properly implemented and enforced.\n\n"What we're learning is that marine ecosystems can be remarkably resilient if we reduce the pressures on them," says oceanographer Dr. Michael Torres. "The ocean has an incredible capacity to heal itself if we give it the chance."\n\nPublic engagement has been crucial to these conservation successes. Citizen science programs, where volunteers help monitor marine environments, have expanded dramatically in recent years. These programs not only provide valuable data but also foster a sense of stewardship among coastal communities.\n\nDespite these positive developments, experts caution that broader action is needed to address global threats to ocean health, particularly climate change and plastic pollution. "Local conservation efforts are essential, but they need to be complemented by international cooperation on the big issues," Dr. Torres emphasizes.\n\nFor those inspired to contribute to ocean conservation, opportunities abound—from participating in beach cleanups to supporting sustainable seafood initiatives or joining citizen science projects monitoring local waterways.`,
    imageUrl:
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    source: "Ocean Science Today",
    date: "June 8, 2023",
    author: "Marine Research Team",
  },
  article3: {
    id: "article3",
    title: "Urban Planning Revolution: How Smart Cities Are Reshaping Modern Living",
    content: `A new generation of urban planners is revolutionizing city design, integrating technology and sustainability to create more livable urban environments. These "smart cities" use data and technology to optimize everything from traffic flow to energy consumption, while prioritizing human-centered design.\n\nBarcelona, Spain, stands as a leading example of this approach. The city has implemented an extensive network of sensors that monitor air quality, noise levels, and traffic patterns in real-time. This data allows city officials to make evidence-based decisions about resource allocation and policy interventions.\n\n"What makes Barcelona's approach unique is that technology serves the city's broader goals of sustainability and quality of life," explains urban studies professor Dr. Elena Martínez. "It's not technology for technology's sake."\n\nSingapore has taken a different but equally innovative path, focusing on green infrastructure. The city-state has mandated that new developments include vegetation in their design, resulting in spectacular "vertical forests" that improve air quality and reduce the urban heat island effect.\n\nIn the United States, Columbus, Ohio, has emerged as an unexpected leader in smart mobility solutions. After winning the U.S. Department of Transportation's Smart City Challenge, Columbus implemented an integrated transportation system that connects various modes of transit—from buses to bike-sharing—through a single digital platform.\n\nThese innovations come at a crucial time. By 2050, nearly 70% of the world's population will live in urban areas, according to UN projections. This rapid urbanization presents both challenges and opportunities for creating sustainable, efficient, and equitable cities.\n\nCritically, the most successful smart city initiatives involve citizens in the planning process. "When residents participate in designing solutions, the results are more likely to address real needs and gain public acceptance," notes Dr. Martínez.\n\nThe smart city movement also presents economic opportunities. The global market for smart city technologies is projected to reach $2.5 trillion by 2025, creating jobs in sectors ranging from renewable energy to data analytics and urban design.\n\nFor city dwellers, these changes promise a future where urban living is more convenient, healthy, and environmentally sustainable—a vision that can't come soon enough as cities worldwide face growing pressures from population growth and climate change.`,
    imageUrl:
      "https://images.unsplash.com/photo-1519501025264-65ba15a82390?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    source: "Urban Development Review",
    date: "April 3, 2023",
    author: "City Planning Institute",
  },
  article4: {
    id: "article4",
    title: "The Science of Running: New Research Reveals Optimal Training Methods",
    content: `A comprehensive review of exercise science research has identified the most effective training methods for runners of all levels, challenging some long-held beliefs about optimal training regimens.\n\nThe analysis, published in the Journal of Sports Medicine, examined data from over 200 studies involving more than 15,000 runners over the past decade. The findings offer evidence-based guidance for both recreational joggers and elite athletes.\n\nContrary to the traditional emphasis on steady-state cardio, the research indicates that a polarized training approach—combining mostly low-intensity runs with a smaller proportion of high-intensity intervals—produces the best results for endurance development.\n\n"The data is quite clear that many runners train in a 'moderate intensity no-man's land' that's too hard to allow proper recovery but not hard enough to stimulate optimal adaptations," explains exercise physiologist Dr. James Moreno, one of the study's authors.\n\nThe research also highlights the importance of strength training for runners, finding that those who incorporate resistance exercises twice weekly experience fewer injuries and better running economy—the efficiency with which the body uses oxygen while running.\n\nRecovery strategies received special attention in the analysis. While adequate sleep emerged as the most important recovery factor, other methods showed varying degrees of effectiveness. Cold water immersion and compression garments demonstrated modest benefits, while many popular recovery supplements showed little to no effect beyond placebo.\n\nFor recreational runners, perhaps the most encouraging finding is that consistency trumps intensity. "The research shows that running even 20 minutes three times per week provides significant health benefits," says Dr. Moreno. "The best training plan is ultimately one that you can sustain long-term."\n\nThe study also examined psychological aspects of running, finding that group training significantly improves adherence to running programs. Runners who train with others are 65% more likely to maintain their routine over a year compared to solo runners.\n\nAs wearable technology continues to advance, researchers anticipate even more personalized training recommendations in the future. "We're moving toward an era where training can be precisely tailored to individual physiology, recovery capacity, and even genetics," Dr. Moreno notes.\n\nFor now, the research offers a science-backed template that runners can adapt to their personal goals: prioritize consistency, incorporate both very easy and very hard efforts while limiting moderate-intensity work, don't neglect strength training, and make adequate sleep a non-negotiable part of training.`,
    imageUrl:
      "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    source: "Sports Science Journal",
    date: "March 12, 2023",
    author: "Fitness Research Team",
  },
  article5: {
    id: "article5",
    title: "Electronic Music Evolution: How Technology is Reshaping the Industry",
    content: `The electronic music landscape is undergoing a technological revolution that is democratizing production, transforming live performances, and creating entirely new sonic possibilities. These innovations are reshaping an industry that has always been at the forefront of embracing new technology.\n\nArtificial intelligence has emerged as perhaps the most disruptive force in electronic music production. AI-powered tools can now generate original melodies, harmonize tracks, and even master completed works with minimal human input. Applications like AIVA and OpenAI's MuseNet can compose complex pieces in specific styles, raising both excitement and concerns within the creative community.\n\n"These tools are incredibly powerful, but they're best viewed as collaborators rather than replacements for human creativity," says electronic music producer Maya Rodriguez. "The most interesting work happens when artists use AI to extend their creative capabilities rather than substitute for them."\n\nVirtual reality is transforming the live music experience, allowing artists to create immersive performances that transcend physical limitations. DJ and producer Jean-Michel Jarre recently performed for over 1 million people in a virtual environment, pointing toward a future where geographic constraints no longer limit audience size or experience quality.\n\nBlockchain technology is addressing long-standing issues with royalty payments and copyright. Several platforms now use smart contracts to ensure artists receive fair compensation when their music is streamed or sampled. This technology is particularly valuable in electronic music, where sampling and remixing are common practices that traditionally created complex royalty situations.\n\nHardware innovations continue to push boundaries as well. New interfaces that respond to gestures, brain activity, and even emotional states are expanding the ways artists can control and manipulate sound. The MI.MU gloves, co-developed by musician Imogen Heap, translate hand movements into musical commands, allowing for more intuitive and expressive performances.\n\nFor listeners, spatial audio technologies are creating more immersive experiences. Apple Music and other platforms now offer tracks mixed in Dolby Atmos, creating a three-dimensional listening experience that better replicates the sensation of live music.\n\nDespite these technological advances, industry veterans emphasize that human creativity remains the essential ingredient. "The technology is just a tool," Rodriguez notes. "What matters is the artistic vision behind it and the emotional connection it creates with listeners."\n\nAs these technologies become more accessible, the electronic music scene is experiencing unprecedented democratization. Artists from regions previously underrepresented in the global music landscape are gaining international audiences, bringing fresh perspectives and cultural influences to the genre.\n\nThe future of electronic music appears to be one of collaboration—between humans and machines, between artists and audiences, and between different cultural traditions—all facilitated by ever-evolving technology.`,
    imageUrl:
      "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    source: "Music Technology Review",
    date: "May 28, 2023",
    author: "Electronic Arts Institute",
  },
}

const { height: windowHeight, width: windowWidth } = Dimensions.get("window")

const FeedScreen = () => {
  // Update the state to include the AI tab
  const [activeTab, setActiveTab] = useState("fyp") // 'fyp', 'discover', or 'ai'
  const [activeFypIndex, setActiveFypIndex] = useState(0)
  const [activeDiscoverIndex, setActiveDiscoverIndex] = useState(0)
  const [savedVideos, setSavedVideos] = useState([])
  const [showSavedVideos, setShowSavedVideos] = useState(false)
  const [activeArticle, setActiveArticle] = useState(null)
  const [activeRelatedVideos, setActiveRelatedVideos] = useState(null)
  const [currentVideoId, setCurrentVideoId] = useState(null)

  const fypFlatListRef = useRef<FlatList>(null)
  const discoverFlatListRef = useRef<FlatList>(null)

  const fypOpacity = useSharedValue(1)
  const discoverOpacity = useSharedValue(0)
  // Add aiOpacity shared value after fypOpacity and discoverOpacity
  const aiOpacity = useSharedValue(0)
  const articleAnimation = useRef(new Animated.Value(0)).current
  const relatedVideosAnimation = useRef(new Animated.Value(0)).current

  const onFypViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveFypIndex(viewableItems[0].index)
      setCurrentVideoId(viewableItems[0].item.id)
    }
  }).current

  const onDiscoverViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveDiscoverIndex(viewableItems[0].index)
      setCurrentVideoId(viewableItems[0].item.id)
    }
  }).current

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current

  // Add switchToAi function after switchToFyp and switchToDiscover functions
  const switchToAi = () => {
    if (activeTab !== "ai") {
      fypOpacity.value = withTiming(0, { duration: 300 })
      discoverOpacity.value = withTiming(0, { duration: 300 })
      aiOpacity.value = withTiming(1, { duration: 300 })
      setActiveTab("ai")
    }
  }

  // Update the switchToFyp function to handle the AI tab
  const switchToFyp = () => {
    if (activeTab !== "fyp") {
      fypOpacity.value = withTiming(1, { duration: 300 })
      discoverOpacity.value = withTiming(0, { duration: 300 })
      aiOpacity.value = withTiming(0, { duration: 300 })
      setActiveTab("fyp")
    }
  }

  // Update the switchToDiscover function to handle the AI tab
  const switchToDiscover = () => {
    if (activeTab !== "discover") {
      fypOpacity.value = withTiming(0, { duration: 300 })
      discoverOpacity.value = withTiming(1, { duration: 300 })
      aiOpacity.value = withTiming(0, { duration: 300 })
      setActiveTab("discover")
    }
  }

  const fypAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fypOpacity.value,
      display: fypOpacity.value === 0 ? "none" : "flex",
    }
  })

  const discoverAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: discoverOpacity.value,
      display: discoverOpacity.value === 0 ? "none" : "flex",
    }
  })

  // Add aiAnimatedStyle after fypAnimatedStyle and discoverAnimatedStyle
  const aiAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: aiOpacity.value,
      display: aiOpacity.value === 0 ? "none" : "flex",
    }
  })

  const handleSaveVideo = (videoId) => {
    // Find the video in either FYP or Discover videos
    const video = [...FYP_VIDEOS, ...DISCOVER_VIDEOS].find((v) => v.id === videoId)

    if (video && !savedVideos.some((v) => v.id === videoId)) {
      setSavedVideos([...savedVideos, video])
    }
  }

  const handleOpenArticle = (videoId) => {
    // Find the video
    const video = [...FYP_VIDEOS, ...DISCOVER_VIDEOS].find((v) => v.id === videoId)

    if (video && video.hasArticle && video.articleId) {
      const article = ARTICLES[video.articleId]
      if (article) {
        setActiveArticle(article)
        Animated.timing(articleAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start()
      }
    }
  }

  const handleCloseArticle = () => {
    Animated.timing(articleAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setActiveArticle(null)
    })
  }

  const handleShowRelated = (videoId) => {
    setCurrentVideoId(videoId)
    if (RELATED_VIDEOS[videoId]) {
      setActiveRelatedVideos(RELATED_VIDEOS[videoId])
      Animated.timing(relatedVideosAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start()
    }
  }

  const handleCloseRelated = () => {
    Animated.timing(relatedVideosAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setActiveRelatedVideos(null)
    })
  }

  const handlePlayRelatedVideo = (videoId) => {
    // For this demo, we'll just close the related videos screen
    // In a real app, you would find and play the related video
    handleCloseRelated()
  }

  const handlePlaySavedVideo = (videoId) => {
    // Find the video in FYP or Discover
    const fypIndex = FYP_VIDEOS.findIndex((v) => v.id === videoId)
    const discoverIndex = DISCOVER_VIDEOS.findIndex((v) => v.id === videoId)

    setShowSavedVideos(false)

    if (fypIndex !== -1) {
      switchToFyp()
      setTimeout(() => {
        fypFlatListRef.current?.scrollToIndex({ index: fypIndex, animated: false })
        setActiveFypIndex(fypIndex)
      }, 300)
    } else if (discoverIndex !== -1) {
      switchToDiscover()
      setTimeout(() => {
        discoverFlatListRef.current?.scrollToIndex({ index: discoverIndex, animated: false })
        setActiveDiscoverIndex(discoverIndex)
      }, 300)
    }
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "fyp" && styles.activeTabButton]}
            onPress={switchToFyp}
          >
            <Text style={[styles.tabText, activeTab === "fyp" && styles.activeTabText]}>For You</Text>
            {activeTab === "fyp" && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "discover" && styles.activeTabButton]}
            onPress={switchToDiscover}
          >
            <Text style={[styles.tabText, activeTab === "discover" && styles.activeTabText]}>Discover</Text>
            {activeTab === "discover" && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
          {/* Add the AI tab button in the tabContainer View, after the Discover tab */}
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "ai" && styles.activeTabButton]}
            onPress={switchToAi}
          >
            <Text style={[styles.tabText, activeTab === "ai" && styles.activeTabText]}>For You AI</Text>
            {activeTab === "ai" && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        </View>

        {/* FYP Feed */}
        <Animated.View style={[styles.feedContainer, fypAnimatedStyle]}>
          <FlatList
            ref={fypFlatListRef}
            data={FYP_VIDEOS}
            renderItem={({ item, index }) => (
              <VideoItem
                video={item}
                isActive={index === activeFypIndex && activeTab === "fyp" && !showSavedVideos}
                onSaveVideo={handleSaveVideo}
                onOpenArticle={handleOpenArticle}
                onShowRelated={handleShowRelated}
              />
            )}
            keyExtractor={(item) => item.id}
            snapToInterval={windowHeight}
            snapToAlignment="start"
            decelerationRate="fast"
            viewabilityConfig={viewabilityConfig}
            onViewableItemsChanged={onFypViewableItemsChanged}
            showsVerticalScrollIndicator={false}
            pagingEnabled
          />
        </Animated.View>

        {/* Discover Feed */}
        <Animated.View style={[styles.feedContainer, discoverAnimatedStyle]}>
          <FlatList
            ref={discoverFlatListRef}
            data={DISCOVER_VIDEOS}
            renderItem={({ item, index }) => (
              <DiscoverVideoItem
                video={item}
                isActive={index === activeDiscoverIndex && activeTab === "discover" && !showSavedVideos}
                onSaveVideo={handleSaveVideo}
                onOpenArticle={handleOpenArticle}
                onShowRelated={handleShowRelated}
              />
            )}
            keyExtractor={(item) => item.id}
            snapToInterval={windowHeight}
            snapToAlignment="start"
            decelerationRate="fast"
            viewabilityConfig={viewabilityConfig}
            onViewableItemsChanged={onDiscoverViewableItemsChanged}
            showsVerticalScrollIndicator={false}
            pagingEnabled
          />
        </Animated.View>

        {/* Add the AI Feed View after the Discover Feed View */}
        {/* AI Feed */}
        <Animated.View style={[styles.feedContainer, aiAnimatedStyle]}>
          <AIFeedScreen
            onSaveVideo={handleSaveVideo}
            onOpenArticle={handleOpenArticle}
            onShowRelated={handleShowRelated}
          />
        </Animated.View>

        {/* Saved Videos Screen */}
        {showSavedVideos && (
          <SavedVideosScreen
            savedVideos={savedVideos}
            onBack={() => setShowSavedVideos(false)}
            onPlayVideo={handlePlaySavedVideo}
          />
        )}

        {/* News Article Screen */}
        {activeArticle && (
          <NewsArticleScreen article={activeArticle} onClose={handleCloseArticle} animatedValue={articleAnimation} />
        )}

        {/* Related Videos Screen */}
        {activeRelatedVideos && (
          <RelatedVideosScreen
            videoId={currentVideoId}
            relatedVideos={activeRelatedVideos}
            onClose={handleCloseRelated}
            onPlayVideo={handlePlayRelatedVideo}
            animatedValue={relatedVideosAnimation}
          />
        )}

        {/* Update the NavigationBar component at the bottom of the return statement */}
        <NavigationBar
          activeTab={activeTab === "fyp" || activeTab === "discover" ? "home" : activeTab === "ai" ? "ai" : "home"}
          onSavedPress={() => setShowSavedVideos(true)}
          savedCount={savedVideos.length}
          onAiPress={switchToAi}
        />
      </View>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingTop: 5,
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    position: "relative",
  },
  activeTabButton: {
    // Active tab styling
  },
  tabText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 16,
    fontWeight: "500",
  },
  activeTabText: {
    color: "#FFF",
    fontWeight: "700",
  },
  activeIndicator: {
    position: "absolute",
    bottom: 0,
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: "#FFF",
    borderRadius: 2,
  },
  feedContainer: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
})

export default FeedScreen

