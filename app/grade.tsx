import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function GradeScreen() {
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (submitted) {
      const t = setTimeout(() => {
        router.replace("/(tabs)/home"); // 자동으로 홈으로 이동
      }, 2000); // 2초 후 이동
      return () => clearTimeout(t);
    }
  }, [submitted]);

  return (
    <View style={styles.container}>
      {!submitted ? (
        <>
          <Text style={styles.question}>국민건강공단에 방문하셨나요?</Text>
          <Pressable style={styles.button} onPress={() => setSubmitted(true)}>
            <Text style={styles.buttonText}>제출했습니다</Text>
          </Pressable>
        </>
      ) : (
        <Text style={styles.message}>
          곧 담당자가 방문할 예정이니 기다려주세요 🙏
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8fafc",
  },
  question: { fontSize: 20, fontWeight: "600", marginBottom: 20, textAlign: "center" },
  button: {
    backgroundColor: "#0ea5e9",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "600" },
  message: { fontSize: 18, fontWeight: "500", color: "#374151", textAlign: "center" },
});
