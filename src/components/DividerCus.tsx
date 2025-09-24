import React from "react";
import { View, StyleSheet } from "react-native";
import { appColors } from "../constants/appColors";

interface DividerProps {
  height?: number;
  color?: string;
  marginHorizontal?: number;
}

const DividerCus: React.FC<DividerProps> = ({
  height = 20,
  color = appColors.gray,
  marginHorizontal = 8,
}) => {
  return <View style={[styles.divider, { height, backgroundColor: color, marginHorizontal }]} />;
};

const styles = StyleSheet.create({
  divider: {
    width: 1,
    borderRadius: 1,
  },
});

export default DividerCus;
