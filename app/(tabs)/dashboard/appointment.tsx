import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import API from "../../../services/api";

const STATUS_COLOR: Record<string, string> = {
  PENDING: "#F59E0B",
  APPROVED: "#16A34A",
  RESCHEDULED: "#3B82F6",
  CANCELLED: "#EF4444",
  COMPLETED: "#6B7280",
};

export default function AppointmentScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cancelConfirm, setCancelConfirm] = useState<number | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchAppointments = useCallback(async () => {
    if (!user?.name) return;
    try {
      const res = await API.get("/api/appointments", {
        params: { patient_name: user.name, limit: 20 },
      });
      setAppointments(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error("Failed to fetch appointments", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.name]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleCancel = async (id: number) => {
    try {
      setCancelling(true);
      await API.patch(`/api/appointments/${id}/status`, {
        status: "CANCELLED",
      });
      setCancelConfirm(null);
      await fetchAppointments();
    } catch {
      Alert.alert("Error", "Could not cancel appointment");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            fetchAppointments();
          }}
        />
      }
    >
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/(tabs)/dashboard")}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Appointments</Text>
        <Text style={styles.headerSub}>Pull down to refresh</Text>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#0E2A4E"
          style={{ marginTop: 40 }}
        />
      ) : appointments.length === 0 ? (
        <View style={styles.emptyBox}>
          <Ionicons name="calendar-outline" size={48} color="#9ca3af" />
          <Text style={styles.emptyText}>No appointments yet</Text>
          <Text style={styles.emptySub}>Book one via Find Hospitals</Text>
          <TouchableOpacity
            style={styles.bookBtn}
            onPress={() => router.push("/(tabs)/dashboard/find-hospital")}
          >
            <Text style={styles.bookBtnText}>Find Hospitals</Text>
          </TouchableOpacity>
        </View>
      ) : (
        appointments.map((appt) => (
          <View key={appt.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.hospitalName}>
                {appt.hospital_name ?? `Hospital #${appt.hospital_id}`}
              </Text>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: STATUS_COLOR[appt.status] ?? "#6B7280" },
                ]}
              >
                <Text style={styles.badgeText}>{appt.status}</Text>
              </View>
            </View>

            <InfoRow icon="medkit-outline" text={`Dept: ${appt.department}`} />
            <InfoRow
              icon="calendar-outline"
              text={`Date: ${appt.appointment_date}`}
            />
            <InfoRow
              icon="time-outline"
              text={`Time: ${appt.appointment_time}`}
            />
            {appt.insurance && (
              <InfoRow
                icon="shield-checkmark-outline"
                text={`Insurance: ${appt.insurance}`}
              />
            )}
            {(appt.status === "PENDING" || appt.status === "APPROVED") &&
              (cancelConfirm === appt.id ? (
                <View style={styles.confirmRow}>
                  <Text style={styles.confirmText}>Confirm cancel?</Text>
                  <TouchableOpacity
                    style={styles.confirmYes}
                    onPress={() => handleCancel(appt.id)}
                    disabled={cancelling}
                  >
                    <Text style={{ color: "#fff", fontWeight: "bold" }}>
                      {cancelling ? "Cancelling…" : "Yes"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.confirmNo}
                    onPress={() => setCancelConfirm(null)}
                  >
                    <Text style={{ color: "#374151" }}>No</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setCancelConfirm(appt.id)}
                >
                  <Text style={styles.cancelText}>Cancel Appointment</Text>
                </TouchableOpacity>
              ))}
          </View>
        ))
      )}
    </ScrollView>
  );
}

function InfoRow({ icon, text }: { icon: any; text: string }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={16} color="#6b7280" />
      <Text style={styles.infoText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },
  header: { backgroundColor: "#0E2A4E", padding: 20, paddingTop: 50 },
  headerTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  headerSub: { color: "#cbd5e1", fontSize: 12 },
  emptyBox: { alignItems: "center", padding: 40, marginTop: 20 },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#374151",
    marginTop: 12,
  },
  emptySub: { color: "#6b7280", marginTop: 4 },
  bookBtn: {
    backgroundColor: "#0E2A4E",
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  bookBtnText: { color: "#fff", fontWeight: "bold" },
  card: {
    backgroundColor: "#fff",
    margin: 16,
    marginBottom: 0,
    padding: 16,
    borderRadius: 16,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  hospitalName: { fontWeight: "bold", fontSize: 16, flex: 1, color: "#1f2937" },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  badgeText: { color: "#fff", fontSize: 11, fontWeight: "bold" },
  infoRow: { flexDirection: "row", alignItems: "center", marginTop: 6, gap: 6 },
  infoText: { color: "#4b5563", fontSize: 14 },
  cancelBtn: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#EF4444",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  cancelText: { color: "#EF4444", fontWeight: "bold" },

  confirmRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    gap: 10,
  },

  confirmText: {
    flex: 1,
    color: "#374151",
    fontWeight: "600",
  },

  confirmYes: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },

  confirmNo: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
});
