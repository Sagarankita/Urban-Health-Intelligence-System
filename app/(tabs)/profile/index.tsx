import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
export default function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState({
    name: "Priya Sharma",
    age: "32",
    gender: "Female",
    ward: "Ward 23, Pune",
    email: "j@example.com",
    insurance: "PM-JAY",
    abha: "12-3456-7890-1234",
    insuranceId: "PMJAY-MH-2024-123456",
    allergies: "Penicillin",
    history: "Type 2 Diabetes diagnosed in 2020",
  });
  const [editingSection, setEditingSection] = useState<
    "personal" | "insurance" | "health" | null
  >(null);
  const scrollRef = useRef<ScrollView>(null);
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
            />

            <TextInput
              style={styles.input}
              value={profile.age}
              onChangeText={(text) => setProfile({ ...profile, age: text })}
            />

            <TextInput
              style={styles.input}
              value={profile.ward}
              onChangeText={(text) => setProfile({ ...profile, ward: text })}
            />

            <TextInput
              style={styles.input}
              value={profile.email}
              onChangeText={(text) => setProfile({ ...profile, email: text })}
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={() => {
                  setEditingSection(null);

                  Toast.show({
                    type: "success",
                    text1: "Details saved successfully",
                    visibilityTime: 5000,
                  });
                }}
              >
                <Text style={{ color: "white" }}>Save Changes</Text>
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

            <InfoRow label="Name" value={profile.name} />
            <InfoRow label="Age" value={profile.age + " years"} />
            <InfoRow label="Gender" value={profile.gender} />
            <InfoRow label="Ward" value={profile.ward} />
            <InfoRow label="Email" value={profile.email} />
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
            />

            <TextInput
              style={styles.input}
              value={profile.abha}
              onChangeText={(text) => setProfile({ ...profile, abha: text })}
            />

            <TextInput
              style={styles.input}
              value={profile.insuranceId}
              onChangeText={(text) =>
                setProfile({ ...profile, insuranceId: text })
              }
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={() => {
                  setEditingSection(null);

                  Toast.show({
                    type: "success",
                    text1: "Insurance details saved",
                    visibilityTime: 5000,
                  });
                }}
              >
                <Text style={{ color: "white" }}>Save Changes</Text>
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

            <InfoRow label="Insurance" value={profile.insurance} />
            <InfoRow label="ABHA ID" value={profile.abha} />
            <InfoRow label="Insurance ID" value={profile.insuranceId} />
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
            />

            <TextInput
              style={styles.input}
              value={profile.history}
              onChangeText={(text) => setProfile({ ...profile, history: text })}
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={() => {
                  setEditingSection(null);

                  Toast.show({
                    type: "success",
                    text1: "Health profile updated",
                    visibilityTime: 5000,
                  });
                }}
              >
                <Text style={{ color: "white" }}>Save Changes</Text>
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
                <Text style={styles.tagText}>{profile.history}</Text>
              </View>
            </View>

            <InfoRow label="Allergies" value={profile.allergies} />

            <View style={styles.infoRow}>
              <Text style={styles.label}>Medical History</Text>
            </View>

            <Text style={styles.historyText}>{profile.history}</Text>
          </View>
        )}

        {/* LOGOUT BUTTON */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => router.replace("/login")}
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

  editCard: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 20,
    borderRadius: 18,
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
