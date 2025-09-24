// import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import React from "react";
// import { appInfo } from "../constants/appInfors";

// const AvatarCus = () => {
//   return (
//     <View
//       style={{
//         alignSelf: "center",
//         justifyContent: "center",
//       }}
//     >
//       <TouchableOpacity
//         style={{
//           width: appInfo.sizes.WIDTH /3,
//           height: appInfo.sizes.HEIGHT/6.23,
//           borderRadius: "100%",
//           backgroundColor: "yellow",
//         }}
//       ></TouchableOpacity>
//     </View>
//   );
// };

// export default AvatarCus;

// const styles = StyleSheet.create({});
import React from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  ImageStyle,
  TextStyle,
  ActivityIndicator,
} from "react-native";

// Avatar.tsx
// A reusable, customizable Avatar component for React Native + TypeScript (works well with Expo).
// Features:
// - image URI or initials fallback
// - size, border, background customization
// - optional small "edit" button overlay (used to trigger image picker in parent)
// - optional badge (online dot, verified icon, etc.)
// - accessible and typed

export type AvatarProps = {
  size?: number; // diameter in pixels
  uri?: string | null; // image url
  initials?: string; // shown when no image
  backgroundColor?: string; // fallback background
  borderColor?: string;
  borderWidth?: number;
  style?: ViewStyle;
  imageStyle?: ImageStyle;
  textStyle?: TextStyle;
  showEdit?: boolean; // show small edit button
  onPress?: () => void; // press avatar
  onEdit?: () => void; // press edit button
  badge?: React.ReactNode; // custom badge component positioned bottom-right
  loading?: boolean; // show loading spinner while image loads
  accessibilityLabel?: string;
};

export default function AvatarCus({
  size = 64,
  uri = null,
  initials = "",
  backgroundColor = "#DDDFE6",
  borderColor = "transparent",
  borderWidth = 0,
  style,
  imageStyle,
  textStyle,
  showEdit = false,
  onPress,
  onEdit,
  badge,
  loading = false,
  accessibilityLabel = "User avatar",
}: AvatarProps) {
  const radius = size / 2;
  const editSize = Math.max(18, Math.round(size * 0.28));

  const Container: any = onPress ? TouchableOpacity : View;

  return (
    <Container
      activeOpacity={0.8}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      style={[
        {
          width: size,
          height: size,
          borderRadius: radius,
          alignItems: "center",
          justifyContent: "center",
          overflow: "visible",
        },
        style,
      ]}
    >
      <View
        style={[
          styles.avatarBase,
          {
            width: size,
            height: size,
            borderRadius: radius,
            backgroundColor,
            borderColor,
            borderWidth,
            alignItems: "center",
            justifyContent: "center",
            
          },
        ]}
      >
        {loading ? (
          <ActivityIndicator />
        ) : uri ? (
          <Image
            source={{ uri }}
            style={[
              {
                width: size,
                height: size,
                borderRadius: radius,
              },
              imageStyle,
            ]}
            resizeMode="cover"
          />
        ) : (
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={[
              {
                fontSize: Math.max(12, Math.round(size * 0.36)),
                color: "#333",
                fontWeight: "600",
              },
              textStyle,
            ]}
          >
            {initials || ""}
          </Text>
        )}
      </View>

      {/* Badge slot (bottom-right) */}
      {badge ? (
        <View
          style={{
            position: "absolute",
            right: -2,
            bottom: -2,
            width: Math.round(size * 0.36),
            height: Math.round(size * 0.36),
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {badge}
        </View>
      ) : null}

      {/* Edit button overlay */}
      {showEdit ? (
        <TouchableOpacity
          onPress={onEdit}
          activeOpacity={0.8}
          style={{
            position: "absolute",
            right: -Math.round(editSize * 0.25),
            bottom: -Math.round(editSize * 0.25),
            width: editSize,
            height: editSize,
            borderRadius: editSize / 2,
            backgroundColor: "#fff",
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: "#EEE",
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          {/* simple plus icon - parent can replace by passing a custom "edit" element via onEdit-handling UI */}
          <Text
            style={{
              fontSize: Math.max(10, Math.round(editSize * 0.45)),
              fontWeight: "700",
            }}
          >
            +
          </Text>
        </TouchableOpacity>
      ) : null}
    </Container>
  );
}

const styles = StyleSheet.create({
  avatarBase: {
    overflow: "hidden",
  },
});
