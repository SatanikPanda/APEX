export type SeverityLevel = 'LOW' | 'MEDIUM' | 'CRITICAL';

export interface DiagnosticReport {
  equipment_identified: string;
  fault_name: string;
  severity_level: SeverityLevel;
  immediate_hazard_alert: string;
  root_cause_analysis: string;
  remediation_sop: string[];
  preventive_measure: string;
  estimated_downtime_minutes: number;
  inference_time_ms?: number;
  source?: 'neural_engine' | 'baseline_mode' | 'calibrated_fallback';
}

export interface TelemetryLogData {
  errorCode: string;
  temperatureC: number;
  vibrationRmsG: number;
  hydraulicPressureBar?: number;
  operatingRpm?: number;
  notes: string;
}

export interface AutomotivePreset {
  id: string;
  title: string;
  subsystem: string;
  workcell: string;
  errorCode: string;
  defaultSeverity: SeverityLevel;
  telemetry: TelemetryLogData;
  diagramType: 'spindle' | 'robot_joint' | 'hydraulic' | 'smt_circuit' | 'weld_tip';
  groundTruth: DiagnosticReport;
}

export interface SOPStepStatus {
  stepIndex: number;
  text: string;
  completed: boolean;
  timestamp?: string;
  technicianId?: string;
}

export interface WorkOrderRecord {
  orderId: string;
  workcellId: string;
  equipment: string;
  fault: string;
  severity: SeverityLevel;
  timestamp: string;
  technicianId: string;
  status: 'QUEUED' | 'IN_PROGRESS' | 'DISPATCHED' | 'RESOLVED';
  downtimeMinutes: number;
  costLossUsd: number;
}
