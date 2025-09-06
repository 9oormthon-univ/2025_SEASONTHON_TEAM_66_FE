import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitle: "카카오 로그인",
        headerBackTitle: "뒤로",
      }}
    />
  );
}
