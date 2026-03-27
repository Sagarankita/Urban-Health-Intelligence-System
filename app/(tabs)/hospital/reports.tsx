import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ReportsScreen() {
  const router = useRouter();
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.header}>
        <Ionicons
          name="chevron-back"
          size={24}
          onPress={() => router.replace("/(tabs)/hospital")}
        />
        <View>
          <Text style={styles.title}>Incoming Patient Reports</Text>
          <Text style={styles.subtitle}>Real-time symptom alerts</Text>
        </View>
      </View>

      {/* REPORTS */}
      <ReportCard
        name="Vikram Singh"
        ward="Ward 23, Pune"
        symptoms={["Fever", "Cough", "Fatigue"]}
        score={72}
        level="High"
        time="2 hours ago"
        isNew
      />

      <ReportCard
        name="Meera Patel"
        ward="Ward 15, Pune"
        symptoms={["Headache", "Body Ache"]}
        score={45}
        level="Moderate"
        time="3 hours ago"
        isNew
      />

      <ReportCard
        name="Arjun Reddy"
        ward="Ward 8, Pune"
        symptoms={["Nausea", "Dizziness"]}
        score={28}
        level="Low"
        time="5 hours ago"
      />

      <ReportCard
        name="Priya Sharma"
        ward="Ward 10, Pune"
        symptoms={["Chest Pain", "Shortness of Breath"]}
        score={85}
        level="High"
        time="30 mins ago"
        isNew
      />

      <ReportCard
        name="Rohit Kumar"
        ward="Ward 5, Pune"
        symptoms={["Sore Throat", "Runny Nose"]}
        score={22}
        level="Low"
        time="6 hours ago"
      />

      {/* INFO */}
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          Auto-refresh: This screen updates automatically when new reports are
          submitted.
        </Text>
      </View>
    </ScrollView>
  );
}
function ReportCard({ name, ward, symptoms, score, level, time, isNew }: any) {
  const getColor = () => {
    if (level === "High") return "#EF4444";
    if (level === "Moderate") return "#F97316";
    return "#22C55E";
  };

  const color = getColor();

  return (
    <View style={[styles.card, isNew && styles.newCard]}>
      {/* HEADER */}
      <View style={styles.rowBetween}>
        <View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.ward}>{ward}</Text>
        </View>

        {isNew && (
          <View style={styles.newBadge}>
            <Text style={{ color: "#fff" }}>NEW</Text>
          </View>
        )}
      </View>

      {/* SYMPTOMS */}
      <Text style={styles.label}>Reported Symptoms:</Text>
      <View style={styles.tagRow}>
        {symptoms.map((s: string, i: number) => (
          <Text key={i} style={styles.tag}>
            {s}
          </Text>
        ))}
      </View>

      {/* SCORE */}
      <View style={[styles.scoreBox, { backgroundColor: color + "20" }]}>
        <Text style={styles.scoreLabel}>AI Severity Score</Text>

        <View style={{ alignItems: "flex-end" }}>
          <Text style={[styles.score, { color }]}>{score}</Text>
          <Text style={{ color }}>{level}</Text>
        </View>
      </View>

      {/* TIME */}
      <Text style={styles.time}>⏱ Reported {time}</Text>

      {/* BUTTONS */}
      <View style={styles.btnRow}>
        <TouchableOpacity style={styles.btnRed}>
          <Text style={{ color: "#fff" }}>Mark Critical</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnDark}>
          <Text style={{ color: "#fff" }}>Recommend Visit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6", padding: 16 },

  header: { flexDirection: "row", alignItems: "center", gap: 10 },

  title: { fontSize: 22, fontWeight: "bold" },
  subtitle: { color: "#6b7280" },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginVertical: 10,
  },

  newCard: {
    borderWidth: 2,
    borderColor: "#0EA5E9",
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  name: { fontSize: 16, fontWeight: "bold" },
  ward: { color: "#6b7280" },

  newBadge: {
    backgroundColor: "#0EA5E9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },

  label: { marginTop: 10 },

  tagRow: { flexDirection: "row", gap: 8, flexWrap: "wrap", marginTop: 5 },

  tag: {
    backgroundColor: "#E0E7FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    color: "#1D4ED8",
  },

  scoreBox: {
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  scoreLabel: { fontWeight: "bold" },

  score: { fontSize: 22, fontWeight: "bold" },

  time: { color: "#6b7280", marginTop: 8 },

  btnRow: { flexDirection: "row", marginTop: 10, gap: 10 },

  btnRed: {
    flex: 1,
    backgroundColor: "#EF4444",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  btnDark: {
    flex: 1,
    backgroundColor: "#0E2A4E",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  infoBox: {
    backgroundColor: "#DBEAFE",
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
  },

  infoText: { color: "#1E3A8A" },
});
