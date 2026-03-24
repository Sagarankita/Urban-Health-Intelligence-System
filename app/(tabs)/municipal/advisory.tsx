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

export default function AdvisoryScreen() {
  const [message, setMessage] = useState("");
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
          <Text style={styles.title}>Public Health Advisory</Text>
          <Text style={styles.subtitle}>Send alerts to citizens</Text>
        </View>
      </TouchableOpacity>

      {/* MESSAGE BOX */}
      <View style={styles.card}>
        <Text style={styles.label}>Message</Text>

        <TextInput
          style={styles.textArea}
          placeholder="Write your advisory message..."
          multiline
          value={message}
          onChangeText={setMessage}
        />

        <Text style={styles.charCount}>{message.length} characters</Text>

        {/* TARGET AREA */}
        <Text style={styles.label}>Target Area</Text>

        <View style={styles.dropdown}>
          <Text>All Pune Citizens</Text>
          <Ionicons name="chevron-down" size={18} />
        </View>

        {/* SEND BUTTON */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Send Advisory</Text>
        </TouchableOpacity>
      </View>

      {/* RECENT */}
      <Text style={styles.sectionTitle}>Recent Advisories</Text>

      <AdvisoryCard
        title="Water Quality Advisory"
        doctor="Dr. Rajesh Kumar"
        time="2 hours ago"
        people="125,000"
      />

      <AdvisoryCard
        title="Heat Wave Warning"
        doctor="Dr. Priya Mehta"
        time="1 day ago"
        people="320,000"
      />

      <AdvisoryCard
        title="COVID Booster Campaign"
        doctor="Dr. Rajesh Patil"
        time="3 days ago"
        people="280,000"
      />

      {/* INFO */}
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          Push Notification: Advisories will be sent as push notifications and
          appear on user home screen.
        </Text>
      </View>
    </ScrollView>
  );
}
function AdvisoryCard({ title, doctor, time, people }: any) {
  return (
    <View style={styles.advisoryCard}>
      <View style={styles.rowBetween}>
        <Text style={styles.cardTitle}>{title}</Text>

        <View style={styles.delivered}>
          <Ionicons name="checkmark-circle" size={16} color="#16A34A" />
          <Text style={{ color: "#16A34A" }}> Delivered</Text>
        </View>
      </View>

      <Text style={styles.subText}>By {doctor}</Text>

      <View style={styles.rowBetween}>
        <Text style={styles.time}>{time}</Text>
        <Text style={styles.people}>👥 {people} recipients</Text>
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

  label: { fontWeight: "bold", marginTop: 10 },

  textArea: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 12,
    height: 120,
    marginTop: 8,
  },

  charCount: {
    textAlign: "right",
    color: "#6b7280",
    marginTop: 5,
  },

  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
  },

  button: {
    backgroundColor: "#0E2A4E",
    padding: 14,
    borderRadius: 12,
    marginTop: 15,
    alignItems: "center",
  },

  buttonText: { color: "#fff", fontWeight: "bold" },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },

  advisoryCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginTop: 10,
  },

  cardTitle: { fontWeight: "bold", fontSize: 16 },

  subText: { color: "#6b7280", marginTop: 4 },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  delivered: { flexDirection: "row", alignItems: "center" },

  time: { color: "#6b7280" },

  people: { color: "#374151" },

  infoBox: {
    backgroundColor: "#DBEAFE",
    padding: 16,
    borderRadius: 12,
    marginTop: 15,
  },

  infoText: { color: "#1E3A8A" },
});
