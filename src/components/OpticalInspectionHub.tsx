import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, RefreshCw, Sparkles, Thermometer, Radio, Activity } from 'lucide-react';
import { AutomotivePreset, TelemetryLogData } from '../types/industrial';
import { AUTOMOTIVE_PRESETS } from '../data/automotivePresets';
import { IndustrialDiagram } from './IndustrialDiagram';

interface OpticalInspectionHubProps {
  currentPreset: AutomotivePreset;
  onSelectPreset: (preset: AutomotivePreset) => void;
  telemetry: TelemetryLogData;
  setTelemetry: React.Dispatch<React.SetStateAction<TelemetryLogData>>;
  customImageBase64: string | null;
  setCustomImageBase64: (img: string | null) => void;
  onRunDiagnostics: () => void;
  isLoading: boolean;
}

export const OpticalInspectionHub: React.FC<OpticalInspectionHubProps> = ({
  currentPreset,
  onSelectPreset,
  telemetry,
  setTelemetry,
  customImageBase64,
  setCustomImageBase64,
  onRunDiagnostics,
  isLoading,
}) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState<'ALL' | 'CRITICAL' | 'MEDIUM' | 'LOW'>('ALL');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Animated FFT / Acoustic Waveform simulation
  const [wavePhase, setWavePhase] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setWavePhase((p) => (p + 1) % 100);
    }, 60);
    return () => clearInterval(timer);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCustomImageBase64(reader.result as string);
        stopCamera();
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err) {
      alert('Camera access unavailable. Please upload an image file instead.');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        setCustomImageBase64(canvas.toDataURL('image/jpeg', 0.85));
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const injectThermalSpike = () => {
    setTelemetry((prev) => ({
      ...prev,
      temperatureC: Math.min(120, prev.temperatureC + 20),
      notes: `${prev.notes} [Telemetry Warning: Thermal runaway detected]`,
    }));
  };

  const injectVibrationSpike = () => {
    setTelemetry((prev) => ({
      ...prev,
      vibrationRmsG: Number((prev.vibrationRmsG + 2.2).toFixed(2)),
      notes: `${prev.notes} [Vibration Spike: Acceleration threshold breached]`,
    }));
  };

  const injectNominalReset = () => {
    setTelemetry({
      errorCode: 'NOMINAL-00',
      temperatureC: 42.0,
      vibrationRmsG: 0.45,
      notes: 'Operational cycle nominal. Acoustic harmonics and thermal balance within normal range.',
    });
  };

  // Filter presets by severity
  const filteredPresets = AUTOMOTIVE_PRESETS.filter((p) => {
    if (filterSeverity === 'ALL') return true;
    return p.defaultSeverity === filterSeverity;
  });

  // Dynamic SVG waveform points for FFT oscilloscope
  const amplitude = Math.min(28, Math.max(4, telemetry.vibrationRmsG * 5.5));
  const frequency = telemetry.vibrationRmsG > 2.5 ? 4 : 2;
  const fftPoints = Array.from({ length: 32 }, (_, i) => {
    const x = (i / 31) * 280;
    const y = 22 + Math.sin((i * frequency * 0.4) + wavePhase * 0.15) * amplitude * 0.7 
                 + (Math.random() - 0.5) * (telemetry.vibrationRmsG > 3.0 ? 6 : 2);
    return `${x},${Math.max(4, Math.min(40, y))}`;
  }).join(' ');

  return (
    <div className="flex flex-col gap-4">
      
      {/* 1. Failure Mode Preset Selector with Severity Filter */}
      <div className="bg-white border border-[#eceae3] rounded-2xl p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5">
          <div>
            <h3 className="font-serif-display text-base font-semibold text-stone-900">
              Manufacturing Failure Modes
            </h3>
            <p className="text-[11px] font-mono text-stone-500">Tier 1 Automotive Robotics Workcells</p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* Filter by Severity */}
            <div className="flex items-center bg-[#f4f2eb] p-0.5 rounded-full border border-[#eceae3] text-[10px] font-mono">
              {(['ALL', 'CRITICAL', 'MEDIUM', 'LOW'] as const).map((sev) => (
                <button
                  key={sev}
                  onClick={() => setFilterSeverity(sev)}
                  className={`px-2.5 py-0.5 rounded-full font-medium transition-all cursor-pointer ${
                    filterSeverity === sev
                      ? 'bg-white text-stone-900 shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-[#e8e5dc]'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>

            <span className="text-xs font-mono font-medium text-stone-700 bg-stone-100 px-2.5 py-0.5 rounded-full border border-[#eceae3]">
              {currentPreset.workcell}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {filteredPresets.map((preset) => {
            const isSelected = preset.id === currentPreset.id && !customImageBase64;
            const isCrit = preset.defaultSeverity === 'CRITICAL';
            const isMed = preset.defaultSeverity === 'MEDIUM';

            return (
              <button
                key={preset.id}
                onClick={() => {
                  setCustomImageBase64(null);
                  stopCamera();
                  onSelectPreset(preset);
                }}
                className={`flex flex-col text-left p-3 rounded-xl border transition-all text-xs cursor-pointer ${
                  isSelected
                    ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                    : 'bg-[#faf9f5] border-[#eceae3] text-stone-800 hover:bg-white hover:border-stone-400'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1.5">
                  <span
                    className={`text-[9px] font-mono px-2 py-0.2 rounded-full font-semibold ${
                      isSelected
                        ? 'bg-stone-800 text-stone-200'
                        : isCrit
                          ? 'bg-rose-100 text-rose-800'
                          : isMed
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {preset.defaultSeverity}
                  </span>
                  <span className={`text-[10px] font-mono ${isSelected ? 'text-stone-400' : 'text-stone-400'}`}>
                    {preset.telemetry.errorCode.split(':')[0]}
                  </span>
                </div>
                <span className={`font-medium line-clamp-1 ${isSelected ? 'text-white' : 'text-stone-900'}`}>
                  {preset.title}
                </span>
                <span className={`text-[10px] truncate mt-0.5 font-mono ${isSelected ? 'text-stone-400' : 'text-stone-500'}`}>
                  {preset.subsystem}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Optical Inspection Display */}
      <div className="bg-white border border-[#eceae3] rounded-2xl p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-serif-display text-base font-semibold text-stone-900">
              Optical Inspection Zone
            </h3>
            <span className="text-[11px] font-mono text-stone-500">
              {customImageBase64 ? 'External Optical Feed' : currentPreset.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-medium text-stone-700 bg-white hover:bg-stone-50 rounded-full border border-[#eceae3] transition-colors shadow-2xs cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-stone-500" />
              <span>Upload Photo</span>
            </button>
            {!isCameraActive ? (
              <button
                onClick={startCamera}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-medium text-stone-700 bg-white hover:bg-stone-50 rounded-full border border-[#eceae3] transition-colors shadow-2xs cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-stone-500" />
                <span>Camera</span>
              </button>
            ) : (
              <button
                onClick={capturePhoto}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-full border border-rose-700 transition-colors shadow-2xs cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Capture Snapshot</span>
              </button>
            )}
            {customImageBase64 && (
              <button
                onClick={() => {
                  setCustomImageBase64(null);
                  stopCamera();
                }}
                className="p-1.5 text-stone-500 hover:text-stone-800 rounded-full border border-[#eceae3] cursor-pointer"
                title="Reset to schematic"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Inspection Display Container */}
        <div className="relative rounded-xl overflow-hidden bg-stone-900 border border-[#eceae3] aspect-[16/9] min-h-[180px] max-h-[220px] flex items-center justify-center">
          {isLoading && (
            <div className="absolute inset-0 z-30 bg-white/95 backdrop-blur-xs flex flex-col items-center justify-center">
              <div className="w-7 h-7 border-2 border-stone-800 border-t-transparent rounded-full animate-spin mb-2" />
              <div className="text-[11px] font-mono font-medium text-stone-900 uppercase tracking-wider">
                Executing Neural FMEA Triage...
              </div>
              <div className="text-[10px] font-mono text-stone-500 mt-0.5">
                Parsing visual degradation and cross-referencing telemetry
              </div>
            </div>
          )}

          {isCameraActive ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover max-h-[220px]"
              />
              <div className="absolute top-3 left-3 bg-rose-600 text-white text-[10px] font-mono font-medium px-2.5 py-0.5 rounded-full shadow">
                LIVE OPTICAL FEED
              </div>
            </div>
          ) : customImageBase64 ? (
            <div className="relative w-full h-full flex items-center justify-center p-2 bg-[#faf9f5]">
              <img
                src={customImageBase64}
                alt="Optical component inspection capture"
                className="max-h-[210px] max-w-full object-contain rounded"
              />
              <div className="absolute bottom-3 left-3 bg-white/95 border border-[#eceae3] text-stone-700 text-[10px] font-mono px-2.5 py-0.5 rounded-full shadow-2xs">
                OPERATOR CAPTURE
              </div>
            </div>
          ) : (
            <IndustrialDiagram
              type={currentPreset.diagramType}
              temperatureC={telemetry.temperatureC}
              vibrationRmsG={telemetry.vibrationRmsG}
            />
          )}
        </div>
      </div>

      {/* 3. Sensor Ingestion & Sliders with Acoustic FFT Visualizer */}
      <div className="bg-white border border-[#eceae3] rounded-2xl p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="font-serif-display text-base font-semibold text-stone-900">
            Live Telemetry Adjustments
          </h3>
          <div className="flex items-center gap-1.5">
            <button
              onClick={injectThermalSpike}
              className="px-2.5 py-0.5 bg-rose-50 text-rose-800 border border-rose-200 rounded-full text-[11px] font-mono hover:bg-rose-100 transition-colors cursor-pointer"
            >
              + Heat Spike
            </button>
            <button
              onClick={injectVibrationSpike}
              className="px-2.5 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 rounded-full text-[11px] font-mono hover:bg-amber-100 transition-colors cursor-pointer"
            >
              + Vibration Spike
            </button>
            <button
              onClick={injectNominalReset}
              className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-[11px] font-mono hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              Reset Baseline
            </button>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <div className="bg-[#faf9f5] border border-[#eceae3] rounded-xl p-3">
            <div className="flex items-center justify-between mb-1.5 text-xs">
              <span className="text-stone-600 font-medium flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-stone-400" />
                Core Temperature
              </span>
              <span className={`font-mono font-bold ${telemetry.temperatureC > 75 ? 'text-rose-700' : 'text-stone-900'}`}>
                {telemetry.temperatureC.toFixed(1)}°C
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="130"
              step="0.5"
              value={telemetry.temperatureC}
              onChange={(e) => setTelemetry((prev) => ({ ...prev, temperatureC: parseFloat(e.target.value) }))}
              className="w-full accent-stone-900 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-stone-400 mt-1">
              <span>Nominal &lt; 55°C</span>
              <span>Warning &gt; 70°C</span>
              <span>Alarm &gt; 85°C</span>
            </div>
          </div>

          <div className="bg-[#faf9f5] border border-[#eceae3] rounded-xl p-3">
            <div className="flex items-center justify-between mb-1.5 text-xs">
              <span className="text-stone-600 font-medium flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-stone-400" />
                Vibration (RMS)
              </span>
              <span className={`font-mono font-bold ${telemetry.vibrationRmsG > 3.0 ? 'text-amber-700' : 'text-stone-900'}`}>
                {telemetry.vibrationRmsG.toFixed(2)} g
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="8.0"
              step="0.05"
              value={telemetry.vibrationRmsG}
              onChange={(e) => setTelemetry((prev) => ({ ...prev, vibrationRmsG: parseFloat(e.target.value) }))}
              className="w-full accent-stone-900 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-stone-400 mt-1">
              <span>Class 1 &lt; 1.0g</span>
              <span>Class 2 &lt; 2.5g</span>
              <span>Alarm &gt; 3.5g</span>
            </div>
          </div>
        </div>

        {/* Real-time Acoustic & Vibration FFT Oscilloscope Visualizer */}
        <div className="bg-[#1c1917] border border-stone-800 rounded-xl p-3 mb-3.5">
          <div className="flex items-center justify-between text-[10px] font-mono text-stone-400 mb-1.5">
            <span className="flex items-center gap-1.5 text-amber-300 font-medium">
              <Activity className="w-3 h-3 animate-pulse" />
              ACOUSTIC & VIBRATION FFT OSCILLOSCOPE (0-10 kHz)
            </span>
            <span>HARMONIC PEAK: {(telemetry.vibrationRmsG * 1.45).toFixed(2)} kHz</span>
          </div>
          <div className="w-full h-11 bg-black/40 rounded-lg border border-stone-800/80 overflow-hidden flex items-center justify-center relative">
            <svg viewBox="0 0 280 44" className="w-full h-full preserve-3d">
              <polyline
                fill="none"
                stroke={telemetry.vibrationRmsG > 3.0 ? '#f43f5e' : telemetry.vibrationRmsG > 1.8 ? '#f59e0b' : '#38bdf8'}
                strokeWidth="1.5"
                points={fftPoints}
              />
            </svg>
            <div className="absolute left-2.5 bottom-1 text-[9px] font-mono text-stone-500">
              SCALE: 10 mV/div
            </div>
            <div className="absolute right-2.5 bottom-1 text-[9px] font-mono text-stone-500">
              BAND: ISO 10816-3
            </div>
          </div>
        </div>

        {/* Inputs & Diagnostic Trigger */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3.5">
          <div className="md:col-span-1">
            <label className="block text-[11px] font-mono font-medium text-stone-500 uppercase mb-1">
              PLC Error Code
            </label>
            <input
              type="text"
              value={telemetry.errorCode}
              onChange={(e) => setTelemetry((prev) => ({ ...prev, errorCode: e.target.value }))}
              className="w-full bg-[#faf9f5] border border-[#eceae3] rounded-xl px-3 py-1.5 text-xs font-mono text-stone-900 focus:outline-none focus:border-stone-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[11px] font-mono font-medium text-stone-500 uppercase mb-1">
              Acoustic and Visual Observations
            </label>
            <input
              type="text"
              value={telemetry.notes}
              onChange={(e) => setTelemetry((prev) => ({ ...prev, notes: e.target.value }))}
              className="w-full bg-[#faf9f5] border border-[#eceae3] rounded-xl px-3 py-1.5 text-xs text-stone-900 focus:outline-none focus:border-stone-500"
            />
          </div>
        </div>

        <button
          onClick={onRunDiagnostics}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3 px-5 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 disabled:text-stone-500 text-stone-100 font-mono text-xs font-medium rounded-full shadow-xs transition-colors cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-stone-400 border-t-transparent rounded-full animate-spin" />
              <span>Analyzing Diagnostics...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Run Multimodal Diagnostics</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};
