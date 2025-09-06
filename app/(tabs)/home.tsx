import { useRouter } from "expo-router";
import React from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";

/** 공통 카드 컴포넌트 */
function Card({
  label,
  color,
  onPress,
  height = 88,
}: {
  label: string;
  color: string;
  onPress: () => void;
  height?: number;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        { backgroundColor: color, height },
      ]}
    >
      <Text style={styles.cardText}>{label}</Text>
    </Pressable>
  );
}

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      

      {/* 상단 그리드 */}
      <View style={{ flexDirection: "row", gap: 12 }}>
        {/* 좌측 큰 카드 */}
        <View style={{ flex: 1 }}>
          <Card
          label="등급받기"
          color="#0ea5e9"
          height={188}
          onPress={() => router.push("/grade")}
          />

        </View>
        {/* 우측 두 카드 */}
        <View style={{ flex: 1, gap: 12 }}>
          <Card label="주·야간보호" color="#22c55e" onPress={() => router.push("/search")} />
          <Card label="요양원/요양병원" color="#a78bfa" onPress={() => router.push("/search")} />
        </View>
      </View>

      {/* 두 번째 줄 */}
      <View style={{ flexDirection: "row", gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Card
            label="계산기"
            color="#f59e0b"
            onPress={() => router.push("/calculator/1")}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Card
            label="보험공단"
            color="#ef4444"
            onPress={() => Linking.openURL("https://www.nhis.or.kr")}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 16,
    gap: 12,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#e0f2fe",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  card: {
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardText: {
    color: "white",
    fontSize: 18,
    fontWeight: "800",
  },
});
