import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome } from "@expo/vector-icons";

const storyData = [
  {
    id: "1",
    user: "Phát",
    avatar: "https://i.pravatar.cc/150?img=1",
    media: [
      { type: "image", uri: "https://picsum.photos/400/700?random=1" },
      { type: "image", uri: "https://picsum.photos/400/700?random=2" },
    ],
  },
  {
    id: "2",
    user: "Minh",
    avatar: "https://i.pravatar.cc/150?img=2",
    media: [{ type: "image", uri: "https://picsum.photos/400/700?random=3" }],
  },
  {
    id: "3",
    user: "Lan",
    avatar: "https://i.pravatar.cc/150?img=3",
    media: [{ type: "image", uri: "https://picsum.photos/400/700?random=4" }],
  },
];

const StoryCus = () => {
  const navigation = useNavigation();

  const handleCreateStory = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["Images", "Videos"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      navigation.navigate("StoryScreens", {
        story: {
          user: "You",
          avatar: "https://via.placeholder.com/150/cccccc",
          media: [{ type: "image", uri: result.assets[0].uri }],
        },
      });
    }
  };

  const renderStory = ({ item }) => (
    <TouchableOpacity
      style={styles.storyItem}
      onPress={() =>
        navigation.navigate("StoryScreens", {
          story: item, // truyền đúng story từng user
        })
      }
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
      </View>
      <Text style={styles.username} numberOfLines={1}>
        {item.user}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={storyData}
        horizontal
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        ListHeaderComponent={
          <TouchableOpacity style={styles.storyItem} onPress={handleCreateStory}>
            <View style={styles.yourStoryContainer}>
              <Image
                source={{ uri: "https://via.placeholder.com/150/cccccc" }}
                style={styles.avatar}
              />
              <View style={styles.addIcon}>
                <FontAwesome name="plus" size={12} color="white" />
              </View>
            </View>
            <Text style={styles.username} numberOfLines={1}>
              Your Story
            </Text>
          </TouchableOpacity>
        }
        renderItem={renderStory}
      />
    </View>
  );
};

export default StoryCus;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingLeft: 10,
  },
  storyItem: {
    alignItems: "center",
    marginRight: 15,
    width: 60,
  },
  yourStoryContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#FF6A00",
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  addIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#007AFF",
    borderRadius: 12,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  username: {
    fontSize: 12,
    color: "#000",
    textAlign: "center",
  },
});
