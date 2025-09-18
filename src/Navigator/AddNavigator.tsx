import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { ProfileScreens } from "../screens";
import AddFriendScreens from "../screens/AddFriend/AddFriendScreens";

const AddNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="AddFriends" component={AddFriendScreens} />
    </Stack.Navigator>
  );
};

export default AddNavigator;
