// app/(tabs)/search.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

type ServiceType = "시설급여" | "재가급여";

type Facility = {
  id: string;
  name: string;
  feeRange: string;
  rating: number;
  distanceKm?: number;
  address: string;
  kind: ServiceType; // ← 시설/재가 구분
};

const MOCK: Facility[] = [
  { id: "1", name: "해피케어요양원", feeRange: "85~110만원", rating: 4.3, distanceKm: 1.2, address: "서울 중구 동호로25길 33", kind: "시설급여" },
  { id: "2", name: "든든재가센터",   feeRange: "60~80만원",  rating: 4.5, distanceKm: 2.8, address: "서울 성동구 성수이로 99", kind: "재가급여" },
  { id: "3", name: "한결요양원",     feeRange: "70~95만원",  rating: 4.1, distanceKm: 4.6, address: "서울 강동구 천호대로 11", kind: "시설급여" },
];

export default function Search() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [selectedType, setSelectedType] = useState<ServiceType | null>(null); // 온보딩/토글 값
  const [items, setItems] = useState<Facility[]>(MOCK);
  const [loading, setLoading] = useState(false);

  // 공통 필터
  const applyAll = useCallback((q: string, type: ServiceType | null) => {
    let arr = [...MOCK];
    if (type) arr = arr.filter((f) => f.kind === type);
    const t = q.trim();
    if (t) arr = arr.filter((f) => f.name.includes(t) || f.address.includes(t));
    return arr;
  }, []);

  // 화면 진입/복귀 시 온보딩에 저장된 서비스 타입 반영
  useFocusEffect(
    React.useCallback(() => {
      let alive = true;
      (async () => {
        setLoading(true);
        const saved = (await AsyncStorage.getItem("onboarding.serviceType")) as ServiceType | null;
        if (alive) {
          setSelectedType(saved ?? null);
          setItems(applyAll(query, saved ?? null));
        }
        setLoading(false);
      })();
      return () => {
        alive = false;
      };
    }, [applyAll, query])
  );

  // 검색어 변경 반영
  useEffect(() => {
    const t = setTimeout(() => {
      setItems(applyAll(query, selectedType));
    }, 200);
    return () => clearTimeout(t);
  }, [applyAll, query, selectedType]);

  // 서비스 타입 토글
  const changeMode = async (type: ServiceType) => {
    setSelectedType(type);
    await AsyncStorage.setItem("onboarding.serviceType", type);
    setItems(applyAll(query, type));
  };

  return (
    <View style={styles.container}>
      {/* 서비스 타입 토글 */}
      <View style={styles.toggle}>
        {(["재가급여", "시설급여"] as ServiceType[]).map((t) => {
          const active = selectedType === t;
          return (
            <Pressable
              key={t}
              onPress={() => changeMode(t)}
              style={[styles.toggleBtn, active && styles.toggleBtnActive]}
            >
              <Text style={[styles.toggleText, active && styles.toggleTextActive]}>{t}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* 검색 + 필터 */}
      <View style={{ flexDirection: "row", gap: 8 }}>
        <TextInput
          placeholder="시설명 / 지역 검색"
          value={query}
          onChangeText={setQuery}
          style={styles.searchBox}
        />
        <Pressable
          onPress={() => router.push("/filters")}
          style={styles.filterBtn}
        >
          <Text>필터</Text>
        </Pressable>
      </View>

      {/* 결과 리스트 */}
      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(it) => it.id}
          contentContainerStyle={{ gap: 10, paddingVertical: 10 }}
          ListEmptyComponent={<Text>검색 결과가 없습니다.</Text>}
          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                router.push({ pathname: "/facility/[id]", params: { id: String(item.id) } })
              }
              style={styles.itemCard}
            >
              <Text style={styles.itemTitle}>
                {item.name} <Text style={{ fontWeight: "400" }}>★{item.rating.toFixed(1)}</Text>
              </Text>
              <Text style={styles.itemSub}>
                월 예상부담 {item.feeRange} · {item.distanceKm ?? "—"}km
              </Text>
              <Text style={styles.itemAddr}>{item.address}</Text>

              <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
                <Pressable
                  onPress={() =>
                    router.push({ pathname: "/calculator/[id]", params: { id: String(item.id) } })
                  }
                  style={styles.calcBtn}
                >
                  <Text style={{ color: "#1d4ed8" }}>차액 계산</Text>
                </Pressable>
                <Pressable
                  onPress={() =>
                    router.push({ pathname: "/facility/[id]", params: { id: String(item.id) } })
                  }
                  style={styles.detailBtn}
                >
                  <Text>상세</Text>
                </Pressable>
              </View>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f8fafc", gap: 10 },
  toggle: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 6,
    gap: 6,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleBtnActive: { backgroundColor: "#0ea5e9" },
  toggleText: { color: "#111827", fontWeight: "700" },
  toggleTextActive: { color: "white" },

  searchBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "white",
    fontSize: 16,
  },
  filterBtn: {
    paddingHorizontal: 14,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    backgroundColor: "white",
  },

  itemCard: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 14,
    padding: 14,
    backgroundColor: "white",
  },
  itemTitle: { fontSize: 16, fontWeight: "700" },
  itemSub: { color: "#374151", marginTop: 4 },
  itemAddr: { color: "#6b7280", marginTop: 2 },

  calcBtn: {
    borderWidth: 1,
    borderColor: "#93c5fd",
    backgroundColor: "#eff6ff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  detailBtn: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
});
