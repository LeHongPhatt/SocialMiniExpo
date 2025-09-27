// // import { Image, Platform, StyleSheet, Text, View } from "react-native";
// // import React from "react";
// // import ContainerCus from "./ContainerCus";
// // import AvatarCus from "./AvatarCus";
// // import SectionCus from "./SectionCus";
// // import { ActionCus, TextCus } from ".";
// // import { globalStyles } from "../styles/globalStyles";
// // import { Images } from "../assets/images";
// // import { appInfo } from "../constants/appInfors";
// // import { fontFamily } from "../constants/fontFamily";

// // interface PostActionsProps {
// //   likes: number | string;
// //   comments: number | string;
// //   uri: any;
// //   name: string;
// //   content: string;
// //   image?: string | null; // đúng chuẩn TS, có thể undefined hoặc null
// // }
// // const CardFeedCus: React.FC<PostActionsProps> = ({
// //   comments,
// //   likes,
// //   uri,
// //   name,
// //   content,
// //   image,
// // }) => {
// //   return (
// //     <View
// //       style={[
// //         globalStyles.shadow,
// //         {
// //           paddingHorizontal: 20,
// //           marginHorizontal: 20,
// //           backgroundColor: "white",
// //           borderRadius: 10,

// //           shadowOpacity: 0.6,
// //           marginTop: 20,
// //         },
// //       ]}
// //     >
// //       <SectionCus
// //         styles={[
// //           globalStyles.row,
// //           { paddingHorizontal: 0, marginTop: 10, paddingBottom: 0 },
// //         ]}
// //       >
// //         <AvatarCus uri={uri} />
// //         <SectionCus>
// //           <TextCus text={name} title />
// //           <TextCus text="time" size={13} />
// //         </SectionCus>
// //       </SectionCus>
// //       <TextCus
// //         size={14}
// //         font={fontFamily.raleway.regular}
// //         styles={{ flex: 1 }}
// //         text={content}
// //       />
// //       <View>
// //         {image && image !== "null" && (
// //           <Image
// //             source={{
// //               uri: image ?? "https://via.placeholder.com/400x200?text=No+Image",
// //             }}
// //             style={{
// //               width: appInfo.sizes.WIDTH,
// //               height: appInfo.sizes.HEIGHT / 4,
// //               alignSelf: "center",
// //             }}
// //             resizeMode="contain"
// //           />
// //         )}
// //       </View>
// //       <ActionCus likeCount={likes} commentCount={comments} />
// //     </View>
// //   );
// // };

// // export default CardFeedCus;

// // const styles = StyleSheet.create({});

// import { Image, StyleSheet, View } from "react-native";
// import React from "react";
// import SectionCus from "./SectionCus";
// import AvatarCus from "./AvatarCus";
// import { TextCus, ActionCus } from ".";
// import { globalStyles } from "../styles/globalStyles";
// import { appInfo } from "../constants/appInfors";
// import { fontFamily } from "../constants/fontFamily";

// interface CardFeedCusProps {
//   likes: number | string;
//   comments: number | string;
//   uri?: string | null; // avatar
//   name?: string | null; // tên tác giả
//   content: string;
//   image?: string | null; // hình bài post
//   isMe?: boolean; // optional: để xử lý nếu post của chính mình
//   time?: number;
// }

// const CardFeedCus: React.FC<CardFeedCusProps> = ({
//   comments,
//   likes,
//   uri,
//   name,
//   content,
//   image,
//   time,
// }) => {
//   // Convert URL avatar
//   const avatarUri =
//     uri && uri !== "null"
//       ? uri.startsWith("http")
//         ? uri
//         : `${appInfo.BASE_URL}${uri.replace(/\\/g, "/")}`
//       : "https://dummyimage.com/100x100/cccccc/000000.png&text=No+Avatar";

//   // Convert URL hình ảnh post
//   const postImage =
//     image && image !== "null"
//       ? image.startsWith("http")
//         ? image
//         : `${appInfo.BASE_URL}${image.replace(/\\/g, "/")}`
//       : null;

