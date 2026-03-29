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

export default function HeatmapScreen() {
  const router = useRouter();
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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
      {/* HEADER */}
      <Text style={styles.title}>Ward Symptom Heatmap</Text>
      <Text style={styles.subtitle}>Symptom density across Pune</Text>

      {/* SUMMARY */}
      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>City-Wide Summary</Text>

        <View style={styles.summaryRow}>
          <SummaryItem value="247" label="Total Reports" />
          <SummaryItem value="10" label="Active Wards" />
          <SummaryItem value="3" label="High Risk" />
        </View>
      </View>

      {/* TOP SYMPTOMS */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Top Reported Symptoms</Text>

        <Symptom name="Fever" value={78} />
        <Symptom name="Cough" value={65} />
        <Symptom name="Headache" value={52} />
        <Symptom name="Body Ache" value={41} />
      </View>

      {/* WARD ANALYSIS */}
      <Text style={styles.sectionTitle2}>Ward-wise Analysis</Text>

      <WardCard
        name="Ward 1 - Shivajinagar"
        risk="HIGH"
        value={85}
        trend="+18% increase"
        color="#EF4444"
      />
      <WardCard
        name="Ward 2 - Kothrud"
        risk="MEDIUM"
        value={58}
        trend="Stable trend"
        color="#F97316"
      />
      <WardCard
        name="Ward 3 - Aundh"
        risk="HIGH"
        value={72}
        trend="+18% increase"
        color="#EF4444"
      />
      <WardCard
        name="Ward 4 - Baner"
        risk="LOW"
        value={35}
        trend="Decreasing"
        color="#16A34A"
      />
      <WardCard
        name="Ward 9 - Viman Nagar"
        risk="HIGH"
        value={78}
        trend="+18% increase"
        color="#EF4444"
      />
      <WardCard
        name="Ward 10 - Wakad"
        risk="LOW"
        value={41}
        trend="Decreasing"
        color="#16A34A"
      />

      {/* LEGEND */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Severity Legend</Text>

        <Legend color="#EF4444" text="High Risk (70%+ reports)" />
        <Legend color="#F97316" text="Medium Risk (40-70%)" />
        <Legend color="#16A34A" text="Low Risk (<40%)" />
      </View>

      {/* ALERT */}
      <View style={styles.alert}>
        <Ionicons name="alert-circle-outline" size={20} color="#B45309" />
        <Text style={styles.alertText}>
          Action Required: Ward 1, Ward 3, and Ward 9 show elevated symptom
          density.
        </Text>
      </View>
    </ScrollView>
  );
}
function SummaryItem({ value, label }: any) {
  return (
    <View>
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}
function Symptom({ name, value }: any) {
  return (
    <View style={{ marginBottom: 12 }}>
      <View style={styles.rowBetween}>
        <Text>{name}</Text>
        <Text>{value}</Text>
      </View>

      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${value}%` }]} />
      </View>
    </View>
  );
}
function WardCard({ name, risk, value, trend, color }: any) {
  return (
    <View style={[styles.wardCard, { borderColor: color }]}>
      <View style={styles.rowBetween}>
        <Text style={styles.wardTitle}>{name}</Text>

        <View style={[styles.badge, { backgroundColor: color + "20" }]}>
          <Text style={{ color, fontWeight: "bold" }}>{risk}</Text>
        </View>
      </View>

      <Text style={styles.subText}>Symptom reports today</Text>

      <View style={styles.rowBetween}>
        <Text>Risk Level</Text>
        <Text>{value}%</Text>
      </View>

      <View style={styles.barBg}>
        <View
          style={[
            styles.barFill,
            { width: `${value}%`, backgroundColor: color },
          ]}
        />
      </View>

      <Text style={styles.trend}>{trend}</Text>
    </View>
  );
}
function Legend({ color, text }: any) {
  return (
    <View style={styles.legendRow}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text>{text}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6", padding: 16 },

  title: { fontSize: 22, fontWeight: "bold" },
  subtitle: { color: "#6b7280", marginBottom: 10 },

  summary: {
    backgroundColor: "#9333EA",
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
  summaryLabel: { color: "#ddd" },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginVertical: 10,
  },

  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  sectionTitle2: { fontSize: 18, fontWeight: "bold", marginTop: 10 },

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
    backgroundColor: "#0EA5E9",
    borderRadius: 5,
  },

  wardCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    marginVertical: 8,
  },

  wardTitle: { fontWeight: "bold" },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  subText: { color: "#6b7280", marginVertical: 5 },

  trend: { marginTop: 8, color: "#6b7280" },

  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  dot: {
    width: 14,
    height: 14,
    borderRadius: 4,
    marginRight: 10,
  },

  alert: {
    backgroundColor: "#FEF3C7",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },

  alertText: { color: "#92400E", flex: 1 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
});
