import React from "react";
import { SafeAreaView } from "react-native";
import AdvisorScreen from "./src/AdvisorScreen";

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AdvisorScreen />
    </SafeAreaView>
  );
}

