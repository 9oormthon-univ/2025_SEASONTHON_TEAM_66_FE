// app/index.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

/** 카드형 버튼 */
function CardButton({
  label,
  color,
  onPress,
  full,
}: {
  label: string;
  color: string;
  onPress: () => void;
  full?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: full ? 1 : undefined,
        backgroundColor: color,
        borderRadius: 16,
        paddingVertical: 32,
        paddingHorizontal: 20,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: "700", color: "white" }}>{label}</Text>
    </Pressable>
  );
}

type Step = "qGrade" | "qTypeIfYes" | "qTypeHelp" | "qGuarYes";

export default function Onboarding() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("qGrade");
  const [hasGrade, setHasGrade] = useState<boolean | null>(null);
  const [serviceType, setServiceType] = useState<"시설급여" | "재가급여" | null>(null);

  const finish = async () => {
    await AsyncStorage.multiSet([
      ["onboarding.done", "1"],
      ["onboarding.hasGrade", String(!!hasGrade)],
      ["onboarding.serviceType", serviceType || ""],
    ]);
    router.replace("/(tabs)/home");
  };

  const goBack = () => {
    if (step === "qTypeIfYes" || step === "qGuarYes") setStep("qGrade");
    else if (step === "qTypeHelp") setStep("qTypeIfYes");
  };

  const renderBody = () => {
    // 1) 등급 보유 여부
    if (step === "qGrade") {
      return (
        <>
          <Text style={{ fontSize: 22, fontWeight: "700", textAlign: "center", marginBottom: 16 }}>
            장기 요양등급을 받으셨나요?
          </Text>

          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <CardButton
                label="네"
                color="#f97316"
                onPress={() => {
                  setHasGrade(true);
                  setStep("qTypeIfYes");
                }}
                full
              />
            </View>
            <View style={{ flex: 1 }}>
              <CardButton
                label="아니요"
                color="#3b82f6"
                onPress={() => {
                  setHasGrade(false);
                  setStep("qGuarYes");
                }}
                full
              />
            </View>
          </View>
        </>
      );
    }

    // 2) 등급 있음 → 서비스 선택
    if (step === "qTypeIfYes") {
      return (
        <>
          <Text style={{ fontSize: 22, fontWeight: "700", textAlign: "center", marginBottom: 16 }}>
            어떤 돌봄 서비스를 찾으세요?
          </Text>

          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <CardButton
                label="시설급여"
                color="#10b981"
                onPress={() => {
                  setServiceType("시설급여");
                  finish();
                }}
                full
              />
            </View>
            <View style={{ flex: 1 }}>
              <CardButton
                label="재가급여"
                color="#8b5cf6"
                onPress={() => {
                  setServiceType("재가급여");
                  finish();
                }}
                full
              />
            </View>
          </View>

          <CardButton label="모르겠어요" color="#6b7280" onPress={() => setStep("qTypeHelp")} />
        </>
      );
    }

    // 2-A) 설명
    if (step === "qTypeHelp") {
      return (
        <ScrollView contentContainerStyle={{ paddingBottom: 8 }}>
          <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 12, textAlign: "center" }}>
            시설급여 vs 재가급여
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 8 }}>
            • <Text style={{ fontWeight: "700" }}>시설급여</Text> : 요양원 등 시설에 입소하여 24시간 돌봄을 받는 형태
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 8 }}>
            • <Text style={{ fontWeight: "700" }}>재가급여</Text> : 가정에서 생활하며 방문요양/방문목욕/주간보호 등을 받는 형태
          </Text>
          <Text style={{ fontSize: 14, color: "#374151", marginTop: 8, textAlign: "center" }}>
            상황에 맞는 방식을 고르세요. 이후에도 설정에서 변경할 수 있어요.
          </Text>

          <View style={{ marginTop: 16 }}>
            <CardButton label="이해했어요, 선택하러 가기" color="#0ea5e9" onPress={() => setStep("qTypeIfYes")} />
          </View>
        </ScrollView>
      );
    }

    // 3) 등급 없음 → 간단 안내
    if (step === "qGuarYes") {
      return (
        <>
          <Text style={{ fontSize: 22, fontWeight: "700", textAlign: "center", marginBottom: 12 }}>
            가까운 국민건강보험공단에 방문해 등급 신청을 진행해 주세요
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 8 }}>
            의사소견서, 신청인(어르신)·보호자 신분증, 가족관계증명서를 지참해 주세요.
          </Text>
          <View style={{ marginTop: 16 }}>
            <CardButton label="시설 탐색 시작하기" color="#16a34a" onPress={finish} full />
          </View>
        </>
      );
    }

    return null;
  };

  return (
    <View style={{ flex: 1, padding: 24, justifyContent: "center", gap: 12, backgroundColor: "#f8fafc" }}>
      {renderBody()}

      {(step === "qTypeIfYes" || step === "qTypeHelp" || step === "qGuarYes") && (
        <Pressable
          onPress={goBack}
          style={{
            alignSelf: "stretch",
            backgroundColor: "white",
            borderRadius: 12,
            paddingVertical: 14,
            borderWidth: 1,
            borderColor: "#e5e7eb",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 2,
          }}
        >
          <Text style={{ textAlign: "center", fontSize: 16, fontWeight: "600" }}>이전</Text>
        </Pressable>
      )}
    </View>
  );
}
