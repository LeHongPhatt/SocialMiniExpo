import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { IntroScreen } from "../screens/Auth";
import { DrawerComponents } from "../components";
import HomeScreens from "../screens/home/HomeScreens";
import TabNavigator from "./TabNavigator";

const Drawer = createDrawerNavigator();
const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: false, drawerPosition: "left" }}
      drawerContent={(props) => <DrawerComponents {...props} />}
    >
      <Drawer.Screen name="HomeNavigator" component={TabNavigator} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

const styles = StyleSheet.create({});
