import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import API from "../../../services/api";

export default function HealthTimelineScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [reports, setReports] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.name) {
        setLoading(false);
        return;
      }
      try {
        const [rRes, aRes] = await Promise.all([
          API.get("/api/reports", {
            params: { patient_name: user.name, limit: 10 },
          }),
          API.get("/api/appointments", {
            params: { patient_name: user.name, limit: 10 },
          }),
        ]);
        setReports(Array.isArray(rRes.data) ? rRes.data : []);
        setAppointments(Array.isArray(aRes.data) ? aRes.data : []);
      } catch (e) {
        console.error("Failed to load timeline data", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.name]);

  const totalReports = reports.length;
  const avgRisk = reports.length
    ? Math.round(
        reports.reduce((s, r) => s + (r.severity ?? 50), 0) / reports.length,
      )
    : null;

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
          <Text style={styles.statTitle}>Avg Severity</Text>
          <Text style={styles.statValue}>{avgRisk ?? "–"}</Text>
          <Text style={{ color: avgRisk && avgRisk < 50 ? "green" : "orange" }}>
            {avgRisk
              ? avgRisk < 50
                ? "Low range"
                : "Monitor closely"
              : "No reports yet"}
          </Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="calendar" size={20} color="#1E88E5" />
          <Text style={styles.statTitle}>Appointments</Text>
          <Text style={styles.statValue}>{appointments.length}</Text>
          <Text>Total booked</Text>
        </View>
      </View>

      {/* RECENT ACTIVITY */}
      <Text style={styles.sectionTitle}>Recent Activity</Text>

      {loading && (
        <Text style={{ textAlign: "center", margin: 20, color: "#6b7280" }}>
          Loading...
        </Text>
      )}

      {!loading && reports.length === 0 && appointments.length === 0 && (
        <Text style={{ textAlign: "center", margin: 20, color: "#6b7280" }}>
          No activity yet. Report symptoms or book an appointment to get
          started.
        </Text>
      )}

      {appointments.map((a: any) => (
        <TimelineItem
          key={`appt-${a.id}`}
          icon="calendar"
          title={`Appointment – ${a.status}`}
          desc={`${a.department} • Hospital #${a.hospital_id}`}
          time={`${a.appointment_date} ${a.appointment_time}`}
        />
      ))}

      {reports.map((r: any) => (
        <TimelineItem
          key={`rep-${r.id}`}
          icon="pulse"
          title={`Symptom Report – ${r.risk ?? "Analyzed"}`}
          desc={`Severity: ${r.severity}/100 • ${r.recommendation ?? ""}`}
          time={new Date(r.created_at).toLocaleString()}
        />
      ))}

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
