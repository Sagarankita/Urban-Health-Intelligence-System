import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HospitalDashboard() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={[styles.headerTop, { justifyContent: "space-between" }]}>
          {/* LEFT SIDE */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={styles.iconBox}>
              <Ionicons name="medkit-outline" size={26} color="#fff" />
            </View>

            <View style={{ marginLeft: 10 }}>
              <Text style={styles.title}>Hospital Portal</Text>
              <Text style={styles.subtitle}>City General Hospital</Text>
            </View>
          </View>

          {/* RIGHT SIDE LOGOUT */}
          <TouchableOpacity onPress={() => router.replace("/login")}>
            <Ionicons name="log-out-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.userCard}>
          <Text style={{ color: "#cbd5e1" }}>Logged in as</Text>
          <Text style={styles.userName}>Dr. Amit Verma</Text>
          <Text style={styles.userRole}>Hospital Administrator</Text>
        </View>
      </View>

      {/* STATS */}
      <View style={styles.statsContainer}>
        <StatCard
          icon="calendar-outline"
          value="12"
          label="Today's Appointments"
          color="#3B82F6"
        />
        <StatCard
          icon="alert-circle-outline"
          value="8"
          label="Incoming Reports"
          color="#F97316"
        />
        <StatCard
          icon="bed-outline"
          value="45"
          label="General Beds"
          sub="of 200 total"
          color="#22C55E"
        />
        <StatCard
          icon="pulse-outline"
          value="8"
          label="ICU Beds"
          sub="of 20 total"
          color="#EF4444"
        />
      </View>

      {/* QUICK ACTIONS */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>

      <ActionCard
        icon="document-text-outline"
        title="Incoming Patient Reports"
        subtitle="Review symptom reports"
        onPress={() => router.push("/hospital/reports" as any)}
      />

      <ActionCard
        icon="calendar-outline"
        title="Appointment Management"
        subtitle="Approve or reschedule"
        onPress={() => router.push("/hospital/appointment" as any)}
      />

      <ActionCard
        icon="settings-outline"
        title="Bed Availability Update"
        subtitle="Update bed status"
        onPress={() => router.push("/hospital/capacity" as any)}
      />

      {/* INFO BOX */}
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          System Integration: All updates are synced in real-time with the
          patient-facing application.
        </Text>
      </View>
    </ScrollView>
  );
}
function StatCard({ icon, value, label, sub, color }: any) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: color + "20" }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>

      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      {sub && <Text style={styles.statSub}>{sub}</Text>}
    </View>
  );
}
function ActionCard({ icon, title, subtitle, onPress }: any) {
  return (
    <TouchableOpacity style={styles.actionCard} onPress={onPress}>
      <View style={[styles.statIcon, { backgroundColor: "#FDE68A" }]}>
        <Ionicons name={icon} size={22} color="#EA580C" />
      </View>

      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionSub}>{subtitle}</Text>
      </View>

      <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },

  header: {
    backgroundColor: "#0E2A4E",
    padding: 20,
    paddingTop: 50,
  },

  headerTop: { flexDirection: "row", alignItems: "center" },

  iconBox: {
    backgroundColor: "#1E88E5",
    padding: 12,
    borderRadius: 12,
    marginRight: 10,
  },

  title: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  subtitle: { color: "#cbd5e1" },

  userCard: {
    backgroundColor: "#1f3b66",
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
  },

  userName: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  userRole: { color: "#cbd5e1" },

  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 16,
  },

  statCard: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
  },

  statIcon: {
    padding: 10,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginBottom: 10,
  },

  statValue: { fontSize: 22, fontWeight: "bold" },
  statLabel: { color: "#374151" },
  statSub: { color: "#9ca3af", fontSize: 12 },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 16,
    marginTop: 10,
  },

  actionCard: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 16,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  actionTitle: { fontSize: 16, fontWeight: "bold" },
  actionSub: { color: "#6b7280" },

  infoBox: {
    backgroundColor: "#DBEAFE",
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },

  logout: {
    position: "absolute",
    right: 20,
    top: 50,
    backgroundColor: "#1E3A8A",
    padding: 10,
    borderRadius: 10,
  },

  infoText: { color: "#1E3A8A" },
});
