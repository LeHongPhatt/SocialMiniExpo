import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  FlatList,
  RefreshControl,
  View,
  ActivityIndicator,
} from "react-native";
import { CardFeedCus, TextCus } from "../../../components";
import authenticationAPI from "../../../apis/authApi";
import { appColors } from "../../../constants/appColors";

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

const LIMIT = 10;

const Post = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    fetchPosts(true);
    return () => {
      isMounted.current = false;
    };
  }, []);

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

        setPosts((prev) => {
          const combined = reset ? res.posts : [...prev, ...res.posts];
          const uniquePosts = Array.from(
            new Map(combined.map((p) => [p.id, p])).values()
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

  const onEndReached = useCallback(() => {
    if (!loading && hasMore) {
      fetchPosts();
    }
  }, [loading, hasMore]);

  const renderItem = useCallback(
    ({ item }: { item: PostType }) => (
      <CardFeedCus
        name={item.author?.username}
        uri={item.author?.avatar}
        content={item.content}
        image={item.image}
        likes={item.likes?.length ?? 0}
        comments={item.comments?.length ?? 0}
        time={item.createdAt}
      />
    ),
    []
  );

  if (!loading && posts.length === 0) {
    return (
      <View style={{ alignItems: "center", marginTop: 40 }}>
        <TextCus text="Hiện chưa có bài đăng nào" size={16} />
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(item, index) => item.id ?? `post-${index}`}
      renderItem={renderItem}
      removeClippedSubviews
      initialNumToRender={5}
      maxToRenderPerBatch={10}
      windowSize={5}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.3}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
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
  );
};

export default Post;
