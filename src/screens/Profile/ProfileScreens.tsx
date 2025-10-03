import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  RefreshControl,
} from "react-native";
import {
  AvatarCus,
  ButtonCus,
  DetailProfile,
  InputCus,
  RowCus,
  TextCus,
} from "../../components";
import { Images } from "../../assets/images";
import { appInfo } from "../../constants/appInfors";
import { appColors } from "../../constants/appColors";
import { FontAwesome } from "@expo/vector-icons";
import CardFeedCus from "../../components/CardFeedCus";
import authenticationAPI from "../../apis/authApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import {
  ProfileReducer,
  updateProfileField,
} from "../../redux/reduces/profileReducer";
import { useDispatch, useSelector } from "react-redux";
import {
  setPosts,
  addPosts,
  setHasMore,
  setLoading,
  toggleLike,
  setLikes,
} from "../../redux/reduces/postReducer";
import { updateAvatar } from "../../redux/reduces/authReducer";
import { RootState } from "@reduxjs/toolkit/query";
import axios from "axios";
import postAPI from "../../apis/postApi";

const { width } = Dimensions.get("window");

const ProfileScreens = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const [profile, setProfile] = useState<any>(null);

  const [edit, setEdit] = useState(false);
  const [updateName, setUpdateName] = useState("");
  const [isBio, setIsBio] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;
  const [refreshing, setRefreshing] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const { posts, page, hasMore, loading } = useSelector(
    (state: any) => state.posts
  );
  console.log("=============posts============", posts);
  const getFullUrl = (path?: string | null) => {
    if (!path) return undefined;
    if (path.startsWith("http")) return path;
    return `${appInfo.BASE_URL}${path.replace(/\\/g, "/")}`;
  };
  const dispatch = useDispatch();

  const LIMIT = 10;
  const firstLoad = useRef(true);

  const loadProfile = async () => {
    try {
      const res = await authenticationAPI.HandleAuthentication(
        "/get-profile",
        "get"
      );
      dispatch(ProfileReducer(res));
      setProfile(res);
      return res;
    } catch (error) {
      console.log("❌ Lỗi load profile:", error);
      return null;
    }
  };

  const loadPosts = async (id: string, page = 1, limit = 10) => {
    if (!id) {
      return;
    }
    dispatch(setLoading(true));
    try {
      const res = await postAPI.request(
        `/user/${id}?page=${page}&limit=${limit}`,
        undefined,
        "get"
      );
      console.log("🟢=============== getUserPost:============", res);
      if (res?.getPost) {
        if (page === 1) {
          dispatch(setPosts(res.getPost));
        } else {
          dispatch(addPosts(res.getPost));
        }
        dispatch(setHasMore(res.getPost.length === LIMIT));
      }
    } catch (err) {
      console.log("❌ Lỗi loadPosts:", err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) loadPosts();
  }, [loading, hasMore]);
  const updateProfile = async () => {
    try {
      const res = await authenticationAPI.HandleAuthentication(
        "/update-profile",
        {
          username: updateName || profile.username,
          displayName: profile.displayName,
          bio: isBio || profile.bio,
        },
        "put"
      );
      setProfile((prev: any) => ({ ...prev, ...res.user }));
      dispatch(updateProfileField(res.user));
      setEdit(false);
    } catch (error) {
      console.log("❌ Lỗi update profile:", error);
    }
  };
  const handleEditAvatar = async () => {
    const token = await AsyncStorage.getItem("auth");

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
        setLoadingPosts(true);
        const res = await authenticationAPI.HandleAuthentication(
          "/upload-avatar",
          formData,
          "post"
        );

        if (res.status === 200) {
          setAvatarUri(res?.avatar);
          dispatch(updateAvatar(res?.avatar));
        } else {
          Alert.alert("Lỗi", "Upload thất bại, vui lòng thử lại!");
        }
      } catch (err) {
        console.error("❌ Upload lỗi", err);
        Alert.alert("Lỗi", "Không thể upload ảnh");
      } finally {
        setLoadingPosts(false);
      }
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (profile?.id && firstLoad.current) {
      firstLoad.current = false;
      loadPosts();
    }
  }, [profile?.id]);
  const handleSwitch = (index: number) => {
    setActiveIndex(index);
    Animated.spring(translateX, {
      toValue: (width / 2) * index,
      useNativeDriver: true,
    }).start();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const profileRes = await loadProfile();
      if (profileRes?.id) {
        await loadPosts();
      }
    } finally {
      setRefreshing(false);
    }
  };

  const handleLike = async (postId: string, alreadyLiked: boolean) => {
    console.log("👍 handleLike", postId, alreadyLiked);
    if (!auth.authData.id) return;
    // cập nhật UI trước
    dispatch(toggleLike({ postId, userId: auth.authData.id }));

    try {
      let res;

      if (alreadyLiked) {
        res = await postAPI.request(`/${postId}/like`, undefined, "delete");
        console.log("🟠 Unlike response:", res.data);
      } else {
        res = await postAPI.request(`/${postId}/like`, undefined, "post");
        console.log("🟢 Like response:", res);
      }

      // đồng bộ lại với backend
      if (res?.data?.likes) {
        console.log("✅ Like updated:", res.data.likes);
        dispatch(setLikes({ postId, likes: res.data.likes }));
      }
    } catch (error) {
      console.log("❌ Like failed:", error);
      // rollback nếu lỗi
      dispatch(toggleLike({ postId, userId: auth.id }));
    }
  };

  useEffect(() => {
    if (profile?.id) {
      loadPosts(profile.id, 1, LIMIT);
    }
  }, [profile?.id]);

  const renderHeader = useCallback(
    () => (
      <View>
        {/* Background */}
        <View>
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
              borderWidth: 2,
              borderRadius: 100,
              borderColor: appColors.primary,
              bottom: -20,
              alignSelf: "center",
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

        {/* Username + Bio */}
        <View style={{ alignItems: "center", marginTop: 30 }}>
          {edit ? (
            <InputCus
              placeholder={profile?.username}
              value={updateName}
              onChange={(val) => setUpdateName(val)}
            />
          ) : (
            <TextCus title text={profile?.username ?? "No username"} />
          )}
          {edit ? (
            <InputCus
              placeholder={profile?.bio}
              value={isBio}
              onChange={(val) => setIsBio(val)}
            />
          ) : (
            <TextCus text={profile?.bio ?? "No bio"} />
          )}
        </View>

        {/* Edit Button */}
        <RowCus styles={{ marginTop: 15 }}>
          <ButtonCus
            onPress={() => (edit ? updateProfile() : setEdit(true))}
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

        {/* Stats */}
        <DetailProfile
          post={profile?.stats?.posts ?? 0}
          follower={profile?.stats?.followers ?? 0}
          following={profile?.stats?.following ?? 0}
          photos={profile?.stats?.photos ?? 0}
        />

        {/* Tabs */}
        <View style={styles.bottomBar}>
          <Animated.View
            style={[styles.indicator, { transform: [{ translateX }] }]}
          />
          {["Post", "Detail"].map((s, idx) => (
            <TouchableOpacity
              key={s}
              style={styles.tabButton}
              onPress={() => handleSwitch(idx)}
            >
              <Text
                style={
                  activeIndex === idx ? styles.activeText : styles.inactiveText
                }
              >
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    ),
    [profile, edit, updateName, isBio, activeIndex]
  );
  const renderItem = ({ item }: any) => {
    console.log("=====🟢 Post item:", item.image);
    return (
      <View>
        <CardFeedCus
          likes={item?.length || 0}
          comments={item?.length || 0}
          uri={
            item.author?.avatar?.startsWith("http")
              ? item.author.avatar
              : `${appInfo.BASE_URL}${item.author?.avatar ?? ""}`
          }
          name={item.author?.username}
          content={item.content}
          image={getFullUrl(item.image)}
          // isLiked={item.author.likes.includes(auth.id)}
          // onLike={() => handleLike(item.id, item.likes.includes(auth.id))}
        />
      </View>
    );
  };
  return (
    <FlatList
      data={activeIndex === 0 ? posts : []}
      keyExtractor={(item) => item._id}
      renderItem={activeIndex === 0 ? renderItem : undefined}
      ListHeaderComponent={renderHeader}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.1}
      ListFooterComponent={() => {
        if (loading) {
          return (
            <Text
              style={{
                textAlign: "center",
                marginVertical: 10,
                fontSize: 16,
              }}
            >
              Đang tải...
            </Text>
          );
        }
        if (!hasMore) {
          return (
            <Text style={{ textAlign: "center", marginVertical: 10 }}>
              Bạn đã xem hết 🎉
            </Text>
          );
        }
        return null;
      }}
    />
  );
};

export default ProfileScreens;
const styles = StyleSheet.create({
  bottomBar: {
    flexDirection: "row",
    height: 60,
    borderTopColor: "#eee",
    backgroundColor: "#eee",
    position: "relative",
  },
  tabButton: { flex: 1, justifyContent: "center", alignItems: "center" },
  activeText: { color: "blue", fontWeight: "bold" },
  inactiveText: { color: "gray" },
  indicator: {
    position: "absolute",
    width: width / 2,
    height: 3,
    backgroundColor: "blue",
    bottom: 0,
    left: 0,
  },
});
