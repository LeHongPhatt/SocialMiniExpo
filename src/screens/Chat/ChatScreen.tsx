// import React, { useEffect, useState, useRef } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   TextInput,
//   TouchableOpacity,
//   KeyboardAvoidingView,
//   Platform,
//   StyleSheet,
//   Dimensions,
//   RefreshControl,
// } from "react-native";
// import { useRoute } from "@react-navigation/native";
// import { useSelector } from "react-redux";
// import { RootState } from "../../redux/store";
// import chatAPI from "../../apis/chatApi";
// import { AvatarCus } from "../../components";
// import { appInfo } from "../../constants/appInfors";
// import { appColors } from "../../constants/appColors";
// import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
// import { SafeAreaView } from "react-native-safe-area-context";
// import io from "socket.io-client";

// const socket = io(`${appInfo.BASE_URL}}`);

// const SCREEN_WIDTH = Dimensions.get("window").width;

// export default function ChatScreen({ navigation }: any) {
//   const route = useRoute<any>();
//   const auth = useSelector((state: RootState) => state.auth);
//   const { conversationId, chatConvert } = route.params;

//   const [messages, setMessages] = useState<any[]>([]);
//   const [text, setText] = useState("");
//   const [convId, setConvId] = useState<string | null>(conversationId || null);
//   const [otherUser, setOtherUser] = useState<any>(null);
//   const [refreshing, setRefreshing] = useState(false);
//   const flatListRef = useRef<FlatList>(null);

//   const getFullUrl = (avatar?: string) => {
//     if (!avatar)
//       return "https://dummyimage.com/100x100/cccccc/000000.png&text=No+Avatar";
//     if (avatar.startsWith("http")) return avatar;
//     return `${appInfo.BASE_URL}${avatar}`;
//   };

//   // Init conversation
//   useEffect(() => {
//     const init = async () => {
//       if (!convId && chatConvert) {
//         try {
//           const res = await chatAPI.request(
//             `/conversation/${chatConvert}`,
//             {},
//             "post"
//           );
//           setConvId(res._id);
//         } catch (err) {
//           console.log("Init conversation error:", err);
//         }
//       }
//     };
//     init();
//   }, []);

//   // Load messages + otherUser
//   const loadMessages = async () => {
//     if (!convId) return;
//     try {
//       const res = await chatAPI.request(`/message/${convId}`, {}, "get");
//       setMessages(res.messages || []);

//       const convRes = await chatAPI.request(`/conversations`, {}, "get");
//       const convsArray = Object.keys(convRes)
//         .filter((key) => !isNaN(Number(key)))
//         .map((key) => convRes[key]);

//       const conv = convsArray.find((c: any) => c._id === convId);
//       if (conv) {
//         setOtherUser({
//           username: conv.username,
//           avatar: conv.avatar,
//         });
//       }

//       await chatAPI.request(`/chat/markAsRead/${convId}`, {}, "post");
//     } catch (err) {
//       console.log("Load messages error:", err);
//     }
//   };

//   useEffect(() => {
//     loadMessages();
//   }, [convId]);

//   // Socket realtime
//   useEffect(() => {
//     if (!convId) return;

//     socket.emit("join_room", convId);

//     const handleReceiveMessage = (msg: any) => {
//       setMessages((prev) => [...prev, msg]);
//       flatListRef.current?.scrollToEnd({ animated: true });
//     };

//     socket.on("receive_message", handleReceiveMessage);

//     return () => {
//       socket.off("receive_message", handleReceiveMessage);
//     };
//   }, [convId]);

//   // Send message
//   const handleSend = async () => {
//     if (!text.trim() || !convId) return;

//     const messageData = {
//       conversationId: convId,
//       text: text.trim(),
//       senderId: auth.authData.id,
//       createdAt: new Date(),
//     };

//     socket.emit("send_message", messageData);

//     setMessages((prev) => [...prev, messageData]);
//     setText("");
//     flatListRef.current?.scrollToEnd({ animated: true });

