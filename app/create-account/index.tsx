import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function CreateAccountScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/login")}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Create Account</Text>
        <Text style={styles.headerSub}>Select your account type</Text>
      </View>

      {/* CONTENT */}
      <View style={styles.content}>
        <Text style={styles.title}>Choose Your Role</Text>
        <Text style={styles.subtitle}>
          Select the type of account you want to create
        </Text>

        {/* PATIENT */}
        <RoleCard
          icon="person-outline"
          title="Patient"
          desc="Access healthcare services, report symptoms, and book appointments"
          color="#2563EB"
          onPress={() => router.push("/create-account/patient")}
        />

        {/* HOSPITAL */}
        <RoleCard
          icon="medkit-outline"
          title="Hospital"
          desc="Manage patient reports, appointments, and bed availability"
          color="#16A34A"
          onPress={() => router.push("/create-account/hospital")}
        />

        {/* MUNICIPAL */}
        <RoleCard
          icon="business-outline"
          title="Municipal Authority"
          desc="Monitor city-wide health trends and manage public advisories"
          color="#9333EA"
          onPress={() => router.push("/create-account/municipal")}
        />
      </View>
    </ScrollView>
  );
}
function RoleCard({ icon, title, desc, color, onPress }: any) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={[styles.iconBox, { backgroundColor: color + "20" }]}>
        <Ionicons name={icon} size={26} color={color} />
      </View>

      <View style={{ flex: 1, marginLeft: 15 }}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDesc}>{desc}</Text>
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

  headerTitle: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 10,
  },

  headerSub: { color: "#cbd5e1" },

  content: { padding: 20 },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },

  subtitle: {
    textAlign: "center",
    color: "#6b7280",
    marginTop: 5,
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    elevation: 3,
  },

  iconBox: {
    padding: 14,
    borderRadius: 12,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },

  cardDesc: {
    color: "#6b7280",
    marginTop: 4,
  },
});
