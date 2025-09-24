import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const StoryScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { story } = route.params; // Lấy story từ params

  const [currentIndex, setCurrentIndex] = useState(0);
  const media = story?.media || [];

  useEffect(() => {
    if (currentIndex < media.length) {
      const timer = setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 3000); // 3s mỗi media
      return () => clearTimeout(timer);
    } else {
      navigation.goBack(); // hết story thì quay lại
    }
  }, [currentIndex]);

  if (!story || media.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <Text style={{ color: "white" }}>Không có story</Text>
      </View>
    );
  }

  const currentMedia = media[currentIndex];
  if (!currentMedia) {
    return null; // tránh lỗi khi index vượt quá
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: currentMedia.uri }} style={styles.image} />

      <View style={styles.userInfo}>
        <Image source={{ uri: story.avatar }} style={styles.avatar} />
        <Text style={styles.username}>{story.user}</Text>
      </View>

      {/* Nhấn qua ảnh tiếp theo */}
      <TouchableOpacity
        style={styles.overlayRight}
        onPress={() =>
          setCurrentIndex(prev => (prev + 1 < media.length ? prev + 1 : prev))
        }
      />

      {/* Nhấn trái quay lại ảnh trước */}
      <TouchableOpacity
        style={styles.overlayLeft}
        onPress={() =>
          setCurrentIndex(prev => (prev - 1 >= 0 ? prev - 1 : 0))
        }
      />
    </View>
  );
};

export default StoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  image: {
    width,
    height,
    resizeMode: "cover",
  },
  userInfo: {
    position: "absolute",
    top: 50,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  overlayRight: {
    position: "absolute",
    right: 0,
    top: 0,
    width: width / 2,
    height,
  },
  overlayLeft: {
    position: "absolute",
    left: 0,
    top: 0,
    width: width / 2,
    height,
  },
});
