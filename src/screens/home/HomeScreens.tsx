import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { use, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addAuth,
  authSelector,
  logoutUser,
  updateAvatar,
} from "../../redux/reduces/authReducer";
import {
  AvatarCus,
  ButtonCus,
  CardFeedCus,
  ContainerCus,
  DividerCus,
  InputCus,
  SectionCus,
  SpaceCus,
  StoryCus,
  TextCus,
} from "../../components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HeaderCus from "../../components/HeaderCus";
import { FontAwesome } from "@expo/vector-icons";
import { Images } from "../../assets/images";
import { globalStyles } from "../../styles/globalStyles";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import authenticationAPI from "../../apis/authApi";
import { fontFamily } from "../../constants/fontFamily";
import StoryScreen from "../story/StoryScreens";
const HomeScreens = ({ navigation }: any) => {
  const user = useSelector(authSelector);
  console.log("asdasd", user);
  const dispatch = useDispatch();
  const [isNew, setIsNew] = useState("");
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const sizeIcon = 16;
  const fontText = fontFamily.quicksand.regular;
  const handleEditAvatar = async () => {
    const token = await AsyncStorage.getItem("auth");
    console.log("Token", token);

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const formData = new FormData();
      formData.append("avatar", {
        uri,
        type: "image/jpeg",
        name: "avatar.jpg",
      } as any);

      try {
        setLoading(true); // ✅ bật loading
        const res = await authenticationAPI.HandleAuthentication(
          "/upload-avatar",
          formData,
          "post"
        );

        console.log("res", res);

        if (res.status === 200) {
          setAvatarUri(res?.avatar); // ✅ cập nhật ảnh ngay lập tức
          dispatch(updateAvatar(res?.avatar)); // ✅ cập nhật Redux
        } else {
          Alert.alert("Lỗi", "Upload thất bại, vui lòng thử lại!");
        }
      } catch (err) {
        console.error("Upload lỗi", err);
        Alert.alert("Lỗi", "Không thể upload ảnh");
      } finally {
        setLoading(false); // ✅ tắt loading dù thành công hay lỗi
      }
    }
  };

  return (
    <ContainerCus isScroll>
      <HeaderCus
        type="logo-with-icons"
        leftLogo={
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
      <SectionCus>
        <View
          style={{
            flexDirection: "row",

            paddingBottom: 0,
          }}
        >
          <AvatarCus
            style={{ paddingLeft: 15 }}
            size={50}
            uri={avatarUri}
            initials="PM"
            onEdit={handleEditAvatar}
            backgroundColor="#EAEAEA"
          />
          <SectionCus styles={{ flex: 1, paddingBottom: 0 }}>
            <InputCus
              onChange={(val) => setIsNew(val)}
              allowClear
              value={isNew}
              placeholder="What your on head ?"
              styles={{
                marginHorizontal: 0,
                paddingHorizontal: 0,
                backgroundColor: "translate",
                borderWidth: 0,
              }}
            />
          </SectionCus>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignSelf: "center",
          }}
        >
          <TouchableOpacity style={[globalStyles.row, globalStyles.alCenter]}>
            <FontAwesome size={sizeIcon} name="image" />
            <TextCus
              font={fontText}
              size={sizeIcon}
              text="Images"
              styles={{ marginLeft: 5 }}
            />
          </TouchableOpacity>
          <DividerCus />
          <TouchableOpacity style={[globalStyles.row, globalStyles.alCenter]}>
            <FontAwesome size={sizeIcon} name="cloud-upload" />
            <TextCus
              font={fontText}
              size={sizeIcon}
              text="Videos"
              styles={{ marginLeft: 5 }}
            />
          </TouchableOpacity>
          <DividerCus />
          <TouchableOpacity style={[globalStyles.row, globalStyles.alCenter]}>
            <FontAwesome name="cloud-upload" size={sizeIcon} />
            <TextCus
              font={fontText}
              size={sizeIcon}
              text="Attach"
              styles={{ marginLeft: 5 }}
            />
          </TouchableOpacity>
        </View>
      </SectionCus>
      <StoryCus />
      <CardFeedCus likes={2330} comments={20000} />
      <CardFeedCus likes={2330} comments={20000} />
      <CardFeedCus likes={2330} comments={20000} />
    </ContainerCus>
  );
};

export default HomeScreens;

const styles = StyleSheet.create({});
