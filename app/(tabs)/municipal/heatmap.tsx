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
}

interface HeatmapData {
  zone_summary: { [key: string]: string[] };
  top_hotspots: WardData[];
  all_wards: WardData[];
  top_symptoms: { name: string; value: number }[];
  // Added by `models/untitled10.py`, but heatmap screen only uses `top_symptoms`.
  ward_symptoms?: { [ward: string]: string[] };
  timestamp: string;
}

export default function HeatmapScreen() {
  const router = useRouter();
  const [data, setData] = useState<HeatmapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHeatmapData();
  }, []);

  const fetchHeatmapData = async () => {
    try {
      setError(null);
      const response = await API.get("/api/outbreaks/heatmap");
      setData(response.data);
    } catch (error: any) {
      console.error("Error fetching heatmap data:", error);
      setError(error.message || "Failed to load heatmap data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text>Loading heatmap data...</Text>
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
  const topSymptoms = Array.isArray((data as any)?.top_symptoms) ? (data as any).top_symptoms : [];

  const totalReports = (wards ?? []).reduce(
    (sum: number, ward: any) => sum + (ward?.actual || 0),
    0
  );

  const activeWards = (wards ?? []).length;

  const highRiskCount = zoneSummary.RED?.length || 0;

  

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
      <Text style={styles.subtitle}>AI-detected outbreak zones</Text>

      {/* SUMMARY */}
      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>City-Wide Summary</Text>

        <View style={styles.summaryRow}>
          <SummaryItem value={totalReports.toString()} label="Total Reports" />
          <SummaryItem value={activeWards.toString()} label="Active Wards" />
          <SummaryItem value={highRiskCount.toString()} label="High Risk" />
        </View>
      </View>

      {/* TOP SYMPTOMS */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Top Reported Symptoms</Text>

        {topSymptoms.map((symptom: any, index: number) => (
          <Symptom key={index} name={symptom.name} value={symptom.value} />
        ))}
      </View>

      {/* WARD ANALYSIS */}
      <Text style={styles.sectionTitle2}>Ward-wise Analysis</Text>

      {wards.slice(0, 6).map((ward: any, index: number) => (
        <WardCard
          key={index}
          name={ward.ward}
          risk={ward.zone === "RED" ? "HIGH" : ward.zone === "YELLOW" ? "MEDIUM" : "LOW"}
          value={Math.round(ward.outbreak_prob)}
          trend={ward.wow_growth_pct ? `${ward.wow_growth_pct > 0 ? "+" : ""}${ward.wow_growth_pct}% ${ward.wow_growth_pct > 0 ? "increase" : "decrease"}` : "Stable trend"}
          color={ward.zone === "RED" ? "#EF4444" : ward.zone === "YELLOW" ? "#F97316" : "#16A34A"}
        />
      ))}

      {/* LEGEND */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Severity Legend</Text>

        <Legend color="#EF4444" text="High Risk (RED Zone - 75%+ outbreak prob)" />
        <Legend color="#F97316" text="Medium Risk (YELLOW Zone - 55-75%)" />
        <Legend color="#16A34A" text="Low Risk (GREEN Zone - <55%)" />
      </View>

      {/* ALERT */}
      {highRiskCount > 0 && (
        <View style={styles.alert}>
          <Ionicons name="alert-circle-outline" size={20} color="#B45309" />
          <Text style={styles.alertText}>
            Action Required: {zoneSummary.RED?.join(", ")} show elevated outbreak probability.
          </Text>
        </View>
      )}
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
