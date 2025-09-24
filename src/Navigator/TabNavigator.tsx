import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { ReactNode } from "react";
import { appColors } from "../constants/appColors";

import { Image, Platform, View } from "react-native";
import { globalStyles } from "../styles/globalStyles";
import DrawerNavigator from "./DrawerNavigator";
import { TextCus } from "../components";
import { FontAwesome } from "@expo/vector-icons";
import { GroupScreens, JobScreens, ProfileScreens } from "../screens";
import AddFriendScreens from "../screens/AddFriend/AddFriendScreens";
import HomeScreens from "../screens/home/HomeScreens";
import { Images } from "../assets/images";
import { useSelector } from "react-redux";
import { authSelector } from "../redux/reduces/authReducer";

const TabNavigator = () => {
  const Tab = createBottomTabNavigator();
  const auth = useSelector(authSelector);
  const avt = auth?.user?.avatar || null;
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: Platform.OS === "ios" ? 88 : 68,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: appColors.white,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let icon: ReactNode;
          color = focused ? appColors.primary : appColors.gray5;
          size = 24;
          switch (route.name) {
            case "HomeScreens":
              icon = <FontAwesome name="home" size={size} color={color} />;
              break;
            case "AddFriends":
              icon = (
                <FontAwesome
                  name="user-plus"
                  size={size}
                  variant="Bold"
                  color={color}
                />
              );
              break;
            case "JobScreens":
              icon = (
                <FontAwesome
                  name="suitcase"
                  size={size}
                  variant="Bold"
                  color={color}
                />
              );
              break;
            case "GroupScreens":
              icon = (
                <FontAwesome
                  name="users"
                  size={size}
                  variant="Bold"
                  color={color}
                />
              );
              break;
            case "ProfileScreens": {
              icon = avt ? (
                <Image
                  source={{ uri: avt }}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    borderWidth: focused ? 2 : 0,
                    borderColor: focused ? appColors.primary : "transparent",
                  }}
                  resizeMode="cover"
                />
              ) : (
                <FontAwesome name="user" size={size} color={color} />
              );
              break;
            }
          }
          return icon;
        },
        tabBarIconStyle: {
          marginTop: 8,
        },
        tabBarLabelPosition: "below-icon",
        tabBarLabel({ focused }) {
          return route.name === "Add" ? null : (
            <TextCus
              text={route.name}
              flex={0}
              size={12}
              color={focused ? appColors.primary : appColors.gray5}
              styles={{
                marginBottom: Platform.OS === "android" ? 12 : 0,
              }}
            />
          );
        },
      })}
    >
      <Tab.Screen name="HomeScreens" component={HomeScreens} />
      <Tab.Screen name="AddFriends" component={AddFriendScreens} />
      <Tab.Screen name="JobScreens" component={JobScreens} />
      <Tab.Screen name="GroupScreens" component={GroupScreens} />
      <Tab.Screen name="ProfileScreens" component={ProfileScreens} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
