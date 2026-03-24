import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Top Blue Section */}
      <View style={styles.topSection}>
        <View style={styles.logoBox}>
          <Ionicons name="shield-checkmark-outline" size={32} color="#fff" />
        </View>

        <Text style={styles.title}>Urban Health Intelligence System</Text>

        <Text style={styles.subtitle}>
          AI-Assisted, Insurance-Aware Healthcare
        </Text>
      </View>

      {/* White Card */}
      <View style={styles.card}>
        <Text style={styles.label}>Select Role</Text>

        <View style={styles.roleContainer}>
          {["Patient", "Hospital", "Municipal"].map((role) => (
            <TouchableOpacity
              key={role}
              style={[
                styles.roleButton,
                selectedRole === role && styles.activeRole,
              ]}
              onPress={() => setSelectedRole(role)}
            >
              <Text
                style={[
                  styles.roleText,
                  selectedRole === role && styles.activeRoleText,
                ]}
              >
                {role}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Email */}
        <Text style={styles.label}>Email / Mobile Number</Text>
        <TextInput
          placeholder="Enter email or mobile"
          placeholderTextColor="#999"
          style={styles.input}
        />

        {/* Password */}
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

   <TouchableOpacity
  style={{ alignSelf: "flex-end" }}
  onPress={() => router.push("/forgot-password")}
>
  <Text style={styles.forgot}>Forgot Password?</Text>
</TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={() => router.replace("/(tabs)/dashboard")}
        >
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 15,
          }}
        >
          <Text style={styles.signupText}>Don't have an account? </Text>

          <TouchableOpacity onPress={() => router.replace("/create-account")}>
            <Text style={{ color: "#1E88E5", fontWeight: "600" }}>
              Create Account
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.footer}>
          Powered by AI • Government of India Initiative
        </Text>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0E2A4E",
  },

  topSection: {
    alignItems: "center",
    paddingVertical: 40,
  },

  logoBox: {
    backgroundColor: "#1E88E5",
    padding: 15,
    borderRadius: 16,
    marginBottom: 15,
  },

  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    paddingHorizontal: 30,
  },

  subtitle: {
    color: "#cbd5e1",
    fontSize: 14,
    marginTop: 8,
  },

  card: {
    flex: 1,
    backgroundColor: "#F2F4F7",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 15,
    marginBottom: 8,
    color: "#1f2937",
  },

  roleContainer: {
    flexDirection: "row",
    backgroundColor: "#e5e7eb",
    borderRadius: 15,
    padding: 5,
  },

  roleButton: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    borderRadius: 12,
  },

  activeRole: {
    backgroundColor: "#0E2A4E",
  },

  roleText: {
    color: "#6b7280",
    fontWeight: "600",
  },

  activeRoleText: {
    color: "#fff",
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
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
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 20,
  },

  loginText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  signupText: {
    textAlign: "center",
    marginTop: 20,
    color: "#374151",
  },

  createText: {
    color: "#1E88E5",
    fontWeight: "600",
  },

  footer: {
    textAlign: "center",
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 25,
  },
});
