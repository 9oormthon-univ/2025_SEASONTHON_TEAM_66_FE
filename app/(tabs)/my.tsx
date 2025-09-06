import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

export default function MyScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>내 정보</Text>

      {/* 첫 줄: 시설/재가 급여 · 수급자명 */}
      <View style={styles.row}>
        <Pressable style={styles.smallCard} onPress={() => Alert.alert("시설/재가 급여 정보")}>
          <Text style={styles.smallCardText}>시설/재가 급여</Text>
        </Pressable>
        <Pressable style={styles.smallCard} onPress={() => Alert.alert("수급자명 정보")}>
          <Text style={styles.smallCardText}>수급자명</Text>
        </Pressable>
      </View>

      {/* 두 번째 줄: 보호자명 */}
      <Pressable style={styles.fullCard} onPress={() => Alert.alert("보호자명 정보")}>
        <Text style={styles.fullCardText}>보호자명</Text>
      </Pressable>

      {/* 세 번째 줄: 평균 결제 금액 */}
      <Pressable style={styles.fullCard} onPress={() => Alert.alert("평균 결제금액 보기")}>
        <Text style={styles.fullCardText}>평균 결제금액</Text>
      </Pressable>

      {/* 네 번째 줄: 다음 심사일 D-? */}
      <Pressable style={[styles.fullCard, { backgroundColor: "#0ea5e9" }]} onPress={() => Alert.alert("다음 심사일 확인")}>
        <Text style={[styles.fullCardText, { color: "white", fontWeight: "700" }]}>
          다음 심사일 D-?
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 16,
    gap: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  smallCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 12,
    paddingVertical: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  smallCardText: { fontSize: 16, fontWeight: "600" },

  fullCard: {
    backgroundColor: "white",
    borderRadius: 12,
    paddingVertical: 22,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  fullCardText: { fontSize: 16, fontWeight: "600" },
});
