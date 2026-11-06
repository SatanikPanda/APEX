import React, { useState } from 'react';
import { SCADANavbar } from './components/SCADANavbar';
import { KPIRibbon } from './components/KPIRibbon';
import { OpticalInspectionHub } from './components/OpticalInspectionHub';
import { DiagnosticsActionPlan } from './components/DiagnosticsActionPlan';
import { PythonStreamlitModal } from './components/PythonStreamlitModal';
import { AUTOMOTIVE_PRESETS } from './data/automotivePresets';
import { AUTOMOTIVE_WORKCELLS } from './data/workcells';
import { AutomotivePreset, DiagnosticReport, SOPStepStatus, TelemetryLogData, WorkOrderRecord } from './types/industrial';
import { Wrench, Terminal, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'inspection' | 'workcells' | 'sop' | 'analytics' | 'orders' | 'logs'>('inspection');
  const [isPythonModalOpen, setIsPythonModalOpen] = useState(false);
  const [isEmergencyStopped, setIsEmergencyStopped] = useState(false);
  const [eStopNotice, setEStopNotice] = useState<string | null>(null);

  // Core Inspection State
  const [currentPreset, setCurrentPreset] = useState<AutomotivePreset>(AUTOMOTIVE_PRESETS[0]);
  const [telemetry, setTelemetry] = useState<TelemetryLogData>(AUTOMOTIVE_PRESETS[0].telemetry);
  const [customImageBase64, setCustomImageBase64] = useState<string | null>(null);
  const [report, setReport] = useState<DiagnosticReport>(AUTOMOTIVE_PRESETS[0].groundTruth);
  const [isLoading, setIsLoading] = useState(false);

  // SOP Steps State
  const [sopSteps, setSopSteps] = useState<SOPStepStatus[]>(() =>
    AUTOMOTIVE_PRESETS[0].groundTruth.remediation_sop.map((step, idx) => ({
      stepIndex: idx + 1,
      text: step,
      completed: false,
    }))
  );

  // Live Work Order Dispatch System
  const [workOrders, setWorkOrders] = useState<WorkOrderRecord[]>([
    {
      orderId: 'WO-1092',
      workcellId: 'WC-04',
      equipment: 'CNC High-Speed Spindle Axis Z',
      fault: 'Bearing Raceway Galling',
      severity: 'CRITICAL',
      timestamp: '11:42 AM',
      technicianId: 'TECH-4882',
      status: 'DISPATCHED',
      downtimeMinutes: 55,
      costLossUsd: 1695,
    },
  ]);

  // Metrics State
  const [totalScans, setTotalScans] = useState(52);
  const [activeFaults, setActiveFaults] = useState(3);
  const [avgLatencyMs, setAvgLatencyMs] = useState(1380);
  const [safetyIncidents] = useState(0);
  const [hourlyLineRate, setHourlyLineRate] = useState(1850);

  // Preset Selection
  const handleSelectPreset = (preset: AutomotivePreset) => {
    setCurrentPreset(preset);
    setTelemetry(preset.telemetry);
    setCustomImageBase64(null);
    setReport(preset.groundTruth);
    setSopSteps(
      preset.groundTruth.remediation_sop.map((step, idx) => ({
        stepIndex: idx + 1,
        text: step,
        completed: false,
      }))
    );
  };

  const handleRunDiagnostics = async () => {
    if (isEmergencyStopped) {
      setEStopNotice('INFERENCE HALTED: Workcells locked under Emergency Stop (E-STOP). Clear physical safety interlocks first.');
      setTimeout(() => setEStopNotice(null), 5000);
      return;
    }

    setIsLoading(true);
    const startTime = Date.now();
    try {
      const response = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: customImageBase64 || undefined,
          telemetryLog: `Error Code: ${telemetry.errorCode} | Temp: ${telemetry.temperatureC}C | Vibration: ${telemetry.vibrationRmsG}g | Notes: ${telemetry.notes}`,
          equipmentHint: currentPreset.title,
        }),
      });

      if (!response.ok) {
        throw new Error(`Inference returned HTTP ${response.status}`);
      }

      const data: DiagnosticReport = await response.json();
      const elapsed = Date.now() - startTime;

      setReport({
        ...data,
        inference_time_ms: data.inference_time_ms || elapsed,
      });

      setSopSteps(
        data.remediation_sop.map((step, idx) => ({
          stepIndex: idx + 1,
          text: step,
          completed: false,
        }))
      );

      setTotalScans((prev) => prev + 1);
      setAvgLatencyMs(elapsed);
      if (data.severity_level === 'CRITICAL' || data.severity_level === 'MEDIUM') {
        setActiveFaults((prev) => Math.min(12, prev + 1));
      }
    } catch (err) {
      console.warn('API error, executing calibrated fallback:', err);
      setReport(currentPreset.groundTruth);
      setSopSteps(
        currentPreset.groundTruth.remediation_sop.map((step, idx) => ({
          stepIndex: idx + 1,
          text: step,
          completed: false,
        }))
      );
      setTotalScans((prev) => prev + 1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddWorkOrder = (order: WorkOrderRecord) => {
    setWorkOrders((prev) => [order, ...prev]);
  };

  const handleResolveOrder = (orderId: string) => {
    setWorkOrders((prev) =>
      prev.map((o) => (o.orderId === orderId ? { ...o, status: 'RESOLVED' } : o))
    );
  };

  const totalFinancialRisk = Math.round((report.estimated_downtime_minutes / 60) * hourlyLineRate);

  return (
    <div className="min-h-screen bg-[#fbfaf7] text-stone-900 flex flex-col font-body antialiased">
      
      {/* Emergency Stop Active Indicator Banner */}
      {isEmergencyStopped && (
        <div className="w-full bg-rose-600 text-white font-mono text-xs py-2 px-4 flex items-center justify-between font-bold z-50 shadow-md">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 animate-bounce" />
            <span>CIRCUIT LOCKOUT: EMERGENCY FEED STOP ACTIVATED (ALL 12 CELLS ISOLATED)</span>
          </div>
          <button
            onClick={() => setIsEmergencyStopped(false)}
            className="px-3 py-1 bg-black/30 hover:bg-black/50 rounded-full border border-white/40 uppercase cursor-pointer transition-colors text-[11px]"
          >
            Clear E-Stop Interlock
          </button>
        </div>
      )}

      {/* Temporary Notice if E-Stop halts diagnostics */}
      {eStopNotice && (
        <div className="w-full bg-amber-500 text-stone-950 font-mono text-xs py-2 px-4 text-center font-bold">
          {eStopNotice}
        </div>
      )}

      {/* Top SCADA Navigation */}
      <SCADANavbar
        onOpenPythonExport={() => setIsPythonModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeWorkcellsCount={12}
        isEmergencyStopped={isEmergencyStopped}
        onToggleEStop={() => setIsEmergencyStopped(!isEmergencyStopped)}
      />

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 py-4 flex flex-col">
        {/* KPI Statistics Ribbon */}
        <KPIRibbon
          totalScans={totalScans}
          activeFaults={activeFaults}
          avgLatencyMs={avgLatencyMs}
          safetyIncidents={safetyIncidents}
          activeWorkcells={12}
          totalWorkcells={12}
          totalFinancialRisk={totalFinancialRisk}
        />

        {/* Tab 1: Inspection Hub */}
        {activeTab === 'inspection' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
            <OpticalInspectionHub
              currentPreset={currentPreset}
              onSelectPreset={handleSelectPreset}
              telemetry={telemetry}
              setTelemetry={setTelemetry}
              customImageBase64={customImageBase64}
              setCustomImageBase64={setCustomImageBase64}
              onRunDiagnostics={handleRunDiagnostics}
              isLoading={isLoading}
            />
            <DiagnosticsActionPlan
              report={report}
              sopSteps={sopSteps}
              setSopSteps={setSopSteps}
              hourlyLineRate={hourlyLineRate}
              setHourlyLineRate={setHourlyLineRate}
              onDispatchWorkOrder={handleAddWorkOrder}
            />
          </div>
        )}

        {/* Tab 2: Workcells Fleet */}
        {activeTab === 'workcells' && (
          <div className="bg-white border border-[#eceae3] rounded-2xl p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-4 border-b border-[#eceae3] pb-3">
              <div>
                <h2 className="font-serif-display text-lg font-semibold text-stone-900">
                  Line 04 Automotive Fleet Topology (12 Cells Monitored)
                </h2>
                <p className="text-xs text-stone-500 font-mono mt-0.5">
                  OPC-UA Synchronous Node Heartbeat | Protocol: IEC 62541
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-emerald-800 font-medium bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">9 Nominal</span>
                <span className="text-amber-900 font-medium bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">1 Warning</span>
                <span className="text-rose-800 font-medium bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">2 Critical</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
              {AUTOMOTIVE_WORKCELLS.map((cell) => {
                const isCrit = cell.status === 'CRITICAL';
                const isWarn = cell.status === 'WARNING';
                return (
                  <div
                    key={cell.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isCrit
                        ? 'bg-rose-50/50 border-rose-200'
                        : isWarn
                          ? 'bg-amber-50/50 border-amber-200'
                          : 'bg-[#faf9f5] border-[#eceae3] hover:border-stone-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-mono font-semibold text-stone-600">{cell.id}</span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${
                          isCrit
                            ? 'bg-rose-100 text-rose-800'
                            : isWarn
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {cell.status}
                      </span>
                    </div>
                    <h3 className="text-xs font-semibold text-stone-900 line-clamp-1 mb-0.5">{cell.name}</h3>
                    <p className="text-[11px] text-stone-500 font-mono mb-2.5">{cell.zone}</p>
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono bg-white p-2.5 rounded-lg border border-[#eceae3] mb-3">
                      <div>
                        <span className="text-stone-400 block">TEMP:</span>
                        <span className={cell.temperatureC > 70 ? 'text-rose-700 font-bold' : 'text-stone-800'}>
                          {cell.temperatureC}°C
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-400 block">VIBRATION:</span>
                        <span className={cell.vibrationG > 2.5 ? 'text-amber-700 font-bold' : 'text-stone-800'}>
                          {cell.vibrationG}g
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-400 block">CYCLE:</span>
                        <span className="text-stone-800">{cell.cycleTimeSec}s</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block">UPTIME:</span>
                        <span className="text-emerald-700 font-semibold">{cell.uptimePct}%</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const matchingPreset = AUTOMOTIVE_PRESETS.find((p) =>
                          (cell.name.toLowerCase().includes('spindle') && p.id === 'spindle-z') ||
                          (cell.name.toLowerCase().includes('welding') && p.id === 'robot-joint4') ||
                          (cell.name.toLowerCase().includes('stamping') && p.id === 'hydraulic-press') ||
                          (cell.name.toLowerCase().includes('smt') && p.id === 'smt-driver')
                        ) || AUTOMOTIVE_PRESETS[0];
                        handleSelectPreset(matchingPreset);
                        setActiveTab('inspection');
                      }}
                      className="w-full py-1.5 text-[11px] font-mono font-medium text-center text-stone-900 bg-stone-100 hover:bg-stone-200 border border-[#eceae3] rounded-full transition-colors cursor-pointer"
                    >
                      Route to Inspection Hub →
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: SOP Workbench */}
        {activeTab === 'sop' && (
          <div className="bg-white border border-[#eceae3] rounded-2xl p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-4 border-b border-[#eceae3] pb-3">
              <div>
                <h2 className="font-serif-display text-lg font-semibold text-stone-900 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-stone-700" />
                  <span>Standard Operating Procedure Execution Table</span>
                </h2>
                <p className="text-xs text-stone-500 font-mono mt-0.5">
                  Asset: <span className="text-stone-900 font-semibold">{report.equipment_identified}</span>
                </p>
              </div>
              <div className="text-xs font-mono font-medium text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                {sopSteps.filter((s) => s.completed).length}/{sopSteps.length} Steps Signed
              </div>
            </div>

            <div className="space-y-2.5">
              {sopSteps.map((step) => (
                <div
                  key={step.stepIndex}
                  onClick={() => {
                    setSopSteps((prev) =>
                      prev.map((s) =>
                        s.stepIndex === step.stepIndex
                          ? { ...s, completed: !s.completed, timestamp: !s.completed ? new Date().toLocaleTimeString() : undefined }
                          : s
                      )
                    );
                  }}
                  className={`p-4 rounded-xl border cursor-pointer select-none transition-all ${
                    step.completed
                      ? 'bg-emerald-50/50 border-emerald-300 text-stone-800'
                      : 'bg-[#faf9f5] border-[#eceae3] hover:border-stone-400 text-stone-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono font-bold text-stone-900">STEP 0{step.stepIndex}</span>
                    {step.completed && (
                      <span className="text-[10px] font-mono text-emerald-800 flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED {step.timestamp}
                      </span>
                    )}
                  </div>
                  <p className={`text-xs leading-relaxed ${step.completed ? 'line-through text-stone-400' : 'text-stone-700'}`}>
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Work Orders Queue */}
        {activeTab === 'orders' && (
          <div className="bg-white border border-[#eceae3] rounded-2xl p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-4 border-b border-[#eceae3] pb-3">
              <div>
                <h2 className="font-serif-display text-lg font-semibold text-stone-900">
                  MES Maintenance Work Order Queue ({workOrders.length} Dispatched)
                </h2>
                <p className="text-xs text-stone-500 font-mono mt-0.5">
                  Synchronous dispatch feed from diagnostic triage to plant ERP
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#eceae3] text-stone-500 bg-[#faf9f5]">
                    <th className="py-2.5 px-3">ORDER ID</th>
                    <th className="py-2.5 px-2">WORKCELL</th>
                    <th className="py-2.5 px-2">ASSET</th>
                    <th className="py-2.5 px-2">FAULT</th>
                    <th className="py-2.5 px-2">SEVERITY</th>
                    <th className="py-2.5 px-2">STATUS</th>
                    <th className="py-2.5 px-2">TIME</th>
                    <th className="py-2.5 px-2">EXPOSURE</th>
                    <th className="py-2.5 px-2 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eceae3]">
                  {workOrders.map((wo) => (
                    <tr key={wo.orderId} className="hover:bg-[#faf9f5] transition-colors">
                      <td className="py-3 px-3 text-stone-900 font-semibold">{wo.orderId}</td>
                      <td className="py-3 px-2 text-stone-600">{wo.workcellId}</td>
                      <td className="py-3 px-2 text-stone-900 font-medium">{wo.equipment}</td>
                      <td className="py-3 px-2 text-stone-600">{wo.fault}</td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          wo.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-900'
                        }`}>
                          {wo.severity}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          wo.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-800'
                        }`}>
                          {wo.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-stone-500">{wo.timestamp}</td>
                      <td className="py-3 px-2 text-rose-700 font-medium">${wo.costLossUsd.toLocaleString()}</td>
                      <td className="py-3 px-2 text-right">
                        {wo.status !== 'RESOLVED' ? (
                          <button
                            onClick={() => handleResolveOrder(wo.orderId)}
                            className="px-2.5 py-1 text-[10px] font-mono text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-full border border-emerald-200 transition-colors cursor-pointer"
                          >
                            Mark Resolved
                          </button>
                        ) : (
                          <span className="text-[10px] text-stone-400 font-mono">Closed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Analytics */}
        {activeTab === 'analytics' && (
          <div className="bg-white border border-[#eceae3] rounded-2xl p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h2 className="font-serif-display text-lg font-semibold text-stone-900 mb-4 pb-2 border-b border-[#eceae3]">
              Financial Risk Assessment and Exposure Models
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-[#faf9f5] p-4 rounded-xl border border-[#eceae3]">
                <span className="text-[10px] font-mono text-stone-500 uppercase font-medium">Estimated Recovery</span>
                <div className="font-serif-display text-3xl font-normal text-stone-900 mt-1">
                  {report.estimated_downtime_minutes} <span className="text-xs font-mono text-stone-400 font-normal">minutes</span>
                </div>
                <div className="text-[11px] text-stone-500 font-mono mt-1">MTTR Target: &lt; 45m</div>
              </div>
              <div className="bg-[#faf9f5] p-4 rounded-xl border border-[#eceae3]">
                <span className="text-[10px] font-mono text-stone-500 uppercase font-medium">Line Cost Rate</span>
                <div className="font-serif-display text-3xl font-normal text-stone-900 mt-1">
                  ${hourlyLineRate.toLocaleString()} <span className="text-xs font-mono text-stone-400 font-normal">/hour</span>
                </div>
                <div className="text-[11px] text-stone-500 font-mono mt-1">${(hourlyLineRate / 60).toFixed(2)} per operational minute</div>
              </div>
              <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-200">
                <span className="text-[10px] font-mono text-rose-800 uppercase font-medium">Calculated Loss</span>
                <div className="font-serif-display text-3xl font-normal text-rose-800 mt-1">
                  ${totalFinancialRisk.toLocaleString()} USD
                </div>
                <div className="text-[11px] text-rose-700 font-mono mt-1">Includes robot idle and throughput drag</div>
              </div>
            </div>

            <div className="bg-[#faf9f5] border border-[#eceae3] rounded-xl p-4">
              <h3 className="text-xs font-mono uppercase font-semibold text-stone-700 mb-2.5">
                Simulated Line Rate Models
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Stamping Press Line ($2,400/hr)', rate: 2400 },
                  { label: 'Body-in-White Robotic Welding ($1,850/hr)', rate: 1850 },
                  { label: 'Powertrain CNC Machining ($2,100/hr)', rate: 2100 },
                  { label: 'ECU Electronics SMT Line ($1,200/hr)', rate: 1200 },
                ].map((item) => (
                  <button
                    key={item.rate}
                    onClick={() => setHourlyLineRate(item.rate)}
                    className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
                      hourlyLineRate === item.rate
                        ? 'bg-stone-900 text-white font-medium border border-stone-900 shadow-2xs'
                        : 'bg-white text-stone-600 border border-[#eceae3] hover:text-stone-900 hover:border-stone-400'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Raw JSON Logs */}
        {activeTab === 'logs' && (
          <div className="bg-white border border-[#eceae3] rounded-2xl p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h2 className="font-serif-display text-lg font-semibold text-stone-900 mb-4 pb-2 border-b border-[#eceae3] flex items-center gap-2">
              <Terminal className="w-4 h-4 text-stone-700" />
              <span>Real-Time Ingestion and Inference Log Feed</span>
            </h2>
            <pre className="bg-[#1c1917] border border-stone-800 p-4 rounded-xl text-xs font-mono text-stone-200 overflow-x-auto">
              <code>{JSON.stringify(report, null, 2)}</code>
            </pre>
          </div>
        )}
      </main>

      <footer className="w-full border-t border-[#eceae3] bg-[#fbfaf7] py-3 text-xs text-stone-500 font-mono">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>APEX 4.0 · SCADA Diagnostics Node · OPC-UA: 192.168.4.102 · IEC 62541</span>
          <button 
            onClick={() => setIsPythonModalOpen(true)} 
            className="text-stone-700 hover:text-stone-900 underline underline-offset-2 cursor-pointer font-medium"
          >
            Export Python Streamlit app.py
          </button>
        </div>
      </footer>

      <PythonStreamlitModal isOpen={isPythonModalOpen} onClose={() => setIsPythonModalOpen(false)} />
    </div>
  );
}
