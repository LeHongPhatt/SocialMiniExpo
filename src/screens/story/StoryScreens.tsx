import React, { useState } from "react";
import { View, Button, Image, Alert, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import storiesApi from "../../apis/storyApi";

const StoryScreens = ({
  onUploadSuccess,
}: {
  onUploadSuccess?: () => void;
}) => {
  const [selected, setSelected] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Chọn ảnh/video từ thư viện
  const pickMedia = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelected(result.assets[0]);
    }
  };

  // Upload story lên server
  const uploadStory = async () => {
    if (!selected) {
      Alert.alert("Vui lòng chọn ảnh hoặc video trước!");
      return;
    }

    const formData = new FormData();
    formData.append("media", {
      uri: selected.uri,
      name: selected.fileName || "story.jpg",
      type: selected.type === "image" ? "image/jpeg" : "video/mp4",
    } as any);

    setLoading(true);
    try {
      console.log("Trước await");
      const res = await Promise.race([
        storiesApi.request("/new-stories", formData, "post"),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Request timeout")), 15000)
        ),
      ]);
      console.log("Sau await");
      console.log("====Upload response 1:========", res);
      if (res) {
        Alert.alert("Đăng story thành công!");
        setSelected(null);
        onUploadSuccess && onUploadSuccess();
      } else {
        Alert.alert("Đăng story thất bại!");
      }
    } catch (err) {
      console.log("Upload failed:", err);
      Alert.alert("Đăng story thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <Button title="Chọn ảnh/video" onPress={pickMedia} />
      {selected && (
        <Image
          source={{ uri: selected.uri }}
          style={{ width: 200, height: 200, marginVertical: 10 }}
        />
      )}
      {loading ? (
        <ActivityIndicator size="large" color="#FF8501" />
      ) : (
        selected && <Button title="Đăng Story" onPress={uploadStory} />
      )}
    </View>
  );
};

export default StoryScreens;
