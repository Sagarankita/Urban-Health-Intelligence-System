# Urban Health Intelligence System — Seed Data Reference

All data below is loaded by `backend/seed/` scripts when the backend starts.

---

## 🔑 Login Credentials

### Patient Accounts
| Name | Email | Password | Ward | Insurance |
|------|-------|----------|------|-----------|
| Priya Sharma | `patient@example.com` | `password123` | Ward 23, Pune | PM-JAY |
| Rahul Mehta | `patient2@example.com` | `test1234` | Ward 5 - Pimpri | ABHA |
| Sunita Desai | `patient3@example.com` | `test1234` | Ward 3 - Aundh | CGHS |

### Hospital Admin Accounts
| Name | Email | Password | Hospital |
|------|-------|----------|----------|
| Dr. Amit Verma | `hospital@example.com` | `password123` | City General Hospital (ID: 1) |
| Dr. Kavita Shah | `hospital2@example.com` | `test1234` | Pune Medical Center (ID: 2) |
| Dr. Meena Deshmukh | `hospital3@example.com` | `test1234` | Aundh District Hospital (ID: 3) |
| Dr. Pooja Sharma | `hospital4@example.com` | `test1234` | Sahyadri Hospital (ID: 4) |
| Dr. Sunita Gaikwad | `hospital5@example.com` | `test1234` | KEM Hospital (ID: 5) |

### Municipal Officer Accounts
| Name | Email | Password | Area |
|------|-------|----------|------|
| Dr. Rajesh Patil | `municipal@example.com` | `password123` | Pune City |
| Officer Anjali Rao | `municipal2@example.com` | `test1234` | Mumbai City |

---

## 🏥 Hospitals

| ID | Name | Location |
|----|------|----------|
| 1 | City General Hospital | Shivajinagar |
| 2 | Pune Medical Center | Kothrud |
| 3 | Aundh District Hospital | Aundh |
| 4 | Sahyadri Hospital | Hadapsar |
| 5 | KEM Hospital | Pimpri |

---

## 🛏️ Hospital Resources (Capacity)

| Hospital ID | Gen Beds | ICU Beds | Ventilators | Status |
|-------------|----------|----------|-------------|--------|
| 1 | 45 | 8 | 12 | ACTIVE |
| 2 | 62 | 15 | 18 | ACTIVE |
| 3 | 28 | 5 | 6 | LIMITED |
| 4 | 38 | 6 | 10 | ACTIVE |
| 5 | 15 | 2 | 3 | LIMITED |

---

## 👨‍⚕️ Doctors

| ID | Name | Department | Specialization | Hospital |
|----|------|-----------|----------------|---------|
| 1 | Dr. Rajesh Kumar | Respiratory Medicine | Sr. Consultant | City General (1) |
| 2 | Dr. Sneha Iyer | General Medicine | Physician | City General (1) |
| 3 | Dr. Amit Verma | Cardiology | Interventional Cardiologist | City General (1) |
| 4 | Dr. Priya Nair | Pediatrics | Child Specialist | City General (1) |
| 5 | Dr. Suresh Patil | Orthopedics | Joint Replacement | Pune Medical (2) |
| 6 | Dr. Kavita Shah | General Medicine | Physician | Pune Medical (2) |
| 7 | Dr. Ramesh Joshi | Emergency | Emergency Medicine | Pune Medical (2) |
| 8 | Dr. Meena Deshmukh | Dermatology | Skin Specialist | Aundh District (3) |
| 9 | Dr. Anand Kulkarni | ENT | Sr. ENT Surgeon | Aundh District (3) |
| 10 | Dr. Pooja Sharma | Gynecology | Obstetrician | Sahyadri (4) |
| 11 | Dr. Vikram Rao | Neurology | Neurologist | Sahyadri (4) |
| 12 | Dr. Sunita Gaikwad | Pulmonology | Chest Physician | KEM Hospital (5) |

---

## 📅 Appointments

### Priya Sharma (patient@example.com)
| Department | Doctor | Hospital | Date | Time | Insurance | Status | Priority |
|-----------|--------|----------|------|------|-----------|--------|---------|
| General Medicine | Dr. Sneha Iyer | City General | Today | 10:00 AM | PM-JAY | PENDING | NORMAL |
| Cardiology | Dr. Amit Verma | City General | -7 days | 11:30 AM | PM-JAY | APPROVED | HIGH |
| Respiratory Medicine | Dr. Rajesh Kumar | City General | +3 days | 09:00 AM | PM-JAY | PENDING | NORMAL |

### Rahul Mehta (patient2@example.com)
| Department | Doctor | Hospital | Date | Time | Insurance | Status | Priority |
|-----------|--------|----------|------|------|-----------|--------|---------|
| Orthopedics | Dr. Suresh Patil | Pune Medical | Today | 02:00 PM | ABHA | APPROVED | NORMAL |
| Emergency | Dr. Ramesh Joshi | Pune Medical | -3 days | 03:30 PM | ABHA | APPROVED | URGENT |
| General Medicine | Dr. Kavita Shah | Pune Medical | +5 days | 01:00 PM | ABHA | PENDING | NORMAL |

### Sunita Desai (patient3@example.com)
| Department | Doctor | Hospital | Date | Time | Insurance | Status | Priority |
|-----------|--------|----------|------|------|-----------|--------|---------|
| ENT | Dr. Anand Kulkarni | Aundh District | Today | 11:00 AM | CGHS | APPROVED | NORMAL |
| Dermatology | Dr. Meena Deshmukh | Aundh District | +2 days | 12:30 PM | CGHS | PENDING | LOW |

