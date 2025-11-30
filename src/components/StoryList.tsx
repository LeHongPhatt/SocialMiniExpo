import React from "react";
import { View, FlatList } from "react-native";
import StoryItem from "./StoryItem";

type StoryData = {
  id: string;
  username: string;
  imageUri: string;
};

type StoryListProps = {
  stories: StoryData[];
  onStoryPress?: (story: StoryData) => void;
};

const StoryList: React.FC<StoryListProps> = ({ stories, onStoryPress }) => {
  return (
    <View style={{ paddingVertical: 10 }}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={stories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <StoryItem
            imageUri={item.imageUri}
            username={item.username}
            onPress={() => onStoryPress(item)}
          />
        )}
      />
    </View>
  );
};

export default StoryList;
