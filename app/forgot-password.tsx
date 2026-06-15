import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import API from "../services/api";

export default function ForgotPasswordScreen() {
  const router = useRouter();

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email || !phone || !newPassword) {
      Alert.alert("Missing Fields", "Please fill all required fields");
      return;
    }
    if (newPassword.length < 8) {
      Alert.alert("Weak Password", "Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Mismatch", "Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await API.post("/api/auth/forgot-password", {
        email,
        phone,
        new_password: newPassword,
      });
      Alert.alert("Success", "Password reset successfully! Please login with your new password.", [
        { text: "OK", onPress: () => router.replace("/login") },
      ]);
    } catch (e: any) {
      Alert.alert("Error", e?.response?.data?.error || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/login")}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>

        <View style={{ alignItems: "center", marginTop: 20 }}>
          <View style={styles.iconBox}>
            <Ionicons name="shield-checkmark-outline" size={40} color="#fff" />
          </View>

          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Verify your identity to reset your password
          </Text>
        </View>
      </View>

      {/* FORM */}
      <View style={styles.form}>
        {/* USERNAME */}
        <Text style={styles.label}>Email *</Text>
        <TextInput style={styles.input} placeholder="Enter your email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />

        {/* DOB */}
        <Text style={styles.label}>Date of Birth *</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={{ flex: 1 }}
            placeholder="dd/mm/yyyy"
          />
          <Ionicons name="calendar-outline" size={20} />
        </View>

        {/* PHONE */}
        <Text style={styles.label}>Phone Number *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your mobile number"
          keyboardType="numeric"
          value={phone}
          onChangeText={setPhone}
        />
        <Text style={styles.helper}>10-digit mobile number</Text>

        {/* NEW PASSWORD */}
        <Text style={styles.label}>New Password *</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={{ flex: 1 }}
            placeholder="Create a new password"
            secureTextEntry={!showPass}
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TouchableOpacity onPress={() => setShowPass(!showPass)}>
            <Ionicons
              name={showPass ? "eye-off" : "eye"}
              size={20}
              color="#6b7280"
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.helper}>Minimum 8 characters required</Text>

        {/* CONFIRM PASSWORD */}
        <Text style={styles.label}>Confirm New Password *</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={{ flex: 1 }}
            placeholder="Re-enter your new password"
            secureTextEntry={!showConfirm}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
            <Ionicons
              name={showConfirm ? "eye-off" : "eye"}
              size={20}
              color="#6b7280"
            />
          </TouchableOpacity>
        </View>

        {/* PASSWORD RULES */}
        <View style={styles.rulesBox}>
          <Text style={{ fontWeight: "bold" }}>
            Password Requirements:
          </Text>
          <Text>• At least 8 characters long</Text>
          <Text>• Mix of letters and numbers recommended</Text>
          <Text>• Avoid common words or personal info</Text>
        </View>

        {/* BUTTON */}
        <TouchableOpacity style={[styles.resetBtn, !loading && { backgroundColor: '#0E2A4E' }]} onPress={handleReset} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              Reset Password
            </Text>
          )}
        </TouchableOpacity>

        {/* BACK TO LOGIN */}
        <TouchableOpacity onPress={() => router.replace("/login")}>
          <Text style={styles.backText}>Back to Login</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
          Secure password reset • Government of India Initiative
        </Text>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },

  header: {
    backgroundColor: "#0E2A4E",
    padding: 20,
    paddingTop: 50,
  },

  iconBox: {
    backgroundColor: "#1E88E5",
    padding: 20,
    borderRadius: 20,
  },

  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 10,
  },

  subtitle: {
    color: "#cbd5e1",
    textAlign: "center",
    marginTop: 5,
  },

  form: {
    backgroundColor: "#fff",
    marginTop: -20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },

  label: {
    marginTop: 15,
    fontWeight: "600",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    justifyContent: "space-between",
  },

  helper: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },

  rulesBox: {
    backgroundColor: "#E3F2FD",
    padding: 12,
    borderRadius: 12,
    marginTop: 20,
  },

  resetBtn: {
    backgroundColor: "#9ca3af",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },

  backText: {
    textAlign: "center",
    color: "#1E88E5",
    marginTop: 15,
  },

  footer: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 12,
    color: "#9ca3af",
  },
});