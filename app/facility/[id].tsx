// app/facility/[id].tsx
import { useLocalSearchParams } from "expo-router";
import { Linking, Pressable, Text, View } from "react-native";

export default function FacilityDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={{ flex: 1, padding: 16, gap: 12, backgroundColor: "#f8fafc" }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>시설 #{id} 상세 정보</Text>
      <Text style={{ color: "#374151" }}>
        여기에 주소, 운영시간, 차량서비스, 프로그램, 식단, 후기 등을 표시할 예정
      </Text>

      <View style={{ flexDirection: "row", gap: 10, marginTop: 16 }}>
        <Pressable
          onPress={() => Linking.openURL("tel:021234567")}
          style={{ borderWidth: 1, borderRadius: 10, padding: 12, backgroundColor: "white" }}
        >
          <Text>전화하기</Text>
        </Pressable>
        <Pressable
          onPress={() => Linking.openURL("sms:021234567")}
          style={{ borderWidth: 1, borderRadius: 10, padding: 12, backgroundColor: "white" }}
        >
          <Text>문자보내기</Text>
        </Pressable>
      </View>

      <Pressable
        onPress={() => Linking.openURL("https://map.kakao.com/")}
        style={{ marginTop: 12, borderWidth: 1, borderRadius: 10, padding: 12, backgroundColor: "white" }}
      >
        <Text>길찾기 열기</Text>
      </Pressable>

      <Pressable
        onPress={() => { window.alert("후기 작성 화면 연결 예정"); }}
        style={{ marginTop: 20, borderWidth: 1, borderRadius: 10, padding: 12, backgroundColor: "#eff6ff", borderColor: "#93c5fd" }}
      >
        <Text style={{ color: "#1d4ed8" }}>후기 작성하기</Text>
      </Pressable>
    </View>
  );
}
