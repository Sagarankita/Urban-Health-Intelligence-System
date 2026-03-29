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
} from "react-native";

export default function PatientRegister() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "Male",
    phone: "",
    email: "",
    ward: "",
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
        <Text style={styles.headerSub}>Patient Registration</Text>
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

      {/* FORM CARD */}
      <View style={styles.card}>
        {step === 1 ? (
          <>
            <Text style={styles.title}>Patient Information</Text>

            {/* NAME */}
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={form.name}
              onChangeText={(t) => setForm({ ...form, name: t })}
            />

            {/* AGE + GENDER */}
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Age *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Age"
                  value={form.age}
                  onChangeText={(t) => setForm({ ...form, age: t })}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Gender *</Text>
                <TextInput style={styles.input} value={form.gender} />
              </View>
            </View>

            {/* PHONE */}
            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter 10-digit mobile number"
              value={form.phone}
              onChangeText={(t) => setForm({ ...form, phone: t })}
              keyboardType="numeric"
            />

            {/* EMAIL */}
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              placeholder="your.email@example.com"
              value={form.email}
              onChangeText={(t) => setForm({ ...form, email: t })}
            />

            {/* WARD */}
            <Text style={styles.label}>Ward / Area *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your area"
              value={form.ward}
              onChangeText={(t) => setForm({ ...form, ward: t })}
            />
          </>
        ) : (
          <>
            <Text style={styles.title}>Set Password</Text>

            {/* PASSWORD */}
            <Text style={styles.label}>Create Password *</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={{ flex: 1 }}
                placeholder="Create a strong password"
                secureTextEntry={!showPass}
                value={form.password}
                onChangeText={(t) => setForm({ ...form, password: t })}
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
                onChangeText={(t) => setForm({ ...form, confirm: t })}
              />
              <TouchableOpacity
                onPress={() => setShowConfirm(!showConfirm)}
              >
                <Ionicons name={showConfirm ? "eye-off" : "eye"} size={20} />
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>

      {/* BUTTON */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (step === 1) setStep(2);
          else alert("Account Created Successfully!");
        }}
      >
        <Text style={styles.buttonText}>
          {step === 1 ? "Review Details" : "Create Account"}
        </Text>
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

  headerSub: {
    color: "#cbd5e1",
  },

  stepBox: {
    backgroundColor: "#fff",
    padding: 16,
  },

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

  row: {
    flexDirection: "row",
    gap: 10,
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