// app/filters.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

type Filters = {
  distanceKm: number | null;           // 1,3,5,10 중 하나 또는 null(무제한)
  serviceType: "시설급여" | "재가급여" | null;
  feeMin: number | null;
  feeMax: number | null;
  ratingMin: number | null;            // 3, 4, 4.5 등
  vehicleService: boolean | null;      // 차량 서비스
};

function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: active ? "#2563eb" : "#e5e7eb",
        backgroundColor: active ? "#eff6ff" : "white",
        marginRight: 8,
        marginBottom: 8,
      }}
    >
      <Text style={{ color: active ? "#1d4ed8" : "#111827" }}>{label}</Text>
    </Pressable>
  );
}

export default function FiltersScreen() {
  const router = useRouter();
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [serviceType, setServiceType] = useState<"시설급여" | "재가급여" | null>(null);
  const [feeMin, setFeeMin] = useState<string>("");
  const [feeMax, setFeeMax] = useState<string>("");
  const [ratingMin, setRatingMin] = useState<number | null>(null);
  const [vehicleService, setVehicleService] = useState<boolean | null>(null);

  const reset = () => {
    setDistanceKm(null);
    setServiceType(null);
    setFeeMin("");
    setFeeMax("");
    setRatingMin(null);
    setVehicleService(null);
  };

  const apply = async () => {
    const payload: Filters = {
      distanceKm,
      serviceType,
      feeMin: feeMin ? Number(feeMin) : null,
      feeMax: feeMax ? Number(feeMax) : null,
      ratingMin,
      vehicleService,
    };
    await AsyncStorage.setItem("filters", JSON.stringify(payload));
    router.back(); // 홈으로 복귀
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* 헤더 대용 상단 바 */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 14,
          borderBottomWidth: 1,
          borderColor: "#e5e7eb",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Pressable onPress={() => router.back()}>
          <Text>닫기</Text>
        </Pressable>
        <Text style={{ fontSize: 18, fontWeight: "700" }}>필터</Text>
        <Pressable onPress={reset}>
          <Text style={{ color: "#6b7280" }}>초기화</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* 거리 */}
        <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 8 }}>거리</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {[1, 3, 5, 10].map((km) => (
            <Chip
              key={km}
              label={`${km}km`}
              active={distanceKm === km}
              onPress={() => setDistanceKm(distanceKm === km ? null : km)}
            />
          ))}
          <Chip label="무제한" active={distanceKm === null} onPress={() => setDistanceKm(null)} />
        </View>

        {/* 유형 */}
        <Text style={{ fontSize: 16, fontWeight: "600", marginVertical: 8 }}>유형</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {(["시설급여", "재가급여"] as const).map((t) => (
            <Chip
              key={t}
              label={t}
              active={serviceType === t}
              onPress={() => setServiceType(serviceType === t ? null : t)}
            />
          ))}
        </View>

        {/* 요금대 (만원 단위 입력) */}
        <Text style={{ fontSize: 16, fontWeight: "600", marginVertical: 8 }}>월 예상부담(만원)</Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <TextInput
            keyboardType="number-pad"
            value={feeMin}
            onChangeText={setFeeMin}
            placeholder="최소"
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: "#e5e7eb",
              borderRadius: 10,
              paddingHorizontal: 12,
              paddingVertical: 10,
            }}
          />
          <TextInput
            keyboardType="number-pad"
            value={feeMax}
            onChangeText={setFeeMax}
            placeholder="최대"
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: "#e5e7eb",
              borderRadius: 10,
              paddingHorizontal: 12,
              paddingVertical: 10,
            }}
          />
        </View>

        {/* 평점 */}
        <Text style={{ fontSize: 16, fontWeight: "600", marginVertical: 8 }}>평점</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {[3, 4, 4.5].map((r) => (
            <Chip
              key={r}
              label={`${r}+`}
              active={ratingMin === r}
              onPress={() => setRatingMin(ratingMin === r ? null : r)}
            />
          ))}
        </View>

        {/* 차량 서비스 */}
        <Text style={{ fontSize: 16, fontWeight: "600", marginVertical: 8 }}>차량 서비스</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          <Chip
            label="있음"
            active={vehicleService === true}
            onPress={() => setVehicleService(vehicleService === true ? null : true)}
          />
          <Chip
            label="없음"
            active={vehicleService === false}
            onPress={() => setVehicleService(vehicleService === false ? null : false)}
          />
        </View>

        <Pressable
          onPress={apply}
          style={{
            marginTop: 24,
            backgroundColor: "#2563eb",
            borderRadius: 12,
            paddingVertical: 14,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "700" }}>적용하기</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
