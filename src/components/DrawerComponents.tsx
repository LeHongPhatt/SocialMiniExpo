import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { use } from "react";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import ContainerCus from "./ContainerCus";
import SectionCus from "./SectionCus";
import RowCus from "./RowCus";
import { globalStyles } from "../styles/globalStyles";
import AvatarCus from "./AvatarCus";
import SpaceCus from "./SpaceCus";
import { appInfo } from "../constants/appInfors";
import { ButtonCus, TextCus } from ".";
import { useDispatch, useSelector } from "react-redux";
import {
  addAuth,
  authSelector,
  logoutUser,
} from "../redux/reduces/authReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { appColors } from "../constants/appColors";
import { RootState } from "../redux/store";

const DrawerComponents = ({ navigation, route }: any) => {
  const profile = useSelector((state: RootState) => state.profile);
  const auth = useSelector((state: RootState) => state.auth);
  console.log("Redux profile:", profile);
  console.log("Redux auth:", auth);
  const dispatch = useDispatch();
  const handleLogout = async () => {
    // Xoá token trong Redux
    dispatch(logoutUser());
    // Xoá token trong AsyncStorage (nếu có)
    await AsyncStorage.removeItem("auth");
    // KHÔNG cần navigation.navigate() nữa!
    // AppRouters sẽ tự render lại AuthNavigator → LoginScreens
  };
  const data = [
    {
      label: "Edit Profile",
      icon: <FontAwesome name="edit" size={23} />,
    },
    {
      label: "NetWork",
      icon: <FontAwesome name="feed" size={23} />,
    },
    {
      label: "Photos",
      icon: <FontAwesome name="photo" size={23} />,
    },
    {
      label: "Group",
      icon: <FontAwesome name="group" size={23} />,
    },
    {
      label: "Your Privacy",
      icon: <FontAwesome name="home" size={23} />,
    },
    {
      label: "Search Profile",
      icon: <FontAwesome name="search" size={23} />,
    },
    {
      label: "Settings",
      icon: <FontAwesome name="gear" size={23} />,
    },
    {
      label: "About Us",
      icon: <FontAwesome name="exclamation" size={23} />,
    },
    {
      label: "Language",
      icon: <FontAwesome name="home" size={23} />,
    },
  ];
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
      <SectionCus
        styles={{
          flexDirection: "row",
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 50,
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity
          style={{ alignItems: "flex-start" }}
          onPress={() => navigation.closeDrawer()}
        >
          <FontAwesome size={32} name="long-arrow-left" />
        </TouchableOpacity>
        <AvatarCus
          uri={
            profile?.avatar
              ? profile.avatar.startsWith("http")
                ? profile.avatar
                : `${appInfo.BASE_URL}${profile.avatar}`
              : "https://dummyimage.com/100x100/cccccc/000000.png&text=No+Avatar"
          }
          size={150}
        />
        <SpaceCus width={32} />
      </SectionCus>
      <SectionCus styles={{ alignItems: "center" }}>
        <TextCus text={profile.username || "texx"} title />
        <TextCus text={profile.bio} />
      </SectionCus>

      <SpaceCus
        height={1}
        styles={{
          backgroundColor: appColors.gray,
          marginHorizontal: "20",
          marginBottom: 10,
        }}
      />
      {data.map((item, index) => {
        return (
          <SectionCus key={index} styles={{ marginTop: 5 }}>
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View style={{ marginRight: 10 }}>{item.icon}</View>
                <Text>{item.label}</Text>
              </View>
              <View>
                <FontAwesome name="angle-right" size={24} />
              </View>
            </TouchableOpacity>
          </SectionCus>
        );
      })}
      <SpaceCus
        height={1}
        styles={{ backgroundColor: appColors.gray, marginHorizontal: "20" }}
      />
      <View
        style={{
          flex: 1,
          alignItems: "flex-start",
          flexDirection: "row",
          marginVertical: 20,
          marginHorizontal: 18,
        }}
      >
        <FontAwesome5 size={23} name="sign-out-alt" />
        <ButtonCus onPress={handleLogout} type="text" text="LogOut" />
      </View>
    </ScrollView>
  );
};

export default DrawerComponents;

const styles = StyleSheet.create({});
