import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { Host } from "react-native-portalize";
import store from "./src/redux/store";
import { NavigationContainer } from "@react-navigation/native";
import AppRouters from "./src/Navigator/AppRouter";
import {
  Raleway_400Regular,
  Raleway_500Medium,
  Raleway_700Bold,
} from "@expo-google-fonts/raleway";
import {
  Quicksand_400Regular,
  Quicksand_500Medium,
  Quicksand_700Bold,
  Quicksand_600SemiBold,
  Quicksand_300Light,
} from "@expo-google-fonts/quicksand";
import { useFonts } from "expo-font";
import React from "react";
export default function App() {
  const [fontsLoaded] = useFonts({
    Raleway_400Regular,
    Raleway_500Medium,
    Raleway_700Bold,
    Quicksand_400Regular,
    Quicksand_500Medium,
    Quicksand_700Bold,
    Quicksand_600SemiBold,
    Quicksand_300Light,
  });
  React.useEffect(() => {
    if (fontsLoaded) {
      // SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // hoặc custom loading
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <StatusBar backgroundColor="transparent" translucent />
        <Host>
          <NavigationContainer>
            <AppRouters />
          </NavigationContainer>
        </Host>
      </Provider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
