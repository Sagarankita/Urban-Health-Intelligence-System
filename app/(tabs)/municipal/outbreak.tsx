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

export default function OutbreakScreen() {
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
          <Text style={styles.title}>Outbreak Detection</Text>
          <Text style={styles.subtitle}>AI-detected symptom clusters</Text>
        </View>
      </TouchableOpacity>

      {/* ALERT SUMMARY */}
      <View style={styles.alertBox}>
        <Text style={styles.alertTitle}>⚠ Active Alerts</Text>

        <View style={styles.alertRow}>
          <Summary number="4" label="Total Alerts" />
          <Summary number="2" label="Critical" />
          <Summary number="136" label="Affected Cases" />
        </View>
      </View>

      {/* CARDS */}
      <OutbreakCard
        title="Flu-like Symptoms Cluster"
        ward="Ward 1 - Shivajinagar"
        cases="42"
        growth="+35% in 48 hours"
        level="CRITICAL"
        symptoms={["Fever", "Cough", "Body Ache"]}
      />

      <OutbreakCard
        title="Respiratory Issues Surge"
        ward="Ward 9 - Viman Nagar"
        cases="38"
        growth="+28% in 24 hours"
        level="HIGH"
        symptoms={["Cough", "Shortness of Breath"]}
      />

      <OutbreakCard
        title="Gastrointestinal Symptoms"
        ward="Ward 3 - Aundh"
        cases="25"
        growth="+18% in 36 hours"
        level="MEDIUM"
        symptoms={["Nausea", "Vomiting", "Diarrhea"]}
      />

      <OutbreakCard
        title="Dengue-like Symptoms"
        ward="Ward 5 - Pimpri"
        cases="31"
        growth="+22% in 24 hours"
        level="HIGH"
        symptoms={["High Fever", "Joint Pain", "Rash"]}
      />

      {/* AI INFO */}
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>AI Detection System</Text>
        <Text style={styles.infoText}>
          Our system analyzes symptom patterns, geographic clustering, and
          trends to detect outbreaks in real-time.
        </Text>
      </View>

      {/* ACTIONS */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Recommended Actions</Text>

        <Action text="Deploy field investigation teams" />
        <Action text="Coordinate with hospitals for resources" />
        <Action text="Issue public advisories" />
        <Action text="Arrange testing camps" />
      </View>
    </ScrollView>
  );
}
function Summary({ number, label }: any) {
  return (
    <View>
      <Text style={styles.summaryNumber}>{number}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}
function OutbreakCard({ title, ward, cases, growth, level, symptoms }: any) {
  const color =
    level === "CRITICAL" ? "#EF4444" : level === "HIGH" ? "#F97316" : "#EAB308";

  return (
    <View style={styles.outbreakCard}>
      <View style={styles.rowBetween}>
        <Text style={styles.cardTitle}>{title}</Text>

        <View style={[styles.badge, { backgroundColor: color + "20" }]}>
          <Text style={{ color, fontWeight: "bold" }}>{level}</Text>
        </View>
      </View>

      <Text style={styles.subText}>📍 {ward}</Text>

      <View style={styles.rowBetween}>
        <View style={styles.smallBox}>
          <Text>Affected Cases</Text>
          <Text style={styles.big}>{cases}</Text>
        </View>

        <View style={styles.smallBox}>
          <Text>Growth Rate</Text>
          <Text style={{ color: "red", fontWeight: "bold" }}>{growth}</Text>
        </View>
      </View>

      {/* Symptoms */}
      <Text style={styles.subText}>Common Symptoms:</Text>
      <View style={styles.tagRow}>
        {symptoms.map((s: string, i: number) => (
          <Text key={i} style={styles.tag}>
            {s}
          </Text>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.rowBetween}>
        <Text style={styles.time}>⏱ Detected recently</Text>
        <Text style={{ color: "red" }}>● Active</Text>
      </View>

      {/* Buttons */}
      <View style={styles.btnRow}>
        <TouchableOpacity style={styles.btnDark}>
          <Text style={{ color: "#fff" }}>Investigate</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnBlue}>
          <Text style={{ color: "#fff" }}>Send Alert</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
function Action({ text }: any) {
  return (
    <View style={styles.actionRow}>
      <View style={styles.circle}>
        <Text style={{ color: "#16A34A" }}>✓</Text>
      </View>
      <Text style={{ flex: 1 }}>{text}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6", padding: 16 },

  header: { flexDirection: "row", alignItems: "center", gap: 10 },

  title: { fontSize: 22, fontWeight: "bold" },
  subtitle: { color: "#6b7280" },

  alertBox: {
    backgroundColor: "#F97316",
    padding: 16,
    borderRadius: 16,
    marginVertical: 10,
  },

  alertTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },

  alertRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  summaryNumber: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  summaryLabel: { color: "#fff" },

  outbreakCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginVertical: 10,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardTitle: { fontWeight: "bold", fontSize: 16 },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  subText: { color: "#6b7280", marginVertical: 6 },

  smallBox: {
    backgroundColor: "#F3F4F6",
    padding: 12,
    borderRadius: 12,
    width: "48%",
  },

  big: { fontSize: 20, fontWeight: "bold" },

  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },

  tag: {
    backgroundColor: "#E0E7FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    color: "#1D4ED8",
  },

  time: { color: "#6b7280" },

  btnRow: { flexDirection: "row", marginTop: 10, gap: 10 },

  btnDark: {
    backgroundColor: "#0E2A4E",
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  btnBlue: {
    backgroundColor: "#0EA5E9",
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  infoBox: {
    backgroundColor: "#DBEAFE",
    padding: 16,
    borderRadius: 12,
    marginVertical: 10,
  },

  infoTitle: { fontWeight: "bold" },
  infoText: { color: "#1E3A8A" },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
  },

  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },

  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },

  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
  },
});
