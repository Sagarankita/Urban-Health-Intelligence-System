import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function FindHospitalScreen() {
  const router = useRouter();

  const hospitals = [
    {
      name: "City General Hospital",
      type: "Multi-Specialty",
      dept: "Respiratory Medicine",
      distance: "2.3 km",
      wait: "45 mins",
      match: 94,
      load: "medium",
    },
    {
      name: "Metro Health Center",
      type: "Primary Care",
      dept: "General Medicine",
      distance: "1.8 km",
      wait: "20 mins",
      match: 89,
      load: "low",
    },
    {
      name: "Apollo Speciality Clinic",
      type: "Respiratory",
      dept: "Pulmonology",
      distance: "3.1 km",
      wait: "85 mins",
      match: 87,
      load: "high",
    },
    {
      name: "Fortis Medical Center",
      type: "Multi-Specialty",
      dept: "Internal Medicine",
      distance: "4.2 km",
      wait: "30 mins",
      match: 82,
      load: "low",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/dashboard")}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Find Hospital</Text>
        <Text style={styles.headerSub}>AI-matched based on your symptoms</Text>
      </View>

      {/* FILTER */}
      <View style={styles.filterBar}>
        <Text style={styles.activeFilter}>All Hospitals</Text>
        <Text style={styles.inactiveFilter}>Insurance Compatible</Text>
      </View>

      {/* HOSPITAL LIST */}
      {hospitals.map((h, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.name}>{h.name}</Text>
              <Text style={styles.type}>{h.type}</Text>
              <Text style={styles.dept}>{h.dept}</Text>
            </View>

            <View style={styles.matchBox}>
              <Ionicons name="star" size={16} color="#fff" />
              <Text style={styles.matchText}>{h.match}%</Text>
            </View>
          </View>

          <View style={styles.row}>
            <Text>📍 {h.distance}</Text>
            <Text>⏱ {h.wait}</Text>
          </View>

          <View style={styles.row}>
            <View style={styles.blueTag}>
              <Text style={{ color: "#1E88E5" }}>PM-JAY Compatible</Text>
            </View>

            <View
              style={[
                styles.loadTag,
                h.load === "low"
                  ? styles.low
                  : h.load === "medium"
                    ? styles.medium
                    : styles.high,
              ]}
            >
              <Text>
                {h.load === "low"
                  ? "Low Load"
                  : h.load === "medium"
                    ? "Medium Load"
                    : "High Load"}
              </Text>
            </View>
          </View>

          {/* MATCH + BUTTON */}
          <View style={styles.bottomRow}>
            <View style={styles.progress}>
              <View style={[styles.progressFill, { width: `${h.match}%` }]} />
            </View>

            <TouchableOpacity style={styles.bookBtn}>
              <Text style={{ color: "#fff" }}>Book</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* INFO */}
      <View style={styles.infoBox}>
        <Text>
          💡 Smart Matching: Hospitals ranked using AI based on symptoms,
          insurance, distance & load.
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

  headerTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },

  headerSub: {
    color: "#cbd5e1",
  },

  filterBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 15,
  },

  activeFilter: {
    backgroundColor: "#0E2A4E",
    color: "#fff",
    padding: 10,
    borderRadius: 20,
  },

  inactiveFilter: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 20,
  },

  card: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 16,
    borderRadius: 16,
    elevation: 3,
  },

  name: { fontSize: 18, fontWeight: "bold" },
  type: { color: "#6b7280" },
  dept: { color: "#1E88E5", marginBottom: 8 },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  matchBox: {
    backgroundColor: "#1E88E5",
    padding: 10,
    borderRadius: 12,
    alignItems: "center",
  },

  matchText: { color: "#fff", fontWeight: "bold" },

  blueTag: {
    backgroundColor: "#E3F2FD",
    padding: 6,
    borderRadius: 12,
  },

  loadTag: {
    padding: 6,
    borderRadius: 12,
  },

  low: { backgroundColor: "#C8E6C9" },
  medium: { backgroundColor: "#FFF3CD" },
  high: { backgroundColor: "#F8D7DA" },

  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  progress: {
    flex: 1,
    height: 8,
    backgroundColor: "#ddd",
    borderRadius: 10,
    marginRight: 10,
  },

  progressFill: {
    height: 8,
    backgroundColor: "#1E88E5",
    borderRadius: 10,
  },

  bookBtn: {
    backgroundColor: "#0E2A4E",
    padding: 10,
    borderRadius: 10,
  },

  infoBox: {
    margin: 20,
    padding: 15,
    backgroundColor: "#E3F2FD",
    borderRadius: 12,
  },
});
