# NEXORA

### AI-Powered Defense & Aerospace Equipment Readiness Monitoring Platform

**Tagline:** *“Predict. Prepare. Protect.”*

---

## 🚀 Executive Overview & Problem Statement

Defense and aerospace organizations operate some of the world's most complex equipment fleets. A military aircraft, ground vehicle, or air defense radar array may be **partially healthy** based on secondary telemetry sensor readings, yet remain **operationally NOT READY** because:

1. A critical sub-assembly component (e.g. cooling system or hydraulic actuator) has degraded below safety threshold.
2. An upstream tier-1 vendor lead time has extended.
3. Depot maintenance capacity is overloaded.

**NEXORA** unifies telemetry health, maintenance planning, parts availability, and 3D Digital Twin problem location visualization into ONE intelligent platform.

---

## 💡 Key Concept: Digital Readiness Twin & 3D Problem Location

Rather than only asking:  
> **“Is this equipment healthy?”**

NEXORA answers:  
> **“Can this equipment realistically be ready when required, and WHERE EXACTLY is the problem located?”**

### Dynamic Readiness Formula (Configurable Prototype Model)
$$\text{Readiness Score} = (35\% \times \text{Health}) + (25\% \times \text{Critical Parts}) + (15\% \times \text{Maint.}) + (15\% \times \text{Supplier}) + (10\% \times \text{Capacity})$$

---

## 📊 Category Breakdown (1,248 Monitored Equipment)

- **ALL EQUIPMENT**: 1,248 Units
- **AIRCRAFT**: 320 Units
- **ARMORED VEHICLES**: 285 Units
- **GROUND VEHICLES**: 410 Units
- **AIR DEFENSE**: 96 Units
- **NAVAL SYSTEMS**: 72 Units
- **SUPPORT SYSTEMS**: 65 Units

---

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Three.js, `@react-three/fiber`, `@react-three/drei`, Recharts, Lucide Icons, React Router DOM v6
- **Backend**: Node.js, Express.js REST API
- **Data Architecture**: Dual-mode data engine — Mongoose MongoDB OR Zero-Config In-Memory dataset (1,248 Equipment, Components, Suppliers, Alerts)
- **AI Architecture**: AI service abstraction layer providing rule-based explanation ("WHY?") & natural language NEXORA AI assistant

---

## 💻 5-Minute Hackathon Demo Flow

1. **Open Command Center (`/dashboard`)**: View top KPI cards (1,248 Total Equipment, 864 Ready, 231 Limited, 19 Maintenance, 134 Critical, Overall Readiness 82%).
2. **Click `[ LIVE HEALTH CHECK ]`**: Observe real-time telemetry scan animation (`CONNECTING TO TELEMETRY...` -> `✓ SCAN COMPLETE`).
3. **Open All Equipment List (`/equipment`)**: Filter by category (e.g. Aircraft 320) or status (Critical).
4. **Inspect Equipment `AF-002` (`/equipment/AF-002`)**:
   - Equipment Health: 68%, Readiness: 51% (NOT READY).
   - **3D Problem Location**: Observe 3D jet model highlighting the **Cooling System** area in glowing red wireframe with an interactive `⚠ PROBLEM DETECTED` HUD connector card.
5. **Open NEXORA AI Assistant**: Click `NEXORA AI` button in header and ask: *"Why is AF-002 not ready?"* or *"Which equipment needs maintenance first?"*

---

## 🏃 Running Locally

### Step 1: Start Backend Server
```bash
cd server
npm install
npm start
```
*Backend runs at `http://localhost:5000` in zero-config DEMO TELEMETRY mode.*

### Step 2: Start Frontend Client
```bash
cd client
npm install
npm run dev
```
*Frontend opens at `http://localhost:3000`.*

---

## 🔐 One-Click Demo Credentials
- **Commander (Admin)**: `commander@nexora.mil` / `password123`
- **Logistics Lead**: `manager@nexora.mil` / `password123`
- **AI Analyst**: `analyst@nexora.mil` / `password123`
- **Guest Inspector**: `viewer@nexora.mil` / `password123`

---

## ⚠️ Safety & Ethical Compliance Statement
NEXORA is created strictly for maintenance planning, equipment safety, and supply-chain continuity. **It does NOT contain or utilize classified military data, targeting systems, weapon deployment information, or operational battlefield data.** All identifiers, telemetry numbers, and organizational names are completely synthetic and simulated for hackathon demonstration.
