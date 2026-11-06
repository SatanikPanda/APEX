# Industry 4.0 Cyber-Physical Maintenance Copilot (APEX 4.0)

A high-precision, production-grade industrial diagnostics operations dashboard engineered with SCADA / Siemens / Tesla factory aesthetic. The system ingests optical camera feeds and shop-floor telemetry logs to execute multimodal Failure Mode and Effects Analysis (FMEA), generating authoritative root-cause correlations, interactive technician Standard Operating Procedure (SOP) remediation checklists, downtime financial exposure tracking, and structured machine-to-machine JSON payloads.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural decisions were confirmed via interactive user interview in Phase 1:
> - **Delivery Platform**: Interactive React SCADA dashboard with an embedded, production-ready single-file Python Streamlit (`app.py`) exporter tab.
> - **Industrial Sector Presets**: Automotive & Robotics assembly workcells (spindles, 6-axis welding robot joints, stamping press hydraulic manifolds, motor drivers).
> - **Operational Workflows**: Interactive SOP technician checklist with task sign-off and financial downtime cost impact tracking ($/min operational loss calculation).

---

## 1. Overview & Core Concept

- **What It Does**: Autonomous edge triage node for smart factory shop-floors. Technicians and reliability engineers inspect degraded machine components (bearings, robotic gears, hydraulic lines, PCB motor drives) alongside telemetry logs (vibration RMS, thermal spikes, error codes) to isolate root causes and guide isolation and repair.
- **Target Persona**: Shop-floor maintenance technicians, reliability engineers, and plant operations supervisors managing automotive body-in-white and powertrain assembly lines.
- **Key Value**: Collapses Mean Time to Diagnose (MTTD) from hours to sub-2-second inference, prevents catastrophic secondary machine failures, and ensures rigorous compliance with OSHA Lockout/Tagout (LOTO) protocols through digital SOP sign-offs.

---

## 2. User Experience & Visual Design

### Visual Identity & Theme
- **Aesthetic Direction**: High-end Industrial Cyber-Physical SCADA / Siemens Sinumerik / Tesla Giga-Factory operations console. Utilitarian, precision-driven, high contrast dark environment.
- **Color Palette**:
  - Dominant Canvas: Deep industrial slate (`#0B0F19`, `#0F172A`)
  - Structural Panels: Crisp hairline-bordered charcoal panels (`#111827`, border: `rgba(255,255,255,0.08)`)
  - Semantic Status:
    - `CRITICAL`: Industrial Crimson (`#EF4444`, `rgba(239, 68, 68, 0.15)`)
    - `MEDIUM / WARNING`: Amber Hazard (`#F59E0B`, `rgba(245, 158, 11, 0.15)`)
    - `NOMINAL / LOW`: Precision Emerald (`#10B981`, `rgba(16, 185, 129, 0.15)`)
    - `SYSTEM ACCENT`: Precision Cyan / Industrial Cobalt (`#38BDF8`, `#2563EB`)
- **Typography & Tabular Discipline**:
  - Display / Headings: `Plus Jakarta Sans` & `Barlow Condensed` for high-density structural readability.
  - Data & Metrics: `JetBrains Mono` and `tabular-nums` for all sensor readings, error codes, timestamps, and cost estimates.
- **Spatial Layout & Hierarchy**:
  - Top Industrial Bar: Single-row 3-zone contract displaying node identifier (`APEX 4.0 // LINE 04 ROBOTICS`), real-time OPC-UA connection indicator, workcell health stats, and Python Export launcher.
  - 4-Column KPI Metric Ribbon: Active Workcells (`12 / 12`), Diagnostic Latency (`~1.4s`), Mean Time to Diagnose (`< 1.8s`), Safety Incidents (`0`).
  - Two-Column Operational Split:
    - **Left Column: Optical Inspection & Telemetry Hub**: Drag-and-drop feed with camera/canvas capture, 5 automotive assembly presets (Spindle Bearing Galling, Robotic Joint Gear Crack, Hydraulic Seal Extrusion, Burnt SMT Driver, Nominal Weld Tip), manual telemetry sliders/inputs (RPM, Temp, Vibration g-force, Pressure, Error Code), and quick-inject telemetry buttons.
    - **Right Column: Prescriptive Telemetry & Action Plan**:
      - Severity & Hazard Warning banner with immediate operator hazard alert.
      - Component identification & fault classification card.
      - Upstream root-cause correlation breakdown.
      - Interactive SOP Remediation Checklist with technician step sign-offs, timer, and notes.
      - Line Downtime & Financial Loss Calculator ($/hr line loss rate with real-time exposure tally).
      - Preventive Maintenance recommendations.
      - Raw machine-to-machine JSON payload inspector with single-click copy and dispatch export.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Full-Stack React + Node/Express Server Architecture**
  - *Chosen Approach*: Implement a full-featured React 19 + Tailwind v4 interface supported by an Express backend proxy (`server.ts` / `/api/diagnose`) that invokes the `@google/genai` SDK using `process.env.GEMINI_API_KEY`.
  - *Why*: Adheres strictly to the AI Studio security rules (zero client-side API key exposure), guarantees robust JSON schema enforcement, and ensures instant, responsive interaction.
