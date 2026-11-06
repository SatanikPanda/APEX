import React from 'react';
import { Layers, Activity, AlertTriangle, Zap, ShieldCheck, DollarSign } from 'lucide-react';

interface KPIRibbonProps {
  totalScans: number;
  activeFaults: number;
  avgLatencyMs: number;
  safetyIncidents: number;
  activeWorkcells: number;
  totalWorkcells: number;
  totalFinancialRisk: number;
}

export const KPIRibbon: React.FC<KPIRibbonProps> = ({
  totalScans,
  activeFaults,
  avgLatencyMs,
  safetyIncidents,
  activeWorkcells,
  totalWorkcells,
  totalFinancialRisk,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 mb-4">
      
      {/* 1. Active Workcells */}
      <div className="bg-white border border-[#eceae3] rounded-2xl p-3.5 shadow-[0_2px_8px_rgba(28,25,23,0.04)] hover:border-[#dfdbd0] transition-colors">
        <div className="flex items-center justify-between text-stone-500 mb-1">
          <span className="text-[10px] font-mono font-medium uppercase tracking-wider">Active Fleet</span>
          <Layers className="w-3.5 h-3.5 text-stone-400" />
        </div>
        <div className="font-serif-display text-2xl font-normal text-stone-900 leading-tight">
          {activeWorkcells} <span className="text-xs font-mono font-normal text-stone-400">/ {totalWorkcells}</span>
        </div>
        <div className="text-[10px] font-mono text-emerald-700 mt-1 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          100% Target Capacity
        </div>
      </div>

      {/* 2. Total Scans */}
      <div className="bg-white border border-[#eceae3] rounded-2xl p-3.5 shadow-[0_2px_8px_rgba(28,25,23,0.04)] hover:border-[#dfdbd0] transition-colors">
        <div className="flex items-center justify-between text-stone-500 mb-1">
          <span className="text-[10px] font-mono font-medium uppercase tracking-wider">Scans Ingested</span>
          <Activity className="w-3.5 h-3.5 text-stone-400" />
        </div>
        <div className="font-serif-display text-2xl font-normal text-stone-900 leading-tight">
          {totalScans}
        </div>
        <div className="text-[10px] font-mono text-stone-500 mt-1">
          Continuous Edge Stream
        </div>
      </div>

      {/* 3. Active Faults */}
      <div className="bg-white border border-[#eceae3] rounded-2xl p-3.5 shadow-[0_2px_8px_rgba(28,25,23,0.04)] hover:border-[#dfdbd0] transition-colors">
        <div className="flex items-center justify-between text-stone-500 mb-1">
          <span className="text-[10px] font-mono font-medium uppercase tracking-wider">Faults Flagged</span>
          <AlertTriangle className={`w-3.5 h-3.5 ${activeFaults > 0 ? 'text-amber-500' : 'text-stone-400'}`} />
        </div>
        <div className={`font-serif-display text-2xl font-normal leading-tight ${activeFaults > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
          {activeFaults}
        </div>
        <div className="text-[10px] font-mono text-stone-500 mt-1">
          {activeFaults > 0 ? 'Triage in Progress' : 'All Lines Clear'}
        </div>
      </div>

      {/* 4. Inference Speed (MTTD) */}
      <div className="bg-white border border-[#eceae3] rounded-2xl p-3.5 shadow-[0_2px_8px_rgba(28,25,23,0.04)] hover:border-[#dfdbd0] transition-colors">
        <div className="flex items-center justify-between text-stone-500 mb-1">
          <span className="text-[10px] font-mono font-medium uppercase tracking-wider">Diagnostics MTTD</span>
          <Zap className="w-3.5 h-3.5 text-amber-500" />
        </div>
        <div className="font-serif-display text-2xl font-normal text-stone-900 leading-tight">
          {(avgLatencyMs / 1000).toFixed(2)}s
        </div>
        <div className="text-[10px] font-mono text-stone-500 mt-1 truncate">
          Neural FMEA Core
        </div>
      </div>

      {/* 5. Safety Incidents */}
      <div className="bg-white border border-[#eceae3] rounded-2xl p-3.5 shadow-[0_2px_8px_rgba(28,25,23,0.04)] hover:border-[#dfdbd0] transition-colors">
        <div className="flex items-center justify-between text-stone-500 mb-1">
          <span className="text-[10px] font-mono font-medium uppercase tracking-wider">Safety Status</span>
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        </div>
        <div className="font-serif-display text-2xl font-normal text-emerald-700 leading-tight">
          {safetyIncidents}
        </div>
        <div className="text-[10px] font-mono text-emerald-700 mt-1">
          OSHA LOTO Compliant
        </div>
      </div>

      {/* 6. Loss Risk Exposure */}
      <div className="bg-white border border-[#eceae3] rounded-2xl p-3.5 shadow-[0_2px_8px_rgba(28,25,23,0.04)] hover:border-[#dfdbd0] transition-colors">
        <div className="flex items-center justify-between text-stone-500 mb-1">
          <span className="text-[10px] font-mono font-medium uppercase tracking-wider">Cost Exposure</span>
          <DollarSign className="w-3.5 h-3.5 text-rose-500" />
        </div>
        <div className="font-serif-display text-2xl font-normal text-rose-700 leading-tight">
          ${totalFinancialRisk.toLocaleString()}
        </div>
        <div className="text-[10px] font-mono text-stone-500 mt-1">
          Estimated Downtime
        </div>
      </div>

    </div>
  );
};
