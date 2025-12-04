import { Stack } from "expo-router";
import React from "react";

const RootLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerTitle: "Home" }} />

      <Stack.Screen name="register" options={{ headerTitle: "Register" }} />

      <Stack.Screen name="residents" options={{ headerTitle: "Residents" }} />

      <Stack.Screen name="dashboard" options={{ headerTitle: "Dashboard" }} />
    </Stack>
  );
};

export default RootLayout;