- **Decision 2: Dual-Mode Delivery (Interactive Web App + Single-File Streamlit `app.py` Exporter)**
  - *Chosen Approach*: Deliver the fully functional live interactive dashboard in React, while integrating an "Industrial Python Streamlit Script Exporter" modal. The exported `app.py` script is a complete, self-contained, revamped Streamlit application using the requested custom CSS, Gemini 2.5 Flash SDK, and industrial layout.
  - *Why*: Satisfies both the user's desire to test and operate the app directly inside AI Studio and their request for a drop-in replacement `app.py` script for local deployment.
- **Decision 3: Realistic Automotive Assembly Presets with Sensor Data**
  - *Chosen Approach*: Pre-configure realistic industrial failure modes from Tier 1 automotive robotic stamping and welding lines, complete with high-resolution imagery, calibrated telemetry (temperatures, vibration spectra, error codes), and verified ground-truth diagnostics.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        APEX 4.0 SCADA Topbar                           │
│  [Node ID: Line 04]  │  [OPC-UA: Connected 18ms]  │  [Export Python]  │
└────────────────────────────────────────────────────────────────────────┘
                                    │
┌────────────────────────────────────────────────────────────────────────┐
│             KPI Ribbon: Workcells | Latency | MTTD | Safety            │
└────────────────────────────────────────────────────────────────────────┘
                  │                                     │
    ┌─────────────┴─────────────┐         ┌─────────────┴─────────────┐
    │  Optical & Telemetry Hub  │         │ Diagnostics & Action Plan │
    │ ───────────────────────── │         │ ───────────────────────── │
    │ • Optical Viewport        │         │ • Severity & Hazard Alert │
    │ • File Upload / Camera    │         │ • Asset Identification    │
    │ • Assembly Presets (5x)   │         │ • Root Cause Correlation  │
    │ • Telemetry Input Form    │         │ • Interactive SOP Signoff │
    │   - Error Code, Temp,     │         │ • Downtime Financial Calc │
    │     Vibration, Pressure   │         │ • Preventive Maintenance  │
    │ • "RUN DIAGNOSTIC PASS"   │         │ • Raw M2M JSON Payload    │
    └─────────────┬─────────────┘         └─────────────┬─────────────┘
                  │                                     │
                  └───────────────┬─────────────────────┘
                                  ▼
                    ┌───────────────────────────┐
                    │  POST /api/diagnose       │
                    │  (Node / Express Server)  │
                    │  - @google/genai SDK      │
                    │  - Model: gemini-2.5-flash│
                    │  - Structured JSON Schema │
                    └───────────────────────────┘
```

### Data Schema (Industry 4.0 Telemetry Payload)
```typescript
interface DiagnosticReport {
  equipment_identified: string;
  fault_name: string;
  severity_level: 'LOW' | 'MEDIUM' | 'CRITICAL';
  immediate_hazard_alert: string;
  root_cause_analysis: string;
  remediation_sop: string[];
  preventive_measure: string;
  estimated_downtime_minutes: number;
}
```

### Interactive State Flow
1. **Preset or Manual Selection**: User selects an automotive preset (e.g. Spindle Axis Z Bearing) or uploads an image and enters sensor readings.
2. **Diagnostic Dispatch**: Clicking "RUN DIAGNOSTIC PASS" triggers a request to `/api/diagnose` with multimodal payloads (Base64 image + telemetry parameters).
3. **Real-time Diagnostic Presentation**: Results render with industrial severity banners, interactive SOP checkboxes with completion timestamps, and a real-time financial downtime loss ticker.
4. **Export & Dispatch**: Technician can export a structured PDF/JSON shop-floor ticket or view and copy the revamped `app.py` Streamlit script.
