// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { Image } from "react-native";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="home"
        options={{
          title: "홈",
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require("./image/home 1.png")}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="facilities"
        options={{
          title: "기관정보",
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require("./image/building 1.png")}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "검색",
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require("./image/loupe 1.png")}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="my"
        options={{
          title: "내 정보",
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require("./image/user 1.png")}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
