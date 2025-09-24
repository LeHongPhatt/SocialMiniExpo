import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import DrawerNavigator from "./DrawerNavigator";
import { IntroScreen } from "../screens/Auth";
import HomeScreens from "../screens/home/HomeScreens";
import { StoryScreen } from "../screens";

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
      {/* <Stack.Screen name="HomeScreens" component={HomeScreens} /> */}
      {/* <Stack.Screen name="IntoScreen" component={IntroScreen} /> */}
    </Stack.Navigator>
  );
};

export default MainNavigator;
