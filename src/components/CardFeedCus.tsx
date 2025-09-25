import { Image, Platform, StyleSheet, Text, View } from "react-native";
import React from "react";
import ContainerCus from "./ContainerCus";
import AvatarCus from "./AvatarCus";
import SectionCus from "./SectionCus";
import { ActionCus, TextCus } from ".";
import { globalStyles } from "../styles/globalStyles";
import { Images } from "../assets/images";
import { appInfo } from "../constants/appInfors";
import { fontFamily } from "../constants/fontFamily";

interface PostActionsProps {
  likes: number | string;
  comments: number | string;
  uri: any;
  name: string;
  content: string;
  image?: string | null; // đúng chuẩn TS, có thể undefined hoặc null
}
const CardFeedCus: React.FC<PostActionsProps> = ({
  comments,
  likes,
  uri,
  name,
  content,
  image,
}) => {
  return (
    <View
      style={[
        globalStyles.shadow,
        {
          paddingHorizontal: 20,
          marginHorizontal: 20,
          backgroundColor: "white",
          borderRadius: 10,

          shadowOpacity: 0.6,
          marginTop: 20,
        },
      ]}
    >
      <SectionCus
        styles={[
          globalStyles.row,
          { paddingHorizontal: 0, marginTop: 10, paddingBottom: 0 },
        ]}
      >
        <AvatarCus uri={uri} />
        <SectionCus>
          <TextCus text={name} title />
          <TextCus text="time" size={13} />
        </SectionCus>
      </SectionCus>
      <TextCus
        size={14}
        font={fontFamily.raleway.regular}
        styles={{ flex: 1 }}
        text={content}
      />
      <View>
        {image && image !== "null" && (
          <Image
            source={{
              uri: image ?? "https://via.placeholder.com/400x200?text=No+Image",
            }}
            style={{
              width: appInfo.sizes.WIDTH,
              height: appInfo.sizes.HEIGHT / 4,
              alignSelf: "center",
            }}
            resizeMode="contain"
          />
        )}
      </View>
      <ActionCus likeCount={likes} commentCount={comments} />
    </View>
  );
};

export default CardFeedCus;

const styles = StyleSheet.create({});
