import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
export default function MunicipalDashboard() {
  const router = useRouter();
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          {/* LEFT SIDE */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={styles.iconBox}>
              <Ionicons name="shield-outline" size={26} color="#fff" />
            </View>

            <View style={{ marginLeft: 10 }}>
              <Text style={styles.title}>Municipal Dashboard</Text>
              <Text style={styles.subtitle}>Pune City Health Monitor</Text>
            </View>
          </View>

          {/* RIGHT SIDE */}
          <TouchableOpacity
            style={styles.logout}
            onPress={() => router.replace("/login")}
          >
            <Ionicons name="log-out-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.userCard}>
          <Text style={styles.logged}>Logged in as</Text>
          <Text style={styles.name}>Dr. Rajesh Patil</Text>
          <Text style={styles.role}>Municipal Health Officer</Text>
        </View>

        {/* OVERVIEW */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>City Health Overview</Text>

          <View style={styles.grid}>
            <StatBox
              title="Reports Today"
              value="247"
              color="#3B82F6"
              sub="+12% vs yesterday"
            />
            <StatBox
              title="High Risk"
              value="23"
              color="#EF4444"
              sub="Requires attention"
            />
            <StatBox
              title="Available Beds"
              value="342"
              color="#22C55E"
              sub="Across 12 hospitals"
            />
            <StatBox
              title="ICU Available"
              value="48"
              color="#F97316"
              sub="62% capacity"
            />
          </View>
        </View>

        {/* TOP SYMPTOMS */}
        <View style={styles.symptomCard}>
          <Text style={styles.symptomTitle}>Top Symptoms Today</Text>

          <SymptomRow name="Fever" value={78} />
          <SymptomRow name="Cough" value={65} />
          <SymptomRow name="Headache" value={52} />
        </View>

        {/* TOOLS */}
        <Text style={styles.sectionTitle2}>Monitoring Tools</Text>

        <ActionCard
          icon="map-outline"
          title="Ward Symptom Heatmap"
          subtitle="Symptom density by ward"
          onPress={() => router.push("/municipal/heatmap")}
        />
        <ActionCard
          icon="warning-outline"
          title="Outbreak Detection"
          subtitle="Unusual symptom clusters"
          badge="3 Alerts"
          onPress={() => router.push("/(tabs)/municipal/outbreak")}
        />
        <ActionCard
          icon="medkit-outline"
          title="Hospital Capacity Monitor"
          subtitle="Real-time bed availability"
          onPress={() => router.push("/(tabs)/municipal/capacity")}
        />
        <ActionCard
          icon="notifications-outline"
          title="Public Health Advisory"
          subtitle="Send alerts to citizens"
          onPress={() => router.push("/(tabs)/municipal/advisory")}
        />

        {/* INFO BOX */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Real-time Monitoring: All data is updated automatically from
            hospitals and patient reports across Pune city.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
function StatBox({ title, value, color, sub }: any) {
  return (
    <View style={[styles.statBox, { backgroundColor: color + "20" }]}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={{ color }}>{sub}</Text>
    </View>
  );
}
function SymptomRow({ name, value }: any) {
  return (
    <View style={styles.symptomRow}>
      <Text style={styles.symptomText}>{name}</Text>
      <View style={styles.barContainer}>
        <View style={[styles.barFill, { width: `${value}%` }]} />
      </View>
      <Text style={styles.symptomValue}>{value}</Text>
    </View>
  );
}
function ActionCard({ icon, title, subtitle, badge, onPress }: any) {
  return (
    <TouchableOpacity style={styles.actionCard} onPress={onPress}>
      <Ionicons name={icon} size={22} color="#6b7280" />

      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionSub}>{subtitle}</Text>
      </View>

      {badge && (
        <View style={styles.badge}>
          <Text style={{ color: "#fff", fontSize: 12 }}>{badge}</Text>
        </View>
      )}

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

  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  iconBox: {
    backgroundColor: "#1E88E5",
    padding: 10,
    borderRadius: 10,
  },

  title: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  subtitle: { color: "#cbd5e1" },

  logout: {
    backgroundColor: "#1E3A8A",
    padding: 10,
    borderRadius: 10,
  },

  userCard: {
    backgroundColor: "#1f3b66",
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
  },

  logged: { color: "#cbd5e1" },
  name: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  role: { color: "#cbd5e1" },

  card: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 16,
    borderRadius: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  statBox: {
    width: "48%",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },

  statTitle: { color: "#374151" },
  statValue: { fontSize: 22, fontWeight: "bold" },

  symptomCard: {
    backgroundColor: "#2563EB",
    margin: 16,
    padding: 16,
    borderRadius: 16,
  },

  symptomTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  symptomRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },

  symptomText: { color: "#fff", width: 80 },

  barContainer: {
    flex: 1,
    height: 6,
    backgroundColor: "#93c5fd",
    borderRadius: 5,
    marginHorizontal: 10,
  },

  barFill: {
    height: 6,
    backgroundColor: "#fff",
    borderRadius: 5,
  },

  symptomValue: { color: "#fff" },

  sectionTitle2: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 16,
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

  actionTitle: { fontWeight: "bold" },
  actionSub: { color: "#6b7280" },

  badge: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },

  infoBox: {
    backgroundColor: "#DBEAFE",
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },

  infoText: { color: "#1E3A8A" },
});
