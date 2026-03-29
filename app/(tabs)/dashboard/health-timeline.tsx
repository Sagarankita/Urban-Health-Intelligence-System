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

export default function HealthTimelineScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/dashboard")}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Health Timeline</Text>
        <Text style={styles.headerSub}>Your complete health journey</Text>
      </View>

      {/* RISK CARD */}
      <View style={styles.riskCard}>
        <Ionicons name="warning" size={28} color="#fff" />
        <Text style={styles.riskTitle}>Outbreak Risk in Your Area</Text>
        <Text style={styles.riskSub}>
          Moderate risk of seasonal flu detected in Ward 23, Pune
        </Text>

        <View style={styles.riskBar}>
          <Text style={{ color: "#fff" }}>Risk Level</Text>
          <Text style={{ color: "#fff", fontWeight: "bold" }}>60%</Text>
        </View>

        <View style={styles.progress}>
          <View style={[styles.progressFill, { width: "60%" }]} />
        </View>
      </View>

      {/* STATS */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Ionicons name="pulse" size={20} color="#1E88E5" />
          <Text style={styles.statTitle}>Avg Risk Score</Text>
          <Text style={styles.statValue}>42</Text>
          <Text style={{ color: "green" }}>Improving trend</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="calendar" size={20} color="#1E88E5" />
          <Text style={styles.statTitle}>Check-ups</Text>
          <Text style={styles.statValue}>12</Text>
          <Text>This year</Text>
        </View>
      </View>

      {/* RECENT ACTIVITY */}
      <Text style={styles.sectionTitle}>Recent Activity</Text>

      <TimelineItem
        icon="calendar"
        title="Appointment Confirmed"
        desc="City General Hospital - Respiratory Medicine"
        time="Today, 9:45 AM"
      />

      <TimelineItem
        icon="pulse"
        title="Symptom Report Submitted"
        desc="Fever, Cough, Headache • Risk Score: 78/100"
        time="Today, 9:30 AM"
      />

      <TimelineItem
        icon="notifications"
        title="Health Advisory Received"
        desc="Seasonal flu alert in your ward"
        time="Yesterday, 8:00 AM"
      />

      <TimelineItem
        icon="heart"
        title="Routine Health Check"
        desc="BP Normal • Sugar Normal"
        time="Feb 20, 2026"
      />

      <TimelineItem
        icon="document-text"
        title="Lab Report Available"
        desc="All parameters normal"
        time="Feb 15, 2026"
      />

      <TimelineItem
        icon="calendar"
        title="Follow-up Consultation"
        desc="Metro Health Center"
        time="Feb 10, 2026"
      />

      {/* ALERTS */}
      <Text style={styles.sectionTitle}>Health Alerts & Advisories</Text>

      <AlertCard
        color="#DBEAFE"
        title="Stay Hydrated"
        desc="Drink at least 3 liters of water daily."
      />

      <AlertCard
        color="#FEF3C7"
        title="Seasonal Disease Alert"
        desc="Flu cases rising. Avoid crowded places."
      />

      <AlertCard
        color="#DCFCE7"
        title="Annual Health Check Due"
        desc="Schedule your yearly health screening."
      />

      {/* BUTTON */}
      <TouchableOpacity style={styles.downloadBtn}>
        <Text style={{ color: "#fff", fontWeight: "bold" }}>
          Download Health Report
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* COMPONENTS */

function TimelineItem({ icon, title, desc, time }: any) {
  return (
    <View style={styles.timelineItem}>
      <Ionicons name={icon} size={20} color="#fff" style={styles.circle} />
      <View style={styles.timelineCard}>
        <Text style={styles.timelineTitle}>{title}</Text>
        <Text style={styles.timelineDesc}>{desc}</Text>
        <Text style={styles.timelineTime}>{time}</Text>
      </View>
    </View>
  );
}

function AlertCard({ title, desc, color }: any) {
  return (
    <View style={[styles.alertCard, { backgroundColor: color }]}>
      <Text style={{ fontWeight: "bold" }}>{title}</Text>
      <Text>{desc}</Text>
    </View>
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

  headerSub: { color: "#cbd5e1" },

  riskCard: {
    backgroundColor: "#FF6A00",
    margin: 16,
    padding: 20,
    borderRadius: 16,
  },

  riskTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  riskSub: { color: "#fff", marginTop: 5 },

  riskBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  progress: {
    height: 8,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginTop: 6,
  },

  progressFill: {
    height: 8,
    backgroundColor: "#FFD700",
    borderRadius: 10,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
  },

  statCard: {
    backgroundColor: "#fff",
    width: "48%",
    padding: 16,
    borderRadius: 16,
    elevation: 3,
  },

  statTitle: { color: "#6b7280" },
  statValue: { fontSize: 24, fontWeight: "bold" },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    margin: 16,
  },

  timelineItem: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 10,
  },

  circle: {
    backgroundColor: "#1E88E5",
    padding: 10,
    borderRadius: 20,
  },

  timelineCard: {
    backgroundColor: "#fff",
    marginLeft: 10,
    padding: 12,
    borderRadius: 12,
    flex: 1,
  },

  timelineTitle: { fontWeight: "bold" },
  timelineDesc: { color: "#6b7280" },
  timelineTime: { color: "#9ca3af", fontSize: 12 },

  alertCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },

  downloadBtn: {
    backgroundColor: "#0E2A4E",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
});
