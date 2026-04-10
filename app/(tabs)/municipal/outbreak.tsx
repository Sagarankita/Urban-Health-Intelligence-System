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

interface WardData {
  ward: string;
  zone: string;
  outbreak_prob: number;
  hotspot_score: number;
  wow_growth_pct: number | null;
  growth_48h_pct: number | null;
  syndrome: string;
  actual: number;
  hospital_load_pct: number;
  advisories: string[];
}

interface OutbreakData {
  zone_summary: { [key: string]: string[] };
  top_hotspots: WardData[];
  all_wards: WardData[];
  ward_symptoms: { [ward: string]: string[] };
  top_symptoms?: { name: string; value: number }[];
  timestamp: string;
}

export default function OutbreakScreen() {
  const router = useRouter();
  const [data, setData] = useState<OutbreakData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOutbreakData();
  }, []);

  const fetchOutbreakData = async () => {
    try {
      setError(null);
      const response = await API.get("/api/outbreaks/heatmap");
      setData(response.data);
    } catch (error: any) {
      console.error("Error fetching outbreak data:", error);
      setError(error.message || "Failed to load outbreak data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text>Loading outbreak data...</Text>
      </View>
    );
  }

  if (error && !data) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: "red", marginBottom: 10 }}>Error: {error}</Text>
        <Text>Using offline data...</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text>Failed to load data</Text>
      </View>
    );
  }

  const wards = Array.isArray((data as any)?.all_wards) ? (data as any).all_wards : [];
  const zoneSummary = (data as any)?.zone_summary || {};
  const topHotspots = Array.isArray((data as any)?.top_hotspots)
    ? (data as any).top_hotspots
    : [];

  const wardSymptomsMap = (data as any)?.ward_symptoms || {};

  // Calculate summary stats (defensive: avoids crashes on unexpected API shape)
  const totalAlerts = wards.filter(
    (w: any) => w?.zone === "RED" || w?.zone === "YELLOW"
  ).length;
  const criticalAlerts = zoneSummary.RED?.length || 0;
  const affectedCases = wards.reduce(
    (sum: number, ward: any) => sum + (ward?.actual || 0),
    0
  );

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
          <Summary number={totalAlerts.toString()} label="Total Alerts" />
          <Summary number={criticalAlerts.toString()} label="Critical" />
          <Summary number={affectedCases.toString()} label="Affected Cases" />
        </View>
      </View>

      {/* CARDS */}
      {topHotspots.slice(0, 4).map((ward: any, index: number) => (
        <OutbreakCard
          key={index}
          title={`${(ward?.syndrome || "").charAt(0).toUpperCase() + (ward?.syndrome || "").slice(1)} Symptoms Cluster`}
          ward={ward.ward}
          cases={(ward?.actual ?? 0).toString()}
          growth={
            ward?.growth_48h_pct
              ? `${ward.growth_48h_pct > 0 ? "+" : ""}${ward.growth_48h_pct.toFixed(1)}% in 48 hours`
              : "Stable"
          }
          level={
            ward?.zone === "RED" ? "CRITICAL" : ward?.zone === "YELLOW" ? "HIGH" : "MEDIUM"
          }
          symptoms={wardSymptomsMap[ward.ward] || []}
        />
      ))}

      {/* AI INFO */}
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>AI Detection System</Text>
        <Text style={styles.infoText}>
          Our system analyzes symptom patterns, geographic clustering, and
          trends to detect outbreaks in real-time using exponential smoothing
          and z-score anomaly detection.
        </Text>
      </View>

      {/* ACTIONS */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Recommended Actions</Text>

        {topHotspots.length > 0 &&
          (topHotspots[0]?.advisories || []).slice(0, 3).map((action: string, index: number) => (
          <Action key={index} text={action} />
          ))}
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
