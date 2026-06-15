import API from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CapacityScreen() {
  const router = useRouter();
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchCapacity();
    }, [])
  );

  const fetchCapacity = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/resources/municipal");
      setHospitals(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch capacity:", err);
    } finally {
      setLoading(false);
    }
  };

  const totalGenBeds = hospitals.reduce((s, h) => s + (h.gen_beds || 0), 0);
  const totalIcuBeds = hospitals.reduce((s, h) => s + (h.icu_beds || 0), 0);
  const totalVents = hospitals.reduce((s, h) => s + (h.ventilators || 0), 0);

  const limitedHospitals = hospitals.filter((h) => h.status === "LIMITED");

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
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

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#1E88E5"
          style={{ marginTop: 40 }}
        />
      ) : (
        <>
          {/* CITY SUMMARY */}
          <View style={styles.summary}>
            <Text style={styles.summaryTitle}>City-Wide Capacity</Text>

            <View style={styles.summaryRow}>
              <Summary value={String(totalGenBeds)} label="General Beds" />
              <Summary value={String(totalIcuBeds)} label="ICU Beds" />
              <Summary value={String(totalVents)} label="Ventilators" />
            </View>
          </View>

          {/* HOSPITAL LIST */}
          {hospitals.map((h) => (
            <HospitalCard
              key={h.id}
              name={h.name}
              area={h.location || "N/A"}
              status={h.status === "ACTIVE" ? "Active" : h.status === "LIMITED" ? "Limited" : "Closed"}
              genBeds={h.gen_beds || 0}
              icuBeds={h.icu_beds || 0}
              ventilators={h.ventilators || 0}
            />
          ))}

          {/* ALERT */}
          {limitedHospitals.length > 0 && (
            <View style={styles.alert}>
              <Text style={styles.alertTitle}>⚠ Capacity Alert</Text>
              <Text style={styles.alertText}>
                {limitedHospitals.map((h) => h.name).join(" and ")}{" "}
                {limitedHospitals.length === 1 ? "is" : "are"} approaching
                capacity limits.
              </Text>
            </View>
          )}

          {/* INFO */}
          <View style={styles.info}>
            <Text style={styles.infoText}>
              Real-time Updates: Data is synced from hospital systems
              automatically.
            </Text>
          </View>
        </>
      )}
    </ScrollView>
  );
}

function Summary({ value, label }: any) {
  return (
    <View>
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

function HospitalCard({
  name,
  area,
  status,
  genBeds,
  icuBeds,
  ventilators,
}: any) {
  const statusColor =
    status === "Active" ? "#16A34A" : status === "Limited" ? "#F97316" : "#EF4444";

  // Estimated total capacity for percentage display
  const genTotal = Math.max(genBeds * 4, 100);
  const icuTotal = Math.max(icuBeds * 3, 10);
  const ventTotal = Math.max(ventilators * 2, 10);

  return (
    <View style={styles.card}>
      {/* HEADER */}
      <View style={styles.cardHeader}>
        <Ionicons name="medkit-outline" size={24} color="#fff" />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.cardTitle}>{name}</Text>
          <Text style={styles.cardSub}>{area}</Text>
        </View>

        <View style={[styles.badge, { backgroundColor: statusColor + "20" }]}>
          <Text style={{ color: statusColor }}>{status}</Text>
        </View>
      </View>

      {/* METRICS */}
      <Metric label="General Beds" value={`${genBeds}/${genTotal}`} />
      <Metric label="ICU Beds" value={`${icuBeds}/${icuTotal}`} />
      <Metric label="Ventilators" value={`${ventilators}/${ventTotal}`} />

      <Text style={styles.updated}>Live data from hospital system ✔</Text>
    </View>
  );
}

function Metric({ label, value }: any) {
  const [used, total] = value.split("/").map(Number);
  const percent = total > 0 ? (used / total) * 100 : 0;

  const color =
    percent > 80 ? "#EF4444" : percent > 50 ? "#F97316" : "#22C55E";

  return (
    <View style={styles.metricBox}>
      <View style={styles.rowBetween}>
        <Text>{label}</Text>
        <Text style={{ color, fontWeight: "bold" }}>{value}</Text>
      </View>

      <View style={styles.barBg}>
        <View
          style={[
            styles.barFill,
            { width: `${percent}%`, backgroundColor: color },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6", padding: 16 },

  header: { flexDirection: "row", alignItems: "center", gap: 10 },

  title: { fontSize: 22, fontWeight: "bold" },
  subtitle: { color: "#6b7280" },

  summary: {
    backgroundColor: "#16A34A",
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
  summaryLabel: { color: "#DCFCE7" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginVertical: 10,
    overflow: "hidden",
  },

  cardHeader: {
    backgroundColor: "#0E2A4E",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  cardTitle: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  cardSub: { color: "#cbd5e1" },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  metricBox: {
    backgroundColor: "#FFF7ED",
    margin: 10,
    padding: 12,
    borderRadius: 12,
  },

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
    borderRadius: 5,
  },

  updated: {
    margin: 10,
    color: "#6b7280",
  },

  alert: {
    backgroundColor: "#FEF3C7",
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
  },

  alertTitle: { fontWeight: "bold", color: "#92400E" },
  alertText: { color: "#92400E" },

  info: {
    backgroundColor: "#DBEAFE",
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
  },

  infoText: { color: "#1E3A8A" },
});
