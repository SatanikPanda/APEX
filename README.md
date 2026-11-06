# APEX 4.0: Autonomous Diagnostics Node & Cyber-Physical Maintenance Copilot

An industrial-grade SCADA diagnostics dashboard designed for smart manufacturing, Tier-1 automotive powertrain milling, robotic body-in-white (BIW) framing, and automated stamping workcells. 

The system pairs real-time shop-floor telemetry ingestion (vibration RMS, bearing thermography, hydraulic pressure, cycle time) with high-resolution optical inspection vision, automated FMEA (Failure Mode and Effects Analysis) root-cause triage, interactive OSHA-compliant technician Standard Operating Procedure (SOP) sign-offs, and dynamic downtime financial risk modeling.

---

## Architecture & Frameworks Involved

### 1. Frontend Architecture
* **React 19 (`react`, `react-dom` ^19.0.1)**: Modern concurrent UI runtime utilizing functional components, custom hooks, and reactive telemetry pipelines.
* **TypeScript 5.8 (`typescript` ^5.8.0)**: Strict static type safety covering all industrial telemetry payloads, diagnostic schemas, and work order records.
* **Vite 8 (`vite` ^8.3.0, `@vitejs/plugin-react` ^6.1.1)**: Lightning-fast development server with Rollup-optimized ESM production bundling.
* **Tailwind CSS v4 (`tailwindcss`, `@tailwindcss/vite` ^4.3.3)**: Next-generation CSS engine using CSS-first `@import "tailwindcss";` without configuration bloat, implementing a warm modernist SCADA palette (`#fbfaf7` canvas, crisp card surfaces, and tactile micro-interactions).
* **Lucide React (`lucide-react` ^0.546.0)**: Lightweight, accessible SVG iconography for SCADA industrial instrumentation and controls.
* **Motion (`motion` ^12.23.24)**: Hardware-accelerated UI transitions, live sensor pulses, and acoustic FFT waveform animations.

### 2. Backend & Diagnostics Engine
* **Node.js & Express 4 (`express` ^4.21.2)**: Lightweight server-side API proxy running on port 3000 (`PORT=3000`), handling high-capacity image payloads (`limit: '25mb'`) and JSON schema validation.
* **TSX (`tsx` ^4.21.0)**: Zero-config TypeScript execution engine for native Node.js ESM server execution in development.
* **Google GenAI SDK (`@google/genai` ^2.4.0)**: Server-side vision and structured JSON telemetry analysis with structured schemas (`DIAGNOSTIC_SCHEMA`) and automated fallback to calibrated engineering baselines when offline.
* **Dotenv (`dotenv` ^17.2.3)**: Secure environment variable management for production and container deployments.

### 3. Industrial Protocols & Standards
* **IEC 62541 OPC-UA Standard**: Node heartbeat latency simulation and synchronous industrial telemetry packet serialization.
* **OSHA 29 CFR 1910.147 LOTO**: Integrated Lockout/Tagout verification interlocks and technician badge credential tracking.
* **ISO 13374 / VDI 3832**: Vibration severity thresholds (RMS acceleration in $g$) and ISO VG hydraulic fluid degradation monitoring.

---

## Key Capabilities & Modules

1. **Optical Inspection Hub with 10mm × 10mm Calibration Grid (Graticule)**:
   * High-resolution photographic inspection viewport locked to `16:9` aspect ratio.
   * **10mm × 10mm physical scale calibration graticule** with 2mm subdivision ticks, 5mm intermediate border markers, coordinate axis rulers (`0mm` to `100mm`), center optical reticle, and calibrated `10mm SCALE (±0.02mm)` reference gauge.
   * Real-time zoom, pan, defect bounding-box overlays, live operator camera feed, and local image file uploads.
   * Fallback CAD vector reticles with dynamic thermal and vibration hotspot localization.
2. **Real-Time Sensor Ingestion & Acoustic FFT Visualizer**:
   * Interactive core temperature (°C) and vibration RMS ($g$) sliders.
   * One-click fault injection simulations (`+ Heat Spike`, `+ Vibration Spike`, `Reset Baseline`).
   * 32-band animated acoustic/vibration FFT waveform generator reflecting live mechanical deviations.
