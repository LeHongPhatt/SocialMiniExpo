import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { DividerCus, RowCus, TextCus } from ".";
import { globalStyles } from "../styles/globalStyles";

interface Props {
  post: number | string;
  photos: number | string;
  follower: number | string;
  following: number | string;
}
const DetailProfile: React.FC<Props> = ({
  post,
  photos,
  follower,
  following,
}: any) => {
  return (
    <View
      style={{
        padding: 6,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: "gray",
        marginHorizontal: 20,
        marginVertical: 20,
      }}
    >
      <RowCus styles={{ justifyContent: "space-around" }}>
        <View style={[globalStyles.alCenter]}>
          <TextCus text={post} title size={16} />
          <TextCus text="posts" size={12} />
        </View>
        <DividerCus height={40} />
        <View style={[globalStyles.alCenter]}>
          <TextCus text={photos} title size={16} />
          <TextCus text="photos" size={12} />
        </View>
        <DividerCus height={40} />

        <View style={[globalStyles.alCenter]}>
          <TextCus text={follower} title size={16} />
          <TextCus text="follower" size={12} />
        </View>
        <DividerCus height={40} />

        <View style={[globalStyles.alCenter]}>
          <TextCus text={following} title size={16} />
          <TextCus text="following" size={12} />
        </View>
      </RowCus>
    </View>
  );
};

export default DetailProfile;

const styles = StyleSheet.create({});
