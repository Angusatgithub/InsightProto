import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface ChartHeaderProps {
  value: string;
  label: string;
}

export const ChartHeader: React.FC<ChartHeaderProps> = ({ value, label }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 20,
  },
  value: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FF7A64",
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: "#ffffff",
    opacity: 1,
  },
});