//     try {
//       await chatAPI.request(
//         "/message",
//         { conversation: convId, text: text.trim() },
//         "post"
//       );
//     } catch (err) {
//       console.log("Send message error:", err);
//     }
//   };
//   const onRefresh = async () => {
//     setRefreshing(true);
//     await loadMessages();
//     setRefreshing(false);
//   };
//   const renderItem = ({ item }: any) => {
//     const isMe =
//       item.senderId === auth.authData.id ||
//       item.sender?._id === auth.authData.id;
//     return (
//       <View
//         style={[
//           styles.messageContainer,
//           isMe
//             ? { justifyContent: "flex-end" }
//             : { justifyContent: "flex-start" },
//         ]}
//       >
//         <View
//           style={[
//             styles.messageBubble,
//             isMe ? styles.myMessage : styles.otherMessage,
//             { maxWidth: SCREEN_WIDTH * 0.75 },
//           ]}
//         >
//           <Text style={{ color: isMe ? "white" : "black", fontSize: 16 }}>
//             {item.text}
//           </Text>
//         </View>
//       </View>
//     );
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity
//           onPress={() => navigation.goBack()}
//           style={{ padding: 5 }}
//         >
//           <FontAwesome name="angle-left" size={28} color="black" />
//         </TouchableOpacity>
//         {otherUser && (
//           <View style={styles.headerUser}>
//             <AvatarCus
//               style={{ marginRight: 12 }}
//               size={40}
//               uri={getFullUrl(otherUser.avatar)}
//             />
//             <Text style={styles.headerName} numberOfLines={1}>
//               {otherUser.username}
//             </Text>
//           </View>
//         )}
//         <TouchableOpacity style={{ padding: 5 }}>
//           <MaterialIcons name="call" size={24} color={appColors.primary} />
//         </TouchableOpacity>
//       </View>

//       {/* Messages */}
//       <KeyboardAvoidingView
//         style={{ flex: 1 }}
//         behavior={Platform.OS === "ios" ? "padding" : undefined}
//         keyboardVerticalOffset={90}
//       >
//         <FlatList
//           ref={flatListRef}
//           data={messages}
//           keyExtractor={(item) => item._id || Math.random().toString()}
//           renderItem={renderItem}
//           contentContainerStyle={{ padding: 10, paddingBottom: 20 }}
//           refreshControl={
//             <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//           }
//         />

