import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BalanceLineChart } from "../components/charts/BalanceLineChart";
import { CHART_CONFIG } from "../constants/chartConfig";
import { mockBalanceData } from "../data/mockBalanceData";

export default function Home() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View>
            <BalanceLineChart data={mockBalanceData} config={CHART_CONFIG} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A22",
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 10,
  },
});
