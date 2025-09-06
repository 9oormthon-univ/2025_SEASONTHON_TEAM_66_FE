// app/(tabs)/facilities.tsx
import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

export default function FacilitiesScreen() {
  const [facilityName, setFacilityName] = useState<string>("");
  const [regDate, setRegDate] = useState<string>("날짜 선택");

  const [paymentDay, setPaymentDay] = useState<string>("15"); // 결제일(숫자)
  const [avgAmount, setAvgAmount] = useState<string>("350,000"); // 평균금액

  const [svc, setSvc] = useState({
    dayCare: true,     // 주야간보호
    bath: false,       // 방문목욕
    homeCare: true,    // 방문요양
    shuttle: false,    // 송영(차량)
  });

  const pickToday = () => {
    const d = new Date();
    const s = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;
    setRegDate(s);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>기관정보</Text>

      {/* 1행: 시설명(큰 카드) + 날짜(작은 카드) */}
      <View style={{ flexDirection: "row", gap: 12 }}>
        {/* 시설명 */}
        <View style={[styles.card, { flex: 1, height: 140 }]}>
          <Text style={styles.cardTitle}>시설명</Text>
          <TextInput
            placeholder="예) 한결요양원"
            value={facilityName}
            onChangeText={setFacilityName}
            style={styles.input}
          />
        </View>

        {/* 날짜 */}
        <Pressable style={[styles.card, { width: 130, height: 140 }]} onPress={pickToday}>
          <Text style={styles.cardTitle}>날짜</Text>
          <Text style={{ fontSize: 16, marginTop: 8, fontWeight: "600" }}>{regDate}</Text>
          <Text style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>탭하여 오늘로 설정</Text>
        </Pressable>
      </View>

      {/* 2행: 결제일 / 평균금액 */}
      <View style={[styles.card]}>
        <Text style={styles.cardTitle}>결제일 / 평균금액</Text>

        <View style={{ flexDirection: "row", gap: 12, marginTop: 10 }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>결제일</Text>
            <TextInput
              value={paymentDay}
              onChangeText={setPaymentDay}
              keyboardType="number-pad"
              placeholder="1~28"
              style={styles.input}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>평균금액</Text>
            <TextInput
              value={avgAmount}
              onChangeText={setAvgAmount}
              keyboardType="number-pad"
              placeholder="예) 350,000"
              style={styles.input}
            />
          </View>
        </View>
      </View>

      {/* 3행: 서비스 기능 */}
      <View style={[styles.card]}>
        <Text style={styles.cardTitle}>서비스 기능</Text>

        <View style={styles.rowItem}>
          <Text style={styles.rowLabel}>주·야간보호</Text>
          <Switch
            value={svc.dayCare}
            onValueChange={(v) => setSvc((s) => ({ ...s, dayCare: v }))}
          />
        </View>

        <View style={styles.rowItem}>
          <Text style={styles.rowLabel}>방문목욕</Text>
          <Switch
            value={svc.bath}
            onValueChange={(v) => setSvc((s) => ({ ...s, bath: v }))}
          />
        </View>

        <View style={styles.rowItem}>
          <Text style={styles.rowLabel}>방문요양</Text>
          <Switch
            value={svc.homeCare}
            onValueChange={(v) => setSvc((s) => ({ ...s, homeCare: v }))}
          />
        </View>

        <View style={styles.rowItem}>
          <Text style={styles.rowLabel}>송영(차량)</Text>
          <Switch
            value={svc.shuttle}
            onValueChange={(v) => setSvc((s) => ({ ...s, shuttle: v }))}
          />
        </View>
      </View>
    </View>
  );
}

/* ===== styles ===== */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc", padding: 16, gap: 12 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 4 },

  card: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", marginBottom: 6 },

  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
    fontSize: 15,
  },
  label: { fontSize: 13, color: "#6b7280", marginBottom: 6 },

  rowItem: {
    marginTop: 8,
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowLabel: { fontSize: 15, fontWeight: "600" },
});
