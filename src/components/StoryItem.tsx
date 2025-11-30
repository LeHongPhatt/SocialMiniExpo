import React from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";

type StoryItemProps = {
  imageUri: string;
  username: string;
  onPress?: () => void;
};

const StoryItem: React.FC<StoryItemProps> = ({ imageUri, username, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: imageUri }} style={styles.image} />
      <Text style={styles.username}>{username}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginHorizontal: 8,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: "#FF8501", // màu giống vòng tròn Instagram
  },
  username: {
    marginTop: 5,
    fontSize: 12,
    textAlign: "center",
  },
});

export default StoryItem;
