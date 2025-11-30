import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
} from "react-native";
import { Images } from "../../assets/images";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

type StoryItem = {
  id: string;
  user: { username?: string; avatar?: string };
  media: string | null;
  type?: string;
};

type StoryViewerProps = {
  visible: boolean;
  onClose: () => void;
  stories: StoryItem[];
  startIndex?: number;
  duration?: number;
};

export default function StoryViewer({
  visible,
  onClose,
  stories,
  startIndex = 0,
  duration = 5000,
}: StoryViewerProps) {
  const [index, setIndex] = useState(startIndex);
  const progress = useRef(new Animated.Value(0)).current;
  const panY = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (visible) {
      setIndex(startIndex);
      startProgress();
    } else {
      resetProgress();
    }
  }, [visible, startIndex]);

  useEffect(() => {
    if (visible) startProgress();
  }, [index]);

  const startProgress = () => {
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: duration,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) handleNext();
    });
  };

  const resetProgress = () => {
    progress.stopAnimation();
    progress.setValue(0);
  };

  const handleNext = () => {
    resetProgress();
    if (index < stories.length - 1) {
      setIndex((i) => i + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    resetProgress();
    if (index > 0) setIndex((i) => i - 1);
  };

  const onTap = (evt: any) => {
    const x = evt.nativeEvent.locationX;
    if (x < SCREEN_W / 3) handlePrev();
    else handleNext();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dy) > Math.abs(gesture.dx),
      onPanResponderMove: (_, gesture) => {
        panY.setValue(gesture.dy);
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > 120) {
          Animated.timing(panY, {
            toValue: SCREEN_H,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            panY.setValue(0);
            onClose();
          });
        } else {
          Animated.spring(panY, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  if (!stories || stories.length === 0) return null;

  const current = stories[index];
  console.log("=====Current Story=====", current);
  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <Animated.View
        style={[styles.container, { transform: [{ translateY: panY } as any] }]}
        {...panResponder.panHandlers}
      >
        <View style={styles.topBar}>
          <View style={styles.progressContainer}>
            {stories.map((_, i) => (
              <View key={i} style={styles.progressTrack}>
                <Animated.View
                  style={[
                    styles.progressFill,
                    i === index
                      ? { width: progressWidth }
                      : { width: i < index ? "100%" : "0%" },
                  ]}
                />
              </View>
            ))}
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={{ color: "white", fontSize: 20 }}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.header}>
          <Image
            source={
              current.user?.avatar ? { uri: current.user.avatar } : Images.logo
            }
            style={styles.avatar}
          />
          <Text style={styles.username}>
            {current.user?.username || "Ẩn danh"}
          </Text>
        </View>

        <TouchableWithoutFeedback onPress={onTap}>
          <View style={styles.content}>
            {current.media ? (
              <Image
                source={{ uri: current.media }}
                style={styles.media}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.media, styles.empty]}>
                <Text style={{ color: "white" }}>No media</Text>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  topBar: {
    position: "absolute",
    top: 30,
    left: 10,
    right: 10,
    zIndex: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  progressContainer: {
    flex: 1,
    marginRight: 10,
    flexDirection: "row",
    gap: 6,
  } as any,
  progressTrack: {
    flex: 1,
    height: 3,
    backgroundColor: "rgba(255,255,255,0.25)",
    marginHorizontal: 2,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: { height: 3, backgroundColor: "white" },
  closeBtn: { padding: 6 },
  header: {
    position: "absolute",
    top: 60,
    left: 12,
    zIndex: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 8 },
  username: { color: "white", fontWeight: "600" },
  content: { flex: 1, justifyContent: "center", alignItems: "center" },
  media: { width: SCREEN_W, height: SCREEN_H },
  empty: { justifyContent: "center", alignItems: "center" },
});
