import React from 'react';

interface IndustrialDiagramProps {
  type: 'spindle' | 'robot_joint' | 'hydraulic' | 'smt_circuit' | 'weld_tip';
  temperatureC?: number;
  vibrationRmsG?: number;
}

export const IndustrialDiagram: React.FC<IndustrialDiagramProps> = ({
  type,
  temperatureC = 50,
  vibrationRmsG = 1.0,
}) => {
  const isHighTemp = temperatureC > 70;
  const isCriticalVib = vibrationRmsG > 3.0;

  return (
    <div className="relative w-full h-full aspect-[16/9] min-h-[180px] max-h-[220px] bg-[#141210] rounded-xl overflow-hidden border border-stone-800 flex items-center justify-center p-2">
      {/* Grid overlay */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none" 
        style={{
          backgroundImage: 'radial-gradient(circle, #38bdf8 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Crosshair inspection overlay */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-12 h-12 border border-sky-500/30 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-sky-400 rounded-full animate-ping opacity-60" />
        </div>
        <div className="absolute top-2 left-3 text-[9px] font-mono text-sky-400/80 uppercase tracking-widest">
          OPTICAL RETICLE | 100x MAGNIFICATION
        </div>
        <div className="absolute bottom-2 right-3 text-[9px] font-mono text-slate-400">
          FOV: 45mm · 4K UHD
        </div>
      </div>

      {type === 'spindle' && (
        <svg viewBox="0 0 500 300" className="w-full h-full max-w-[460px]">
          <defs>
            <linearGradient id="metal-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="50%" stopColor="#64748b" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
            <radialGradient id="heat-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Spindle Housing */}
          <rect x="50" y="40" width="400" height="220" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="2" />
          <line x1="50" y1="150" x2="450" y2="150" stroke="#0284c7" strokeDasharray="6 4" strokeWidth="1" opacity="0.6" />

          {/* Shaft Core */}
          <rect x="30" y="110" width="440" height="80" rx="3" fill="url(#metal-grad)" stroke="#94a3b8" strokeWidth="1.5" />

          {/* Front Bearing Assembly Zone */}
          <rect x="120" y="60" width="90" height="180" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" rx="3" />
          <circle cx="165" cy="85" r="16" fill="#475569" stroke="#94a3b8" strokeWidth="2" />
          <circle cx="165" cy="215" r="16" fill="#475569" stroke="#94a3b8" strokeWidth="2" />

          {/* Rear Bearing */}
          <rect x="310" y="60" width="70" height="180" fill="#1e293b" stroke="#64748b" strokeWidth="1" rx="3" />
          <circle cx="345" cy="85" r="14" fill="#334155" stroke="#64748b" strokeWidth="1.5" />
          <circle cx="345" cy="215" r="14" fill="#334155" stroke="#64748b" strokeWidth="1.5" />

          {/* Defect Highlight: Galling / Spalling Zone */}
          {isHighTemp && (
            <circle cx="165" cy="85" r="32" fill="url(#heat-glow)" className="animate-pulse" />
          )}
          <circle cx="165" cy="85" r="8" fill="#ef4444" />
          <path d="M 160 82 L 170 88 M 168 80 L 162 90" stroke="#fef08a" strokeWidth="1.5" />

          {/* Telemetry Callout */}
          <line x1="165" y1="50" x2="165" y2="25" stroke="#ef4444" strokeWidth="1.5" />
          <line x1="165" y1="25" x2="240" y2="25" stroke="#ef4444" strokeWidth="1.5" />
          <text x="245" y="28" fill="#ef4444" fontSize="11" fontFamily="JetBrains Mono" fontWeight="600">
            PITTING & GALLING HOTSPOT ({temperatureC}°C)
          </text>

          {/* Tool Arbor */}
          <polygon points="460,120 495,135 495,165 460,180" fill="#64748b" stroke="#cbd5e1" strokeWidth="1.5" />
        </svg>
      )}

      {type === 'robot_joint' && (
        <svg viewBox="0 0 500 300" className="w-full h-full max-w-[460px]">
          <defs>
            <radialGradient id="gear-fatigue" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Harmonic Drive Outer Circular Spline */}
          <circle cx="250" cy="150" r="115" fill="#0f172a" stroke="#475569" strokeWidth="6" />
          <circle cx="250" cy="150" r="105" fill="#1e293b" stroke="#334155" strokeWidth="2" strokeDasharray="3 3" />

          {/* Flexspline Cup */}
          <ellipse cx="250" cy="150" rx="90" ry="76" fill="#1e293b" stroke="#38bdf8" strokeWidth="2.5" />

          {/* Wave Generator Elliptical Bearing */}
          <ellipse cx="250" cy="150" rx="68" ry="50" fill="#0f172a" stroke="#94a3b8" strokeWidth="2" />
          <circle cx="250" cy="150" r="28" fill="#334155" stroke="#64748b" strokeWidth="2" />
          <circle cx="250" cy="150" r="10" fill="#0284c7" />

          {/* Teeth representations */}
          {[...Array(24)].map((_, i) => {
            const angle = (i * 15 * Math.PI) / 180;
            const x1 = 250 + Math.cos(angle) * 88;
            const y1 = 150 + Math.sin(angle) * 74;
            const x2 = 250 + Math.cos(angle) * 98;
            const y2 = 150 + Math.sin(angle) * 82;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#64748b" strokeWidth="1.5" />;
          })}

          {/* Crack defect at Flexspline Major Axis */}
          <circle cx="340" cy="150" r="24" fill="url(#gear-fatigue)" className="animate-pulse" />
          <path d="M 334 142 Q 340 150 346 158" stroke="#ef4444" strokeWidth="2.5" fill="none" />
          <path d="M 339 148 L 344 145" stroke="#facc15" strokeWidth="1.5" />

          <line x1="340" y1="130" x2="385" y2="70" stroke="#ef4444" strokeWidth="1.5" />
          <line x1="385" y1="70" x2="480" y2="70" stroke="#ef4444" strokeWidth="1.5" />
          <text x="390" y="62" fill="#ef4444" fontSize="11" fontFamily="JetBrains Mono" fontWeight="600">
            FLEXSPLINE TOOTH FATIGUE CRACK
          </text>
          <text x="390" y="85" fill="#94a3b8" fontSize="10" fontFamily="JetBrains Mono">
            DRIFT: +0.42mm · VIB: {vibrationRmsG}g
          </text>
        </svg>
      )}

      {type === 'hydraulic' && (
        <svg viewBox="0 0 500 300" className="w-full h-full max-w-[460px]">
          {/* Manifold Block */}
          <rect x="60" y="45" width="380" height="210" rx="6" fill="#111827" stroke="#374151" strokeWidth="2" />

          {/* Internal Hydraulic Flow Channels */}
          <path d="M 120 45 L 120 120 L 250 120 L 250 180 L 380 180 L 380 255" fill="none" stroke="#0284c7" strokeWidth="14" strokeLinecap="round" opacity="0.6" />
          <path d="M 120 45 L 120 120 L 250 120 L 250 180 L 380 180 L 380 255" fill="none" stroke="#38bdf8" strokeWidth="3" strokeDasharray="10 8" />

          {/* Cartridge Valve Body */}
          <rect x="210" y="80" width="80" height="140" rx="4" fill="#1e293b" stroke="#94a3b8" strokeWidth="2" />
          <rect x="230" y="100" width="40" height="100" fill="#334155" stroke="#64748b" strokeWidth="1.5" />

          {/* Extruded O-Ring and Fluid Weep */}
          <ellipse cx="210" cy="150" r="16" fill="#f59e0b" opacity="0.4" className="animate-pulse" />
          <circle cx="205" cy="150" r="5" fill="#f59e0b" />
          <path d="M 205 155 Q 200 175 195 190" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="3 2" fill="none" />

          {/* Annotation */}
          <line x1="205" y1="150" x2="140" y2="195" stroke="#f59e0b" strokeWidth="1.5" />
          <line x1="140" y1="195" x2="30" y2="195" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="35" y="185" fill="#f59e0b" fontSize="11" fontFamily="JetBrains Mono" fontWeight="600">
            EXTRUDED VITON O-RING
          </text>
          <text x="35" y="210" fill="#94a3b8" fontSize="10" fontFamily="JetBrains Mono">
            PRESSURE DROP: 240 → 168 BAR
          </text>
        </svg>
      )}

      {type === 'smt_circuit' && (
        <svg viewBox="0 0 500 300" className="w-full h-full max-w-[460px]">
          {/* PCB Surface */}
          <rect x="50" y="30" width="400" height="240" rx="8" fill="#064e3b" stroke="#047857" strokeWidth="2" />

          {/* Traces */}
          <path d="M 70 80 L 160 80 L 200 120 L 320 120" stroke="#fbbf24" strokeWidth="2" fill="none" opacity="0.7" />
          <path d="M 70 180 L 180 180 L 220 150 L 360 150" stroke="#fbbf24" strokeWidth="2" fill="none" opacity="0.7" />
          <path d="M 240 50 L 240 130" stroke="#fbbf24" strokeWidth="2.5" fill="none" opacity="0.7" />

          {/* IC Chip (Main Driver) */}
          <rect x="220" y="110" width="70" height="70" rx="3" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1.5" />
          <text x="232" y="150" fill="#94a3b8" fontSize="9" fontFamily="JetBrains Mono">DRV-88</text>

          {/* Burnt MOSFET & Capacitor Component */}
          <rect x="320" y="105" width="45" height="35" rx="2" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.5" />

          {/* Charred area glow */}
          <circle cx="342" cy="122" r="32" fill="#ef4444" opacity="0.5" className="animate-pulse" />
          <circle cx="342" cy="122" r="10" fill="#18181b" stroke="#ef4444" strokeWidth="2" />
          <path d="M 336 116 L 348 128 M 346 116 L 338 128" stroke="#f97316" strokeWidth="2" />

          {/* Callout */}
          <line x1="342" y1="95" x2="385" y2="55" stroke="#ef4444" strokeWidth="1.5" />
          <line x1="385" y1="55" x2="480" y2="55" stroke="#ef4444" strokeWidth="1.5" />
          <text x="390" y="48" fill="#ef4444" fontSize="11" fontFamily="JetBrains Mono" fontWeight="600">
            MOSFET GATE PUNCTURE (94.8°C)
          </text>
          <text x="390" y="70" fill="#94a3b8" fontSize="10" fontFamily="JetBrains Mono">
            OVERCURRENT TRIP E-212
          </text>
        </svg>
      )}

      {type === 'weld_tip' && (
        <svg viewBox="0 0 500 300" className="w-full h-full max-w-[460px]">
          {/* Copper Electrode Shank */}
          <path d="M 180 30 L 320 30 L 320 180 L 280 250 L 220 250 L 180 180 Z" fill="#b45309" stroke="#f59e0b" strokeWidth="2" />

          {/* Internal Cooling Water Channel */}
          <path d="M 235 30 L 265 30 L 265 200 L 235 200 Z" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />

          {/* Electrode Tip Face Profile */}
          <rect x="220" y="246" width="60" height="8" rx="2" fill="#d97706" stroke="#fef08a" strokeWidth="1.5" />

          {/* Nominal indicator */}
          <circle cx="250" cy="250" r="12" fill="#10b981" opacity="0.3" />
          <text x="250" y="278" textAnchor="middle" fill="#10b981" fontSize="11" fontFamily="JetBrains Mono" fontWeight="600">
            NOMINAL TIP PROFILE: 6.2mm (TOLERANCE ±0.8mm)
          </text>
          <text x="250" y="294" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="JetBrains Mono">
            COOLING WATER: 4.2 L/MIN · TEMP: 38.4°C
          </text>
        </svg>
      )}
    </div>
  );
};
