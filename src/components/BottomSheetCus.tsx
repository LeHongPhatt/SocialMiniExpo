import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Modalize } from "react-native-modalize";
import { FontAwesome } from "@expo/vector-icons";
import { appColors } from "../constants/appColors";

export type NewStatusSheetRef = {
  open: () => void;
  close: () => void;
};

type ActionItem = {
  key: string;
  iconName: keyof typeof FontAwesome.glyphMap;
  color: string;
  label: string;
  onPress: () => void;
};

interface BottomSheetCusProps {
  actions: ActionItem[];
}

const BottomSheetCus = forwardRef<NewStatusSheetRef, BottomSheetCusProps>(
  ({ actions }, ref) => {
    const modalRef = useRef<Modalize>(null);

    useImperativeHandle(ref, () => ({
      open: () => modalRef.current?.open(),
      close: () => modalRef.current?.close(),
    }));

    return (
      <Modalize
        ref={modalRef}
        adjustToContentHeight
        modalStyle={{
          padding: 16,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
      >
        <Text style={styles.sheetTitle}>Tạo bài viết mới</Text>
        <View style={styles.actions}>
          {actions.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={styles.actionButton}
              onPress={() => {
                item.onPress();
                modalRef.current?.close(); // đóng sheet sau khi bấm (tuỳ ý)
              }}
            >
              <FontAwesome
                name={item.iconName}
                size={28}
                color={item.color}
                style={{ marginRight: 10 }}
              />
              <Text>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modalize>
    );
  }
);

const styles = StyleSheet.create({
  sheetTitle: { fontSize: 18, fontWeight: "600", marginBottom: 16 },
  actions: { margin: 10 },
  actionButton: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 15,
  },
});

export default BottomSheetCus;
