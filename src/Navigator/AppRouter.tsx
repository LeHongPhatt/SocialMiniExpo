import React, { useEffect, useState } from "react";
import AuthNavigator from "./AuthNavigator";
import MainNavigator from "./MainNavigator";
import SplashScreen from "../screens/splashScreens";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { addAuth, authSelector } from "../redux/reduces/authReducer";
import {
  clearProfile,
  fetchProfile,
  ProfileReducer,
} from "../redux/reduces/profileReducer";

const AppRouters = () => {
  const [isShowSplash, setIsShowSplash] = useState(true);
  const [hasSeenIntro, setHasSeenIntro] = useState(false);

  const dispatch = useDispatch();
  const auth = useSelector(authSelector);

  useEffect(() => {
    const initApp = async () => {
      try {
        // 1. Kiểm tra intro
        const intro = await AsyncStorage.getItem("hasSeenIntro");
        setHasSeenIntro(!!intro);

        // 2. Lấy token từ AsyncStorage
        const authData = await AsyncStorage.getItem("auth");
        if (authData) {
          const parsedAuth = JSON.parse(authData);
          dispatch(clearProfile());
          if (parsedAuth?.accesstoken) {
            dispatch(addAuth(parsedAuth));
            const resultAction = await dispatch(fetchProfile());
            if (fetchProfile.fulfilled.match(resultAction)) {
              console.log("✅ PROFILE LOADED:", resultAction.payload);
            } else {
              console.log("❌ PROFILE FETCH FAILED:", resultAction.payload);
            }
          }
        }
      } catch (error) {
        console.log("Error init app:", error);
      } finally {
        setIsShowSplash(false);
      }
    };

    initApp();
  }, [dispatch]);

  if (isShowSplash) return <SplashScreen />;

  if (!hasSeenIntro) return <AuthNavigator initialRouteName="IntroScreens" />;

  return auth.accesstoken ? (
    <MainNavigator />
  ) : (
    <AuthNavigator initialRouteName="LoginScreens" />
  );
};

export default AppRouters;
