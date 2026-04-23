import API from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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

export default function PatientRegister() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "Male",
    phone: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [cities, setCities] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [selectedWard, setSelectedWard] = useState<any>(null);
  const [picker, setPicker] = useState<null | "CITY" | "WARD">(null);

  useEffect(() => {
    API.get("/api/geo/cities", { params: { state: "Maharashtra" } })
      .then((r) => {
        const list = Array.isArray(r.data) ? r.data : [];
        setCities(list);
        const pune =
          list.find((c: any) => c.name === "Pune") || list[0] || null;
        setSelectedCity(pune);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedCity?.id) return;
    API.get(`/api/geo/cities/${selectedCity.id}/wards`)
      .then((r) => {
        setWards(Array.isArray(r.data) ? r.data : []);
        setSelectedWard(null);
      })
      .catch(() => {});
  }, [selectedCity?.id]);

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Create Account</Text>
        <Text style={styles.headerSub}>Patient Registration</Text>
      </View>

      {/* STEP BAR */}
      <View style={styles.stepBox}>
        <View style={styles.stepRow}>
          <Text>Step {step} of 2</Text>
          <Text>{step === 1 ? "Fill Details" : "Set Password"}</Text>
        </View>

        <View style={styles.progressBg}>
          <View
            style={[
              styles.progressFill,
              { width: step === 1 ? "50%" : "100%" },
            ]}
          />
        </View>
      </View>

      {/* FORM CARD */}
      <View style={styles.card}>
        {step === 1 ? (
          <>
            <Text style={styles.title}>Patient Information</Text>

            {/* NAME */}
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={form.name}
              onChangeText={(t) => setForm({ ...form, name: t })}
            />

            {/* AGE + GENDER */}
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Age *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Age"
                  value={form.age}
                  onChangeText={(t) => setForm({ ...form, age: t })}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Gender *</Text>
                <View style={styles.genderRow}>
                  {["Male", "Female", "Other"].map((g) => (
                    <TouchableOpacity
                      key={g}
                      style={[
                        styles.genderBtn,
                        form.gender === g && styles.genderBtnActive,
                      ]}
                      onPress={() => setForm({ ...form, gender: g })}
                    >
                      <Text
                        style={[
                          styles.genderText,
                          form.gender === g && styles.genderTextActive,
                        ]}
                      >
                        {g}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* PHONE */}
            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter 10-digit mobile number"
              value={form.phone}
              onChangeText={(t) => setForm({ ...form, phone: t })}
              keyboardType="numeric"
            />

            {/* EMAIL */}
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              placeholder="your.email@example.com"
              value={form.email}
              onChangeText={(t) => setForm({ ...form, email: t })}
            />

            {/* CITY */}
            <Text style={styles.label}>City *</Text>
            <TouchableOpacity
              style={[
                styles.input,
                {
                  justifyContent: "space-between",
                  flexDirection: "row",
                  alignItems: "center",
                },
              ]}
              onPress={() => setPicker("CITY")}
            >
              <Text style={{ color: selectedCity ? "#1f2937" : "#9ca3af" }}>
                {selectedCity?.name || "Select City"}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#6b7280" />
            </TouchableOpacity>

            {/* WARD */}
            <Text style={styles.label}>Ward / Area *</Text>
            <TouchableOpacity
              style={[
                styles.input,
                {
                  justifyContent: "space-between",
                  flexDirection: "row",
                  alignItems: "center",
                  opacity: selectedCity ? 1 : 0.5,
                },
              ]}
              onPress={() => selectedCity && setPicker("WARD")}
            >
              <Text style={{ color: selectedWard ? "#1f2937" : "#9ca3af" }}>
                {selectedWard?.name || "Select Ward"}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#6b7280" />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.title}>Set Password</Text>

            {/* PASSWORD */}
            <Text style={styles.label}>Create Password *</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={{ flex: 1 }}
                placeholder="Create a strong password"
                secureTextEntry={!showPass}
                value={form.password}
                onChangeText={(t) => setForm({ ...form, password: t })}
              />
              <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                <Ionicons name={showPass ? "eye-off" : "eye"} size={20} />
              </TouchableOpacity>
            </View>

            <Text style={styles.helper}>Minimum 6 characters</Text>

            {/* CONFIRM */}
            <Text style={styles.label}>Confirm Password *</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={{ flex: 1 }}
                placeholder="Re-enter password"
                secureTextEntry={!showConfirm}
                value={form.confirm}
                onChangeText={(t) => setForm({ ...form, confirm: t })}
              />
              <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                <Ionicons name={showConfirm ? "eye-off" : "eye"} size={20} />
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>

      {/* BUTTON */}
      <TouchableOpacity
        style={styles.button}
        onPress={async () => {
          if (step === 1) {
            if (!form.name || !form.email || !form.phone || !selectedWard) {
              alert("Please fill in all required fields including ward");
              return;
            }
            setStep(2);
          } else {
            if (!form.password || form.password.length < 6) {
              alert("Password must be at least 6 characters");
              return;
            }
            if (form.password !== form.confirm) {
              alert("Passwords do not match");
              return;
            }
            try {
              await API.post("/api/auth/register", {
                name: form.name,
                email: form.email,
                password: form.password,
                role: "PATIENT",
                phone: form.phone,
                ward: selectedWard?.name ?? "",
                age: form.age,
                gender: form.gender,
              });
              alert("Account created! Please login.");
              router.replace("/login");
            } catch (err: any) {
              const msg = err?.response?.data?.error || "Registration failed";
              alert(msg);
            }
          }
        }}
      >
        <Text style={styles.buttonText}>
          {step === 1 ? "Review Details" : "Create Account"}
        </Text>
      </TouchableOpacity>

      {/* CITY / WARD PICKER MODAL */}
      <Modal
        visible={picker !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setPicker(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                {picker === "CITY" ? "Select City" : "Select Ward"}
              </Text>
              <TouchableOpacity onPress={() => setPicker(null)}>
                <Ionicons name="close" size={22} color="#374151" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={picker === "CITY" ? cities : wards}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.pickItem}
                  onPress={() => {
                    if (picker === "CITY") {
                      setSelectedCity(item);
                      setSelectedWard(null);
                    } else setSelectedWard(item);
                    setPicker(null);
                  }}
                >
                  <Text
                    style={{
                      fontWeight:
                        (picker === "CITY"
                          ? selectedCity?.id
                          : selectedWard?.id) === item.id
                          ? "bold"
                          : "normal",
                    }}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },

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

  headerSub: {
    color: "#cbd5e1",
  },

  stepBox: {
    backgroundColor: "#fff",
    padding: 16,
  },

  stepRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  progressBg: {
    height: 6,
    backgroundColor: "#e5e7eb",
    borderRadius: 10,
    marginTop: 10,
  },

  progressFill: {
    height: 6,
    backgroundColor: "#1E88E5",
    borderRadius: 10,
  },

  card: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 16,
    borderRadius: 16,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  label: {
    marginTop: 10,
    fontWeight: "600",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 12,
    marginTop: 6,
  },

  row: {
    flexDirection: "row",
    gap: 10,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 12,
    marginTop: 6,
    justifyContent: "space-between",
  },

  helper: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },

  button: {
    backgroundColor: "#0E2A4E",
    margin: 16,
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  genderRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 6,
    flexWrap: "wrap",
  },

  genderBtn: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: "#f9fafb",
  },

  genderBtnActive: {
    borderColor: "#1E88E5",
    backgroundColor: "#EBF5FF",
  },

  genderText: {
    fontSize: 13,
    color: "#374151",
  },

  genderTextActive: {
    color: "#1E88E5",
    fontWeight: "600",
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },

  modalSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "60%",
  },

  pickItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
});
