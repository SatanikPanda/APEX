export interface WorkcellStatus {
  id: string;
  name: string;
  zone: string;
  status: 'NOMINAL' | 'WARNING' | 'CRITICAL';
  cycleTimeSec: number;
  uptimePct: number;
  temperatureC: number;
  vibrationG: number;
}

export const AUTOMOTIVE_WORKCELLS: WorkcellStatus[] = [
  { id: 'WC-01', name: 'Danly 1200T Stamping Press', zone: 'Stamping Bay A', status: 'WARNING', cycleTimeSec: 8.2, uptimePct: 97.4, temperatureC: 64.2, vibrationG: 1.85 },
  { id: 'WC-02', name: 'Sheet Metal De-Stacker Feeder', zone: 'Stamping Bay A', status: 'NOMINAL', cycleTimeSec: 3.4, uptimePct: 99.8, temperatureC: 38.0, vibrationG: 0.42 },
  { id: 'WC-03', name: 'Underbody Framing Jig Alpha', zone: 'Body-in-White Line', status: 'NOMINAL', cycleTimeSec: 42.0, uptimePct: 99.1, temperatureC: 34.5, vibrationG: 0.31 },
  { id: 'WC-04', name: '5-Axis CNC Spindle Z (Powertrain)', zone: 'Machining Cell 04', status: 'CRITICAL', cycleTimeSec: 68.0, uptimePct: 92.5, temperatureC: 88.5, vibrationG: 4.82 },
  { id: 'WC-05', name: 'ABB IRB-6700 Spot Welder 01', zone: 'Body-in-White Line', status: 'NOMINAL', cycleTimeSec: 1.8, uptimePct: 99.4, temperatureC: 41.2, vibrationG: 0.65 },
  { id: 'WC-06', name: 'ABB IRB-6700 Spot Welder 02', zone: 'Body-in-White Line', status: 'NOMINAL', cycleTimeSec: 1.9, uptimePct: 99.6, temperatureC: 39.8, vibrationG: 0.58 },
  { id: 'WC-07', name: 'Welding Robot Joint 4 Reducer', zone: 'Body-in-White Cell 07', status: 'CRITICAL', cycleTimeSec: 2.1, uptimePct: 94.0, temperatureC: 72.0, vibrationG: 3.45 },
  { id: 'WC-08', name: 'Automated Hemming Table Press', zone: 'Closure Assembly', status: 'NOMINAL', cycleTimeSec: 14.5, uptimePct: 98.9, temperatureC: 44.1, vibrationG: 0.72 },
  { id: 'WC-09', name: 'Resistance Spot Weld Servogun', zone: 'Door Hemming Cell 09', status: 'NOMINAL', cycleTimeSec: 2.0, uptimePct: 99.9, temperatureC: 38.4, vibrationG: 0.35 },
  { id: 'WC-10', name: 'SMT Pick-and-Place Feeder Beta', zone: 'ECU Electronics Line', status: 'CRITICAL', cycleTimeSec: 0.45, uptimePct: 91.2, temperatureC: 94.8, vibrationG: 0.95 },
  { id: 'WC-11', name: 'Windshield Polyurethane Dispenser', zone: 'Final Trim & Glazing', status: 'NOMINAL', cycleTimeSec: 18.0, uptimePct: 99.5, temperatureC: 28.5, vibrationG: 0.22 },
  { id: 'WC-12', name: 'Optical End-of-Line Quality Audit', zone: 'Quality Assurance Bay', status: 'NOMINAL', cycleTimeSec: 24.0, uptimePct: 100.0, temperatureC: 22.0, vibrationG: 0.12 },
];
