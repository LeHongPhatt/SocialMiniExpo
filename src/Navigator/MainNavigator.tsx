import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import DrawerNavigator from "./DrawerNavigator";
import HomeScreens from "../screens/home/HomeScreens";
import { StoryScreen } from "../screens";
import NewPost from "../screens/home/component/NewPost";
import CommentDetail from "../screens/Comments/CommentDetail";
import StoryViewer from "../screens/story/StoryViewer";
import ChatListScreen from "../screens/Chat/ChatListScreen";
import ChatScreen from "../screens/Chat/ChatScreen";

const MainNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Main" component={DrawerNavigator} />
      <Stack.Screen name="StoryScreens" component={StoryScreen} />
      <Stack.Screen name="StoryViewer" component={StoryViewer} />
      <Stack.Screen name="ChatListScreen" component={ChatListScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />

      <Stack.Screen name="HomeScreens" component={HomeScreens} />

      <Stack.Screen name="NewPost" component={NewPost} />
      <Stack.Screen name="CommentDetail" component={CommentDetail} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
