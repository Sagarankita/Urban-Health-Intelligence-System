import API from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type City = { id: number; state: string; name: string };
type Ward = { id: number; city_id: number; name: string };
type Advisory = {
  id: number;
  message: string;
  target_area: string | null;
  city_id: number | null;
  ward_id: number | null;
  city_name?: string | null;
  ward_name?: string | null;
  created_at: string;
};

type TargetMode = "CITY" | "WARD";

export default function AdvisoryScreen() {
  const [message, setMessage] = useState("");
  const [targetMode, setTargetMode] = useState<TargetMode>("CITY");

  const [cities, setCities] = useState<City[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null);

  const [recent, setRecent] = useState<Advisory[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(false);

  const [pickerOpen, setPickerOpen] = useState<null | "MODE" | "CITY" | "WARD">(null);

  const targetLabel = useMemo(() => {
    if (targetMode === "CITY") return selectedCity?.name || "Select City";
    return selectedWard?.name || "Select Ward";
  }, [selectedCity, selectedWard, targetMode]);

  const fetchCities = async () => {
    const resp = await API.get("/api/geo/cities", { params: { state: "Maharashtra" } });
    setCities(Array.isArray(resp.data) ? resp.data : []);
  };

  const fetchWards = async (cityId: number) => {
    const resp = await API.get(`/api/geo/cities/${cityId}/wards`);
    setWards(Array.isArray(resp.data) ? resp.data : []);
  };

  const fetchRecent = async () => {
    setLoadingRecent(true);
    try {
      const resp = await API.get("/api/advisories", { params: { limit: 20 } });
      setRecent(Array.isArray(resp.data) ? resp.data : []);
    } finally {
      setLoadingRecent(false);
    }
  };

  useEffect(() => {
    fetchCities().catch(console.error);
    fetchRecent().catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedCity?.id) {
      setWards([]);
      return;
    }
    fetchWards(selectedCity.id).catch(console.error);
  }, [selectedCity?.id]);

  const sendAdvisory = async () => {
    try {
      if (!message.trim()) {
        alert("Message cannot be empty");
        return;
      }

      if (targetMode === "CITY" && !selectedCity) {
        alert("Please select a city");
        return;
      }
      if (targetMode === "WARD" && (!selectedCity || !selectedWard)) {
        alert("Please select a city and ward");
        return;
      }

      await API.post("/api/advisories", {
        message,
        city_id: targetMode === "CITY" ? selectedCity?.id : selectedCity?.id,
        ward_id: targetMode === "WARD" ? selectedWard?.id : null,
        target_area: targetMode === "CITY" ? selectedCity?.name : selectedWard?.name,
      });
  
      alert("Advisory sent ✅");
      setMessage(""); // clear input
      await fetchRecent();
    } catch (err) {
      console.error(err);
      alert("Failed to send advisory");
    }
  };

  const deleteRecent = async (id: number) => {
    try {
      await API.delete(`/api/advisories/${id}`);
      await fetchRecent();
    } catch (e) {
      console.error(e);
      alert("Failed to delete advisory");
    }
  };

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

        <View style={styles.targetRow}>
          <TouchableOpacity
            style={[styles.dropdown, { flex: 1 }]}
            onPress={() => setPickerOpen("MODE")}
          >
            <Text>{targetMode === "CITY" ? "City" : "Ward"}</Text>
            <Ionicons name="chevron-down" size={18} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.dropdown, { flex: 2 }]}
            onPress={() => setPickerOpen(targetMode === "CITY" ? "CITY" : selectedCity ? "WARD" : "CITY")}
          >
            <Text numberOfLines={1}>{targetLabel}</Text>
            <Ionicons name="chevron-down" size={18} />
          </TouchableOpacity>
        </View>

        {/* SEND BUTTON */}
        <TouchableOpacity style={styles.button} onPress={sendAdvisory}>
          <Text style={styles.buttonText}>Send Advisory</Text>
        </TouchableOpacity>
      </View>

      {/* RECENT */}
      <Text style={styles.sectionTitle}>Recent Advisories</Text>
      {loadingRecent ? (
        <View style={styles.advisoryCard}>
          <Text>Loading…</Text>
        </View>
      ) : recent.length === 0 ? (
        <View style={styles.advisoryCard}>
          <Text>No advisories yet.</Text>
        </View>
      ) : (
        recent.slice(0, 10).map((a) => (
          <View key={a.id} style={styles.advisoryCard}>
            <View style={styles.rowBetween}>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {a.ward_name || a.city_name || a.target_area || "Advisory"}
              </Text>
              <TouchableOpacity onPress={() => deleteRecent(a.id)}>
                <Ionicons name="trash-outline" size={18} color="#EF4444" />
              </TouchableOpacity>
            </View>
            <Text style={styles.subText} numberOfLines={3}>
              {a.message}
            </Text>
          </View>
        ))
      )}

      {/* INFO */}
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          Push Notification: Advisories will be sent as push notifications and
          appear on user home screen.
        </Text>
      </View>

      {/* PICKER MODAL */}
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
                {pickerOpen === "MODE"
                  ? "Choose Target Type"
                  : pickerOpen === "CITY"
                    ? "Choose City"
                    : "Choose Ward"}
              </Text>
              <TouchableOpacity onPress={() => setPickerOpen(null)}>
                <Ionicons name="close" size={20} />
              </TouchableOpacity>
            </View>

            {pickerOpen === "MODE" ? (
              <>
                {(["CITY", "WARD"] as TargetMode[]).map((m) => (
                  <TouchableOpacity
                    key={m}
                    style={styles.pickItem}
                    onPress={() => {
                      setTargetMode(m);
                      setPickerOpen(null);
                      // Reset selection when switching modes to avoid confusion.
                      if (m === "CITY") setSelectedWard(null);
                    }}
                  >
                    <Text style={{ fontWeight: m === targetMode ? "bold" : "normal" }}>
                      {m === "CITY" ? "City" : "Ward"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </>
            ) : pickerOpen === "CITY" ? (
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
                data={wards}
                keyExtractor={(w) => String(w.id)}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.pickItem}
                    onPress={() => {
                      setSelectedWard(item);
                      setPickerOpen(null);
                    }}
                  >
                    <Text style={{ fontWeight: selectedWard?.id === item.id ? "bold" : "normal" }}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <View style={{ paddingVertical: 16 }}>
                    <Text style={{ color: "#6b7280" }}>
                      Select a city first (or no wards seeded for this city).
                    </Text>
                  </View>
                }
              />
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
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

  targetRow: {
    flexDirection: "row",
    gap: 10,
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

  time: { color: "#6b7280" },

  people: { color: "#374151" },

  infoBox: {
    backgroundColor: "#DBEAFE",
    padding: 16,
    borderRadius: 12,
    marginTop: 15,
  },

  infoText: { color: "#1E3A8A" },

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
  pickItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});
