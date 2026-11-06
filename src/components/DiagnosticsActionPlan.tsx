import React, { useState } from 'react';
import { 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Wrench, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Download, 
  Check, 
  UserCheck,
  Send,
  Cpu,
  ShieldAlert
} from 'lucide-react';
import { DiagnosticReport, SOPStepStatus, WorkOrderRecord } from '../types/industrial';

interface DiagnosticsActionPlanProps {
  report: DiagnosticReport;
  sopSteps: SOPStepStatus[];
  setSopSteps: React.Dispatch<React.SetStateAction<SOPStepStatus[]>>;
  hourlyLineRate: number;
  setHourlyLineRate: (rate: number) => void;
  onDispatchWorkOrder: (order: WorkOrderRecord) => void;
}

export const DiagnosticsActionPlan: React.FC<DiagnosticsActionPlanProps> = ({
  report,
  sopSteps,
  setSopSteps,
  hourlyLineRate,
  setHourlyLineRate,
  onDispatchWorkOrder,
}) => {
  const [copiedJson, setCopiedJson] = useState(false);
  const [isJsonOpen, setIsJsonOpen] = useState(false);
  const [technicianBadgeId, setTechnicianBadgeId] = useState('TECH-4882');
  const [isSignedOff, setIsSignedOff] = useState(false);
  const [dispatchSuccess, setDispatchSuccess] = useState(false);

  const toggleStep = (stepIdx: number) => {
    setSopSteps((prev) =>
      prev.map((step) =>
        step.stepIndex === stepIdx
          ? {
              ...step,
              completed: !step.completed,
              timestamp: !step.completed ? new Date().toLocaleTimeString() : undefined,
              technicianId: !step.completed ? technicianBadgeId : undefined,
            }
          : step
      )
    );
  };

  const completedCount = sopSteps.filter((s) => s.completed).length;
  const progressPct = sopSteps.length > 0 ? Math.round((completedCount / sopSteps.length) * 100) : 0;
  const estimatedCost = Math.round((report.estimated_downtime_minutes / 60) * hourlyLineRate);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(report, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleDownloadTicket = () => {
    const ticketData = {
      ticket_id: `DISPATCH-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      technician_id: technicianBadgeId,
      line_workcell: 'Line 04 Automotive Cell 07',
      diagnostic_report: report,
      sop_execution_status: sopSteps,
      financial_downtime_impact_usd: estimatedCost,
    };
    const blob = new Blob([JSON.stringify(ticketData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SOP-DISPATCH-${report.equipment_identified.replace(/\s+/g, '_').slice(0, 20)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDispatchOrder = () => {
    const newOrder: WorkOrderRecord = {
      orderId: `WO-${Math.floor(1000 + Math.random() * 9000)}`,
      workcellId: 'WC-07',
      equipment: report.equipment_identified,
      fault: report.fault_name,
      severity: report.severity_level,
      timestamp: new Date().toLocaleTimeString(),
      technicianId: technicianBadgeId,
      status: 'DISPATCHED',
      downtimeMinutes: report.estimated_downtime_minutes,
      costLossUsd: estimatedCost,
    };
    onDispatchWorkOrder(newOrder);
    setDispatchSuccess(true);
    setTimeout(() => setDispatchSuccess(false), 3000);
  };

  const isCritical = report.severity_level === 'CRITICAL';
  const isMedium = report.severity_level === 'MEDIUM';

  return (
    <div className="flex flex-col gap-4">
      
      {/* 1. Status Alert Header */}
      <div 
        className={`border rounded-2xl p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all ${
          isCritical 
            ? 'bg-rose-50/80 border-rose-200 text-rose-950' 
            : isMedium 
              ? 'bg-amber-50/80 border-amber-200 text-amber-950' 
              : 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
        }`}
      >
        <div className="flex items-start gap-3">
          {isCritical ? (
            <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          ) : isMedium ? (
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-xs font-mono font-bold tracking-wider uppercase">
                Status: {report.severity_level} | Fault: {report.fault_name}
              </span>
              <span className="text-[11px] font-mono text-stone-500">
                Response: {report.inference_time_ms ? `${report.inference_time_ms}ms` : '< 1.4s'}
              </span>
            </div>
            <p className="text-xs leading-relaxed font-medium">
              <strong className="uppercase tracking-wide font-mono text-[11px]">Immediate Hazard:</strong> {report.immediate_hazard_alert}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Asset Identification & Root Cause */}
      <div className="bg-white border border-[#eceae3] rounded-2xl p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between mb-3.5 border-b border-[#eceae3] pb-2.5">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-stone-700" />
            <h3 className="font-serif-display text-base font-semibold text-stone-900">
              Root Cause Telemetry Correlation
            </h3>
          </div>
          <span className="text-[10px] font-mono text-stone-600 font-medium bg-[#faf9f5] px-2.5 py-0.5 rounded-full border border-[#eceae3]">
            Engine: Neural FMEA Core
          </span>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <span className="text-[10px] font-mono font-medium text-stone-500 uppercase block mb-1">
              Target Asset and Assembly:
            </span>
            <div className="font-mono text-stone-900 bg-[#faf9f5] p-3 rounded-xl border border-[#eceae3] font-semibold">
              {report.equipment_identified}
            </div>
          </div>
          <div>
            <span className="text-[10px] font-mono font-medium text-stone-500 uppercase block mb-1">
              Physical Root Cause Correlation:
            </span>
            <p className="text-stone-800 leading-relaxed bg-[#faf9f5] p-3.5 rounded-xl border border-[#eceae3]">
              {report.root_cause_analysis}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Interactive SOP Checklist */}
      <div className="bg-white border border-[#eceae3] rounded-2xl p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-stone-700" />
            <h3 className="font-serif-display text-base font-semibold text-stone-900">
              Technician SOP Remediation Checklist
            </h3>
          </div>
          <span className="text-xs font-mono font-medium text-stone-900">
            {completedCount}/{sopSteps.length} Verified ({progressPct}%)
          </span>
        </div>

        <div className="w-full bg-[#f4f2eb] h-1.5 rounded-full overflow-hidden mb-3 border border-[#eceae3]">
          <div 
            className="h-full bg-stone-900 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="flex items-center gap-2 bg-amber-50/80 border border-amber-200 rounded-xl p-2.5 text-[11px] text-amber-900 mb-3 font-mono">
          <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-amber-600" />
          <span>MANDATORY: Execute OSHA Lockout/Tagout (LOTO) before physical access.</span>
        </div>

        <div className="space-y-2 mb-3.5">
          {sopSteps.map((step) => (
            <div
              key={step.stepIndex}
              onClick={() => toggleStep(step.stepIndex)}
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer select-none transition-all ${
                step.completed
                  ? 'bg-emerald-50/60 border-emerald-300 text-stone-800'
                  : 'bg-[#faf9f5] border-[#eceae3] hover:border-stone-400 text-stone-800'
              }`}
            >
              <input
                type="checkbox"
                checked={step.completed}
                onChange={() => {}}
                className="mt-0.5 rounded border-stone-300 text-stone-900 focus:ring-0 cursor-pointer"
              />
              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className={`font-mono text-[11px] font-bold ${step.completed ? 'text-emerald-800' : 'text-stone-900'}`}>
                    STEP 0{step.stepIndex}
                  </span>
                  {step.completed && (
                    <span className="text-[10px] font-mono text-emerald-800">
                      Signed at {step.timestamp} ({step.technicianId})
                    </span>
                  )}
                </div>
                <p className={`mt-0.5 leading-relaxed ${step.completed ? 'line-through text-stone-400' : 'text-stone-700'}`}>
                  {step.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Technician ID & Dispatch Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#eceae3]">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-[10px] font-mono font-medium text-stone-500 uppercase">Technician ID:</span>
            <input
              type="text"
              value={technicianBadgeId}
              onChange={(e) => setTechnicianBadgeId(e.target.value)}
              className="bg-[#faf9f5] border border-[#eceae3] rounded-full px-3 py-1 text-xs font-mono text-stone-900 w-28 focus:outline-none focus:border-stone-500"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => setIsSignedOff(!isSignedOff)}
              disabled={progressPct < 100}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono font-medium rounded-full transition-colors border shadow-2xs cursor-pointer ${
                isSignedOff
                  ? 'bg-emerald-600 text-white border-emerald-700'
                  : progressPct === 100
                    ? 'bg-stone-900 hover:bg-stone-800 text-white border-stone-900'
                    : 'bg-stone-100 text-stone-400 border-[#eceae3] cursor-not-allowed'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{isSignedOff ? 'SOP Signed Off' : 'Sign-Off Steps'}</span>
            </button>

            <button
              onClick={handleDispatchOrder}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono font-medium rounded-full bg-amber-600 hover:bg-amber-700 text-white border border-amber-700 shadow-2xs transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{dispatchSuccess ? 'Dispatched to MES' : 'Dispatch Work Order'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Downtime & Cost Calculation */}
      <div className="bg-white border border-[#eceae3] rounded-2xl p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-stone-700" />
            <h3 className="font-serif-display text-base font-semibold text-stone-900">
              Downtime Risk Exposure Model
            </h3>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono">
            <button
              onClick={() => setHourlyLineRate(1850)}
              className={`px-2.5 py-0.5 rounded-full border transition-colors cursor-pointer ${
                hourlyLineRate === 1850 
                  ? 'bg-stone-900 text-white border-stone-900 font-medium' 
                  : 'bg-[#faf9f5] text-stone-600 border-[#eceae3] hover:text-stone-900'
              }`}
            >
              BIW ($1,850/h)
            </button>
            <button
              onClick={() => setHourlyLineRate(2400)}
              className={`px-2.5 py-0.5 rounded-full border transition-colors cursor-pointer ${
                hourlyLineRate === 2400 
                  ? 'bg-stone-900 text-white border-stone-900 font-medium' 
                  : 'bg-[#faf9f5] text-stone-600 border-[#eceae3] hover:text-stone-900'
              }`}
            >
              Stamping ($2,400/h)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-[#faf9f5] border border-[#eceae3] rounded-xl p-3">
            <span className="text-[10px] font-mono text-stone-500 uppercase font-medium block">Estimated Downtime</span>
            <div className="font-serif-display text-2xl font-normal text-stone-900 mt-1">
              {report.estimated_downtime_minutes} <span className="text-xs font-mono text-stone-400 font-normal">min</span>
            </div>
          </div>
          <div className="bg-[#faf9f5] border border-[#eceae3] rounded-xl p-3">
            <span className="text-[10px] font-mono text-stone-500 uppercase font-medium block">Line Burn Rate</span>
            <div className="font-serif-display text-2xl font-normal text-stone-900 mt-1">
              ${(hourlyLineRate / 60).toFixed(0)} <span className="text-xs font-mono text-stone-400 font-normal">/min</span>
            </div>
          </div>
          <div className="bg-rose-50/50 border border-rose-200 rounded-xl p-3">
            <span className="text-[10px] font-mono text-rose-800 uppercase font-medium block">Calculated Loss</span>
            <div className="font-serif-display text-2xl font-normal text-rose-800 mt-1">
              ${estimatedCost.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="mt-3.5 pt-3 border-t border-[#eceae3] text-xs">
          <span className="text-[10px] font-mono font-medium text-stone-500 uppercase block mb-1">
            Condition-Based Maintenance Action:
          </span>
          <p className="text-stone-800 italic bg-[#faf9f5] p-3 rounded-xl border border-[#eceae3]">
            "{report.preventive_measure}"
          </p>
        </div>
      </div>

      {/* 5. JSON Telemetry Logs & Export */}
      <div className="bg-white border border-[#eceae3] rounded-2xl p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsJsonOpen(!isJsonOpen)}
            className="flex items-center gap-1.5 font-serif-display text-sm font-semibold text-stone-800 hover:text-stone-900 cursor-pointer"
          >
            {isJsonOpen ? <ChevronUp className="w-4 h-4 text-stone-600" /> : <ChevronDown className="w-4 h-4 text-stone-600" />}
            <span>Diagnostic Payload (JSON Schema)</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyJson}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-medium text-stone-700 bg-white hover:bg-stone-50 rounded-full border border-[#eceae3] transition-colors shadow-2xs cursor-pointer"
            >
              {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-500" />}
              <span>{copiedJson ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={handleDownloadTicket}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-full border border-stone-800 transition-colors shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Ticket</span>
            </button>
          </div>
        </div>

        {isJsonOpen && (
          <div className="mt-3.5">
            <pre className="bg-[#1c1917] text-stone-200 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-60 border border-stone-800">
              <code>{JSON.stringify(report, null, 2)}</code>
            </pre>
          </div>
        )}
      </div>

    </div>
  );
};
