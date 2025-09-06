// app/index.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function Welcome() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  // 이미 온보딩 끝났으면 바로 홈으로
  useEffect(() => {
    (async () => {
      const done = await AsyncStorage.getItem("onboarding.done");
      if (done === "1") router.replace("/(tabs)/home");
      else setChecking(false);
    })();
  }, []);

  const startWithKakao = () => {
    router.push("/auth/kakao-consent"); // 동의 화면으로 이동
  };

  if (checking) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("./(tabs)/image/logo.png")}
        style={{ width: 96, height: 96, marginBottom: 18 }}
        resizeMode="contain"
      />

      {/* 슬로건 */}
      <Text
      style={{
        fontSize: 20,
        fontWeight: "600",
        color: "#374151",
        textAlign: "center",
        lineHeight: 32,   // 👈 줄 간격 늘리기
        marginBottom: 28, // 👈 아래 버튼과도 여백 추가
        }}
>
  돌봄은 쉽게{"\n"}정보는 쉽게
</Text>


      <Pressable onPress={startWithKakao} style={styles.kakaoBtn}>
        <Text style={styles.kakaoText}>카카오로 시작하기</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc", alignItems: "center", justifyContent: "center", padding: 24 },
  title: { fontSize: 24, fontWeight: "800", marginBottom: 6 },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
    lineHeight: 32, // 줄 간격
    marginBottom: 28,
  },
  kakaoBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEE500",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  kakaoText: { fontSize: 16, fontWeight: "700", color: "#111827" },
});
