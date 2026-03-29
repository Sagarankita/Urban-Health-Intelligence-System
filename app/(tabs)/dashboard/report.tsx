import API from "../../services/api";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ReportSymptoms() {
  const router = useRouter();

  const symptoms = [
    "Fever",
    "Cough",
    "Headache",
    "Fatigue",
    "Body Ache",
    "Sore Throat",
    "Nausea",
    "Dizziness",
    "Shortness of Breath",
    "Chest Pain",
    "Loss of Taste",
    "Runny Nose",
  ];

  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [duration, setDuration] = useState("");
  const [severity, setSeverity] = useState(50);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const toggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const getRiskCardStyles = (risk: string) => {
    switch (risk?.toUpperCase()) {
      case "LOW":
        return { backgroundColor: "#D1FAE5", borderLeftColor: "#10B981", textColor: "#047857" };
      case "MEDIUM":
        return { backgroundColor: "#FEF3C7", borderLeftColor: "#F59E0B", textColor: "#92400E" };
      case "HIGH":
        return { backgroundColor: "#FED7AA", borderLeftColor: "#F97316", textColor: "#9A3412" };
      case "CRITICAL":
        return { backgroundColor: "#FEE2E2", borderLeftColor: "#EF4444", textColor: "#991B1B" };
      default:
        return { backgroundColor: "#F3F4F6", borderLeftColor: "#9CA3AF", textColor: "#374151" };
    }
  };

  const handleAnalyze = async () => {
  if (selectedSymptoms.length === 0 || !duration) {
    alert("Please select symptoms and duration");
    return;
  }

  try {
    setLoading(true);
    const res = await API.post("/api/analyze", {
      symptoms: selectedSymptoms,
      duration,
      severity,
    });
    console.log("FRONTEND RESPONSE:", res.data);
    setResult(res.data);
    router.push({
      pathname: "/dashboard",
      params: {
        risk: res.data.risk,
        recommendation: res.data.recommendation,
      },
    });
  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  } finally {
    setLoading(false);
  }
};

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/dashboard")}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Report Symptoms</Text>
        <Text style={styles.headerSubtitle}>
          AI-powered severity assessment
        </Text>
      </View>

      {/* LOCATION */}

      <View style={styles.locationRow}>
        <Ionicons name="location-outline" size={18} color="#1E88E5" />
        <Text style={styles.locationText}>Location: Ward 23, Pune</Text>
      </View>

      {/* SYMPTOMS CARD */}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Select Your Symptoms *</Text>

        <View style={styles.grid}>
          {symptoms.map((symptom) => {
            const selected = selectedSymptoms.includes(symptom);

            return (
              <TouchableOpacity
                key={symptom}
                style={[styles.symptomBtn, selected && styles.symptomSelected]}
                onPress={() => toggleSymptom(symptom)}
              >
                <Text
                  style={[styles.symptomText, selected && { color: "white" }]}
                >
                  {symptom}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* DURATION */}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Duration *</Text>

        <View style={styles.grid}>
          {["< 1 day", "1-2 days", "3-5 days", "5+ days"].map((item) => {
            const selected = duration === item;

            return (
              <TouchableOpacity
                key={item}
                style={[
                  styles.durationBtn,
                  selected && styles.durationSelected,
                ]}
                onPress={() => setDuration(item)}
              >
                <Text
                  style={[styles.durationText, selected && { color: "white" }]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* SEVERITY */}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Severity Level *</Text>

        <Text style={styles.percent}>{severity}%</Text>

        <Slider
          minimumValue={0}
          maximumValue={100}
          value={severity}
          onValueChange={setSeverity}
        />

        <View style={styles.severityLabels}>
          <Text>Mild</Text>
          <Text>Moderate</Text>
          <Text>Severe</Text>
        </View>
      </View>

      {/* ANALYZE BUTTON */}

      <TouchableOpacity style={styles.analyzeBtn} onPress={handleAnalyze}>
        <Ionicons name="sparkles-outline" size={20} color="#6b7280" />
        <Text style={styles.analyzeText}>{loading ? "Analyzing..." : "Analyze with AI"}</Text>
      </TouchableOpacity>
      {/* RESULT */}
{result && result.risk && (
  <View style={[styles.card, { backgroundColor: getRiskCardStyles(result.risk).backgroundColor, borderLeftWidth: 4, borderLeftColor: getRiskCardStyles(result.risk).borderLeftColor }]}>
    <Text style={[styles.cardTitle, { color: getRiskCardStyles(result.risk).textColor }]}>Result</Text>
    <Text style={{ color: getRiskCardStyles(result.risk).textColor, fontSize: 16, fontWeight: "600", marginBottom: 8 }}>Risk: {result.risk}</Text>
    <Text style={{ color: getRiskCardStyles(result.risk).textColor }}>Advice: {result.recommendation}</Text>
  </View>
)}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },

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

  headerSubtitle: {
    color: "#cbd5e1",
    marginTop: 4,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
  },

  locationText: {
    marginLeft: 6,
    color: "#374151",
  },

  card: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 18,
    borderRadius: 14,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  symptomBtn: {
    width: "48%",
    padding: 14,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 16,
    marginBottom: 10,
    alignItems: "center",
  },

  symptomSelected: {
    backgroundColor: "#0E2A4E",
    borderColor: "#0E2A4E",
  },

  symptomText: {
    color: "#374151",
  },

  durationBtn: {
    width: "48%",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
    alignItems: "center",
  },

  durationSelected: {
    backgroundColor: "#0E2A4E",
    borderColor: "#0E2A4E",
  },

  durationText: {
    color: "#374151",
  },

  percent: {
    alignSelf: "center",
    backgroundColor: "#0E2A4E",
    color: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 10,
  },

  severityLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },

  analyzeBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e5e7eb",
    margin: 20,
    padding: 16,
    borderRadius: 16,
  },

  analyzeText: {
    marginLeft: 8,
    color: "#6b7280",
    fontWeight: "600",
  },
});
