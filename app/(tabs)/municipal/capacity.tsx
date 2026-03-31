import API from "@/services/api";
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
API.get("/api/resources/municipal")

export default function CapacityScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <TouchableOpacity
        style={styles.header}
        onPress={() => router.replace("/municipal")}
      >
        <Ionicons name="chevron-back" size={24} />
        <View>
          <Text style={styles.title}>Hospital Capacity Monitor</Text>
          <Text style={styles.subtitle}>Real-time bed availability</Text>
        </View>
      </TouchableOpacity>

      {/* CITY SUMMARY */}
      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>City-Wide Capacity</Text>

        <View style={styles.summaryRow}>
          <Summary value="270" label="General Beds" />
          <Summary value="48" label="ICU Beds" />
          <Summary value="73" label="Ventilators" />
        </View>
      </View>

      {/* HOSPITAL LIST */}
      <HospitalCard
        name="City General Hospital"
        area="Shivajinagar"
        status="Active"
        beds="45/200"
        icu="8/20"
        vents="12/25"
      />

      <HospitalCard
        name="Pune Medical Center"
        area="Kothrud"
        status="Active"
        beds="62/250"
        icu="15/30"
        vents="18/40"
      />

      <HospitalCard
        name="Aundh District Hospital"
        area="Aundh"
        status="Limited"
        beds="28/150"
        icu="5/15"
        vents="6/20"
      />

      <HospitalCard
        name="Sahyadri Hospital"
        area="Hadapsar"
        status="Active"
        beds="38/180"
        icu="6/18"
        vents="10/22"
      />

      <HospitalCard
        name="KEM Hospital"
        area="Pimpri"
        status="Limited"
        beds="15/120"
        icu="2/12"
        vents="3/15"
      />

      {/* ALERT */}
      <View style={styles.alert}>
        <Text style={styles.alertTitle}>⚠ Capacity Alert</Text>
        <Text style={styles.alertText}>
          Aundh District Hospital and KEM Hospital are approaching capacity
          limits.
        </Text>
      </View>

      {/* INFO */}
      <View style={styles.info}>
        <Text style={styles.infoText}>
          Real-time Updates: Data is synced from hospital systems every 5
          minutes.
        </Text>
      </View>
    </ScrollView>
  );
}
function Summary({ value, label }: any) {
  return (
    <View>
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}
function HospitalCard({ name, area, status, beds, icu, vents }: any) {
  const statusColor = status === "Active" ? "#16A34A" : "#F97316";

  return (
    <View style={styles.card}>
      {/* HEADER */}
      <View style={styles.cardHeader}>
        <Ionicons name="medkit-outline" size={24} color="#fff" />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.cardTitle}>{name}</Text>
          <Text style={styles.cardSub}>{area}</Text>
        </View>

        <View style={[styles.badge, { backgroundColor: statusColor + "20" }]}>
          <Text style={{ color: statusColor }}>{status}</Text>
        </View>
      </View>

      {/* METRICS */}
      <Metric label="General Beds" value={beds} />
      <Metric label="ICU Beds" value={icu} />
      <Metric label="Ventilators" value={vents} />

      <Text style={styles.updated}>Last updated 10 mins ago ✔</Text>
    </View>
  );
}
function Metric({ label, value }: any) {
  const [used, total] = value.split("/").map(Number);
  const percent = (used / total) * 100;

  const color = percent > 80 ? "#EF4444" : percent > 50 ? "#F97316" : "#22C55E";

  return (
    <View style={styles.metricBox}>
      <View style={styles.rowBetween}>
        <Text>{label}</Text>
        <Text style={{ color, fontWeight: "bold" }}>{value}</Text>
      </View>

      <View style={styles.barBg}>
        <View
          style={[
            styles.barFill,
            { width: `${percent}%`, backgroundColor: color },
          ]}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6", padding: 16 },

  header: { flexDirection: "row", alignItems: "center", gap: 10 },

  title: { fontSize: 22, fontWeight: "bold" },
  subtitle: { color: "#6b7280" },

  summary: {
    backgroundColor: "#16A34A",
    padding: 16,
    borderRadius: 16,
    marginVertical: 10,
  },

  summaryTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  summaryValue: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  summaryLabel: { color: "#DCFCE7" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginVertical: 10,
    overflow: "hidden",
  },

  cardHeader: {
    backgroundColor: "#0E2A4E",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  cardTitle: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  cardSub: { color: "#cbd5e1" },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  metricBox: {
    backgroundColor: "#FFF7ED",
    margin: 10,
    padding: 12,
    borderRadius: 12,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  barBg: {
    height: 6,
    backgroundColor: "#e5e7eb",
    borderRadius: 5,
    marginTop: 5,
  },

  barFill: {
    height: 6,
    borderRadius: 5,
  },

  updated: {
    margin: 10,
    color: "#6b7280",
  },

  alert: {
    backgroundColor: "#FEF3C7",
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
  },

  alertTitle: { fontWeight: "bold", color: "#92400E" },
  alertText: { color: "#92400E" },

  info: {
    backgroundColor: "#DBEAFE",
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
  },

  infoText: { color: "#1E3A8A" },
});
