import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
export default function Dashboard() {
  const router = useRouter();
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Welcome back,</Text>
          <Text style={styles.name}>Priya Sharma</Text>
          <Text style={styles.location}>Ward 23, Pune</Text>
        </View>

        <TouchableOpacity
          style={styles.avatar}
          onPress={() => router.push("/(tabs)/profile")}
        >
          <Ionicons name="person-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* RISK CARD */}
      <View style={styles.riskCard}>
        <View style={styles.riskIcon}>
          <Ionicons name="pulse" size={20} color="#fff" />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.riskTitle}>Current AI Risk Level</Text>
          <Text style={styles.lowRisk}>Low Risk</Text>
          <Text style={styles.riskDesc}>
            No recent symptom reports • You're doing great!
          </Text>
        </View>
      </View>

      {/* QUICK ACTIONS */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>

      <View style={styles.grid}>
        <ActionCard
          icon="document-text-outline"
          title="Report Symptoms"
          subtitle="Get AI assessment"
          onPress={() => router.push("/dashboard/report")}
        />
        <ActionCard
          icon="medkit-outline"
          title="Find Hospitals"
          subtitle="Nearby hospitals"
          onPress={() => router.push("/dashboard/find-hospital")}
        />
        <ActionCard
          icon="calendar-outline"
          title="My Appointments"
          subtitle="View & manage"
          onPress={() => router.push("/dashboard/appointment")}
        />
        <ActionCard
          icon="pulse-outline"
          title="Health Timeline"
          subtitle="Track progress"
          onPress={() => router.push("/dashboard/health-timeline")}
        />
      </View>

      {/* ADVISORIES */}
      <Text style={styles.sectionTitle}>Area Health Advisories</Text>

      <View style={styles.alertCard}>
        <Text style={styles.alertTitle}>Moderate Flu Risk in Your Ward</Text>
        <Text style={styles.alertDesc}>
          Increased respiratory infections reported in Ward 23, Pune.
        </Text>

        <View style={styles.progressBar}>
          <View style={styles.progressFill} />
        </View>

        <Text style={styles.riskPercent}>60% Risk</Text>
      </View>

      <View style={styles.simpleCard}>
        <Text style={styles.alertTitle}>Seasonal Vaccination Drive</Text>
        <Text style={styles.alertDesc}>
          Free flu vaccines available at nearby health centers.
        </Text>
      </View>

      {/* PROFILE */}
      <TouchableOpacity
        style={styles.profileCard}
        onPress={() => router.push("/(tabs)/profile")}
      >
        <Ionicons name="person-circle-outline" size={28} color="#0E2A4E" />

        <View style={{ marginLeft: 10 }}>
          <Text style={{ fontWeight: "600" }}>Profile Settings</Text>
          <Text style={{ color: "gray" }}>PM-JAY • ABHA: 1234</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ACTION CARD COMPONENT */
function ActionCard({ icon, title, subtitle, onPress }: any) {
  return (
    <TouchableOpacity style={styles.actionCard} onPress={onPress}>
      <View style={styles.actionIcon}>
        <Ionicons name={icon} size={18} color="#1E88E5" />
      </View>
      <Text style={styles.actionTitle}>{title}</Text>
      <Text style={styles.actionSubtitle}>{subtitle}</Text>
    </TouchableOpacity>
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
    paddingTop: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  welcome: { color: "#cbd5e1" },
  name: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  location: { color: "#cbd5e1", marginTop: 4 },

  avatar: {
    backgroundColor: "#1E3A5F",
    padding: 12,
    borderRadius: 25,
  },

  riskCard: {
    backgroundColor: "#E6F4EA",
    marginHorizontal: 20,
    marginTop: 20,
    padding: 18,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
  },

  riskIcon: {
    backgroundColor: "#16A34A",
    padding: 12,
    borderRadius: 30,
    marginRight: 12,
  },

  riskTitle: { fontSize: 14 },
  lowRisk: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#15803D",
    marginTop: 4,
  },
  riskDesc: { fontSize: 13, marginTop: 4 },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 20,
    marginTop: 25,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 15,
  },

  actionCard: {
    display: "flex",
    backgroundColor: "#fff",
    width: "100%",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 1,
    height: 120,
    justifyContent: "center",
  },

  actionIcon: {
    backgroundColor: "#E3F2FD",
    padding: 12,
    borderRadius: 14,
    alignSelf: "flex-start",
    marginBottom: 10,
  },

  actionTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },

  actionSubtitle: {
    fontSize: 13,
    color: "gray",
    marginTop: 4,
  },

  alertCard: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 16,
    borderRadius: 18,
    elevation: 2,
  },

  alertTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },

  alertDesc: {
    marginTop: 5,
    color: "gray",
  },

  progressBar: {
    height: 6,
    backgroundColor: "#eee",
    borderRadius: 10,
    marginTop: 12,
  },

  progressFill: {
    width: "60%",
    height: 6,
    backgroundColor: "orange",
    borderRadius: 10,
  },

  riskPercent: {
    marginTop: 6,
    fontWeight: "bold",
    color: "orange",
  },

  simpleCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 16,
    borderRadius: 18,
    elevation: 2,
  },

  profileCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 16,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },
});
