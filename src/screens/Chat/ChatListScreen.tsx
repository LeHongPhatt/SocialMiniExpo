import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
// import chatApi from "../services/chatApi";
import { useNavigation } from "@react-navigation/native";
import chatAPI from "../../apis/chatApi";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { appInfo } from "../../constants/appInfors";
import HeaderCus from "../../components/HeaderCus";
import { appColors } from "../../constants/appColors";
import { FontAwesome } from "@expo/vector-icons";
export default function ChatListScreen() {
  const auth = useSelector((state: RootState) => state.auth);

  const [conversations, setConversations] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation();

  const loadData = async () => {
    try {
      const res = await chatAPI.request("/conversations", {}, "get");
      console.log("==conversations==", res.data);
      const conversationsArray = Object.keys(res)
        .filter((key) => key !== "status")
        .map((key) => res[key]);

      console.log("==conversationsArray==", conversationsArray);
      setConversations(conversationsArray);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    loadData();
  }, []);
  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };
  const handlePressConversation = async (conversationId: string) => {
    navigation.navigate("ChatScreen", { conversationId });

    try {
      await chatAPI.request(`/chat/markAsRead/${conversationId}`, {}, "post");
      // cập nhật ngay trên frontend
      setConversations((prev) =>
        prev.map((c) =>
          c._id === conversationId ? { ...c, hasUnread: false } : c
        )
      );
    } catch (err) {
      console.log("Mark as read error:", err);
    }
  };
  const renderItem = ({ item }: any) => {
    console.log("==item conversation==", item);
    const hasUnread =
      item.hasUnread && item.lastMessageSender !== auth.authData.id;
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => handlePressConversation(item._id)}
      >
        <Image
          source={{
            uri: item.avatar
              ? `${appInfo.BASE_URL}${item.avatar}`
              : "https://dummyimage.com/100x100/cccccc/000000.png&text=User",
          }}
          style={styles.avatar}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.username || "Ẩn danh"}</Text>
          <Text style={styles.lastMsg} numberOfLines={1}>
            {item.lastMessage || "Bắt đầu cuộc trò chuyện"}
          </Text>
        </View>
        {hasUnread ? <View style={styles.unreadDot} /> : null}
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <HeaderCus
        height={100}
        type="back-title-icon"
        title="New Post"
        showBackButton
        onBackPress={() => navigation.goBack()}
        icons={[
          {
            icon: <FontAwesome name="send" size={24} color="white" />,
          },
        ]}
      />
      <FlatList
        data={conversations}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        alwaysBounceVertical={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: appColors.white },
  item: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 0.5,
    borderColor: appColors.gray2,
    marginHorizontal: 20,
    marginTop: 20,
  },
  avatar: { width: 52, height: 52, borderRadius: 26, marginRight: 12 },
  name: { fontSize: 16, fontWeight: "600" },
  lastMsg: { color: "gray", marginTop: 2 },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "red",
    marginLeft: 5,
  },
});
