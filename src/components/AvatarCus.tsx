import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { appInfo } from "../constants/appInfors";

const AvatarCus = () => {
  return (
    <View
      style={{
        alignSelf: "center",
        justifyContent: "center",
      }}
    >
      <TouchableOpacity
        style={{
          width: appInfo.sizes.WIDTH /3,
          height: appInfo.sizes.HEIGHT/6.23,
          borderRadius: "100%",
          backgroundColor: "yellow",
        }}
      ></TouchableOpacity>
    </View>
  );
};

export default AvatarCus;

const styles = StyleSheet.create({});