### Other Patients
| Patient | Department | Hospital | Status | Priority |
|---------|-----------|----------|--------|---------|
| Rajesh Kumar | Cardiology | City General | PENDING | HIGH |
| Anita Desai | Orthopedics | Pune Medical | APPROVED | NORMAL |
| Vikram Singh | Emergency | Pune Medical | PENDING | URGENT |
| Meera Patel | Pediatrics | City General | APPROVED | LOW |
| Rohit Nair | Respiratory Medicine | City General | PENDING | NORMAL |
| Sneha Kulkarni | ENT | Aundh District | APPROVED | NORMAL |
| Amit Joshi | General Medicine | Pune Medical | PENDING | NORMAL |
| Pooja Nair | Gynecology | Sahyadri | APPROVED | NORMAL |
| Anil Desai | Neurology | Sahyadri | PENDING | NORMAL |
| Kavita Jain | Pulmonology | KEM Hospital | PENDING | HIGH |

---

## 📋 Patient Reports (Health Timeline)

### Priya Sharma
| Symptoms | Severity | Risk | Status | Recommendation | Time |
|----------|----------|------|--------|---------------|------|
| Chest Pain, Shortness of Breath | 85 | Severe | NEW | Visit hospital immediately | 30 min ago |
| Fever, Cough, Fatigue | 72 | High | REVIEWED | Take prescribed medication and rest | 5 days ago |
| Headache, Body Ache | 45 | Moderate | REVIEWED | Monitor symptoms and rest | 12 days ago |

### Rahul Mehta
| Symptoms | Severity | Risk | Status | Recommendation | Time |
|----------|----------|------|--------|---------------|------|
| Fever, Joint Pain, Fatigue | 65 | Moderate | NEW | Monitor symptoms and rest | 1 hour ago |
| High BP, Dizziness | 70 | High | REVIEWED | Continue BP medication, follow-up | 8 days ago |

### Sunita Desai
| Symptoms | Severity | Risk | Status | Recommendation | Time |
|----------|----------|------|--------|---------------|------|
| Cough, Wheezing, Shortness of Breath | 60 | Moderate | NEW | Use inhaler as prescribed | 2 hours ago |
| Sore Throat, Runny Nose, Fever | 40 | Mild | REVIEWED | Rest and stay hydrated | 6 days ago |

---

## 🦠 Outbreak / Ward Data

| Ward | Zone | Outbreak Prob | Cases | Syndrome |
|------|------|--------------|-------|---------|
| Ward 1 - Shivajinagar | RED | 82% | 42 | Respiratory |
| Ward 9 - Viman Nagar | YELLOW | 65% | 38 | Respiratory |
| Ward 3 - Aundh | GREEN | 40% | 25 | Gastrointestinal |

### Ward Stats
| Ward | Risk Level | Score | Trend | Top Symptoms |
|------|-----------|-------|-------|-------------|
| Ward 1 - Shivajinagar | HIGH | 85 | +18% | Fever, Cough |
| Ward 2 - Kothrud | MEDIUM | 58 | Stable | Headache |
| Ward 3 - Aundh | HIGH | 72 | +18% | Nausea |
| Ward 4 - Baner | LOW | 35 | Stable | Fever, Cough |
| Ward 5 - Pimpri | MEDIUM | 65 | +12% | High Fever, Joint Pain |
| Ward 6 - Chinchwad | MEDIUM | 45 | Stable | Fever, Cough |
| Ward 7 - Hadapsar | MEDIUM | 55 | +8% | Nausea, Vomiting |
| Ward 8 - Yerwada | LOW | 40 | Stable | High Fever, Rash |
| Ward 9 - Viman Nagar | HIGH | 78 | +22% | Fever, Cough |
| Ward 10 - Wakad | MEDIUM | 41 | Stable | Fever, Cough |

---

## 📢 Advisories

| Message | Target Area |
|---------|------------|
| Respiratory illness surge detected. Wear masks in crowded areas. | Ward 1 - Shivajinagar |
| High dengue risk. Eliminate stagnant water near your home. | Ward 5 - Pimpri |
| Gastroenteritis cluster reported. Avoid eating outside. Boil drinking water. | Ward 3 - Aundh |
| Air quality index is poor today. Avoid outdoor exercise between 7–10 AM. | Pune |
| Influenza vaccination camp at City General Hospital. Free for all residents. | Pune |
| COVID-like symptoms reported in Viman Nagar. Please self-isolate if symptomatic. | Ward 9 - Viman Nagar |
| Vector-borne disease alert. Use mosquito repellents and sleep under nets. | Ward 8 - Yerwada |
| Water-borne disease advisory: Municipal water supply may be contaminated in your ward. | Ward 7 - Hadapsar |
| Heat wave alert. Stay hydrated and avoid direct sun exposure between 11 AM–4 PM. | Mumbai |
| Free health checkup camp at KEM Hospital on Friday 9 AM–1 PM. All welcome. | Ward A - Colaba |

---

## 🌆 Cities & Wards

### Pune Wards
Ward 1 - Shivajinagar · Ward 2 - Kothrud · Ward 3 - Aundh · Ward 4 - Baner · Ward 5 - Pimpri · Ward 6 - Chinchwad · Ward 7 - Hadapsar · Ward 8 - Yerwada · Ward 9 - Viman Nagar · Ward 10 - Wakad · Ward 23

### Mumbai Wards
Ward A - Colaba · Ward B - Fort · Ward C - Dadar · Ward D - Andheri · Ward E - Borivali

### Maharashtra Cities
Mumbai · Pune · Nagpur · Nashik · Thane · Aurangabad · Solapur · Kolhapur · Amravati · Navi Mumbai

---

## 🔄 How to Re-seed the Database

```bash
cd backend
node src/init-db.js
```

To run migrations only (no seed):
```bash
node src/init-db.js --migrate-only
```

To run seeds only (no migrations):
```bash
node src/init-db.js --seed-only
```
