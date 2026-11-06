import React, { useState, useEffect } from 'react';
import { Activity, ShieldAlert, FileCode2, Thermometer } from 'lucide-react';

interface SCADANavbarProps {
  onOpenPythonExport: () => void;
  activeTab: 'inspection' | 'workcells' | 'sop' | 'analytics' | 'orders' | 'logs';
  setActiveTab: (tab: 'inspection' | 'workcells' | 'sop' | 'analytics' | 'orders' | 'logs') => void;
  activeWorkcellsCount: number;
  isEmergencyStopped: boolean;
  onToggleEStop: () => void;
}

export const SCADANavbar: React.FC<SCADANavbarProps> = ({
  onOpenPythonExport,
  activeTab,
  setActiveTab,
  activeWorkcellsCount,
  isEmergencyStopped,
  onToggleEStop,
}) => {
  // Real-time Sensor Pulse state oscillating between 32°C and 35°C
  const [pulseTemp, setPulseTemp] = useState(33.4);
  const [latencyMs, setLatencyMs] = useState(18);

  useEffect(() => {
    const interval = setInterval(() => {
      // Oscillate smoothly within 32.0°C - 35.0°C range
      setPulseTemp((prev) => {
        const delta = (Math.random() - 0.5) * 0.6;
        const next = Math.max(32.1, Math.min(34.9, prev + delta));
        return Number(next.toFixed(1));
      });
      // Simulate real-time OPC-UA latency oscillation (16ms - 22ms)
      setLatencyMs(Math.floor(16 + Math.random() * 6));
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { id: 'inspection', label: 'Inspection Hub' },
    { id: 'workcells', label: `Workcells (${activeWorkcellsCount}/12)` },
    { id: 'sop', label: 'SOP Workbench' },
    { id: 'orders', label: 'Work Orders' },
    { id: 'analytics', label: 'Loss Analytics' },
    { id: 'logs', label: 'Telemetry Logs' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#fbfaf7]/90 backdrop-blur-md border-b border-[#eceae3]">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        
        {/* Brand & Editorial Identity */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-full bg-stone-900 text-stone-100 flex items-center justify-center shadow-xs">
            <Activity className="w-4 h-4 text-amber-300" />
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-2">
              <span className="font-serif-display text-base sm:text-lg font-medium tracking-tight text-stone-900">
                APEX 4.0
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-medium tracking-wider bg-stone-100 text-stone-700 border border-[#eceae3]">
                AUTONOMOUS NODE
              </span>
            </div>
            <span className="text-[10px] font-mono text-stone-500 hidden sm:inline">
              Line 04 Automotive · Cell #07
            </span>
          </div>
        </div>

        {/* Pill Navigation Bar */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#f4f2eb] p-1 rounded-full border border-[#eceae3]">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1 text-[11px] font-medium rounded-full transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-white text-stone-900 shadow-[0_1px_2px_rgba(0,0,0,0.06)] border border-[#e8e5dc]'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Telemetry Pulse, E-Stop & Export Actions */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Live Connectivity: OPC-UA Latency Badge & Real-time Sensor Pulse */}
          <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-[#eceae3] text-[11px] font-mono text-stone-700 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            {/* OPC-UA Latency Badge */}
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-semibold text-stone-800">OPC-UA:</span>
              <span className="tabular-nums text-emerald-700 font-semibold">{latencyMs}ms</span>
            </div>

            <span className="text-stone-300">|</span>

            {/* Real-time Sensor Pulse Indicator */}
            <div className="flex items-center gap-1.5" title="Live telemetry sensor pulse: core line temperature">
              <Thermometer className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="text-stone-500 hidden sm:inline uppercase text-[10px] tracking-wider font-semibold">Sensor Pulse:</span>
              <span className="tabular-nums font-bold text-stone-900">{pulseTemp}°C</span>
            </div>
          </div>

          {/* Plant E-Stop Button */}
          <button
            onClick={onToggleEStop}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold transition-all cursor-pointer whitespace-nowrap shadow-xs ${
              isEmergencyStopped
                ? 'bg-rose-600 text-white border border-rose-700 animate-pulse'
                : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
            }`}
            title="Toggle Plant Emergency Stop interlock"
          >
            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
            <span>{isEmergencyStopped ? 'E-STOPPED' : 'E-STOP'}</span>
          </button>

          {/* Export app.py Button */}
          <button
            onClick={onOpenPythonExport}
            className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono font-medium text-stone-100 bg-stone-900 hover:bg-stone-800 rounded-full border border-stone-800 transition-colors cursor-pointer whitespace-nowrap shadow-xs"
            title="Export local Python script"
          >
            <FileCode2 className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="hidden sm:inline">Export</span>
            <span>app.py</span>
          </button>
        </div>

      </div>

      {/* Mobile / Tablet Horizontal Scroll Nav */}
      <div className="lg:hidden flex items-center gap-1 px-4 py-1.5 border-t border-[#eceae3] overflow-x-auto bg-[#faf9f5]">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-2.5 py-0.5 text-[11px] font-medium rounded-full transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-white text-stone-900 shadow-xs border border-[#eceae3]'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
