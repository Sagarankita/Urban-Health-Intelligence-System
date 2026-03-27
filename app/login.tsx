import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState("Patient");
  const [secure, setSecure] = useState(true);

  const roles = [
    { name: "Patient", icon: "person-outline" },
    { name: "Hospital", icon: "medkit-outline" },
    { name: "Municipal", icon: "business-outline" },
  ];

  const roleDescriptions: any = {
    Patient: "Access healthcare services and report symptoms",
    Hospital: "Manage patients, reports and appointments",
    Municipal: "Monitor city-wide health trends",
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* HEADER */}
      <View style={styles.topSection}>
        <View style={styles.logoBox}>
          <Ionicons name="shield-checkmark-outline" size={32} color="#fff" />
          <Text style={styles.title}>Urban Health Intelligence System</Text>
          <Text style={styles.subtitle}>
            AI-Assisted, Insurance-Aware Healthcare
          </Text>
        </View>
      </View>

      {/* CARD */}
      <ScrollView
        style={styles.card}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* ROLE SELECTOR */}
        <Text style={styles.label}>Select Role</Text>

        <View style={styles.roleContainer}>
          {roles.map((item) => (
            <TouchableOpacity
              key={item.name}
              style={[
                styles.roleItem,
                selectedRole === item.name && styles.activeRoleItem,
              ]}
              onPress={() => setSelectedRole(item.name)}
            >
              <Ionicons
                name={item.icon as any}
                size={18}
                color={selectedRole === item.name ? "#fff" : "#6b7280"}
              />
              <Text
                style={[
                  styles.roleText,
                  selectedRole === item.name && styles.activeRoleText,
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* DESCRIPTION */}
        <Text style={styles.roleDesc}>{roleDescriptions[selectedRole]}</Text>

        {/* EMAIL */}
        <Text style={styles.label}>Email / Mobile Number</Text>
        <TextInput
          placeholder="Enter email or mobile"
          placeholderTextColor="#999"
          style={styles.input}
        />

        {/* PASSWORD */}
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Enter password"
            placeholderTextColor="#999"
            secureTextEntry={secure}
            style={{ flex: 1 }}
          />
          <TouchableOpacity onPress={() => setSecure(!secure)}>
            <Ionicons
              name={secure ? "eye-outline" : "eye-off-outline"}
              size={22}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        {/* FORGOT */}
        <TouchableOpacity
          style={{ alignSelf: "flex-end" }}
          onPress={() => router.push("/forgot-password")}
        >
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* LOGIN BUTTON */}
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={() => {
            if (selectedRole === "Patient") {
              router.replace("/(tabs)/dashboard");
            } else if (selectedRole === "Hospital") {
              router.replace("/(tabs)/hospital");
            } else {
              router.replace("/(tabs)/municipal");
            }
          }}
        >
          <Text style={styles.loginText}>Login as {selectedRole}</Text>
        </TouchableOpacity>

        {/* SIGNUP */}
        <View style={styles.signupRow}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.replace("/create-account")}>
            <Text style={styles.createText}>Create Account</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>
          Powered by AI • Government of India Initiative
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0E2A4E" },

  topSection: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 30,
  },

  logoBox: {
    backgroundColor: "#061938",
    padding: 18,
    borderRadius: 20,
    marginBottom: 15,
    alignItems: "center",
  },

  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 12,
  },

  subtitle: {
    color: "#cbd5e1",
    marginTop: 6,
    textAlign: "center",
  },

  card: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 20,
    marginTop: 10,
  },

  label: {
    fontWeight: "600",
    marginTop: 15,
    marginBottom: 8,
  },
  roleContainer: {
    flexDirection: "row",
    backgroundColor: "#E5E7EB",
    borderRadius: 20,
    padding: 6,
  },

  roleItem: {
    flex: 1,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
  },

  activeRoleItem: {
    backgroundColor: "#0E2A4E",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  roleText: {
    color: "#6b7280",
    marginLeft: 5,
  },

  activeRoleText: {
    color: "#fff",
    fontWeight: "600",
  },

  roleDesc: {
    textAlign: "center",
    color: "#6b7280",
    marginTop: 10,
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginTop: 5,
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  forgot: {
    color: "#1E88E5",
    marginTop: 8,
  },

  loginBtn: {
    backgroundColor: "#0E2A4E",
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 25,
  },

  loginText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },

  signupText: {
    color: "#374151",
  },

  createText: {
    color: "#374151",
    fontWeight: "600",
  },

  footer: {
    textAlign: "center",
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 25,
  },
});
