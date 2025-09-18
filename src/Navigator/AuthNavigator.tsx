import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  ForgotPassword,
  IntroScreen,
  LoginScreens,
  OtpScreen,
  RegisterScreens,
  ResetPasswordScreens,
} from "../screens/Auth";

const Stack = createNativeStackNavigator();
const AuthNavigator = ({ initialRouteName = "LoginScreens" }: any) => {
  return (
    <Stack.Navigator 
    initialRouteName={initialRouteName || "LoginScreens"}
     screenOptions={{ headerShown: false }}>
      {/* <Stack.Screen name="IntroScreens" component={IntroScreen} /> */}
      <Stack.Screen name="LoginScreens" component={LoginScreens} />
      <Stack.Screen name="RegisterScreens" component={RegisterScreens} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="OtpScreen" component={OtpScreen} />
      <Stack.Screen name="ResetPasswordScreens" component={ResetPasswordScreens} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;

const styles = StyleSheet.create({});
