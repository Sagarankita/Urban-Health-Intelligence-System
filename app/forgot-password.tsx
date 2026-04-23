import API from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function ForgotPasswordScreen() {
  const router = useRouter();

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    email: "",
    phone: "",
    newPassword: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);

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
        {/* EMAIL */}
        <Text style={styles.label}>Email *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your registered email"
          value={form.email}
          onChangeText={(t) => setForm({ ...form, email: t })}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* DOB */}
        <Text style={styles.label}>Date of Birth *</Text>
        <View style={styles.inputRow}>
          <TextInput style={{ flex: 1 }} placeholder="dd/mm/yyyy" />
          <Ionicons name="calendar-outline" size={20} />
        </View>

        {/* PHONE */}
        <Text style={styles.label}>Phone Number *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your registered mobile number"
          keyboardType="numeric"
          value={form.phone}
          onChangeText={(t) => setForm({ ...form, phone: t })}
        />
        <Text style={styles.helper}>10-digit mobile number</Text>

        {/* NEW PASSWORD */}
        <Text style={styles.label}>New Password *</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={{ flex: 1 }}
            placeholder="Create a new password"
            secureTextEntry={!showPass}
            value={form.newPassword}
            onChangeText={(t) => setForm({ ...form, newPassword: t })}
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
            value={form.confirm}
            onChangeText={(t) => setForm({ ...form, confirm: t })}
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
          <Text style={{ fontWeight: "bold" }}>Password Requirements:</Text>
          <Text>• At least 8 characters long</Text>
          <Text>• Mix of letters and numbers recommended</Text>
          <Text>• Avoid common words or personal info</Text>
        </View>

        {/* BUTTON */}
        <TouchableOpacity
          style={[
            styles.resetBtn,
            { backgroundColor: loading ? "#9ca3af" : "#0E2A4E" },
          ]}
          disabled={loading}
          onPress={async () => {
            if (!form.email || !form.phone || !form.newPassword) {
              alert("Please fill in all fields");
              return;
            }
            if (form.newPassword !== form.confirm) {
              alert("Passwords do not match");
              return;
            }
            if (form.newPassword.length < 8) {
              alert("Password must be at least 8 characters");
              return;
            }
            try {
              setLoading(true);
              await API.post("/api/auth/reset-password", {
                email: form.email,
                phone: form.phone,
                new_password: form.newPassword,
              });
              alert("Password reset successful! Please login.");
              router.replace("/login");
            } catch (err: any) {
              alert(
                err?.response?.data?.error ||
                  "Reset failed. Check your details.",
              );
            } finally {
              setLoading(false);
            }
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>
            {loading ? "Resetting..." : "Reset Password"}
          </Text>
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
