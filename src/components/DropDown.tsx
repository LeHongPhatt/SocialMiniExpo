import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

type VisibilityOption = "Public" | "Private" | "Only me";

interface DropDownProps {
  selected?: VisibilityOption;
  onSelect?: (value: VisibilityOption) => void;
}

const DropDown: React.FC<DropDownProps> = ({
  selected = "Public",
  onSelect,
}) => {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<VisibilityOption>(selected);
  const options: VisibilityOption[] = ["Public", "Private", "Only me"];

  const handleSelect = (value: VisibilityOption) => {
    setCurrent(value);
    onSelect && onSelect(value);
    setOpen(false);
  };

  return (
    <View style={{ width: 160 }}>
      {/* Nút chính */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => setOpen((prev) => !prev)}
      >
        <Text style={styles.buttonText}>{current}</Text>
        <FontAwesome
          name={open ? "chevron-up" : "chevron-down"}
          size={11}
          color="#333"
        />
      </TouchableOpacity>

      {/* Drop options */}
      {open && (
        <View style={styles.dropdown}>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              style={styles.option}
              onPress={() => handleSelect(option)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    width:100
    
  },
  buttonText: { fontSize: 14, color: "#333" },
  dropdown: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginTop: 4,
    elevation: 3,
  },
  option: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  optionText: { fontSize: 14, color: "#333" },
});

export default DropDown;
