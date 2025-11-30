import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Keyboard,
} from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import postAPI from "../../apis/postApi";
import {
  AvatarCus,
  ButtonCus,
  InputCus,
  RowCus,
  TextCus,
} from "../../components";
import { fontFamily } from "../../constants/fontFamily";
import { appInfo } from "../../constants/appInfors";

const CommentDetail = ({ route }) => {
  const { post } = route.params; // ✅ Lấy từ params
  console.log("=====Post in CommentDetail:======", post);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(post.comments || []);
  const listRef = useRef(null);
  const auth = useSelector((state: RootState) => state.auth);

  const handleSendComment = async (postId: string) => {
    if (!comment.trim()) return;
    try {
      const res = await postAPI.request(
        `/${postId}/comments`,
        { text: comment },
        "post"
      );
      console.log("✅========== Comment sent===========:", res);
      const newComment = res.comment;
      setComments((prev) => [...prev, newComment]);
      setComment("");
      Keyboard.dismiss();
    } catch (error) {
      console.log("❌ Error sending comment:", error);
    }
  };

  useEffect(() => {
    if (comments.length > 0) {
      listRef.current?.scrollToEnd({ animated: true });
    }
  }, [comments]);

  return (
    <View style={{ flex: 1, padding: 10, paddingBottom: 30 }}>
      {/* Danh sách comment */}
      <FlatList
        ref={listRef}
        data={comments}
        // keyExtractor={(item) => item._id}
        keyExtractor={(item, index) => item?._id || index.toString()}
        renderItem={({ item }) => {
          console.log("Item comment: ", item);
          return (
            <View
              style={{
                marginVertical: 2,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <AvatarCus
                  size={60}
                  uri={
                    item.user?.avatar
                      ? item.user?.avatar.startsWith("http")
                        ? item.user?.avatar
                        : `${appInfo.BASE_URL}${item.user?.avatar}`
                      : "https://dummyimage.com/100x100/cccccc/000000.png&text=PM"
                  }
                />
                <TextCus
                  styles={{ marginLeft: 5 }}
                  font={fontFamily.raleway.bold}
                  size={17}
                  text={item.user?.username || "Ẩn danh"}
                />
                <Text>{" : "}</Text>
              </View>
              <TextCus size={15} text={item.text} />
            </View>
          );
        }}
      />

      {/* Input comment */}
      <View
        style={{
          marginTop: 5,
        }}
      >
        <InputCus
          value={comment}
          onChange={(val) => setComment(val)}
          placeholder="Viết bình luận..."
          styles={{ flex: 1, marginRight: 10 }}
        />
        <ButtonCus
          type="primary"
          text="Gửi"
          onPress={() => handleSendComment(post._id)}
        />
      </View>
    </View>
  );
};

export default CommentDetail;
