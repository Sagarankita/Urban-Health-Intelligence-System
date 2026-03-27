import * as Linking from "expo-linking";
import { Tabs, useRouter } from "expo-router";
import { useEffect } from "react";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="dashboard" />
      <Tabs.Screen name="hospital" />
      <Tabs.Screen name="municipal" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

const router = useRouter();

useEffect(() => {
  const sub = Linking.addEventListener("url", ({ url }) => {
    if (url.includes("login")) {
      router.replace("/login");
    }
  });

  return () => sub.remove();
}, []);
