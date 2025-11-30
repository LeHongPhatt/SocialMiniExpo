import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import postAPI from "../apis/postApi";
// import { addComment } from "../services/postService"; // API gọi backend
// import { addCommentToPost } from "../redux/postSlice"; // Redux action

const CommentSection = () => {
  const [text, setText] = useState("");
  const dispatch = useDispatch();
  const authData = useSelector((state: any) => state.auth);

  const handleAddComment = async (postId: string, text: string) => {
    if (!text.trim()) return;
    try {
      //   const res = await addComment(post._id, text, authData.accessToken);
      //   const newComment = res.data.comments.slice(-1)[0]; // lấy comment mới nhất

      //   dispatch(addCommentToPost({ postId: post._id, comment: newComment }));
      const res = await postAPI.request(
        `${postId}/comments`,
        undefined,
        "post"
      );
      console.log("===res add comment===", res);
      setText("");
    } catch (err) {
      console.log("Add comment error:", err);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.commentContainer}>
      <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <Text>
          <Text style={styles.username}>{item.user.name} </Text>
          {item.text}
        </Text>
        <Text style={styles.time}>
          {new Date(item.createdAt).toLocaleTimeString()}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Danh sách comment */}
      <FlatList
        data={post.comments}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
      />

      {/* Input comment */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Viết bình luận..."
          value={text}
          onChangeText={setText}
        />
        <TouchableOpacity onPress={handleAddComment}>
          <Text style={styles.sendBtn}>Gửi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CommentSection;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  commentContainer: {
    flexDirection: "row",
    marginVertical: 6,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  username: {
    fontWeight: "bold",
  },
  time: {
    fontSize: 12,
    color: "gray",
    marginTop: 2,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "#f0f2f5",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  sendBtn: {
    marginLeft: 8,
    color: "#1877F2",
    fontWeight: "bold",
  },
});
