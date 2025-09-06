import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

/** 간단 체크박스 */
function Check({
  checked, onToggle, label, sub,
}: { checked: boolean; onToggle: () => void; label: string; sub?: string }) {
  return (
    <Pressable onPress={onToggle} style={styles.row}>
      <View style={[styles.checkbox, checked && styles.checkboxOn]} />
      <View style={{ flex: 1 }}>
        <Text style={styles.rowLabel}>{label}</Text>
        {!!sub && <Text style={styles.rowSub}>{sub}</Text>}
      </View>
    </Pressable>
  );
}

type Step = "kakao" | "required";

export default function KakaoConsentScreen() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("kakao");

  // Step 1: 카카오 동의(샘플)
  const [agreeAll, setAgreeAll] = useState(false);
  const [agreeLogin, setAgreeLogin] = useState(false);

  // Step 2: 필수 동의
  const [age14, setAge14] = useState(false);
  const [tos, setTos] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [location, setLocation] = useState(false);

  const requiredOK = age14 && tos && privacy && location;

  const toggleAll = () => {
    const next = !agreeAll;
    setAgreeAll(next);
    setAgreeLogin(next);
  };

  const goNext = () => {
    if (step === "kakao") setStep("required");
    else if (step === "required" && requiredOK) router.replace("/onboarding");
  };

  const btnEnabled = useMemo(() => {
    if (step === "kakao") return agreeLogin;
    return requiredOK;
  }, [step, agreeLogin, requiredOK]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {step === "kakao" ? (
        <>
          <Text style={styles.title}>카카오 계정으로 로그인</Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>동의 항목</Text>
            <Check
              checked={agreeAll}
              onToggle={toggleAll}
              label="전체 동의"
              sub="모든 동의 항목을 한 번에 선택합니다"
            />
            <View style={styles.divider} />
            <Check
              checked={agreeLogin}
              onToggle={() => setAgreeLogin(!agreeLogin)}
              label="로그인 동의"
              sub="프로필(닉네임/프로필사진), 이메일 등 기본정보"
            />
          </View>

          <Pressable
            disabled={!btnEnabled}
            onPress={goNext}
            style={[styles.kakaoBtn, !btnEnabled && { opacity: 0.5 }]}
          >
            <Text style={styles.kakaoText}>동의하고 계속</Text>
          </Pressable>
        </>
      ) : (
        <>
          <Text style={styles.title}>필수 동의</Text>

          <View style={styles.card}>
            <Check checked={age14} onToggle={() => setAge14(!age14)} label="만 14세 이상입니다 (필수)" />
            <Check checked={tos} onToggle={() => setTos(!tos)} label="이용약관 동의 (필수)" />
            <Check checked={privacy} onToggle={() => setPrivacy(!privacy)} label="개인정보 수집·이용 동의 (필수)" />
            <Check checked={location} onToggle={() => setLocation(!location)} label="위치정보 이용 동의 (필수)" />
          </View>

          <Pressable
            disabled={!btnEnabled}
            onPress={goNext}
            style={[styles.primaryBtn, !btnEnabled && { opacity: 0.5 }]}
          >
            <Text style={styles.primaryText}>동의하고 시작하기</Text>
          </Pressable>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#f8fafc", flexGrow: 1 },
  title: { fontSize: 22, fontWeight: "800", marginBottom: 12 },
  card: {
    backgroundColor: "white",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 14,
    marginBottom: 16,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", marginBottom: 8 },
  row: { flexDirection: "row", gap: 12, alignItems: "center", paddingVertical: 10 },
  rowLabel: { fontSize: 16, fontWeight: "600" },
  rowSub: { fontSize: 12, color: "#6b7280", marginTop: 2 },
  checkbox: {
    width: 22, height: 22, borderRadius: 6,
    borderWidth: 2, borderColor: "#9ca3af", backgroundColor: "white",
  },
  checkboxOn: { backgroundColor: "#16a34a", borderColor: "#16a34a" },
  divider: { height: 1, backgroundColor: "#f1f5f9", marginVertical: 8 },

  kakaoBtn: {
    backgroundColor: "#FEE500",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    elevation: 1,
  },
  kakaoText: { fontSize: 16, fontWeight: "700", color: "#111827" },

  primaryBtn: {
    backgroundColor: "#0ea5e9",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryText: { fontSize: 16, fontWeight: "700", color: "white" },
});