3. **Automated Cyber-Physical Root-Cause Correlation**:
   * Multimodal reasoning correlating optical wear patterns with sensor anomalies.
   * Specific equipment identification, fault classification, and immediate hazard alerting.
4. **Interactive Technician SOP Checklist & Dispatch**:
   * Numbered step-by-step remediation procedure with individual technician sign-offs.
   * LOTO compliance enforcement and automated dispatch to the plant MES (Manufacturing Execution System) queue.
5. **Downtime Risk & Loss Exposure Analytics**:
   * Real-time calculation of financial loss based on estimated downtime minutes and configurable hourly line burn rates ($1,850/h Body-in-White vs $2,400/h Stamping).
6. **Factory-Floor Hardware E-STOP (Emergency Stop)**:
   * Shop-wide safety interlock isolating active workcells and suspending inference until physically cleared.
7. **Python Edge Script Export (`app.py`)**:
   * Single-click export of an independent, self-contained Python + Streamlit dashboard script for air-gapped local terminal deployments.

---

## Project Structure

```
├── public/
│   └── favicon.svg              # Plant node favicon
├── src/
│   ├── assets/
│   │   └── images/              # Authentic industrial machinery photography
│   │       ├── spindle_bearing_inspection_*.jpg
│   │       ├── robot_joint_harmonic_drive_*.jpg
│   │       ├── hydraulic_press_manifold_*.jpg
│   │       ├── smt_driver_board_*.jpg
│   │       └── weld_electrode_tip_*.jpg
│   ├── components/
│   │   ├── DiagnosticsActionPlan.tsx   # Root-cause analysis, SOP checklists & MES dispatch
│   │   ├── IndustrialDiagram.tsx       # Vector CAD reticle schematics
│   │   ├── KPIRibbon.tsx               # Top 6-card SCADA metrics bar
│   │   ├── OpticalInspectionHub.tsx    # 10mm graticule, FFT visualizer & optical viewport
│   │   ├── PythonStreamlitModal.tsx    # Local Python app.py export modal
│   │   └── SCADANavbar.tsx             # Brand header, tabs, sensor pulse & E-Stop
│   ├── data/
│   │   ├── automotivePresets.ts        # 5 curated automotive manufacturing failure modes
│   │   └── workcells.ts                # 12-cell plant topology and status data
│   ├── types/
│   │   └── industrial.ts               # Complete TypeScript interfaces and domain schemas
│   ├── App.tsx                         # Primary SCADA dashboard layout & state machine
│   ├── index.css                       # Tailwind v4 directives & typography tokens
│   └── main.tsx                        # React application bootstrap
├── index.html                          # HTML entry point with Newsreader & Geist fonts
├── package.json                        # Dependencies, engines, and run scripts
├── server.ts                           # Express backend API & Vite middleware proxy
├── tsconfig.json                       # TypeScript compiler configuration
├── vite.config.ts                      # Vite configuration with React & Tailwind plugins
└── .env.example                        # Environment variable template
```

---

## Getting Started

### Prerequisites
* **Node.js**: `v20.x` or higher
* **npm**: `v10.x` or higher

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd apex-scada-diagnostics

# Install dependencies
npm install
```

### Environment Configuration
Create a `.env` file in the root directory (refer to `.env.example`):
```env
PORT=3000
NODE_ENV=development
# Optional: GEMINI_API_KEY for real-time generative AI multimodal inference
# If omitted, the system seamlessly uses calibrated industrial baseline triage
GEMINI_API_KEY=your_api_key_here
```

### Running Locally
```bash
# Start the full-stack development server (Express + Vite)
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Production Build & Deployment

```bash
# Compile client assets and verify types
npm run build

# Start the production server
npm start
```

### API Endpoints
* `GET /api/health`: Node diagnostic health status and ISO timestamp.
* `POST /api/diagnose`: Multimodal payload processing (accepts `imageBase64`, `mimeType`, `telemetryLog`, and `equipmentHint`).

---

## Standalone Python Deployment (`app.py`)

For isolated edge computers or shop-floor kiosks without Node.js:
1. Click the **Export app.py** button in the top navigation bar.
2. Save the generated `app.py` script.
3. Install dependencies:
   ```bash
   pip install streamlit google-genai pillow
   ```
4. Run the Streamlit application:
   ```bash
   streamlit run app.py
   ```
