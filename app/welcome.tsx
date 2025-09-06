// app/welcome.tsx
import { useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function Welcome() {
  const router = useRouter();

  const startWithKakao = () => {
    console.log("[welcome] go /auth/kakao-consent");
    router.push("/auth/kakao-consent");
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("./(tabs)/image/logo.png")}
        style={{ width: 96, height: 96, marginBottom: 18 }}
        resizeMode="contain"
      />
      <Text style={styles.slogan}>
        돌봄은 쉽게{"\n"}정보는 쉽게
      </Text>
      <Pressable onPress={startWithKakao} style={styles.kakaoBtn}>
        <Text style={styles.kakaoText}>카카오로 시작하기</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: "#f8fafc",
    alignItems: "center", justifyContent: "center", padding: 24,
  },
  slogan: {
    fontSize: 20, fontWeight: "600", color: "#374151",
    textAlign: "center", lineHeight: 32, marginBottom: 28,
  },
  kakaoBtn: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#FEE500", borderRadius: 12,
    paddingVertical: 14, paddingHorizontal: 24,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 3, elevation: 2,
  },
  kakaoText: { fontSize: 16, fontWeight: "700", color: "#111827" },
});
