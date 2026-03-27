import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#0A1F44",
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="hospital"
        options={{
          title: "Hospital",
          tabBarIcon: ({ color }) => (
            <Ionicons name="medkit-outline" size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="municipal"
        options={{
          title: "Municipal",
          tabBarIcon: ({ color }) => (
            <Ionicons name="business-outline" size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
