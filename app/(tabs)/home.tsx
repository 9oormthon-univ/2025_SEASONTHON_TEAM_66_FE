// app/(tabs)/home.tsx
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Linking,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Env } from "../src/config/env";

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
    <Pressable onPress={onPress} style={[styles.card, { backgroundColor: color, height }]}>
      <Text style={styles.cardText}>{label}</Text>
    </Pressable>
  );
}

type Facility = {
  id: string;
  name: string;
  feeRange: string;
  rating: number;
  address: string;
};

export default function Home() {
  const router = useRouter();

  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch(`${Env.API_URL}/facilities`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      // 백엔드 구조에 따라 필요 시 data.items로 변경
      setFacilities(Array.isArray(data) ? data : data.items ?? []);
    } catch (err: any) {
      console.error("API error:", err);
      setError("데이터를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>불러오는 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 상단 카드들 */}
      <View style={{ flexDirection: "row", gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Card
            label="등급받기"
            color="#0ea5e9"
            height={188}
            onPress={() => router.push("/grade")}
          />
        </View>

        <View style={{ flex: 1, gap: 12 }}>
          <Card label="주·야간보호" color="#22c55e" onPress={() => router.push("/search")} />
          <Card label="요양원/요양병원" color="#a78bfa" onPress={() => router.push("/search")} />
        </View>
      </View>

      {/* 두 번째 줄 */}
      <View style={{ flexDirection: "row", gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Card label="계산기" color="#f59e0b" onPress={() => router.push("/calculator/1")} />
        </View>
        <View style={{ flex: 1 }}>
          <Card
            label="보험공단"
            color="#ef4444"
            onPress={() => Linking.openURL("https://www.nhis.or.kr")}
          />
        </View>
      </View>

      {/* 서버에서 불러온 시설 리스트 */}
      <FlatList
        data={facilities}
        keyExtractor={(item) => String(item.id)}
        style={{ marginTop: 12 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={{ paddingVertical: 24 }}>
            <Text style={{ textAlign: "center", color: "#6b7280" }}>
              표시할 시설이 없어요.
            </Text>
          </View>
        }
        ListHeaderComponent={
          error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
              <Pressable onPress={load} style={styles.retryBtn}>
                <Text style={{ color: "white", fontWeight: "700" }}>다시 시도</Text>
              </Pressable>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <Text style={styles.itemTitle}>{item.name}</Text>
            <Text style={styles.itemLine}>월 예상부담 {item.feeRange}</Text>
            <Text style={styles.itemLine}>{item.address}</Text>
            <Text style={[styles.itemLine, { color: "#ef4444" }]}>★ {item.rating}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc", padding: 16, gap: 12 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
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
  cardText: { color: "white", fontSize: 18, fontWeight: "800" },

  itemCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 10,
  },
  itemTitle: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  itemLine: { color: "#374151", marginTop: 2 },

  errorBox: {
    backgroundColor: "#fef2f2",
    borderColor: "#fecaca",
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  errorText: { color: "#b91c1c", marginBottom: 8, textAlign: "center" },
  retryBtn: {
    alignSelf: "center",
    backgroundColor: "#ef4444",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
});
