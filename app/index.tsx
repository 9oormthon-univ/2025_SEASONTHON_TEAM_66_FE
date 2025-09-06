// app/index.tsx  (스플래시)
import { router, type Href } from "expo-router"; // ✅ 전역 router + Href
import React, { useEffect } from "react";
import { Text, View } from "react-native";

export default function SplashIndex() {
  useEffect(() => {
    const t = setTimeout(() => {
      router.replace("/welcome" as Href);  // ✅ 밑줄 사라짐
    }, 1200);
    return () => clearTimeout(t);
  }, []);

  return <View><Text>Splash</Text></View>;
}
