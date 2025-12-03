import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { use, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

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
  StoryList,
  TextCus,
} from "../../components";
import HeaderCus from "../../components/HeaderCus";
import { FontAwesome } from "@expo/vector-icons";
import { Images } from "../../assets/images";
import { globalStyles } from "../../styles/globalStyles";
import { fontFamily } from "../../constants/fontFamily";
import { RootState } from "../../redux/store";
import { appInfo } from "../../constants/appInfors";
import postAPI from "../../apis/postApi";
import {
  addPostAtStart,
  setLikes,
  toggleLike,
} from "../../redux/reduces/postReducer";
import authenticationAPI from "../../apis/authApi";
import { appColors } from "../../constants/appColors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { StoryScreen } from "..";
import storiesApi from "../../apis/storyApi";
import StoryViewer from "../story/StoryViewer";
import io from "socket.io-client";
interface PostType {
  id: string;
  content: string;
  image?: string;
  likes: string[];
  comments: string[];
  createdAt: string;
  author?: {
    id: string;
    username?: string;
    avatar?: string;
  };
}

const HomeScreens = ({ navigation, route }: any) => {
  const posts = useSelector((state: RootState) => state.posts.posts);
  const auth = useSelector((state: RootState) => state.auth);
  console.log("🏠 HomeScreens render", auth.authData.id);
  const dispatch = useDispatch();
  const profile = useSelector((state: RootState) => state.profile);
  const [isNew, setIsNew] = useState("");
  const [IsPosts, setIsPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [stories, setStories] = useState<any[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [loadingStories, setLoadingStories] = useState(false);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerStories, setViewerStories] = useState<any[]>([]);
  const [viewerStartIndex, setViewerStartIndex] = useState(0);
  const socketRef = useRef<any>(null);

  const sizeIcon = 16;
  const LIMIT = 10;
  const [commentText, setCommentText] = useState("");
  const fontText = fontFamily.quicksand.regular;
  const getFullUrl = (path?: string | null) => {
    if (!path) return undefined;
    if (path.startsWith("http")) return path;
    return `${appInfo.BASE_URL}${path.replace(/\\/g, "/")}`;
  };
  const socket = io(`${appInfo.BASE_URL}`);

  useEffect(() => {
    // Join user room với userId của mình
    if (auth.authData?.id) {
      socket.emit("join_user", auth.authData.id);
    }

    // Lắng nghe story mới
    socket.on("new_story", (story) => {
      // console.log("New story received:", story);
      setStories((prev) => {
        // Group theo user nếu muốn giống storyList
        const existingUserIndex = prev.findIndex(
          (s) => s.user.id === story.user.id
        );
        if (existingUserIndex >= 0) {
          const updated = [...prev];
          updated[existingUserIndex].stories.unshift(story);
          return updated;
        } else {
          return [{ user: story.user, stories: [story] }, ...prev];
        }
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [auth.authData?.id]);

  const handleLike = async (postId: string, alreadyLiked: boolean) => {
    console.log("👍 handleLike", postId, alreadyLiked);
    // if (!auth.authData.id) return;
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
  const fetchPosts = async (reset = false) => {
    if (loading) return;
    setLoading(true);

    try {
      const currentPage = reset ? 1 : page;

      const res = await authenticationAPI.HandleAuthentication(
        `/get-post?page=${currentPage}&limit=${LIMIT}`,
        null,
        "get"
      );

      if (!isMounted.current) return;

      if (res?.posts) {
        setIsPosts((prev) => {
          const combined = reset ? res.posts : [...prev, ...res.posts];
          const uniquePosts = Array.from(
            new Map(combined.map((p) => [p._id, p])).values()
          );
          return uniquePosts;
        });

        setHasMore(res.posts.length === LIMIT);
        setPage(reset ? 2 : currentPage + 1);
      } else {
        console.warn("⚠️ API không trả về 'posts'");
      }
    } catch (error) {
      console.log("❌ Lỗi khi tải bài đăng:", error);
    } finally {
      if (isMounted.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    fetchPosts(true);
  }, []);
  useEffect(() => {
    fetchPosts();
  }, []);
  const onEndReached = useCallback(() => {
    if (!loading && hasMore) {
      fetchPosts();
    }
  }, [loading, hasMore]);

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    fetchPosts(true);
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleComment = async (postId: string) => {
    if (!commentText.trim()) return;

    try {
      const res = await postAPI.request(
        `/${postId}/comments`,
        { text: commentText },
        "post"
      );

      console.log("✅ Comment response:", res.data);

      // reset
      setCommentText("");
      setActivePostId(null);

      // TODO: cập nhật lại state IsPosts (hoặc redux) để thêm comment mới
      // Ví dụ:
      setIsPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? { ...p, comments: [...(p.comments || []), res.comment] }
            : p
        )
      );
    } catch (error) {
      console.log("❌ Error comment:", error);
    }
  };

  const loadStories = async () => {
    setLoadingStories(true);
    try {
      const res = await storiesApi.request("/get-stories", null, "get");
      console.log("===========✅ Load stories response===========:", res);
      if (res?.stories) {
        // Gắn user info cho từng story
        const formattedStories = res.stories.map((story: any) => ({
          id: story._id,
          media: story.media ? getFullUrl(story.media) : null,
          type: story.type || "image",
          user: {
            id: story.user?._id,
            username: story.user?.username || "Ẩn danh",
            avatar: story.user?.avatar
              ? getFullUrl(story.user.avatar)
              : "https://dummyimage.com/100x100/cccccc/000000.png&text=User",
          },
        }));

        // Group stories theo user để hiển thị 1 vòng tròn / user
        const grouped: { [key: string]: any } = {};
        formattedStories.forEach((s) => {
          const userId = s.user.id;
          if (!grouped[userId]) {
            grouped[userId] = { user: s.user, stories: [] };
          }
          grouped[userId].stories.push(s);
        });

        setStories(Object.values(grouped));
      }
    } catch (error) {
      console.log("❌ Load stories error:", error);
    } finally {
      setLoadingStories(false);
    }
  };

  useEffect(() => {
    loadStories();
  }, []);

  const handleStoryPress = (item: any) => {
    if (!item?.userStories || item.userStories.length === 0) return;
    setViewerStories(item.userStories);
    setViewerStartIndex(0);
    setViewerVisible(true);
  };

  if (showUpload) {
    return (
      <StoryScreen
        onUploadSuccess={() => {
          setShowUpload(false);
          loadStories(); // reload stories sau khi upload
        }}
      />
    );
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#FF8501" />
      </View>
    );
  }
  const renderHeader = () => {
    return (
      <View>
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
              icon: <FontAwesome name="bell" size={22} />,
              onPress: () => console.log("Notify"),
            },
            {
              icon: <FontAwesome name="envelope" size={22} />,
              onPress: () => navigation.navigate("ChatListScreen"),
            },
          ]}
        />
        <SpaceCus height={60} />
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
              uri={
                profile.avatar
                  ? profile.avatar.startsWith("http")
                    ? profile.avatar
                    : `${appInfo.BASE_URL}${profile.avatar}`
                  : "https://dummyimage.com/100x100/cccccc/000000.png&text=No+Avatar"
              }
              initials="PM"
              backgroundColor="#EAEAEA"
            />
            <SectionCus styles={{ flex: 1, paddingBottom: 0 }}>
              <InputCus
                onEnd={() => navigation.navigate("NewPost")}
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
            <TouchableOpacity
              onPress={() => navigation.navigate("NewPost")}
              style={[globalStyles.row, globalStyles.alCenter]}
            >
              <FontAwesome size={sizeIcon} name="image" />
              <TextCus
                font={fontText}
                size={sizeIcon}
                text="Images"
                styles={{ marginLeft: 5 }}
              />
            </TouchableOpacity>
            <DividerCus />
            <TouchableOpacity
              onPress={() => navigation.navigate("NewPost")}
              style={[globalStyles.row, globalStyles.alCenter]}
            >
              <FontAwesome size={sizeIcon} name="cloud-upload" />
              <TextCus
                font={fontText}
                size={sizeIcon}
                text="Videos"
                styles={{ marginLeft: 5 }}
              />
            </TouchableOpacity>
            <DividerCus />
            <TouchableOpacity
              onPress={() => navigation.navigate("NewPost")}
              style={[globalStyles.row, globalStyles.alCenter]}
            >
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
        <Button title="Đăng Story mới" onPress={() => setShowUpload(true)} />
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            marginLeft: 10,
            marginTop: 10,
          }}
        >
          Stories
        </Text>
        <StoryList
          stories={stories
            .filter((s) => s.stories && s.stories.length > 0)
            .map((s) => ({
              id: s.user.id,
              username: s.user.username,
              imageUri: s.user.avatar,
              userStories: s.stories,
            }))}
          onStoryPress={(item) => handleStoryPress(item)}
        />

        <StoryViewer
          visible={viewerVisible}
          onClose={() => setViewerVisible(false)}
          stories={viewerStories || []} // fallback empty array
          startIndex={viewerStartIndex}
          duration={5000}
        />
      </View>
    );
  };
  return (
    <ContainerCus>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={IsPosts}
        keyExtractor={(item) => item._id}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.3}
        ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item, index }) => {
          const author = item.author || {};
          return (
            <View>
              <CardFeedCus
                key={index}
                content={item.content || ""}
                name={author.username || author.name || "Người dùng"}
                uri={getFullUrl(author?.avatar)}
                image={getFullUrl(item.image)}
                likes={item.likes?.length || 0}
                comments={item.comments?.length || 0}
                time={122}
                isLiked={item.likes.includes(auth.id)}
                onLike={() =>
                  handleLike(item._id, item.likes.includes(auth.id))
                }
                // onPressComment={() => console.log("Comment")}
                onPressComment={() => setActivePostId(item._id)}
              />
              {activePostId === item._id && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 5,
                  }}
                >
                  <InputCus
                    value={commentText}
                    onChange={(val) => setCommentText(val)}
                    placeholder="Viết bình luận..."
                    styles={{ flex: 1, marginRight: 10 }}
                  />
                  <ButtonCus
                    type="primary"
                    text="Gửi"
                    onPress={() => handleComment(item._id)}
                  />
                </View>
              )}
              {item.comments && item.comments.length > 0 && (
                <View style={{ marginLeft: 15, marginTop: 5 }}>
                  {item.comments.slice(-2).map((c: any, i: number) => {
                    return (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginVertical: 2,
                        }}
                        key={i}
                      >
                        <AvatarCus
                          size={30}
                          uri={
                            c.user?.avatar
                              ? c.user?.avatar.startsWith("http")
                                ? c.user?.avatar
                                : `${appInfo.BASE_URL}${c.user?.avatar}`
                              : "https://dummyimage.com/100x100/cccccc/000000.png&text=PM"
                          }
                        />
                        <Text style={{ fontSize: 14, marginLeft: 3 }}>
                          <Text style={{ fontWeight: "bold" }}>
                            {c.user?.username || "Ẩn danh"}:{" "}
                          </Text>
                          {c.text}
                        </Text>
                      </View>
                    );
                  })}
                  {item.comments.length > 2 && (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("CommentDetail", { post: item })
                      }
                    >
                      <Text style={{ color: "gray" }}>
                        Xem tất cả {item.comments.length} bình luận
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          );
        }}
        ListFooterComponent={
          !refreshing &&
          (loading ? (
            <ActivityIndicator
              size="small"
              color={appColors?.primary || "blue"}
              style={{ marginVertical: 15 }}
            />
          ) : !hasMore && posts.length > 0 ? (
            <TextCus
              text="Bạn đã xem hết tất cả bài đăng 🎉"
              styles={{ textAlign: "center", marginVertical: 10 }}
            />
          ) : null)
        }
      />
    </ContainerCus>
  );
};

export default HomeScreens;

const styles = StyleSheet.create({});
