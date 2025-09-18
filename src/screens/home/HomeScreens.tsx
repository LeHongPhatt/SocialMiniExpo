import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/reduces/authReducer";
import { ButtonCus } from "../../components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HeaderCus from "../../components/HeaderCus";
import { FontAwesome } from "@expo/vector-icons";
import { Images } from "../../assets/images";

const HomeScreens = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const handleLogout = async () => {
    // Xoá token trong Redux
    dispatch(logoutUser());
    // Xoá token trong AsyncStorage (nếu có)
    await AsyncStorage.removeItem("auth");
    // KHÔNG cần navigation.navigate() nữa!
    // AppRouters sẽ tự render lại AuthNavigator → LoginScreens
  };
  return (
    <View>
      <HeaderCus
        type="logo-with-icons"
        leftLogo={
          // <Text style={{ fontSize: 20, fontWeight: "bold" }}>SocialMini</Text>
          <Image
            source={Images.textLogo}
            style={{ width: 150, height: 150 }}
            resizeMode="contain"
          />
        }
        icons={[
          {
            icon: <FontAwesome name="search" size={22} />,
            onPress: () => console.log("Search"),
          },
          {
            icon: <FontAwesome name="bell" size={22} />,
            onPress: () => console.log("Notify"),
          },
          {
            icon: <FontAwesome name="envelope" size={22} />,
            onPress: () => console.log("Settings"),
          },
        ]}
      />
      <ButtonCus onPress={handleLogout} type="primary" text="áda" />
    </View>
  );
};

export default HomeScreens;

const styles = StyleSheet.create({});
