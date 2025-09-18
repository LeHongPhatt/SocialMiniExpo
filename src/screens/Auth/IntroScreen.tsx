import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Swiper from "react-native-swiper";
import { appColors } from "../../constants/appColors";
import { globalStyles } from "../../styles/globalStyles";
import { appInfo } from "../../constants/appInfors";
import { ButtonCus, TextCus } from "../../components";
import { fontFamily } from "../../constants/fontFamily";
import { Images } from "../../assets/images";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";

const IntroScreen = ({ navigation }: any) => {
  const [index, setIndex] = useState(0);

  const goToLogin = async () => {
    await AsyncStorage.setItem("hasSeenIntro", "true"); // lưu flag
    navigation.replace("LoginScreens"); // chuyển sang login
  };

  return (
    <View style={[globalStyles.container]}>
      <Swiper
        paginationStyle={{ bottom: 40 }}
        style={{}}
        loop={false}
        onIndexChanged={(num) => setIndex(num)}
        index={index}
        // dotStyle={{ top: 12 }}
        activeDotStyle={{ width: 20, backgroundColor: appColors.primary }}
      >
        <Image
          source={Images.intro1}
          style={{
            flex: 1,
            width: appInfo.sizes.WIDTH,
            // height: appInfo.sizes.HEIGHT,
            resizeMode: "contain",
          }}
        />
        <Image
          source={Images.intro2}
          style={{
            flex: 1,
            width: appInfo.sizes.WIDTH,
            height: appInfo.sizes.HEIGHT,
            resizeMode: "contain",
          }}
        />
        <Image
          source={Images.logo}
          style={{
            flex: 1,
            width: appInfo.sizes.WIDTH,
            height: appInfo.sizes.HEIGHT,
            resizeMode: "contain",
          }}
        />
      </Swiper>
      <View
        style={[
          {
            paddingHorizontal: 16,
            paddingVertical: 20,
            position: "absolute",
            bottom: 20,
            right: 20,
            left: 20,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          },
        ]}
      >
        <TouchableOpacity onPress={goToLogin}>
          <TextCus
            text="Skip"
            color={appColors.text}
            font={fontFamily.quicksand.medium}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (index < 2) setIndex(index + 1);
            else goToLogin();
          }}
        >
          <TextCus
            text="Next"
            color={appColors.text}
            font={fontFamily.quicksand.medium}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default IntroScreen;

const styles = StyleSheet.create({
  text: {
    color: appColors.white,
    fontSize: 16,
    fontWeight: "500",
  },
});
