import { View, Text, StyleProp, TextStyle } from "react-native";
import React from "react";

interface Props {
  width?: number;
  height?: number;
  styles?: StyleProp<TextStyle>;
}

const SpaceCus = (props: Props) => {
  const { width, height, styles } = props;

  return <View style={[styles, { width, height }]} />;
};

export default SpaceCus;