//   return (
//     <View
//       style={[
//         globalStyles.shadow,
//         {
//           paddingHorizontal: 20,
//           marginHorizontal: 20,
//           backgroundColor: "white",
//           borderRadius: 10,
//           shadowOpacity: 0.6,
//           marginTop: 20,
//         },
//       ]}
//     >
//       {/* Header: avatar + tên */}
//       <SectionCus
//         styles={[
//           globalStyles.row,
//           { paddingHorizontal: 0, marginTop: 10, paddingBottom: 0 },
//         ]}
//       >
//         <AvatarCus uri={avatarUri} />
//         <SectionCus>
//           <TextCus text={name || "Người dùng"} title />
//           <TextCus text={time} size={13} />
//         </SectionCus>
//       </SectionCus>

//       {/* Nội dung bài viết */}
//       <TextCus
//         size={14}
//         font={fontFamily.raleway.regular}
//         styles={{ flex: 1, marginTop: 10 }}
//         text={content}
//       />

//       {/* Hình ảnh bài viết */}
//       {postImage && (
//         <Image
//           source={{ uri: postImage }}
//           style={{
//             width: appInfo.sizes.WIDTH - 40, // paddingHorizontal 20
//             height: appInfo.sizes.HEIGHT / 4,
//             alignSelf: "center",
//             marginTop: 10,
//             borderRadius: 10,
//           }}
//           resizeMode="cover"
//         />
//       )}

//       {/* Like + Comment */}
//       <ActionCus likeCount={likes} commentCount={comments} />
//     </View>
//   );
// };

// export default CardFeedCus;

// const styles = StyleSheet.create({});

import { Image, StyleSheet, View } from "react-native";
import React from "react";
import SectionCus from "./SectionCus";
import AvatarCus from "./AvatarCus";
import { TextCus, ActionCus } from ".";
import { globalStyles } from "../styles/globalStyles";
import { appInfo } from "../constants/appInfors";
import { fontFamily } from "../constants/fontFamily";

interface CardFeedCusProps {
  likes: number | string;
  comments: number | string;
  uri?: string | null; // avatar
  name?: string | null; // tên tác giả
  content: string;
  image?: string | null; // hình bài post
  isMe?: boolean; // optional: để xử lý nếu post của chính mình
  time?: string | number; // ISO string hoặc timestamp
}

const formatTime = (time?: string | number) => {
  if (!time) return "";
  try {
    const date =
      typeof time === "number" ? new Date(time) : new Date(time.toString());
    return date.toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
    });
  } catch (err) {
    return "";
  }
};

const CardFeedCus: React.FC<CardFeedCusProps> = ({
  comments,
  likes,
  uri,
  name,
  content,
  image,
  time,
}) => {
  // Convert URL avatar
  const avatarUri =
    uri && uri !== "null"
      ? uri.startsWith("http")
        ? uri
        : `${appInfo.BASE_URL}${uri.replace(/\\/g, "/")}`
      : "https://dummyimage.com/100x100/cccccc/000000.png&text=No+Avatar";

  // Convert URL hình ảnh post
  const postImage =
    image && image !== "null"
      ? image.startsWith("http")
        ? image
        : `${appInfo.BASE_URL}${image.replace(/\\/g, "/")}`
      : null;

  return (
    <View style={[globalStyles.shadow, styles.card]}>
      {/* Header: avatar + tên */}
      <SectionCus styles={[globalStyles.row, styles.header]}>
        <AvatarCus uri={avatarUri} />
        <SectionCus>
          <TextCus text={name || "Người dùng"} title />
          {time && <TextCus text={formatTime(time)} size={13} />}
        </SectionCus>
      </SectionCus>

      {/* Nội dung bài viết */}
      {!!content && (
        <TextCus
          size={14}
          font={fontFamily.raleway.regular}
          styles={styles.content}
          text={content}
        />
      )}

      {/* Hình ảnh bài viết */}
      {postImage && (
        <Image source={{ uri: postImage }} style={styles.postImage} />
      )}

      {/* Like + Comment */}
      <ActionCus likeCount={likes} commentCount={comments} />
    </View>
  );
};

export default CardFeedCus;

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 20,
    marginHorizontal: 20,
    backgroundColor: "white",
    borderRadius: 10,
    shadowOpacity: 0.6,
    marginTop: 20,
  },
  header: {
    paddingHorizontal: 0,
    marginTop: 10,
    paddingBottom: 0,
  },
  content: {
    flex: 1,
    marginTop: 10,
  },
  postImage: {
    width: appInfo.sizes.WIDTH - 40,
    height: appInfo.sizes.HEIGHT / 4,
    alignSelf: "center",
    marginTop: 10,
    borderRadius: 10,
  },
});
