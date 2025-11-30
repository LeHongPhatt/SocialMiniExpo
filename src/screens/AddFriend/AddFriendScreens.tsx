import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect } from "react";
import {
  AvatarCus,
  ButtonCus,
  InputCus,
  RowCus,
  SectionCus,
  TextCus,
} from "../../components";
import { FontAwesome } from "@expo/vector-icons";
import { appColors } from "../../constants/appColors";
import HeaderCus from "../../components/HeaderCus";
import authenticationAPI from "../../apis/authApi";
import { appInfo } from "../../constants/appInfors";

const AddFriendScreens = ({ navigation }) => {
  const [searchText, setSearchText] = React.useState("");
  const [followers, setFollowers] = React.useState([]);
  const [results, setResults] = React.useState([]);

  const searchUser = async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    try {
      const res = await authenticationAPI.HandleAuthentication(
        `/search?q=${encodeURIComponent(searchText)}`,
        null,
        "get"
      );
      console.log("==res search user==", res);
      setResults(res.users || []);
    } catch (error) {
      console.log("==error search user==", error);
    }
  };
  useEffect(() => {
    searchUser(searchText);
  }, [searchText]);
  const handleSelect = (user: any) => {
    navigation.navigate("UserProfile", { userId: user._id });
  };

  const getFullUrl = (avatar?: string) => {
    if (!avatar)
      return "https://dummyimage.com/100x100/cccccc/000000.png&text=No+Avatar";
    if (avatar.startsWith("http")) return avatar;
    return `${appInfo.BASE_URL}${avatar}`;
  };

  const handleFollow = async (userId: string) => {
    try {
      const res = await authenticationAPI.HandleAuthentication(
        `/${userId}/follow`,
        { searchText },
        "post"
      );
      console.log("==follow/unfollow response==", res);
      setResults((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, isFollowed: res.isFollowed } : user
        )
      );
    } catch (error) {
      console.log("==error follow/unfollow==", error);
    }
  };

  return (
    <View style={{ flex: 1, paddingTop: 30, backgroundColor: appColors.white }}>
      <HeaderCus
        title="Search "
        type="back-title-icon"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />
      <View style={{ padding: 20 }}>
        <InputCus
          onChange={(val) => setSearchText(val)}
          allowClear
          value={searchText}
          suffix={
            <TouchableOpacity onPress={() => searchUser(searchText)}>
              <FontAwesome name="search" size={22} color={appColors.gray} />
            </TouchableOpacity>
          }
        />
      </View>

      <Text>Gợi ý kết bạn</Text>

      <FlatList
        data={results}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => handleSelect(item)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 10,
              }}
            >
              <AvatarCus
                size={40}
                uri={getFullUrl(item.avatar)}
                style={{ marginRight: 10 }}
              />
              <TextCus text={item.username || "Ẩn danh"} />
              <View style={{ marginLeft: "auto" }}>
                <ButtonCus
                  type="primary"
                  text={item.isFollowed ? "Unfollow" : "Follow"}
                  onPress={() => handleFollow(item._id)}
                />
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={() => (
          <Text
            style={{
              textAlign: "center",
              marginTop: 20,
              color: appColors.gray,
            }}
          >
            Không có người dùng nào
          </Text>
        )}
      />
    </View>
  );
};

export default AddFriendScreens;

const styles = StyleSheet.create({});
