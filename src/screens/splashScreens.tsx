import React from "react";
import { ActivityIndicator, Image, ImageBackground, View } from "react-native";
import { appInfo } from "../constants/appInfors";
import { appColors } from "../constants/appColors";
import { SpaceCus } from "../components";
import { Images } from "../assets/images";

const SplashScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={Images.textLogo}
        style={{
          width: appInfo.sizes.WIDTH * 0.5,
          resizeMode: "contain",
        }}
      />
      <SpaceCus height={16} />
      <ActivityIndicator color={appColors.gray} size={22} />
    </View>
  );
};

export default SplashScreen;
