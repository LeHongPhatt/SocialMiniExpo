import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome, MaterialIcons, Feather } from "@expo/vector-icons";

interface ActionBarProps {
  likeCount: number | string;
  commentCount: number | string;
  isLiked?: boolean; // trạng thái đã like chưa
  onLike?: () => void; // callback khi nhấn like
  onPressComment?: () => void; // callback khi nhấn comment
}

const ActionCus: React.FC<ActionBarProps> = ({
  likeCount,
  commentCount,
  isLiked = false,
  onLike,
  onPressComment,
}) => {
  const [liked, setLiked] = useState(isLiked);
  const [saved, setSaved] = useState(false);
  const [currentLike, setCurrentLike] = useState(Number(likeCount) || 0);
  const [currentComment, setCurrentComment] = useState(
    Number(commentCount) || 0
  );

  // Chuyển props sang number an toàn
  useEffect(() => {
    setCurrentLike(Number(likeCount) || 0);
    setCurrentComment(Number(commentCount) || 0);
  }, [likeCount, commentCount]);

  const toggleLike = () => {
    setLiked(!liked);
    setCurrentLike((prev) => (liked ? prev - 1 : prev + 1));

    // Gọi callback nếu có (từ parent) để update redux + gọi API
    if (onLike) onLike();
  };

  const toggleSave = () => setSaved(!saved);

  return (
    <View style={styles.container}>
      {/* Like */}
      <TouchableOpacity style={styles.action} onPress={toggleLike}>
        <FontAwesome
          name={liked ? "heart" : "heart-o"}
          size={24}
          color={liked ? "red" : "black"}
        />
        <Text style={styles.text}>{currentLike}</Text>
      </TouchableOpacity>

      {/* Comment */}
      <TouchableOpacity style={styles.action} onPress={onPressComment}>
        <FontAwesome name="comment-o" size={24} color="black" />
        <Text style={styles.text}>{currentComment}</Text>
      </TouchableOpacity>

      {/* Save */}
      <TouchableOpacity style={styles.action} onPress={toggleSave}>
        <MaterialIcons
          name={saved ? "bookmark" : "bookmark-border"}
          size={24}
          color="black"
        />
        <Text style={styles.text}>{saved ? "Saved" : "Save"}</Text>
      </TouchableOpacity>

      {/* Share */}
      <TouchableOpacity style={styles.action}>
        <Feather name="share" size={24} color="black" />
        <Text style={styles.text}>Share</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  action: { alignItems: "center" },
  text: { fontSize: 12, marginTop: 2 },
});

export default ActionCus;
