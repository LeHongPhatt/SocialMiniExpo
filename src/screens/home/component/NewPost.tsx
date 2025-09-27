

import {
  Alert,
  Button,
  Image,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import HeaderCus from "../../../components/HeaderCus";
import { FontAwesome } from "@expo/vector-icons";
import { appColors } from "../../../constants/appColors";
import {
  AvatarCus,
  BottomSheetCus,
  DropDown,
  InputCus,
  RowCus,
  SectionCus,
} from "../../../components";
import NewStatusSheetRef from "../../../components/BottomSheetCus";
import authenticationAPI from "../../../apis/authApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { addPostAtStart } from "../../../redux/reduces/postReducer";
import { useDispatch, useSelector } from "react-redux";
import { appInfo } from "../../../constants/appInfors";
import { RootState } from "@reduxjs/toolkit/query";
import axios from "axios";

const NewPost = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const sheetRef = useRef<NewStatusSheetRef>(null);
  const profile = useSelector((state: RootState) => state.profile);

  const [isPost, setIsPost] = useState("");
  const [image, setImage] = useState<any>(null); // ảnh từ ImagePicker
  const [visibility, setVisibility] = useState<"public" | "private" | "only">(
    "public"
  );

  useEffect(() => {
    sheetRef.current?.open();
  }, []);

  const handleSelect = (value: "Public" | "Private" | "Only me") => {
    if (value === "Public") setVisibility("public");
    else if (value === "Private") setVisibility("private");
    else setVisibility("only");
  };

  

  const submitPost = async () => {
    if (!isPost && !image) return;

    const formData = new FormData();
    if (image) {
      formData.append("image", {
        uri: image.uri,
        name: image.fileName || "photo.jpg",
        type: image.type || "image/jpeg",
      } as any);
    }
    formData.append("content", isPost);

    try {
      const token = await AsyncStorage.getItem("accessToken");
     
      const res = await authenticationAPI.HandleAuthentication(
        "/new-post",
        formData,
        "post"
      );
      console.log("dât", res);
      dispatch(addPostAtStart(res));
      navigation.navigate("Main");
      setIsPost("");
      setImage(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSelectPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const actions = [
    {
      key: "photo",
      iconName: "photo",
      color: "#4CAF50",
      label: "Ảnh/Video",
      onPress: handleSelectPhoto,
    },
    {
      key: "feel",
      iconName: "smile-o",
      color: "#FFC107",
      label: "Cảm xúc",
      onPress: () => Alert.alert("Chọn cảm xúc"),
    },
    {
      key: "checkin",
      iconName: "map-marker",
      color: "#F44336",
      label: "Check-in",
      onPress: () => Alert.alert("Chọn địa điểm"),
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: appColors.white }}>
      <HeaderCus
        height={100}
        type="back-title-icon"
        title="New Post"
        showBackButton
        onBackPress={() => navigation.goBack()}
        icons={[
          {
            icon: <FontAwesome name="send" size={24} color="gray" />,
            onPress: submitPost,
          },
        ]}
      />
      <RowCus
        styles={{
          justifyContent: "flex-start",
          marginHorizontal: 20,
          alignItems: "center",
        }}
      >
        <AvatarCus
          size={60}
          uri={
            profile.avatar
              ? profile.avatar.startsWith("http")
                ? profile.avatar
                : `${appInfo.BASE_URL}${profile.avatar}`
              : "https://dummyimage.com/100x100/cccccc/000000.png&text=PM"
          }
        />
        <SectionCus>
          <DropDown selected="Public" onSelect={handleSelect} />
        </SectionCus>
      </RowCus>

      <InputCus
        placeholder="Bạn muốn gì???"
        multiline
        value={isPost}
        onChange={setIsPost}
        styles={{ borderWidth: 0, paddingHorizontal: 20 }}
      />

      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Button title="Chọn ảnh" onPress={handleSelectPhoto} />
        {image && (
          <Image
            source={{ uri: image.uri }}
            style={{ width: 300, height: 300, marginTop: 20 }}
            resizeMode="contain"
          />
        )}
      </View>

      <BottomSheetCus ref={sheetRef} actions={actions} />
    </View>
  );
};

export default NewPost;

const styles = StyleSheet.create({});
