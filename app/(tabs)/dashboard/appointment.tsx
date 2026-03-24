import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function AppointmentScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/dashboard")}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Appointment Confirmed</Text>
        <Text style={styles.headerSub}>AI-prioritized scheduling</Text>
      </View>

      {/* SUCCESS BANNER */}
      <View style={styles.successBanner}>
        <Ionicons name="checkmark-circle" size={24} color="#fff" />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.successTitle}>
            Booking Confirmed Successfully
          </Text>
          <Text style={styles.successSub}>
            Confirmation sent to your registered mobile
          </Text>
        </View>
      </View>

      {/* PRIORITY CARD */}
      <View style={styles.priorityCard}>
        <Ionicons name="alert-circle" size={40} color="#fff" />
        <Text style={styles.priorityText}>LOW PRIORITY</Text>
        <Text style={styles.prioritySub}>
          Priority assigned using AI severity and workload analysis
        </Text>
      </View>

      {/* DETAILS CARD */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Appointment Details</Text>

        <InfoItem
          icon="location-outline"
          label="Hospital"
          value="City General Hospital"
          sub="Multi-Specialty Center"
        />

        <InfoItem
          icon="person-outline"
          label="Department & Doctor"
          value="Respiratory Medicine"
          sub="Dr. Rajesh Kumar • Sr. Consultant"
        />

        <InfoItem
          icon="calendar-outline"
          label="Date & Time"
          value="18 Mar 2026"
          sub="10:30 AM - 11:00 AM"
        />

        <InfoItem
          icon="time-outline"
          label="Queue Status"
          value="Position #8"
          sub="Est. waiting: 25-30 minutes"
        />
      </View>

      {/* BREAKDOWN */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Priority Level Breakdown</Text>

        <Progress label="Symptom Severity" value={40} />
        <Progress label="Department Load" value={65} />
        <Progress label="Medical History" value={55} />

        <View style={styles.analysisBox}>
          <Text>
            <Text style={{ fontWeight: "bold" }}>AI Analysis: </Text>
            Based on your symptoms, medical history, and department workload,
            you’ve been assigned low priority for optimized consultation.
          </Text>
        </View>
      </View>

      {/* BUTTONS */}
      <TouchableOpacity style={styles.primaryBtn}>
        <Text style={styles.primaryText}>View Health Timeline →</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryBtn}>
        <Text style={styles.secondaryText}>Download Appointment</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* COMPONENTS */

function InfoItem({ icon, label, value, sub }: any) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={22} color="#1E88E5" />
      <View style={{ marginLeft: 10 }}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.sub}>{sub}</Text>
      </View>
    </View>
  );
}

function Progress({ label, value }: any) {
  return (
    <View style={{ marginTop: 12 }}>
      <View style={styles.rowBetween}>
        <Text>{label}</Text>
        <Text>{value}%</Text>
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${value}%` }]} />
      </View>
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

  successBanner: {
    flexDirection: "row",
    backgroundColor: "#16A34A",
    margin: 16,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  successTitle: { color: "#fff", fontWeight: "bold" },
  successSub: { color: "#dcfce7", fontSize: 12 },

  priorityCard: {
    backgroundColor: "#16A34A",
    margin: 16,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },

  priorityText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
  },

  prioritySub: {
    color: "#dcfce7",
    textAlign: "center",
    marginTop: 5,
  },

  card: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 16,
    borderRadius: 16,
    elevation: 3,
  },

  cardTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },

  label: { color: "#6b7280" },
  value: { fontWeight: "bold", fontSize: 16 },
  sub: { color: "#6b7280" },

  progressBar: {
    height: 8,
    backgroundColor: "#ddd",
    borderRadius: 10,
    marginTop: 5,
  },

  progressFill: {
    height: 8,
    backgroundColor: "#16A34A",
    borderRadius: 10,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  analysisBox: {
    borderWidth: 1,
    borderColor: "#86efac",
    padding: 10,
    borderRadius: 12,
    marginTop: 10,
  },

  primaryBtn: {
    backgroundColor: "#0E2A4E",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  primaryText: { color: "#fff", fontWeight: "bold" },

  secondaryBtn: {
    borderWidth: 2,
    borderColor: "#0E2A4E",
    marginHorizontal: 16,
    marginBottom: 30,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  secondaryText: {
    color: "#0E2A4E",
    fontWeight: "bold",
  },
});
