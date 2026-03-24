import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function CapacityScreen() {
  const router = useRouter();

  const [generalBeds, setGeneralBeds] = useState("45");
  const [icuBeds, setIcuBeds] = useState("8");
  const [ventilators, setVentilators] = useState("12");

  const [status, setStatus] = useState("active");

  const calcPercent = (available: number, total: number) => {
    return Math.round(((total - available) / total) * 100);
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/(tabs)/hospital")}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>

        <Text style={styles.title}>Bed Availability Update</Text>
        <Text style={styles.subtitle}>Update real-time availability</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* GENERAL BEDS */}
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={[styles.iconBox, { backgroundColor: "#E8F5E9" }]}>
              <Ionicons name="bed-outline" size={22} color="green" />
            </View>
            <View>
              <Text style={styles.cardTitle}>General Beds</Text>
              <Text style={styles.cardSub}>Total capacity: 200</Text>
            </View>
          </View>

          <Text style={styles.label}>Available Beds</Text>

          <TextInput
            value={generalBeds}
            onChangeText={setGeneralBeds}
            keyboardType="numeric"
            style={styles.input}
          />

          <View style={styles.progressRow}>
            <Text>Occupancy</Text>
            <Text>{calcPercent(Number(generalBeds), 200)}%</Text>
          </View>

          <View style={styles.progressBg}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${calcPercent(Number(generalBeds), 200)}%`,
                  backgroundColor: "green",
                },
              ]}
            />
          </View>
        </View>

        {/* ICU */}
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={[styles.iconBox, { backgroundColor: "#FDECEA" }]}>
              <Ionicons name="pulse-outline" size={22} color="red" />
            </View>
            <View>
              <Text style={styles.cardTitle}>ICU Beds</Text>
              <Text style={styles.cardSub}>Total capacity: 20</Text>
            </View>
          </View>

          <Text style={styles.label}>Available ICU Beds</Text>

          <TextInput
            value={icuBeds}
            onChangeText={setIcuBeds}
            keyboardType="numeric"
            style={styles.input}
          />

          <View style={styles.progressRow}>
            <Text>Occupancy</Text>
            <Text>{calcPercent(Number(icuBeds), 20)}%</Text>
          </View>

          <View style={styles.progressBg}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${calcPercent(Number(icuBeds), 20)}%`,
                  backgroundColor: "red",
                },
              ]}
            />
          </View>
        </View>

        {/* VENTILATORS */}
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={[styles.iconBox, { backgroundColor: "#E3F2FD" }]}>
              <Ionicons name="speedometer-outline" size={22} color="#1976D2" />
            </View>
            <View>
              <Text style={styles.cardTitle}>Ventilators</Text>
              <Text style={styles.cardSub}>Total capacity: 25</Text>
            </View>
          </View>

          <Text style={styles.label}>Available Ventilators</Text>

          <TextInput
            value={ventilators}
            onChangeText={setVentilators}
            keyboardType="numeric"
            style={styles.input}
          />

          <View style={styles.progressRow}>
            <Text>In Use</Text>
            <Text>{calcPercent(Number(ventilators), 25)}%</Text>
          </View>

          <View style={styles.progressBg}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${calcPercent(Number(ventilators), 25)}%`,
                  backgroundColor: "#1976D2",
                },
              ]}
            />
          </View>
        </View>

        {/* EMERGENCY STATUS */}
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={[styles.iconBox, { backgroundColor: "#FFF3E0" }]}>
              <Ionicons name="alert-circle-outline" size={22} color="#F57C00" />
            </View>
            <View>
              <Text style={styles.cardTitle}>Emergency Services</Text>
              <Text style={styles.cardSub}>Current availability status</Text>
            </View>
          </View>

          {["active", "limited", "closed"].map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => setStatus(item)}
              style={[styles.statusBtn, status === item && styles.activeStatus]}
            >
              <Text
                style={
                  status === item ? styles.activeStatusText : styles.statusText
                }
              >
                {item === "active"
                  ? "Active - Accepting Patients"
                  : item === "limited"
                    ? "Limited - At Capacity"
                    : "Closed - Not Accepting"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* SUMMARY */}
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Current Availability Summary</Text>

          <View style={styles.summaryRow}>
            <Text>General Beds</Text>
            <Text>{generalBeds}/200</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text>ICU Beds</Text>
            <Text>{icuBeds}/20</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text>Ventilators</Text>
            <Text>{ventilators}/25</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text>Emergency</Text>
            <Text style={{ color: "green", fontWeight: "600" }}>
              {status.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },

  header: {
    padding: 16,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 8,
  },

  subtitle: {
    color: "#666",
  },

  card: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 16,
    borderRadius: 16,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  cardTitle: {
    fontWeight: "700",
    fontSize: 16,
  },

  cardSub: {
    color: "#666",
  },

  label: {
    marginTop: 10,
    marginBottom: 6,
    fontWeight: "500",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },

  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  progressBg: {
    height: 8,
    backgroundColor: "#eee",
    borderRadius: 10,
    marginTop: 6,
  },

  progressFill: {
    height: 8,
    borderRadius: 10,
  },

  statusBtn: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    marginTop: 10,
  },

  activeStatus: {
    backgroundColor: "#E8F5E9",
    borderColor: "#4CAF50",
  },

  statusText: {
    textAlign: "center",
  },

  activeStatusText: {
    textAlign: "center",
    color: "#2E7D32",
    fontWeight: "600",
  },

  summary: {
    margin: 16,
    padding: 16,
    backgroundColor: "#E3F2FD",
    borderRadius: 16,
  },

  summaryTitle: {
    fontWeight: "700",
    marginBottom: 10,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
});
