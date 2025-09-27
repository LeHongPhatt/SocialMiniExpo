import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import { ArrowLeft } from "lucide-react-native";

type HeaderIcon = {
  icon: React.ReactNode;
  onPress?: () => void;
};

interface HeaderProps {
  // Kiểu header
  type?:
    | "logo-with-icons"
    | "back-with-title"
    | "back-only"
    | "back-title-icon";

  // Common props
  backgroundColor?: string;
  textColor?: string;
  height?: number;
  showShadow?: boolean;
  paddingBottom?: number;

  // Back button
  showBackButton?: boolean;
  onBackPress?: () => void;

  // Title / content ở giữa
  title?: string;
  centerContent?: React.ReactNode;

  // Logo + icons
  leftLogo?: React.ReactNode;
  icons?: HeaderIcon[];
}

const HeaderCus: React.FC<HeaderProps> = ({
  type = "logo-with-icons",
  backgroundColor = "#fff",
  textColor = "#000",
  height = 60,
  paddingBottom = -20,
  showShadow = true,
  showBackButton = false,
  onBackPress,
  title,
  centerContent,
  leftLogo,
  icons = [],
}) => {
  // Hiển thị icons nếu type là logo-with-icons hoặc back-title-icon
  const showIcons = type === "logo-with-icons" || type === "back-title-icon";

  return (
    <SafeAreaView
      style={{
        height,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
      }}
    >
      <View
        style={{
          height,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 16,
          backgroundColor,
          flex: 1,
        }}
      >
        {/* LEFT SIDE */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {showBackButton && (
            <TouchableOpacity onPress={onBackPress} style={{ marginRight: 12 }}>
              <FontAwesome name="arrow-left" size={24} color={textColor} />
            </TouchableOpacity>
          )}
          {type === "logo-with-icons" && leftLogo}
        </View>

        {/* CENTER */}
        <View style={{ flex: 1, alignItems: "center" }}>
          {centerContent
            ? centerContent
            : title && (
                <Text
                  style={{ fontSize: 18, fontWeight: "600", color: textColor }}
                >
                  {title}
                </Text>
              )}
        </View>

        {/* RIGHT SIDE */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {showIcons &&
            icons.slice(0, 3).map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={item.onPress}
                style={{ marginLeft: 16 }}
              >
                {item.icon}
              </TouchableOpacity>
            ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HeaderCus;
