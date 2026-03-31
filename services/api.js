import axios from "axios";
import { Platform } from "react-native";

// In Expo, only EXPO_PUBLIC_* vars are guaranteed to be available in the app.
// Fallbacks cover emulator vs local dev.
const FALLBACK_BASE_URL =
  Platform.OS === "android" ? "http://10.0.2.2:5000" : "http://localhost:5000";
const LOCAL_BASE_URL = process.env.EXPO_PUBLIC_API_URL || FALLBACK_BASE_URL;

const API = axios.create({
  baseURL: LOCAL_BASE_URL,
  timeout: 10000,
});

export default API;