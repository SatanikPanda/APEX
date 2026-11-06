import React, { useState } from 'react';
import { X, Copy, Check, Download, FileCode2, Terminal } from 'lucide-react';

interface PythonStreamlitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PythonStreamlitModal: React.FC<PythonStreamlitModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const pythonScriptCode = `"""
APEX 4.0 · Autonomous Diagnostics Node
Industry 4.0 Cyber-Physical Maintenance Copilot & Diagnostics Engineer
SCADA / Siemens / Tesla Factory UI Operations Dashboard
Powered by Industrial Neural Diagnostics Core
"""

import streamlit as st
from google import genai
from google.genai import types
from PIL import Image
import json
import time

st.set_page_config(
    page_title="APEX 4.0 | Industrial Diagnostics Node",
    page_icon="⚡",
    layout="wide",
    initial_sidebar_state="expanded"
)

# ----------------- Modern Industrial Dark SCADA Theme -----------------
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
    
    * {
        font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    
    code, pre, .stCode, .mono-data {
        font-family: 'JetBrains Mono', monospace !important;
        font-feature-settings: "tnum" 1, "zero" 1;
    }

    .main {
        background-color: #0b0f19;
        color: #f1f5f9;
    }

    /* Top KPI Metric Ribbon */
    .kpi-container {
        display: flex;
        gap: 0.75rem;
        margin-bottom: 1.5rem;
        flex-wrap: wrap;
    }
    .kpi-card {
        background: #111827;
        border: 1px solid #1f2937;
        border-radius: 6px;
        padding: 0.85rem 1.1rem;
        flex: 1;
        min-width: 140px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    }
    .kpi-label {
        font-size: 0.7rem;
        color: #94a3b8;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-weight: 600;
    }
    .kpi-val {
        font-size: 1.4rem;
        font-weight: 700;
        color: #f8fafc;
        margin-top: 0.2rem;
        font-family: 'JetBrains Mono', monospace;
    }
    .kpi-sub {
        font-size: 0.65rem;
        color: #64748b;
        font-family: 'JetBrains Mono', monospace;
        margin-top: 0.15rem;
    }

    /* Severity Status Badges */
    .badge-critical {
        background-color: rgba(239, 68, 68, 0.15);
        color: #ef4444;
        border: 1px solid rgba(239, 68, 68, 0.5);
        padding: 0.6rem 1rem;
        border-radius: 6px;
        font-weight: 700;
        font-size: 0.88rem;
        font-family: 'JetBrains Mono', monospace;
        display: block;
        margin-bottom: 1rem;
    }
    .badge-medium {
        background-color: rgba(245, 158, 11, 0.15);
        color: #f59e0b;
        border: 1px solid rgba(245, 158, 11, 0.5);
        padding: 0.6rem 1rem;
        border-radius: 6px;
        font-weight: 700;
        font-size: 0.88rem;
        font-family: 'JetBrains Mono', monospace;
        display: block;
        margin-bottom: 1rem;
    }
    .badge-low {
        background-color: rgba(16, 185, 129, 0.15);
        color: #10b981;
        border: 1px solid rgba(16, 185, 129, 0.5);
        padding: 0.6rem 1rem;
        border-radius: 6px;
        font-weight: 700;
        font-size: 0.88rem;
        font-family: 'JetBrains Mono', monospace;
        display: block;
        margin-bottom: 1rem;
    }

    /* SOP Remediation Step */
    .sop-step {
        background: #0f172a;
        border-left: 3px solid #38bdf8;
        padding: 0.75rem 1rem;
        margin-bottom: 0.5rem;
        border-radius: 0 4px 4px 0;
        font-size: 0.88rem;
        line-height: 1.5;
        border-top: 1px solid #1e293b;
        border-right: 1px solid #1e293b;
        border-bottom: 1px solid #1e293b;
    }

    /* Telemetry Info Box */
    .info-box {
        background: #111827;
        border: 1px solid #1f2937;
        border-radius: 6px;
        padding: 1rem;
        margin-bottom: 1rem;
    }
</style>
""", unsafe_allow_html=True)

# ----------------- Top Header Bar -----------------
col_title, col_conn = st.columns([3, 1])
with col_title:
    st.markdown("### ⚡ APEX 4.0 · Autonomous Diagnostics Node")
    st.caption("Line 04 Automotive Robotics Assembly · Cyber-Physical Edge Triage Engine")
with col_conn:
    st.markdown("""
        <div style="text-align: right; font-size: 0.82rem; color: #10b981; font-family: 'JetBrains Mono'; padding-top: 8px;">
            ● OPC-UA: CONNECTED<br><span style="color: #64748b;">LATENCY: 18ms · WORKCELL #07</span>
        </div>
    """, unsafe_allow_html=True)

# ----------------- Top KPI Counters -----------------
st.markdown("""
<div class="kpi-container">
    <div class="kpi-card">
        <div class="kpi-label">Active Workcells</div>
        <div class="kpi-val">12 / 12</div>
        <div class="kpi-sub">100% OPERATIONAL</div>
    </div>
    <div class="kpi-card">
        <div class="kpi-label">Diagnostics Latency</div>
        <div class="kpi-val" style="color: #38bdf8;">~1.4s</div>
        <div class="kpi-sub">MTTD &lt; 1.8s TARGET</div>
    </div>
    <div class="kpi-card">
        <div class="kpi-label">Defect Escape Rate</div>
        <div class="kpi-val" style="color: #10b981;">0.00%</div>
        <div class="kpi-sub">ZERO RUNAWAYS</div>
    </div>
    <div class="kpi-card">
        <div class="kpi-label">Safety Incidents</div>
        <div class="kpi-val" style="color: #10b981;">0</div>
        <div class="kpi-sub">OSHA LOTO COMPLIANT</div>
    </div>
    <div class="kpi-card">
        <div class="kpi-label">Diagnostics Core</div>
        <div class="kpi-val" style="color: #60a5fa;">Neural FMEA</div>
        <div class="kpi-sub">AUTONOMOUS ENGINE</div>
    </div>
</div>
""", unsafe_allow_html=True)

# ----------------- Sidebar Configuration & Feed Ingestion -----------------
with st.sidebar:
    st.subheader("🔐 Edge Gateway Authentication")
    api_key = st.text_input("Diagnostics Gateway API Key", type="password", placeholder="AIzaSy...")
    st.divider()

    st.subheader("📡 Preset Quick-Loads")
    preset_choice = st.selectbox(
        "Automotive Assembly Failure Modes",
        [
            "Custom Feed / Manual Entry",
            "High-Speed Spindle Axis Z (E-301 Over-Temp & Vibration)",
            "6-Axis Robot Joint 4 Harmonic Drive (E-409 Gear Crack)",
            "Stamping Press Hydraulic Manifold (E-718 Pressure Drop)",
            "SMT Feeder Motor Driver (E-212 MOSFET Overcurrent)"
        ]
    )

    default_notes = ""
    if "Spindle" in preset_choice:
        default_notes = "Error code: E-301. Spindle speed 18,200 RPM, sudden 14% torque drop. Core temp 88.5°C, vibration RMS 4.82g at 7.2 kHz harmonic."
    elif "Robot Joint" in preset_choice:
        default_notes = "Error code: E-409. Joint 4 backlash +0.42mm TCP drift. Servo current ripple 185% nominal. Temp 72°C, vibration 3.45g."
    elif "Stamping" in preset_choice:
        default_notes = "Error code: E-718. Hydraulic pressure dropped from 240 bar to 168 bar. ISO VG 46 fluid weeping detected at proportional valve subplate."
    elif "SMT" in preset_choice:
        default_notes = "Error code: E-212. Feeder axis motor stuttering. Driver PCB MOSFET hotspot at 94.8°C. Overcurrent trip logged."

    st.divider()
    st.subheader("📷 Optical Feed & Telemetry")
    uploaded_file = st.file_uploader("Upload Component/Machine Photo", type=["jpg", "png", "jpeg"])
    
    telemetry_log = st.text_area(
        "Shop-Floor Telemetry / Error Log",
        value=default_notes,
        placeholder="e.g. Error code: E-409, thermal spike 84°C, vibration RMS 4.2 g",
        height=120
    )
    
    analyze_btn = st.button("⚡ RUN DIAGNOSTIC PASS", type="primary", use_container_width=True)

# ----------------- Two-Column Operational Split -----------------
col_feed, col_diag = st.columns([1, 1], gap="medium")

with col_feed:
    st.markdown("#### 📷 Optical Inspection Zone")
    if uploaded_file:
        img = Image.open(uploaded_file)
        st.image(img, use_container_width=True, caption="In-Line Optical Inspection Feed (4K Inspection FOV)")
    else:
        st.markdown(f"""
        <div style="border: 2px dashed #1e293b; border-radius: 8px; padding: 4rem 2rem; text-align: center; color: #64748b; background: #0f172a;">
            <div style="font-size: 1.8rem; margin-bottom: 0.5rem;">🔍</div>
            <div style="font-weight: 600; color: #94a3b8;">Awaiting Optical Feed Payload</div>
            <div style="font-size: 0.8rem; margin-top: 0.25rem;">Active Preset: <b>{preset_choice}</b></div>
            <div style="font-size: 0.75rem; color: #475569; margin-top: 0.5rem;">Upload photo in sidebar or supply telemetry notes to trigger FMEA</div>
        </div>
        """, unsafe_allow_html=True)

with col_diag:
    st.markdown("#### 📊 Diagnostic & Prescriptive Telemetry")

    if analyze_btn:
        if not api_key:
            st.error("Missing Gateway API Key. Please enter it in the sidebar.")
        elif not uploaded_file and not telemetry_log:
            st.warning("Please supply an image or telemetry text.")
        else:
            with st.spinner("Executing Multimodal Failure Mode & Effects Analysis (FMEA)..."):
                try:
                    start_time = time.time()
                    client = genai.Client(api_key=api_key)

                    prompt_content = [
                        "Perform an authoritative Industry 4.0 failure analysis and generate an immediate technician SOP."
                    ]
                    if telemetry_log:
                        prompt_content.append(f"Shop-Floor Telemetry / Operator Logs:\\n{telemetry_log}")
                    if uploaded_file:
                        prompt_content.append(Image.open(uploaded_file))

                    system_instruction = (
                        "You are an expert Industry 4.0 Cyber-Physical Maintenance Engineer deployed on a smart automotive factory floor. "
                        "Analyze machinery visual feeds and telemetry logs. Provide precise diagnostics, root causes, and repair SOPs. "
                        "You must strictly output structured JSON conforming to the requested schema."
                    )

                    json_schema = {
                        "type": "OBJECT",
                        "properties": {
                            "equipment_identified": {"type": "STRING"},
                            "fault_name": {"type": "STRING"},
                            "severity_level": {"type": "STRING", "enum": ["LOW", "MEDIUM", "CRITICAL"]},
                            "immediate_hazard_alert": {"type": "STRING"},
                            "root_cause_analysis": {"type": "STRING"},
                            "remediation_sop": {"type": "ARRAY", "items": {"type": "STRING"}},
                            "preventive_measure": {"type": "STRING"},
                            "estimated_downtime_minutes": {"type": "INTEGER"}
                        },
                        "required": [
                            "equipment_identified",
                            "fault_name",
                            "severity_level",
                            "immediate_hazard_alert",
                            "root_cause_analysis",
                            "remediation_sop",
                            "preventive_measure",
                            "estimated_downtime_minutes"
                        ]
                    }

                    model_name = os.environ.get("DIAGNOSTICS_MODEL", "neural-fmea-v4")
                    response = client.models.generate_content(
                        model=model_name,
                        contents=prompt_content,
                        config=types.GenerateContentConfig(
                            system_instruction=system_instruction,
                            response_mime_type="application/json",
                            response_schema=json_schema,
                            temperature=0.1
                        )
                    )

                    res = json.loads(response.text)
                    latency = round(time.time() - start_time, 2)

                    # Severity Alert Banner
                    sev = res.get("severity_level", "LOW")
                    if sev == "CRITICAL":
                        st.markdown(f'<div class="badge-critical">🚨 CRITICAL FAULT: {res.get("fault_name")} (Inference: {latency}s)</div>', unsafe_allow_html=True)
                    elif sev == "MEDIUM":
                        st.markdown(f'<div class="badge-medium">⚠️ WARNING: {res.get("fault_name")} (Inference: {latency}s)</div>', unsafe_allow_html=True)
                    else:
                        st.markdown(f'<div class="badge-low">✅ NOMINAL / LOW RISK: {res.get("fault_name")} (Inference: {latency}s)</div>', unsafe_allow_html=True)

                    # Diagnostic Report Container
                    with st.container():
                        st.markdown(f"**Identified Asset:** \`{res.get('equipment_identified')}\`")
                        st.markdown(f"**Immediate Hazard:** {res.get('immediate_hazard_alert')}")
                        st.markdown(f"**Root-Cause Correlation:** {res.get('root_cause_analysis')}")
                        
                        downtime = res.get('estimated_downtime_minutes', 30)
                        hourly_rate = 1850  # Automotive BIW rate ($/hr)
                        cost_exposure = round((downtime / 60) * hourly_rate)
                        
                        st.markdown(f"**Estimated Line Downtime:** \`{downtime} minutes\` · **Financial Exposure:** \`\${cost_exposure:,} USD\`")

                        st.markdown("##### 🛠️ Standard Operating Procedure (SOP) Remediation:")
                        for idx, step in enumerate(res.get("remediation_sop", []), 1):
                            st.markdown(f'<div class="sop-step"><b>Step {idx}:</b> {step}</div>', unsafe_allow_html=True)

                        st.markdown(f"**Preventive Recommendation:** *{res.get('preventive_measure')}*")

                    with st.expander("📦 Machine-to-Machine Payload (JSON Schema)"):
                        st.json(res)

                except Exception as e:
                    st.error(f"Inference error: {str(e)}")
    else:
        st.info("Select an automotive preset or upload component feed to trigger real-time FMEA analysis.")
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(pythonScriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([pythonScriptCode], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'app.py';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="bg-[#1c1917] border border-stone-800 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-[#151311]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-stone-800 rounded-full text-amber-300">
              <FileCode2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif-display text-base font-semibold text-stone-100">
                Production Python Script (app.py)
              </h2>
              <p className="text-xs text-stone-400 font-mono">
                Single-file implementation with SCADA Dark Theme & Neural Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono font-medium text-stone-200 bg-stone-800 hover:bg-stone-700 rounded-full border border-stone-700 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono font-medium text-stone-900 bg-stone-100 hover:bg-white rounded-full transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download app.py</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition-colors ml-2 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Instructions banner */}
        <div className="bg-stone-900/90 border-b border-stone-800 px-6 py-2.5 text-xs font-mono text-stone-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-amber-300" />
            <span>RUN LOCALLY: <b>pip install google-genai streamlit pillow</b> && <b>streamlit run app.py</b></span>
          </div>
          <span className="text-[11px] text-stone-500">ENGINE: Neural FMEA Core · SCHEMA: JSON</span>
        </div>

        {/* Code Viewport */}
        <div className="flex-1 overflow-auto p-4 bg-[#100e0d]">
          <pre className="text-xs font-mono text-stone-300 leading-relaxed">
            <code>{pythonScriptCode}</code>
          </pre>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-stone-800 bg-[#151311] flex items-center justify-between text-xs font-mono text-stone-500">
          <span>APEX 4.0 | Cyber-Physical Edge Diagnostics Node</span>
          <span>Industrial Automation System · 2026</span>
        </div>

      </div>
    </div>
  );
};
