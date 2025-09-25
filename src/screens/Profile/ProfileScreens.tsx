import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  AvatarCus,
  ButtonCus,
  ContainerCus,
  DetailProfile,
  InputCus,
  RowCus,
  TextCus,
} from "../../components";
import { Images } from "../../assets/images";
import { appInfo } from "../../constants/appInfors";
import { appColors } from "../../constants/appColors";
import { FontAwesome } from "@expo/vector-icons";
import Post from "./components/Post";
import Detail from "./components/Detail";
import { useDispatch, useSelector } from "react-redux";
import { authSelector, updateAvatar } from "../../redux/reduces/authReducer";
import authenticationAPI from "../../apis/authApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import {
  ProfileReducer,
  setProfileReducer,
  updateProfileField,
} from "../../redux/reduces/profileReducer";
const { width } = Dimensions.get("window");

const screens = [
  { key: "Post", component: <Post /> },
  { key: "Detail", component: <Detail /> },
];
const ProfileScreens = () => {
  const [profile, setIsProfile] = useState(null);

  const [edit, setEdit] = useState(false);
  const [updateName, setUpdateName] = useState("");

  const [isBio, setIsBio] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  //
  const [name, setName] = useState();
  const [displayName, setDisplayName] = useState();
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await authenticationAPI.HandleAuthentication(
          "/get-profile",
          "get"
        );
        dispatch(ProfileReducer(res));
        setIsProfile(res);
      } catch (error) {
        console.log("err", error);
      }
    };
    fetchProfile();
  }, []);
  const updateProfile = async () => {
    try {
      const res = await authenticationAPI.HandleAuthentication(
        "/update-profile",
        {
          username: updateName || profile.username,
          displayName: displayName || profile.displayName,
          bio: isBio || profile.bio,
        },
        "put"
      );
      setIsProfile((prev) => ({ ...prev, ...res.user }));
      dispatch(updateProfileField(res.user)); // ✅ cập nhật Redux

      setEdit(false); // tắt chế độ edit sau khi update
    } catch (error) {
      console.log("error", error);
    }
  };
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
  const handleSwitch = (index: number) => {
    setActiveIndex(index);
    Animated.spring(translateX, {
      toValue: (width / screens.length) * index,
      useNativeDriver: true,
    }).start();
  };

  return (
    <ContainerCus isScroll>
      <View style={{}}>
        <Image
          style={{
            flex: 1,
            borderBottomLeftRadius: 25,
            borderBottomRightRadius: 25,
          }}
          source={Images.intro1}
          width={appInfo.sizes.WIDTH}
          resizeMode="contain"
        />
        <View
          style={{
            position: "absolute",
            alignSelf: "center",
            bottom: -30,
            borderWidth: 2,
            borderRadius: 100,
            borderColor: appColors.primary,
          }}
        >
          {profile ? (
            <AvatarCus
              onEdit={handleEditAvatar}
              showEdit={edit}
              size={100}
              uri={
                profile?.avatar
                  ? profile.avatar.startsWith("http")
                    ? profile.avatar
                    : `${appInfo.BASE_URL}${profile.avatar}`
                  : "https://dummyimage.com/100x100/cccccc/000000.png&text=No+Avatar"
              }
            />
          ) : (
            <TextCus text="Đang tải dữ liệu..." />
          )}
        </View>
      </View>
      <View style={{ alignItems: "center", marginTop: 40 }}>
        {edit ? (
          <InputCus
            placeholder={profile.username}
            value={updateName}
            onChange={(val) => setUpdateName(val)}
          />
        ) : (
          <TextCus text={profile?.username ?? "No username"} />
        )}
        {edit ? (
          <InputCus
            placeholder={profile.bio}
            value={isBio}
            onChange={(val) => setIsBio(val)}
          />
        ) : (
          <TextCus text={profile?.bio ?? "No username"} />
        )}
      </View>
      <RowCus styles={{ marginTop: 15 }}>
        <ButtonCus
          onPress={() => {
            if (edit) {
              updateProfile();
              setEdit(false);
            } else {
              setEdit(true);
            }
          }}
          text={edit ? "Save" : "Edit Profile"}
          styles={{
            borderWidth: 1,
            backgroundColor: "white",
            marginBottom: 0,
          }}
          type="primary"
          textColor="black"
        />
        <View
          style={{
            padding: 8,
            borderWidth: 1,
            alignItems: "center",
            alignSelf: "center",
            borderRadius: 10,
          }}
        >
          <FontAwesome name="home" size={34} />
        </View>
      </RowCus>
      <DetailProfile
        post={profile?.stats?.posts ?? 0}
        follower={profile?.stats?.followers ?? 0}
        following={profile?.stats?.following ?? 0}
        photos={profile?.stats?.photos ?? 0}
      />
      <View style={{ flex: 1 }}>
        {/* Bottom bar */}
        <View style={styles.bottomBar}>
          <Animated.View
            style={[styles.indicator, { transform: [{ translateX }] }]}
          />
          {screens.map((s, idx) => (
            <TouchableOpacity
              key={s.key}
              style={styles.tabButton}
              onPress={() => handleSwitch(idx)}
            >
              <Text
                style={
                  activeIndex === idx ? styles.activeText : styles.inactiveText
                }
              >
                {s.key}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View>{screens[activeIndex].component}</View>
    </ContainerCus>
  );
};

export default ProfileScreens;

const styles = StyleSheet.create({
  bottomBar: {
    flexDirection: "row",
    height: 60,
    // borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
    position: "relative",
  },
  tabButton: { flex: 1, justifyContent: "center", alignItems: "center" },
  activeText: { color: "blue", fontWeight: "bold" },
  inactiveText: { color: "gray" },
  indicator: {
    position: "absolute",
    width: width / screens.length,
    height: 3,
    backgroundColor: "blue",
    bottom: 0,
    left: 0,
  },
  textScreen: { fontSize: 24 },
});
