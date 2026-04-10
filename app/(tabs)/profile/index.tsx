import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { useRef, useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import Toast from "react-native-toast-message";
import API from "../../../services/api";
import { useAuth } from "../../../services/AuthContext";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, updateUser } = useAuth();

  const [profile, setProfile] = useState({
    name: "",
    age: "",
    gender: "",
    ward: "",
    email: "",
    insurance: "",
    abha: "",
    insuranceId: "",
    allergies: "",
    history: "",
  });

  // Load profile from auth context
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        age: user.age || "",
        gender: user.gender || "",
        ward: user.ward || "",
        email: user.email || "",
        insurance: user.insurance || "",
        abha: user.abha || "",
        insuranceId: user.insurance_id || "",
        allergies: user.allergies || "",
        history: user.medical_history || "",
      });
    }
  }, [user]);

  const [editingSection, setEditingSection] = useState<
    "personal" | "insurance" | "health" | null
  >(null);
  const [saving, setSaving] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const handleSave = async (section: string) => {
    setSaving(true);
    try {
      const res = await API.put("/api/auth/profile", {
        name: profile.name,
        age: profile.age,
        gender: profile.gender,
        ward: profile.ward,
        email: profile.email,
        insurance: profile.insurance,
        abha: profile.abha,
        insurance_id: profile.insuranceId,
        allergies: profile.allergies,
        medical_history: profile.history,
      });
      // Update local auth context
      updateUser(res.data);
      setEditingSection(null);
      Toast.show({
        type: "success",
        text1: `${section} saved successfully`,
        visibilityTime: 3000,
      });
    } catch (e: any) {
      Alert.alert("Error", e?.response?.data?.error || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <>
      <ScrollView
        ref={scrollRef}
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.replace("/dashboard")}>
            <Ionicons name="chevron-back" size={26} color="#fff" />
          </TouchableOpacity>
          <View style={{ marginTop: 10 }}>
            <Text style={styles.headerTitle}>Profile Settings</Text>
            <Text style={styles.headerSubtitle}>
              Manage your health information
            </Text>
          </View>
        </View>

        {/* PERSONAL INFO CARD */}

        {editingSection === "personal" ? (
          <View style={styles.card}>
            <Text style={styles.editTitle}>Edit Personal Information</Text>

            <TextInput
              style={styles.input}
              value={profile.name}
              onChangeText={(text) => setProfile({ ...profile, name: text })}
              placeholder="Full Name"
            />

            <TextInput
              style={styles.input}
              value={profile.age}
              onChangeText={(text) => setProfile({ ...profile, age: text })}
              placeholder="Age"
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              value={profile.ward}
              onChangeText={(text) => setProfile({ ...profile, ward: text })}
              placeholder="Ward"
            />

            <TextInput
              style={styles.input}
              value={profile.email}
              onChangeText={(text) => setProfile({ ...profile, email: text })}
              placeholder="Email"
              keyboardType="email-address"
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.saveBtn, saving && { opacity: 0.7 }]}
                disabled={saving}
                onPress={() => handleSave("Personal details")}
              >
                <Text style={{ color: "white" }}>{saving ? "Saving..." : "Save Changes"}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setEditingSection(null)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleWrapper}>
                <Ionicons name="person-outline" size={20} color="#1E88E5" />
                <Text style={styles.cardTitle}>Personal Information</Text>
              </View>

              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => {
                  setEditingSection("personal");
                  scrollRef.current?.scrollTo({ y: 0, animated: true });
                }}
              >
                <Ionicons name="pencil-outline" size={16} color="#1E88E5" />
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
            </View>

            <InfoRow label="Name" value={profile.name || "Not set"} />
            <InfoRow label="Age" value={profile.age ? profile.age + " years" : "Not set"} />
            <InfoRow label="Gender" value={profile.gender || "Not set"} />
            <InfoRow label="Ward" value={profile.ward || "Not set"} />
            <InfoRow label="Email" value={profile.email || "Not set"} />
          </View>
        )}

        {/* INSURANCE CARD */}

        {editingSection === "insurance" ? (
          <View style={styles.card}>
            <Text style={styles.editTitle}>Edit Insurance Details</Text>

            <TextInput
              style={styles.input}
              value={profile.insurance}
              onChangeText={(text) =>
                setProfile({ ...profile, insurance: text })
              }
              placeholder="Insurance Provider"
            />

            <TextInput
              style={styles.input}
              value={profile.abha}
              onChangeText={(text) => setProfile({ ...profile, abha: text })}
              placeholder="ABHA ID"
            />

            <TextInput
              style={styles.input}
              value={profile.insuranceId}
              onChangeText={(text) =>
                setProfile({ ...profile, insuranceId: text })
              }
              placeholder="Insurance ID"
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.saveBtn, saving && { opacity: 0.7 }]}
                disabled={saving}
                onPress={() => handleSave("Insurance details")}
              >
                <Text style={{ color: "white" }}>{saving ? "Saving..." : "Save Changes"}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setEditingSection(null)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleWrapper}>
                <Ionicons name="shield-outline" size={20} color="#1E88E5" />
                <Text style={styles.cardTitle}>Insurance & ABHA Details</Text>
              </View>

              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => {
                  setEditingSection("insurance");
                }}
              >
                <Ionicons name="pencil-outline" size={16} color="#1E88E5" />
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
            </View>

            <InfoRow label="Insurance" value={profile.insurance || "Not set"} />
            <InfoRow label="ABHA ID" value={profile.abha || "Not set"} />
            <InfoRow label="Insurance ID" value={profile.insuranceId || "Not set"} />
          </View>
        )}

        {/* HEALTH PROFILE CARD */}

        {editingSection === "health" ? (
          <View style={styles.card}>
            <Text style={styles.editTitle}>Edit Health Profile</Text>

            <TextInput
              style={styles.input}
              value={profile.allergies}
              onChangeText={(text) =>
                setProfile({ ...profile, allergies: text })
              }
              placeholder="Allergies"
            />

            <TextInput
              style={styles.input}
              value={profile.history}
              onChangeText={(text) => setProfile({ ...profile, history: text })}
              placeholder="Medical History"
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.saveBtn, saving && { opacity: 0.7 }]}
                disabled={saving}
                onPress={() => handleSave("Health profile")}
              >
                <Text style={{ color: "white" }}>{saving ? "Saving..." : "Save Changes"}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setEditingSection(null)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleWrapper}>
                <Ionicons name="heart-outline" size={20} color="#1E88E5" />
                <Text style={styles.cardTitle}>Health Profile</Text>
              </View>

              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => {
                  setEditingSection("health");
                }}
              >
                <Ionicons name="pencil-outline" size={16} color="#1E88E5" />
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Chronic Conditions</Text>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{profile.history || "None"}</Text>
              </View>
            </View>

            <InfoRow label="Allergies" value={profile.allergies || "None"} />

            <View style={styles.infoRow}>
              <Text style={styles.label}>Medical History</Text>
            </View>

            <Text style={styles.historyText}>{profile.history || "No medical history recorded"}</Text>
          </View>
        )}

        {/* LOGOUT BUTTON */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

/* REUSABLE ROW COMPONENT */
function InfoRow({ label, value }: any) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },

  header: {
    backgroundColor: "#0E2A4E",
    padding: 20,
    paddingTop: 50,
  },

  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
  },

  headerSubtitle: {
    color: "#cbd5e1",
    marginTop: 5,
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 20,
    padding: 18,
    borderRadius: 12,
    elevation: 2,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  cardTitleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 6,
  },

  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  editText: {
    color: "#1E88E5",
    marginLeft: 4,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  label: {
    color: "#6b7280",
  },

  value: {
    fontWeight: "600",
    color: "#0E2A4E",
  },

  tag: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },

  tagText: {
    color: "#1E88E5",
    fontWeight: "600",
  },

  historyText: {
    marginTop: 10,
    color: "#0E2A4E",
  },

  logoutBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ff2d2d",
    margin: 20,
    padding: 16,
    borderRadius: 12,
  },

  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },

  editTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },

  buttonRow: {
    flexDirection: "row",
    marginTop: 20,
  },

  saveBtn: {
    backgroundColor: "#0E2A4E",
    padding: 14,
    borderRadius: 10,
    marginRight: 10,
  },

  cancelBtn: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 14,
    borderRadius: 10,
  },
});
