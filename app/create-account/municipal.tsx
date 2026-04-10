import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../../services/AuthContext";

export default function MunicipalRegister() {
  const router = useRouter();
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    employeeId: "",
    department: "",
    ward: "",
    email: "",
    password: "",
    confirm: "",
  });

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Create Account</Text>
        <Text style={styles.headerSub}>
          Municipal Authority Registration
        </Text>
      </View>

      {/* STEP BAR */}
      <View style={styles.stepBox}>
        <View style={styles.stepRow}>
          <Text>Step {step} of 2</Text>
          <Text>{step === 1 ? "Fill Details" : "Set Password"}</Text>
        </View>

        <View style={styles.progressBg}>
          <View
            style={[
              styles.progressFill,
              { width: step === 1 ? "50%" : "100%" },
            ]}
          />
        </View>
      </View>

      {/* FORM */}
      <View style={styles.card}>
        {step === 1 ? (
          <>
            <Text style={styles.title}>
              Municipal Authority Information
            </Text>

            {/* NAME */}
            <Text style={styles.label}>Officer Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter officer's full name"
              value={form.name}
              onChangeText={(t) => setForm({ ...form, name: t })}
            />

            {/* EMPLOYEE ID */}
            <Text style={styles.label}>Employee ID *</Text>
            <TextInput
              style={styles.input}
              placeholder="Government employee ID"
              value={form.employeeId}
              onChangeText={(t) =>
                setForm({ ...form, employeeId: t })
              }
            />

            {/* DEPARTMENT */}
            <Text style={styles.label}>Department *</Text>
            <View style={styles.inputRow}>
              <Text style={{ color: form.department ? "#000" : "#9ca3af" }}>
                {form.department || "Select Department"}
              </Text>
              <Ionicons name="chevron-down" size={18} />
            </View>

            {/* WARD */}
            <Text style={styles.label}>Assigned Ward *</Text>
            <View style={styles.inputRow}>
              <Text style={{ color: form.ward ? "#000" : "#9ca3af" }}>
                {form.ward || "Select Ward"}
              </Text>
              <Ionicons name="chevron-down" size={18} />
            </View>
          </>
        ) : (
          <>
            <Text style={styles.title}>Account Setup</Text>

            {/* EMAIL */}
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              placeholder="official@email.com"
              value={form.email}
              onChangeText={(t) => setForm({ ...form, email: t })}
            />

            {/* PASSWORD */}
            <Text style={styles.label}>Password *</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={{ flex: 1 }}
                placeholder="Create a strong password"
                secureTextEntry={!showPass}
                value={form.password}
                onChangeText={(t) =>
                  setForm({ ...form, password: t })
                }
              />
              <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                <Ionicons name={showPass ? "eye-off" : "eye"} size={20} />
              </TouchableOpacity>
            </View>

            <Text style={styles.helper}>Minimum 6 characters</Text>

            {/* CONFIRM */}
            <Text style={styles.label}>Confirm Password *</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={{ flex: 1 }}
                placeholder="Re-enter password"
                secureTextEntry={!showConfirm}
                value={form.confirm}
                onChangeText={(t) =>
                  setForm({ ...form, confirm: t })
                }
              />
              <TouchableOpacity
                onPress={() => setShowConfirm(!showConfirm)}
              >
                <Ionicons name={showConfirm ? "eye-off" : "eye"} size={20} />
              </TouchableOpacity>
            </View>

            {/* VERIFICATION BOX */}
            <View style={styles.verifyBox}>
              <Text style={{ color: "#6b21a8" }}>
                <Text style={{ fontWeight: "bold" }}>
                  Verification Required:
                </Text>{" "}
                Municipal accounts require admin approval before activation.
                You'll receive an email notification once verified.
              </Text>
            </View>
          </>
        )}
      </View>

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        disabled={loading}
        onPress={async () => {
          if (step === 1) {
            if (!form.name || !form.employeeId) {
              Alert.alert("Missing Fields", "Please fill all required fields");
              return;
            }
            setStep(2);
          } else {
            if (!form.email || !form.password || form.password.length < 6) {
              Alert.alert("Weak Password", "Password must be at least 6 characters");
              return;
            }
            if (form.password !== form.confirm) {
              Alert.alert("Mismatch", "Passwords do not match");
              return;
            }
            setLoading(true);
            const result = await register({
              name: form.name,
              email: form.email,
              password: form.password,
              role: "municipal",
              employee_id: form.employeeId,
              department: form.department,
              assigned_ward: form.ward,
            });
            setLoading(false);
            if (result.success) {
              Alert.alert("Success", "Municipal Account Created! Pending verification.", [
                { text: "OK", onPress: () => router.replace("/(tabs)/municipal") },
              ]);
            } else {
              Alert.alert("Error", result.error || "Registration failed");
            }
          }
        }}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {step === 1 ? "Review Details" : "Create Account"}
          </Text>
        )}
      </TouchableOpacity>
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

  headerTitle: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 10,
  },

  headerSub: { color: "#cbd5e1" },

  stepBox: { backgroundColor: "#fff", padding: 16 },

  stepRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  progressBg: {
    height: 6,
    backgroundColor: "#e5e7eb",
    borderRadius: 10,
    marginTop: 10,
  },

  progressFill: {
    height: 6,
    backgroundColor: "#1E88E5",
    borderRadius: 10,
  },

  card: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 16,
    borderRadius: 16,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  label: {
    marginTop: 10,
    fontWeight: "600",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 12,
    marginTop: 6,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 12,
    marginTop: 6,
    justifyContent: "space-between",
  },

  helper: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },

  verifyBox: {
    backgroundColor: "#f3e8ff",
    padding: 12,
    borderRadius: 12,
    marginTop: 20,
  },

  button: {
    backgroundColor: "#0E2A4E",
    margin: 16,
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});