import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import Icon from "react-native-vector-icons/FontAwesome";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const activeTintColor = Colors[colorScheme || "light"].tint; // Ensure this is valid
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeTintColor,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          android: { backgroundColor: "white" }, // Example Android styling
          default: {}, // Default platform styling
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }: { color: string }) => {
            return <Icon size={28} name="home" color={color} />;
          },
        }}
      />

      <Tabs.Screen
        name="tasks"
        options={{
          title: "Tasks",
          tabBarIcon: ({ color }: { color: string }) => {
            return <Icon size={28} name="list" color={color} />;
          },
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: "Reminders",
          tabBarIcon: ({ color }: { color: string }) => {
            return <Icon size={28} name="calendar-o" color={color} />;
          },
        }}
      />
      <Tabs.Screen
        name="timer"
        options={{
          title: "Timer",
          tabBarIcon: ({ color }: { color: string }) => {
            return <Icon size={28} name="clock-o" color={color} />;
          },
        }}
      />
    </Tabs>
  );
}
