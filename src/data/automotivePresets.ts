import { AutomotivePreset } from '../types/industrial';

export interface EnhancedAutomotivePreset extends AutomotivePreset {
  previewImageUrl?: string;
}

export const AUTOMOTIVE_PRESETS: EnhancedAutomotivePreset[] = [
  {
    id: 'spindle-z',
    title: 'High-Speed CNC Spindle Axis Z',
    subsystem: 'Powertrain Cylinder Block Milling Cell',
    workcell: 'Cell 04-A // Spindle 01',
    errorCode: 'E-301: Spindle Bearing Over-Temperature & High Vibration',
    defaultSeverity: 'CRITICAL',
    diagramType: 'spindle',
    previewImageUrl: '/assets/aistudio/image_376ca200.png',
    telemetry: {
      errorCode: 'E-301',
      temperatureC: 88.5,
      vibrationRmsG: 4.82,
      operatingRpm: 18200,
      notes: 'Sudden 14% spindle torque drop under 0.8mm depth-of-cut. Acoustic mic detecting high-pitched screeching at 7.2 kHz harmonic. Bearing raceway temp peaked at 88.5°C (normal threshold < 55°C).'
    },
    groundTruth: {
      equipment_identified: 'Automotive Powertrain 5-Axis CNC Milling Spindle (Axis Z Drive)',
      fault_name: 'Ceramic Hybrid Angular Contact Bearing Galling & Racewear Spalling',
      severity_level: 'CRITICAL',
      immediate_hazard_alert: 'Catastrophic spindle seizure hazard at 18,000 RPM. Risk of severe tool fragmentation and spindle shaft shear damaging workpiece clamping arbor.',
      root_cause_analysis: 'High-speed air-oil mist lubrication system experienced micro-orifice clogging (0.2mm nozzle blocked by particulate ingress), causing boundary lubrication starvation and rapid thermal expansion of ceramic ball elements.',
      remediation_sop: [
        'Engage Emergency Stop (E-Stop) on Cell 04-A and verify 0 RPM shaft standstill.',
        'Execute OSHA Lockout/Tagout (LOTO) on Primary 480V Electrical Disconnect Panel.',
        'Apply active chiller circulation until spindle core temperature drops below 35°C.',
        'Disassemble spindle front labyrinth seal and inspect front bearing cartridge for metallic pitting.',
        'Purge and inspect air-oil distribution block lines; replace 5-micron oil mist filter cartridge.',
        'Install pre-balanced replacement cartridge (Part #SPN-7704-B) and torque to 45 N·m.',
        'Execute 20-minute stepped spin-up ramp from 2,000 to 18,000 RPM while logging vibration RMS.'
      ],
      preventive_measure: 'Upgrade air-oil mist delivery with automated differential pressure transducer (DPS-12) to detect nozzle clogs 30 hours prior to lubrication starvation.',
      estimated_downtime_minutes: 55
    }
  },
  {
    id: 'robot-joint4',
    title: '6-Axis Spot Welding Robot Joint 4',
    subsystem: 'Body-in-White Framing Line',
    workcell: 'Cell 07 // Robot Arm ABB-IRB6700',
    errorCode: 'E-409: Harmonic Drive Backlash & Axis Position Drift',
    defaultSeverity: 'CRITICAL',
    diagramType: 'robot_joint',
    previewImageUrl: '/assets/aistudio/image_b7d29a6b.png',
    telemetry: {
      errorCode: 'E-409',
      temperatureC: 72.0,
      vibrationRmsG: 3.45,
      operatingRpm: 120,
      notes: 'Positional drift of +0.42mm at weld gun TCP (Tool Center Point) causing flange seam gap violation. Joint 4 servo amplifier logging torque ripple peaks exceeding 185% nominal rating.'
    },
    groundTruth: {
      equipment_identified: 'Body-in-White 6-Axis Spot Welding Robot (Joint 4 Harmonic Speed Reducer)',
      fault_name: 'Harmonic Drive Flexspline Tooth Fatigue Micro-Cracking and Excessive Backlash',
      severity_level: 'CRITICAL',
      immediate_hazard_alert: 'Flexspline structural rupture hazard. Uncontrolled robot arm deflection under 120 kg spot-welding payload could crush automated tooling fixtures.',
      root_cause_analysis: 'Cyclic torsional shock loads during rapid 1.8-second spot-weld repositioning cycles exceeded flexspline endurance limit, accelerated by degraded synthetic molybdenum grease.',
      remediation_sop: [
        'Pause framing cell automation sequence and lock safety perimeter interlock gates.',
        'Zero-gravity jog robot arm to maintenance posture and insert mechanical locking pins.',
        'Perform electrical LOTO on Robot Controller Cabinet RC-07.',
        'Mount dial test indicator to measure angular backlash on Joint 4 output flange (> 0.08° confirms gear tooth failure).',
        'Drain and inspect gearbox grease for metallic magnetic slurry.',
        'Replace Joint 4 Harmonic Reducer assembly (Part #HDR-160-50).',
        'Perform 6-axis kinematic laser tracker calibration and TCP zero verification.'
      ],
      preventive_measure: 'Implement continuous high-frequency servo current signature analysis (MCSA) on Joint 4 and schedule specialized synthetic grease change every 4,000 operating hours.',
      estimated_downtime_minutes: 75
    }
  },
  {
    id: 'hydraulic-press',
    title: 'Stamping Press Hydraulic Manifold',
    subsystem: 'Chassis Sheet-Metal Stamping Press',
    workcell: 'Press Line 02 // 1200T Danly Press',
    errorCode: 'E-718: Proportional Directional Valve Pressure Drop',
    defaultSeverity: 'MEDIUM',
    diagramType: 'hydraulic',
    previewImageUrl: '/assets/aistudio/image_cb915aab.png',
    telemetry: {
      errorCode: 'E-718',
      temperatureC: 64.2,
      vibrationRmsG: 1.85,
      hydraulicPressureBar: 168.0,
      notes: 'Line pressure dropped from nominal 240 bar down to 168 bar over a 35-minute run. External weeping of ISO VG 46 hydraulic fluid detected at valve manifold subplate interface.'
    },
    groundTruth: {
      equipment_identified: '1200-Ton Automotive Stamping Press Main Cushion Hydraulic Manifold',
      fault_name: 'Viton O-Ring Extrusion and Proportional Cartridge Spool Valve Leakage',
      severity_level: 'MEDIUM',
      immediate_hazard_alert: 'High-pressure fluid pinhole injection risk (168 bar) and hydraulic slip-and-fall hazard. Line pressure decay causes inconsistent sheet-metal draw depth.',
      root_cause_analysis: 'Thermal fluid cycling (oil temperature exceeding 60°C continuously) combined with hydraulic water-hammer pressure spikes degraded the 90 Durometer Viton sealing rings, causing extrusion into clearance gaps.',
      remediation_sop: [
        'Switch stamping press to Manual Mode and lower ram onto mechanical safety stops.',
        'Bleed hydraulic accumulator pressure to 0 bar via manual needle relief valve.',
        'Confirm 0 PSI on analog pressure gauge and execute LOTO on Main Hydraulic Pump Motor.',
        'Wipe manifold exterior and inspect cartridge port for extruded elastomeric particles.',
        'Remove proportional cartridge valve and inspect bore surface for scoring.',
        'Replace all manifold subplate O-rings with PTFE back-up rings and 95 Shore D seals.',
        'Torque valve manifold mounting bolts in criss-cross pattern to 65 N·m.',
        'Pressurize slowly to 50 bar to check for fluid weeping before returning to 240 bar service.'
      ],
      preventive_measure: 'Install secondary water-cooled oil heat exchanger and fit pressure relief accumulator upstream of proportional valve block to suppress 40-bar hydraulic hammer pulses.',
      estimated_downtime_minutes: 35
    }
  },
  {
    id: 'smt-driver',
    title: 'SMT Feeder Robot Motor Driver',
    subsystem: 'Automotive Electronics & ECU Assembly Line',
    workcell: 'Line 01 // Pick-and-Place Head Beta',
    errorCode: 'E-212: Feeder Axis Motor Driver Overcurrent & Thermal Trip',
    defaultSeverity: 'CRITICAL',
    diagramType: 'smt_circuit',
    telemetry: {
      errorCode: 'E-212',
      temperatureC: 94.8,
      vibrationRmsG: 0.95,
      notes: 'SMT pick-and-place nozzle placement head stuttering on Tape Reel Feeder Axis 3. Driver PCB surface thermography shows 94.8°C hotspot at MOSFET bridge switching stage.'
    },
    groundTruth: {
      equipment_identified: 'High-Speed SMT Component Mounter (Feeder Axis Multi-Channel Servo Driver Board)',
      fault_name: 'Power MOSFET Gate-Source Dielectric Puncture and Bulk Capacitor Charring',
      severity_level: 'CRITICAL',
      immediate_hazard_alert: 'Electrical short circuit and toxic localized smoke emission hazard. Risk of overvoltage surge propagating to Main Motion Controller motherboard.',
      root_cause_analysis: 'High ambient enclosure temperature caused thermal aging of low-ESR electrolytic smoothing capacitor (C42), resulting in excessive ripple voltage that punctured the high-side MOSFET silicon gate.',
      remediation_sop: [
        'Trigger Emergency Stop on SMT Line 01 and isolate 24V/48V DC bus power supply.',
        'Follow ESD (Electrostatic Discharge) wrist-strap grounding procedures before opening driver bay.',
        'Discharge internal DC bus capacitors through 100-ohm ceramic power resistor.',
        'Unseat burnt servo driver module (Slot #3) and inspect backplane socket contacts for charring.',
        'Clean backplane edge connector using electronic-grade isopropyl alcohol.',
        'Insert certified replacement brushless servo driver board (Part #DRV-8840-X).',
        'Verify cabinet cooling fan airflow (CFM) and clean fan intake filter mesh.',
        'Perform zero-load homing calibration on Feeder Axis 3.'
      ],
      preventive_measure: 'Add PT100 temperature telemetry sensor to driver enclosure interior and implement thermal derating alert at 65°C.',
      estimated_downtime_minutes: 30
    }
  },
  {
    id: 'weld-tip',
    title: 'Robotic Spot Welding Electrode Tip',
    subsystem: 'Door Hemming & Subassembly Workcell',
    workcell: 'Cell 09 // Servogun Welder Alpha',
    errorCode: 'NOMINAL-00: Scheduled Preventive Tip Inspection',
    defaultSeverity: 'LOW',
    diagramType: 'weld_tip',
    telemetry: {
      errorCode: 'NOMINAL-00',
      temperatureC: 38.4,
      vibrationRmsG: 0.35,
      notes: 'Scheduled 500-cycle visual audit. Electrode tip diameter measured at 6.2mm (nominal 6.0mm, max wear limit 7.5mm). Cooling water flow nominal at 4.2 L/min.'
    },
    groundTruth: {
      equipment_identified: 'Automotive Robotic Resistance Spot Welding Servo Gun (Class 2 Copper-Chromium-Zirconium Tip)',
      fault_name: 'Minor Surface Pitting and Oxide Layer Accumulation (Within Tolerances)',
      severity_level: 'LOW',
      immediate_hazard_alert: 'No immediate safety hazard. Normal operational wear characteristic.',
      root_cause_analysis: 'Galvanized zinc coating transfer from hot-dipped sheet steel onto copper electrode surface during repeated 200ms resistance weld cycles.',
      remediation_sop: [
        'Execute automated pneumatic tip dressing cycle (5 rotations at 6 bar pneumatic pressure).',
        'Inspect dressed electrode face diameter using go/no-go optical caliper gauge.',
        'Verify chiller coolant return temperature is below 24°C.',
        'Release robot back into automated line production queue.'
      ],
      preventive_measure: 'Maintain automated tip dressing schedule after every 250 spot-welds to preserve nugget tensile shear strength.',
      estimated_downtime_minutes: 5
    }
  }
];
