// app/config/env.ts
import Constants from "expo-constants";
const { API_URL } = Constants.expoConfig?.extra || {};
export const Env = { API_URL: (API_URL as string) ?? "http://127.0.0.1:5000/api" };
