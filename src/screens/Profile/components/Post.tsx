import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { CardFeedCus } from "../../../components";
import { useSelector } from "react-redux";
import { authSelector } from "../../../redux/reduces/authReducer";

const Post = () => {
  const user = useSelector(authSelector);
  console.log("user",user)
  return (
    <View>
      <CardFeedCus
        content={user.accesstoken}
        likes={131}
        comments={2321}
        uri={user.avatar}
        name={user.username || "Vô danh"}
        image={user.avatar}
      />
    </View>
  );
};

export default Post;

const styles = StyleSheet.create({});
