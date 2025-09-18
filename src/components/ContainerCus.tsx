import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from "react-native";
import React, { ReactNode } from "react";
import { globalStyles } from "../styles/globalStyles";
import { useNavigation } from "@react-navigation/native";
import { TextCus } from ".";
import { appColors } from "../constants/appColors";
import { fontFamily } from "../constants/fontFamily";
import { FontAwesome } from "@expo/vector-icons";
import RowCus from "./RowCus";
import { Images } from "../assets/images";
// import {fontFamilies} from '../constants/fontFamilies';

interface Props {
  isImageBackground?: boolean;
  isScroll?: boolean;
  title?: string;
  children: ReactNode;
  back?: boolean;
}

const ContainerCus = (props: Props) => {
  const { children, isScroll, isImageBackground, title, back } = props;

  const navigation: any = useNavigation();

  const headerComponent = () => {
    return (
      <View style={{ flex: 1 }}>
        {(title || back) && (
          <RowCus
            styles={{
              paddingHorizontal: 16,
              paddingVertical: 10,
              minWidth: 48,
              minHeight: 48,
              justifyContent: "flex-start",
            }}
          >
            {back && (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{ marginRight: 12 }}
              >
                <FontAwesome
                  name="arrow-left"
                  size={24}
                  color={appColors.text}
                />
              </TouchableOpacity>
            )}
            {title ? (
              <TextCus
                text={title}
                size={16}
                font={fontFamily.quicksand.medium}
                flex={1}
              />
            ) : (
              <></>
            )}
          </RowCus>
        )}
        {returnContainer}
      </View>
    );
  };

  const returnContainer = isScroll ? (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  ) : (
    <View style={{ flex: 1 }}>{children}</View>
  );

  return isImageBackground ? (
    <ImageBackground
      source={Images.logo}
      style={{ flex: 1 }}
      imageStyle={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>{headerComponent()}</SafeAreaView>
    </ImageBackground>
  ) : (
    <SafeAreaView style={[globalStyles.container]}>
      <StatusBar barStyle={"dark-content"} />
      <View
        style={[
          globalStyles.container,
          {
            paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
          },
        ]}
      >
        {headerComponent()}
      </View>
    </SafeAreaView>
  );
};

export default ContainerCus;
