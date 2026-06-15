import API from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const HOSPITAL_ID = 1;

export default function AppointmentManagement() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/appointments", {
        params: { hospital_id: HOSPITAL_ID },
      });
      setAppointments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleStatusUpdate = async (
    id: number,
    status: string,
    extra?: any
  ) => {
    try {
      setActionLoading(id);
      await API.patch(`/api/appointments/${id}/status`, { status, ...extra });
      await fetchAppointments();
    } catch (err) {
      console.error("Failed to update appointment:", err);
      Alert.alert("Error", "Could not update appointment");
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = appointments.filter((item) =>
    item.patient_name?.toLowerCase().includes(search.toLowerCase())
  );

  const pendingCount = appointments.filter(
    (a) => a.status === "PENDING"
  ).length;
  const approvedCount = appointments.filter(
    (a) => a.status === "APPROVED"
  ).length;

  const formatDate = (dateStr: string, timeStr: string) => {
    if (!dateStr) return timeStr || "";
    const d = new Date(dateStr);
    const options: any = { weekday: "short", day: "numeric", month: "short" };
    return `${d.toLocaleDateString("en-IN", options)} at ${timeStr}`;
  };

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

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#1E88E5"
          style={{ marginTop: 40 }}
        />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {filtered.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.row}>
                <View style={styles.avatar}>
                  <Ionicons name="person-outline" size={20} color="#4A90E2" />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{item.patient_name}</Text>
                  <Text style={styles.dept}>{item.department}</Text>
                </View>

                <View
                  style={[
                    styles.status,
                    item.status === "APPROVED"
                      ? styles.approved
                      : item.status === "CANCELLED"
                        ? styles.cancelled
                        : styles.pending,
                  ]}
                >
                  <Text
                    style={
                      item.status === "APPROVED"
                        ? styles.approvedText
                        : item.status === "CANCELLED"
                          ? styles.cancelledText
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
                <Text style={styles.info}>
                  {formatDate(item.appointment_date, item.appointment_time)}
                </Text>
              </View>

              {item.doctor_name && (
                <View style={styles.infoRow}>
                  <Ionicons name="person-outline" size={18} color="#6366F1" />
                  <Text style={styles.info}>
                    {item.doctor_name}{" "}
                    {item.doctor_specialization
                      ? `• ${item.doctor_specialization}`
                      : ""}
                  </Text>
                </View>
              )}

              <View style={styles.infoRow}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={18}
                  color="#4CAF50"
                />
                <Text style={styles.info}>{item.insurance || "N/A"}</Text>
              </View>

              {/* ACTION BUTTONS */}
              {item.status === "PENDING" ? (
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.approveBtn}
                    disabled={actionLoading === item.id}
                    onPress={() => handleStatusUpdate(item.id, "APPROVED")}
                  >
                    <Text style={styles.btnText}>
                      {actionLoading === item.id ? "..." : "Approve"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.rescheduleBtn}
                    disabled={actionLoading === item.id}
                    onPress={() =>
                      handleStatusUpdate(item.id, "RESCHEDULED")
                    }
                  >
                    <Text style={styles.btnText}>Reschedule</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.cancelBtn}
                    disabled={actionLoading === item.id}
                    onPress={() =>
                      handleStatusUpdate(item.id, "CANCELLED")
                    }
                  >
                    <Text style={styles.btnText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              ) : item.status === "APPROVED" ? (
                <View style={styles.confirmed}>
                  <Text style={{ color: "#2E7D32" }}>
                    ✓ Appointment Confirmed
                  </Text>
                </View>
              ) : (
                <View
                  style={[styles.confirmed, { backgroundColor: "#F3F4F6" }]}
                >
                  <Text style={{ color: "#6b7280" }}>
                    {item.status === "CANCELLED"
                      ? "✕ Cancelled"
                      : `Status: ${item.status}`}
                  </Text>
                </View>
              )}
            </View>
          ))}

          {/* SUMMARY */}
          <View style={styles.summary}>
            <View style={{ alignItems: "center" }}>
              <Text style={styles.summaryNumber}>{pendingCount}</Text>
              <Text style={{ color: "#3B5BDB" }}>Pending</Text>
            </View>

            <View style={{ alignItems: "center" }}>
              <Text style={[styles.summaryNumber, { color: "#2E7D32" }]}>
                {approvedCount}
              </Text>
              <Text style={{ color: "#2E7D32" }}>Approved</Text>
            </View>
          </View>

          <View style={{ height: 30 }} />
        </ScrollView>
      )}
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

  cancelled: {
    backgroundColor: "#F8D7DA",
  },

  pendingText: {
    color: "#856404",
  },

  approvedText: {
    color: "#2E7D32",
  },

  cancelledText: {
    color: "#721C24",
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
