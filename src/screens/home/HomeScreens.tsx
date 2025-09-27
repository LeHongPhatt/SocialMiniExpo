import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  AvatarCus,
  ButtonCus,
  CardFeedCus,
  ContainerCus,
  DividerCus,
  InputCus,
  SectionCus,
  StoryCus,
  TextCus,
} from "../../components";
import HeaderCus from "../../components/HeaderCus";
import { FontAwesome } from "@expo/vector-icons";
import { Images } from "../../assets/images";
import { globalStyles } from "../../styles/globalStyles";
import { fontFamily } from "../../constants/fontFamily";
import { RootState } from "../../redux/store";
import { appInfo } from "../../constants/appInfors";
const HomeScreens = ({ navigation, route }: any) => {
  const posts = useSelector((state: RootState) => state.posts.posts);
  const profile = useSelector((state: RootState) => state.profile);
  const [isNew, setIsNew] = useState("");
  const sizeIcon = 16;
  const fontText = fontFamily.quicksand.regular;
  const getFullUrl = (path?: string | null) => {
    if (!path) return undefined;
    if (path.startsWith("http")) return path;
    return `${appInfo.BASE_URL}${path.replace(/\\/g, "/")}`;
  };
  return (
    <ContainerCus>
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
            icon: <FontAwesome name="search" size={22} />,
            onPress: () => console.log("Search"),
          },
          {
            icon: <FontAwesome name="bell" size={22} />,
            onPress: () => console.log("Notify"),
          },
          {
            icon: <FontAwesome name="envelope" size={22} />,
            onPress: () => console.log("Settings"),
          },
        ]}
      />
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
            // onEdit={handleEditAvatar}
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
          <TouchableOpacity style={[globalStyles.row, globalStyles.alCenter]}>
            <FontAwesome size={sizeIcon} name="image" />
            <TextCus
              font={fontText}
              size={sizeIcon}
              text="Images"
              styles={{ marginLeft: 5 }}
            />
          </TouchableOpacity>
          <DividerCus />
          <TouchableOpacity style={[globalStyles.row, globalStyles.alCenter]}>
            <FontAwesome size={sizeIcon} name="cloud-upload" />
            <TextCus
              font={fontText}
              size={sizeIcon}
              text="Videos"
              styles={{ marginLeft: 5 }}
            />
          </TouchableOpacity>
          <DividerCus />
          <TouchableOpacity style={[globalStyles.row, globalStyles.alCenter]}>
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
      <StoryCus />
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          const author = item.author || {};
          return (
            <CardFeedCus
              content={item.content || ""}
              name={author.username || author.name || "Người dùng"}
              uri={getFullUrl(author?.avatar)}
              image={getFullUrl(item.image)}
              likes={item.likes?.length || 0}
              comments={item.comments?.length || 0}
              time={122}
            />
          );
        }}
      />
    </ContainerCus>
  );
};

export default HomeScreens;

const styles = StyleSheet.create({});