//         {/* Input */}
//         <View style={styles.inputContainer}>
//           <TextInput
//             value={text}
//             onChangeText={setText}
//             placeholder="Type a message..."
//             style={styles.input}
//             multiline
//           />
//           <TouchableOpacity onPress={handleSend} style={styles.sendBtn}>
//             <Text style={{ color: "white", fontWeight: "600" }}>Send</Text>
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   header: {
//     height: 60,
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 10,
//     borderBottomWidth: 0.5,
//     borderColor: "#ccc",
//     backgroundColor: "#fff",
//   },
//   headerUser: {
//     flexDirection: "row",
//     alignItems: "center",
//     flex: 1,
//     marginLeft: 10,
//   },
//   headerName: {
//     fontSize: 17,
//     fontWeight: "600",
//     flexShrink: 1,
//   },
//   inputContainer: {
//     flexDirection: "row",
//     padding: 10,
//     borderTopWidth: 0.5,
//     borderColor: "#ccc",
//     backgroundColor: "#fff",
//   },
//   input: {
//     flex: 1,
//     borderRadius: 25,
//     borderWidth: 0.5,
//     borderColor: "#ccc",
//     paddingHorizontal: 15,
//     paddingVertical: Platform.OS === "ios" ? 10 : 5,
//     backgroundColor: "#f5f5f5",
//     maxHeight: 100,
//   },
//   sendBtn: {
//     backgroundColor: appColors.primary,
//     borderRadius: 25,
//     paddingHorizontal: 18,
//     justifyContent: "center",
//     alignItems: "center",
//     marginLeft: 8,
//     height: 45,
//   },
//   messageContainer: {
//     flexDirection: "row",
//     marginVertical: 4,
//     alignItems: "flex-end",
//   },
//   messageBubble: {
//     padding: 12,
//     borderRadius: 20,
//   },
//   myMessage: {
//     backgroundColor: "#0084ff",
//     color: "white",
//     alignSelf: "flex-end",
//     borderTopRightRadius: 0,
//   },
//   otherMessage: {
//     backgroundColor: "#e5e5ea",
//     color: "black",
//     alignSelf: "flex-start",
//     borderTopLeftRadius: 0,
//   },
// });

import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  RefreshControl,
  Dimensions,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import chatAPI from "../../apis/chatApi";
import { AvatarCus } from "../../components";
import { appInfo } from "../../constants/appInfors";
import { appColors } from "../../constants/appColors";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import io from "socket.io-client";

const socket = io(`${appInfo.BASE_URL}`);

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function ChatScreen({ navigation }: any) {
  const route = useRoute<any>();
  const auth = useSelector((state: RootState) => state.auth);
  const { conversationId, chatConvert } = route.params;

  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [convId, setConvId] = useState<string | null>(conversationId || null);
  const [otherUser, setOtherUser] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const getFullUrl = (avatar?: string) => {
    if (!avatar)
      return "https://dummyimage.com/100x100/cccccc/000000.png&text=No+Avatar";
    if (avatar.startsWith("http")) return avatar;
    return `${appInfo.BASE_URL}${avatar}`;
  };

  // Init conversation
  useEffect(() => {
    const init = async () => {
      if (!convId && chatConvert) {
        try {
          const res = await chatAPI.request(
            `/conversation/${chatConvert}`,
            {},
            "post"
          );
          setConvId(res._id);
        } catch (err) {
          console.log("Init conversation error:", err);
        }
      }
    };
    init();
  }, []);

  // Load messages + otherUser
  const loadMessages = async () => {
    if (!convId) return;
    try {
      const res = await chatAPI.request(`/message/${convId}`, {}, "get");
      setMessages(res.messages || []);

      const convRes = await chatAPI.request(`/conversations`, {}, "get");
      const convsArray = Object.keys(convRes)
        .filter((key) => !isNaN(Number(key)))
        .map((key) => convRes[key]);

      const conv = convsArray.find((c: any) => c._id === convId);
      if (conv) {
        setOtherUser({
          username: conv.username,
          avatar: conv.avatar,
        });
      }

      await chatAPI.request(`/chat/markAsRead/${convId}`, {}, "post");
    } catch (err) {
      console.log("Load messages error:", err);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [convId]);

  // Realtime socket
  useEffect(() => {
    if (!convId) return;

    socket.emit("join_room", convId);

    const handleReceiveMessage = (msg: any) => {
      setMessages((prev) => [...prev, msg]);
      flatListRef.current?.scrollToEnd({ animated: true });
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [convId]);

  const handleSend = async () => {
    if (!text.trim() || !convId) return;

    const messageData = {
      conversationId: convId,
      text: text.trim(),
      senderId: auth.authData.id,
      createdAt: new Date(),
    };

    socket.emit("send_message", messageData);
    setMessages((prev) => [...prev, messageData]);
    setText("");
    flatListRef.current?.scrollToEnd({ animated: true });

    try {
      await chatAPI.request(
        "/message",
        { conversation: convId, text: text.trim() },
        "post"
      );
    } catch (err) {
      console.log("Send message error:", err);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMessages();
    setRefreshing(false);
  };

  const renderItem = ({ item }: any) => {
    const isMe =
      item.senderId === auth.authData.id ||
      item.sender?._id === auth.authData.id;
    return (
      <View
        style={[
          styles.messageContainer,
          isMe
            ? { justifyContent: "flex-end" }
            : { justifyContent: "flex-start" },
        ]}
      >
        {!isMe && (
          <AvatarCus
            style={{ marginRight: 6 }}
            size={30}
            uri={getFullUrl(item.sender?.avatar)}
          />
        )}
        <View
          style={[
            styles.messageBubble,
            isMe ? styles.myMessage : styles.otherMessage,
            { maxWidth: SCREEN_WIDTH * 0.75 },
          ]}
        >
          <Text style={{ color: isMe ? "white" : "black", fontSize: 16 }}>
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ padding: 5 }}
        >
          <FontAwesome name="angle-left" size={28} color="black" />
        </TouchableOpacity>
        {otherUser && (
          <View style={styles.headerUser}>
            <AvatarCus
              style={{ marginRight: 12 }}
              size={40}
              uri={getFullUrl(otherUser.avatar)}
            />
            <Text style={styles.headerName} numberOfLines={1}>
              {otherUser.username}
            </Text>
          </View>
        )}
        <TouchableOpacity style={{ padding: 5 }}>
          <MaterialIcons name="call" size={24} color={appColors.primary} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item._id || Math.random().toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 10, paddingBottom: 20 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          alwaysBounceVertical={true}
        />

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Type a message..."
            style={styles.input}
            multiline
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendBtn}>
            <Text style={{ color: "white", fontWeight: "600" }}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    borderBottomWidth: 0.5,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  headerUser: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: 10,
  },
  headerName: {
    fontSize: 17,
    fontWeight: "600",
    flexShrink: 1,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 0.5,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    borderRadius: 25,
    borderWidth: 0.5,
    borderColor: "#ccc",
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === "ios" ? 10 : 5,
    backgroundColor: "#f5f5f5",
    maxHeight: 100,
  },
  sendBtn: {
    backgroundColor: appColors.primary,
    borderRadius: 25,
    paddingHorizontal: 18,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    height: 45,
  },
  messageContainer: {
    flexDirection: "row",
    marginVertical: 4,
    alignItems: "flex-end",
  },
  messageBubble: {
    padding: 12,
    borderRadius: 20,
  },
  myMessage: {
    backgroundColor: "#0084ff",
    color: "white",
    alignSelf: "flex-end",
    borderTopRightRadius: 0,
  },
  otherMessage: {
    backgroundColor: "#e5e5ea",
    color: "black",
    alignSelf: "flex-start",
    borderTopLeftRadius: 0,
  },
});
