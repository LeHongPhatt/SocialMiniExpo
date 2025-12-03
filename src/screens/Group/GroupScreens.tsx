import {
  Button,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { use, useEffect, useState } from "react";
import authenticationAPI from "../../apis/authApi";
import { appInfo } from "../../constants/appInfors";
import { ButtonCus, SpaceCus } from "../../components";
import HeaderCus from "../../components/HeaderCus";

const GroupScreens = ({ navigation }: any) => {
  const [users, setUsers] = useState([]);
  const getFullUrl = (path?: string | null) => {
    if (!path) return undefined;
    if (path.startsWith("http")) return path;
    return `${appInfo.BASE_URL}${path.replace(/\\/g, "/")}`;
  };

  console.log("==users==", users);
  const getAllGroups = async () => {
    try {
      const res = await authenticationAPI.HandleAuthentication(
        "/get-all-users",
        "get"
      );
      console.log("==res all groups==", res);

      const usersArray = Object.keys(res)
        .filter((key) => !isNaN(Number(key))) // bỏ key "status"
        .map((key) => res[key]);

      setUsers(usersArray);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllGroups();
  }, []);

  const handleFollow = async (userId: string) => {
    try {
      const res = await authenticationAPI.HandleAuthentication(
        `/${userId}/follow`,
        {},
        "post"
      );
      console.log("==follow/unfollow response==", res);

      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, isFollowed: res.isFollowed } : u
        )
      );
    } catch (error) {
      console.log("==error follow/unfollow==", error);
    }
  };
  return (
    <View style={styles.container}>
      <HeaderCus
        title="Friend"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />
      <SpaceCus height={30} />
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() =>
              navigation.navigate("ChatScreen", { chatConvert: item._id })
            }
          >
            <Image
              source={{ uri: getFullUrl(item.avatar) }}
              style={styles.avatar}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.username}</Text>
              <ButtonCus
                onPress={() => handleFollow(item._id)}
                textStyles={{}}
                styles={{
                  width: "auto",
                  paddingVertical: 3,
                  paddingHorizontal: 10,
                  flex: 1,
                  alignSelf: "flex-start",
                }}
                type="primary"
                color={item.isFollowed ? "green" : "gray"}
                text={item.isFollowed ? " Đã Follow" : "Chưa follow"}
              />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default GroupScreens;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  item: {
    flexDirection: "row",
    alignItems: "center",

    borderColor: "#eee",
    marginHorizontal: 20,
    paddingTop: 20,
    borderBottomWidth: 1,
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  name: { fontSize: 16, fontWeight: "600" },
});
