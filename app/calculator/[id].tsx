// app/calculator/[id].tsx
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

export default function Calculator() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [grade, setGrade] = useState<string | null>(null);
  const [discount, setDiscount] = useState(false);

  // 임시 계산 로직
  const baseFee = grade === "2등급" ? 100 : grade === "3등급" ? 80 : 0;
  const result = grade ? `${discount ? baseFee * 0.8 : baseFee}만원` : "-";

  return (
    <View style={{ flex: 1, padding: 16, gap: 16, backgroundColor: "#f8fafc" }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>월 차액 계산기 — 시설 #{id}</Text>

      <Text style={{ fontWeight: "600" }}>등급 선택</Text>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <Pressable
          onPress={() => setGrade("2등급")}
          style={{ borderWidth: 1, borderRadius: 10, padding: 12, backgroundColor: grade === "2등급" ? "#bfdbfe" : "white" }}
        >
          <Text>2등급</Text>
        </Pressable>
        <Pressable
          onPress={() => setGrade("3등급")}
          style={{ borderWidth: 1, borderRadius: 10, padding: 12, backgroundColor: grade === "3등급" ? "#bfdbfe" : "white" }}
        >
          <Text>3등급</Text>
        </Pressable>
      </View>

      <Text style={{ fontWeight: "600", marginTop: 10 }}>감경 여부</Text>
      <Pressable
        onPress={() => setDiscount(!discount)}
        style={{ borderWidth: 1, borderRadius: 10, padding: 12, backgroundColor: discount ? "#bbf7d0" : "white" }}
      >
        <Text>{discount ? "감경 적용됨" : "감경 없음"}</Text>
      </Pressable>

      <View style={{ borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 12, padding: 16, backgroundColor: "white" }}>
        <Text style={{ fontWeight: "600" }}>월 예상 본인부담</Text>
        <Text style={{ fontSize: 20, marginTop: 6 }}>{result}</Text>
      </View>
    </View>
  );
}
