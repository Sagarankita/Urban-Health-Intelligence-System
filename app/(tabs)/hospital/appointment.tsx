import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function AppointmentManagement() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const appointments = [
    {
      name: "Priya Sharma",
      department: "General Medicine",
      time: "Sun, 15 Mar at 10:00 AM",
      insurance: "PM-JAY",
      status: "Pending",
    },
    {
      name: "Rajesh Kumar",
      department: "Cardiology",
      time: "Sun, 15 Mar at 11:30 AM",
      insurance: "CGHS",
      status: "Pending",
    },
    {
      name: "Anita Desai",
      department: "Orthopedics",
      time: "Sun, 15 Mar at 02:00 PM",
      insurance: "PM-JAY",
      status: "Approved",
    },
    {
      name: "Vikram Singh",
      department: "Emergency",
      time: "Sun, 15 Mar at 03:30 PM",
      insurance: "ABHA",
      status: "Pending",
    },
    {
      name: "Meera Patel",
      department: "Pediatrics",
      time: "Mon, 16 Mar at 09:00 AM",
      insurance: "PM-JAY",
      status: "Approved",
    },
  ];

  const filtered = appointments.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/(tabs)/hospital")}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.title}>Appointment Management</Text>
        <Text style={styles.subtitle}>Review and manage appointments</Text>
      </View>

      {/* SEARCH BAR */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#666" />
        <TextInput
          placeholder="Search patient..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      {/* LIST */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {filtered.map((item, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.row}>
              <View style={styles.avatar}>
                <Ionicons name="person-outline" size={20} color="#4A90E2" />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.dept}>{item.department}</Text>
              </View>

              <View
                style={[
                  styles.status,
                  item.status === "Approved" ? styles.approved : styles.pending,
                ]}
              >
                <Text
                  style={
                    item.status === "Approved"
                      ? styles.approvedText
                      : styles.pendingText
                  }
                >
                  {item.status}
                </Text>
              </View>
            </View>

            {/* DETAILS */}
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={18} color="#4A90E2" />
              <Text style={styles.info}>{item.time}</Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons
                name="checkmark-circle-outline"
                size={18}
                color="#4CAF50"
              />
              <Text style={styles.info}>{item.insurance}</Text>
            </View>

            {/* ACTION BUTTONS */}
            {item.status === "Pending" ? (
              <View style={styles.actions}>
                <TouchableOpacity style={styles.approveBtn}>
                  <Text style={styles.btnText}>Approve</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.rescheduleBtn}>
                  <Text style={styles.btnText}>Reschedule</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.cancelBtn}>
                  <Text style={styles.btnText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.confirmed}>
                <Text style={{ color: "#2E7D32" }}>
                  ✓ Appointment Confirmed
                </Text>
              </View>
            )}
          </View>
        ))}

        {/* SUMMARY */}
        <View style={styles.summary}>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.summaryNumber}>
              {appointments.filter((a) => a.status === "Pending").length}
            </Text>
            <Text style={{ color: "#3B5BDB" }}>Pending</Text>
          </View>

          <View style={{ alignItems: "center" }}>
            <Text style={[styles.summaryNumber, { color: "#2E7D32" }]}>
              {appointments.filter((a) => a.status === "Approved").length}
            </Text>
            <Text style={{ color: "#2E7D32" }}>Approved</Text>
          </View>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
  },

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
    marginTop: 4,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    height: 45,
  },

  searchInput: {
    marginLeft: 8,
    flex: 1,
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  name: {
    fontWeight: "700",
    fontSize: 16,
  },

  dept: {
    color: "#666",
  },

  status: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  pending: {
    backgroundColor: "#FFF3CD",
  },

  approved: {
    backgroundColor: "#D4EDDA",
  },

  pendingText: {
    color: "#856404",
  },

  approvedText: {
    color: "#2E7D32",
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  info: {
    marginLeft: 6,
    color: "#333",
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },

  approveBtn: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 10,
  },

  rescheduleBtn: {
    backgroundColor: "#6C757D",
    padding: 10,
    borderRadius: 10,
  },

  cancelBtn: {
    backgroundColor: "#E53935",
    padding: 10,
    borderRadius: 10,
  },

  btnText: {
    color: "#fff",
    fontSize: 12,
  },

  confirmed: {
    marginTop: 12,
    backgroundColor: "#E8F5E9",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  summary: {
    flexDirection: "row",
    justifyContent: "space-around",
    margin: 16,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
  },

  summaryNumber: {
    fontSize: 20,
    fontWeight: "700",
  },
});
