import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import {
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import API from "../../../services/api";
import { useAuth } from "../../../services/AuthContext";

type City = { id: number; state: string; name: string };
type Ward = { id: number; city_id: number; name: string };
export default function Dashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [result, setResult] = React.useState<any>(null);
  const [riskData, setRiskData] = React.useState<{ risk: string | null; recommendation: string | null }>({ risk: null, recommendation: null });
  const [advisories, setAdvisories] = React.useState<any[]>([]);
  const [advisoryError, setAdvisoryError] = React.useState<string | null>(null);

  const [cities, setCities] = React.useState<City[]>([]);
  const [wards, setWards] = React.useState<Ward[]>([]);
  const [selectedCity, setSelectedCity] = React.useState<City | null>(null);
  const [selectedWard, setSelectedWard] = React.useState<Ward | null>(null); // null => all wards in city
  const [pickerOpen, setPickerOpen] = React.useState<null | "CITY" | "WARD">(null);

  const locationLabel = selectedWard?.name
    ? `${selectedWard.name}, ${selectedCity?.name || ""}`.trim()
    : selectedCity?.name
      ? `All wards, ${selectedCity.name}`
      : "Select City";

  // Fetch latest risk from DB on mount (persistent risk)
  React.useEffect(() => {
    const fetchLatestRisk = async () => {
      try {
        const patientName = user?.name || "";
        const resp = await API.get("/api/latest", { params: { patient_name: patientName } });
        if (resp.data?.risk) {
          setRiskData({ risk: resp.data.risk, recommendation: resp.data.recommendation });
        }
      } catch (e) {
        console.error("Failed to load latest risk", e);
      }
    };
    fetchLatestRisk();
  }, [user?.name]);

  React.useEffect(() => {
    const loadCities = async () => {
      try {
        const resp = await API.get("/api/geo/cities", { params: { state: "Maharashtra" } });
        const list = Array.isArray(resp.data) ? resp.data : [];
        setCities(list);
        // Default to Pune if present, else first city.
        const pune = list.find((c: any) => c.name === "Pune") || list[0] || null;
        setSelectedCity(pune);
      } catch (e) {
        console.error("Failed to load cities", e);
      }
    };
    loadCities();
  }, []);

  React.useEffect(() => {
    const loadWards = async () => {
      if (!selectedCity?.id) return;
      try {
        const resp = await API.get(`/api/geo/cities/${selectedCity.id}/wards`);
        const list = Array.isArray(resp.data) ? resp.data : [];
        setWards(list);
        // Default to user's ward if present
        const userWard = user?.ward ? list.find((w: any) => w.name === user.ward) : null;
        const w23 = userWard || list.find((w: any) => w.name === "Ward 23") || null;
        setSelectedWard(w23); // if null => all wards
      } catch (e) {
        console.error("Failed to load wards", e);
        setWards([]);
        setSelectedWard(null);
      }
    };
    loadWards();
  }, [selectedCity?.id]);

  React.useEffect(() => {
    const loadAdvisories = async () => {
      if (!selectedCity?.id) return;
      try {
        setAdvisoryError(null);
        const params: any = { limit: 5 };
        if (selectedWard?.id) params.ward_id = selectedWard.id;
        else params.city_id = selectedCity.id; // all wards in city

        const resp = await API.get("/api/advisories", { params });
        setAdvisories(Array.isArray(resp.data) ? resp.data : []);
      } catch (e: any) {
        console.error("Failed to load advisories", e);
        setAdvisoryError(e?.message || "Failed to load advisories");
        setAdvisories([]);
      }
    };
    loadAdvisories();
  }, [selectedCity?.id, selectedWard?.id]);
  
  const getRiskUI = (risk: string) => {
  switch (risk) {
    case "Severe":
      return {
        bg: "#FEE2E2",
        iconBg: "#DC2626",
        textColor: "#DC2626",
        icon: "warning",
      };
    case "Moderate":
      return {
        bg: "#FEF3C7",
        iconBg: "#F59E0B",
        textColor: "#F59E0B",
        icon: "alert-circle",
      };
    default:
      return {
        bg: "#E6F4EA",
        iconBg: "#16A34A",
        textColor: "#15803D",
        icon: "checkmark-circle",
      };
  }
};
const riskValue = riskData.risk || "Low";
const riskUI = getRiskUI(riskValue);
const userName = user?.name || "User";
const userInsurance = user?.insurance || "N/A";
const userAbha = user?.abha || "N/A";
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Welcome back,</Text>
          <Text style={styles.name}>{userName}</Text>
          <Text style={styles.location}>{locationLabel}</Text>
        </View>

        <TouchableOpacity
          style={styles.avatar}
          onPress={() => router.push("/(tabs)/profile")}
        >
          <Ionicons name="person-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* RISK CARD */}
      <View style={[styles.riskCard, { backgroundColor: riskUI.bg }]}>
  <View style={[styles.riskIcon, { backgroundColor: riskUI.iconBg }]}>
    <Ionicons name={riskUI.icon as any} size={20} color="#fff" />
  </View>

  <View style={{ flex: 1 }}>
    <Text style={styles.riskTitle}>Current AI Risk Level</Text>

    <Text style={[styles.riskValue, { color: riskUI.textColor }]}>
      {`${riskValue} Risk`}
    </Text>

    <Text style={styles.riskDesc}>
      {riskData.recommendation ||
        "No recent symptom reports • You're doing great!"}
    </Text>
  </View>
</View>

      {/* QUICK ACTIONS */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>

      <View style={styles.grid}>
        <ActionCard
          icon="document-text-outline"
          title="Report Symptoms"
          subtitle="Get AI assessment"
          onPress={() => router.push("/dashboard/report")}
        />
        <ActionCard
          icon="medkit-outline"
          title="Find Hospitals"
          subtitle="Nearby hospitals"
          onPress={() => router.push("/dashboard/find-hospital")}
        />
        <ActionCard
          icon="calendar-outline"
          title="My Appointments"
          subtitle="View & manage"
          onPress={() => router.push("/dashboard/appointment")}
        />
        <ActionCard
          icon="pulse-outline"
          title="Health Timeline"
          subtitle="Track progress"
          onPress={() => router.push("/dashboard/health-timeline")}
        />
      </View>

      {/* ADVISORIES */}
      <Text style={styles.sectionTitle}>Area Health Advisories</Text>

      <View style={{ paddingHorizontal: 20, marginTop: 12 }}>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity
            style={[styles.simpleCard, { flex: 1, marginHorizontal: 0 }]}
            onPress={() => setPickerOpen("CITY")}
          >
            <Text style={styles.alertTitle}>
              {selectedCity?.name ? `City: ${selectedCity.name}` : "Select City"}
            </Text>
            <Text style={styles.alertDesc}>Tap to change city</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.simpleCard, { flex: 1, marginHorizontal: 0 }]}
            onPress={() => setPickerOpen("WARD")}
            disabled={!selectedCity}
          >
            <Text style={styles.alertTitle}>
              {selectedWard?.name ? `Ward: ${selectedWard.name}` : "Ward: All wards"}
            </Text>
            <Text style={styles.alertDesc}>Tap to change ward</Text>
          </TouchableOpacity>
        </View>
      </View>

      {advisoryError ? (
        <View style={styles.simpleCard}>
          <Text style={styles.alertTitle}>Unable to load advisories</Text>
          <Text style={styles.alertDesc}>{advisoryError}</Text>
        </View>
      ) : advisories.length === 0 ? (
        <View style={styles.simpleCard}>
          <Text style={styles.alertTitle}>No advisories right now</Text>
          <Text style={styles.alertDesc}>
            If your municipal authority sends an advisory for your selected area, it will show here.
          </Text>
        </View>
      ) : (
        advisories.slice(0, 2).map((a, idx) => (
          <View key={a.id ?? idx} style={styles.simpleCard}>
            <Text style={styles.alertTitle}>
              {a.ward_name || a.city_name || a.target_area || "Public Advisory"}
            </Text>
            <Text style={styles.alertDesc}>{a.message}</Text>
          </View>
        ))
      )}

      <Modal
        visible={pickerOpen !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setPickerOpen(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.rowBetween}>
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                {pickerOpen === "CITY" ? "Choose City" : "Choose Ward"}
              </Text>
              <TouchableOpacity onPress={() => setPickerOpen(null)}>
                <Ionicons name="close" size={20} />
              </TouchableOpacity>
            </View>

            {pickerOpen === "CITY" ? (
              <FlatList
                data={cities}
                keyExtractor={(c) => String(c.id)}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.pickItem}
                    onPress={() => {
                      setSelectedCity(item);
                      setSelectedWard(null);
                      setPickerOpen(null);
                    }}
                  >
                    <Text style={{ fontWeight: selectedCity?.id === item.id ? "bold" : "normal" }}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            ) : (
              <FlatList
                data={[{ id: -1, city_id: selectedCity?.id ?? 0, name: "All wards" } as any, ...wards]}
                keyExtractor={(w) => String(w.id)}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.pickItem}
                    onPress={() => {
                      if (item.id === -1) setSelectedWard(null);
                      else setSelectedWard(item);
                      setPickerOpen(null);
                    }}
                  >
                    <Text
                      style={{
                        fontWeight:
                          (item.id === -1 && !selectedWard) || selectedWard?.id === item.id
                            ? "bold"
                            : "normal",
                      }}
                    >
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </Modal>

      {/* PROFILE */}
      <TouchableOpacity
        style={styles.profileCard}
        onPress={() => router.push("/(tabs)/profile")}
      >
        <Ionicons name="person-circle-outline" size={28} color="#0E2A4E" />

        <View style={{ marginLeft: 10 }}>
          <Text style={{ fontWeight: "600" }}>Profile Settings</Text>
          <Text style={{ color: "gray" }}>{userInsurance} • ABHA: {userAbha}</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ACTION CARD COMPONENT */
function ActionCard({ icon, title, subtitle, onPress }: any) {
  return (
    <TouchableOpacity style={styles.actionCard} onPress={onPress}>
      <View style={styles.actionIcon}>
        <Ionicons name={icon} size={18} color="#1E88E5" />
      </View>
      <Text style={styles.actionTitle}>{title}</Text>
      <Text style={styles.actionSubtitle}>{subtitle}</Text>
    </TouchableOpacity>
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
    paddingTop: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  welcome: { color: "#cbd5e1" },
  name: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  location: { color: "#cbd5e1", marginTop: 4 },

  avatar: {
    backgroundColor: "#1E3A5F",
    padding: 12,
    borderRadius: 25,
  },

  riskCard: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 18,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
  },

  riskValue: {
  fontSize: 20,
  fontWeight: "bold",
  marginTop: 4,
},

  riskIcon: {
    backgroundColor: "#16A34A",
    padding: 12,
    borderRadius: 30,
    marginRight: 12,
  },

  riskTitle: { fontSize: 14 },

  riskDesc: { fontSize: 13, marginTop: 4 },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 20,
    marginTop: 25,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 15,
  },

  actionCard: {
    display: "flex",
    backgroundColor: "#fff",
    width: "100%",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 1,
    height: 120,
    justifyContent: "center",
  },

  actionIcon: {
    backgroundColor: "#E3F2FD",
    padding: 12,
    borderRadius: 14,
    alignSelf: "flex-start",
    marginBottom: 10,
  },

  actionTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },

  actionSubtitle: {
    fontSize: 13,
    color: "gray",
    marginTop: 4,
  },

  alertTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },

  alertDesc: {
    marginTop: 5,
    color: "gray",
  },

  simpleCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 16,
    borderRadius: 18,
    elevation: 2,
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    maxHeight: "70%",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pickItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  profileCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 16,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },
});
