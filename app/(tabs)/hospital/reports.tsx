import API from "@/services/api";
import { useAuth } from "@/services/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ReportsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const HOSPITAL_ID = user?.hospital_id || 1;
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/reports", {
        params: { hospital_id: HOSPITAL_ID },
      });
      setReports(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    } finally {
      setLoading(false);
    }
  }, [HOSPITAL_ID]);

  useFocusEffect(
    useCallback(() => {
      fetchReports();
    }, [fetchReports])
  );

  const handleMarkCritical = async (id: number) => {
    try {
      setActionLoading(id);
      await API.patch(`/api/reports/${id}/critical`, { is_critical: true });
      await fetchReports();
    } catch (err) {
      console.error("Failed to mark critical:", err);
      Alert.alert("Error", "Could not mark report as critical");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRecommendVisit = async (id: number) => {
    try {
      setActionLoading(id);
      await API.patch(`/api/reports/${id}/status`, { status: "ACKNOWLEDGED" });
      await fetchReports();
      Alert.alert("Done", "Patient has been recommended for a visit");
    } catch (err) {
      console.error("Failed to update report:", err);
      Alert.alert("Error", "Could not update report");
    } finally {
      setActionLoading(null);
    }
  };

  const getTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} mins ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hours ago`;
    return `${Math.floor(hours / 24)} days ago`;
  };

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

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#1E88E5"
          style={{ marginTop: 40 }}
        />
      ) : reports.length === 0 ? (
        <View style={styles.emptyCard}>
          <Ionicons name="document-outline" size={40} color="#9ca3af" />
          <Text style={{ color: "#6b7280", marginTop: 10, fontSize: 16 }}>
            No patient reports yet
          </Text>
        </View>
      ) : (
        reports.map((report) => {
          const symptoms = Array.isArray(report.symptoms)
            ? report.symptoms
            : (() => {
                try {
                  return JSON.parse(report.symptoms);
                } catch {
                  return [];
                }
              })();
          const isNew = report.status === "NEW";

          return (
            <ReportCard
              key={report.id}
              name={report.patient_name || "Unknown Patient"}
              ward={report.ward || "Unknown Ward"}
              symptoms={symptoms}
              score={report.severity}
              level={report.risk}
              time={getTimeAgo(report.created_at)}
              isNew={isNew}
              isCritical={report.is_critical}
              loading={actionLoading === report.id}
              onMarkCritical={() => handleMarkCritical(report.id)}
              onRecommendVisit={() => handleRecommendVisit(report.id)}
            />
          );
        })
      )}

      {/* INFO */}
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          Auto-refresh: Pull down to refresh or re-enter this screen for latest
          reports.
        </Text>
      </View>
    </ScrollView>
  );
}

function ReportCard({
  name,
  ward,
  symptoms,
  score,
  level,
  time,
  isNew,
  isCritical,
  loading,
  onMarkCritical,
  onRecommendVisit,
}: any) {
  const getColor = () => {
    if (level === "Severe" || level === "High") return "#EF4444";
    if (level === "Moderate") return "#F97316";
    return "#22C55E";
  };

  const color = getColor();

  return (
    <View style={[styles.card, isNew && styles.newCard, isCritical && styles.criticalCard]}>
      {/* HEADER */}
      <View style={styles.rowBetween}>
        <View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.ward}>{ward}</Text>
        </View>

        <View style={{ flexDirection: "row", gap: 6 }}>
          {isCritical && (
            <View style={styles.criticalBadge}>
              <Text style={{ color: "#fff", fontSize: 11 }}>CRITICAL</Text>
            </View>
          )}
          {isNew && (
            <View style={styles.newBadge}>
              <Text style={{ color: "#fff" }}>NEW</Text>
            </View>
          )}
        </View>
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
        <TouchableOpacity
          style={[styles.btnRed, isCritical && { opacity: 0.5 }]}
          onPress={onMarkCritical}
          disabled={isCritical || loading}
        >
          <Text style={{ color: "#fff" }}>
            {loading ? "..." : isCritical ? "Marked Critical" : "Mark Critical"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnDark}
          onPress={onRecommendVisit}
          disabled={loading}
        >
          <Text style={{ color: "#fff" }}>
            {loading ? "..." : "Recommend Visit"}
          </Text>
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

  criticalCard: {
    borderWidth: 2,
    borderColor: "#EF4444",
  },

  emptyCard: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    marginTop: 20,
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

  criticalBadge: {
    backgroundColor: "#EF4444",
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
