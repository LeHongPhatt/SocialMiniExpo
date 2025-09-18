import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { GroupScreens } from "../screens";

const GroupNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="GroupScreens" component={GroupScreens} />
    </Stack.Navigator>
  );
};

export default GroupNavigator;
