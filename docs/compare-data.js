window.COMPARE_DATA = {
  "revisions": [
    {
      "version": "base",
      "name": "Starting Base Tune (SVTv29.26.hpt)",
      "summary": "Nic's starting file: already contains Siemens Deka 60 lb injector data, 0.484 manifold vacuum multiplier, ERFS FPDM PID, and conservative 10.75-11.50 deg boost spark, but retains return-style 40 psi flat FRPS lookup, 0.00 OL TPS threshold, 64 F cranking cliff, 2,500 RPM lean pockets, -49.5 deg boost VCT, 0.00 dashpot decay, 850 RPM idle, and 225 F high fan."
    },
    {
      "version": "v000",
      "name": "Nic's Initial Start Tune (v000-initial-start.hpt)",
      "summary": "Initial startup tune written in VCM Editor from SVTv29.26.hpt using Parameter Navigator ECM numbers: dynamic 0-78.72 psi FRPS transfer, smooth cranking fuel above 64 F, 200/350 closed-loop TPS thresholds, 1.00 lambda at 2,500 RPM light-load pockets, FRPS/O2 MIL reporting, v037 VCT reversion lockout, 950 RPM idle with 1.000 spark gain, dashpot decay/pre-position cleanup, and 205/199 F high fan thresholds."
    }
  ],
  "parameters": [
    {
      "id": "7596",
      "name": "Fuel Pressure Sensor Transfer Function",
      "path": "Fuel System / General / Fuel Pressure Sensor / Fuel Pressure Sensor Transfer Function",
      "description": "[ECM 7596] CRITICAL RETURNLESS FIX: SVTv29.26 flatlines every FRPS count at 40 psi for a return-style conversion. Restores the authentic 0 to 78.72 psi linear ERFS transfer curve across AD Counts 0..1,023.",
      "kind": "table",
      "axis_label": "AD Counts \\ Parameter",
      "cols": ["Fuel Pressure (psi)"],
      "rows": [
        "0 Counts",
        "0 Counts",
        "0 Counts",
        "0 Counts",
        "102 Counts (~0.50 V)",
        "921 Counts (~4.50 V)",
        "1,023 Counts (~5.00 V)"
      ],
      "v000_matrix": [["40"], ["40"], ["40"], ["40"], ["40"], ["40"], ["40"]],
      "v001_matrix": [["0.00"], ["0.00"], ["0.00"], ["0.00"], ["0.00"], ["70.00"], ["78.72"]]
    },
    {
      "id": "32731",
      "name": "Open Loop Fuel TPS Thresh vs. RPM",
      "path": "Engine / Fuel / Open Loop / Base / Open Loop / Open Loop Fuel TPS Thresh vs. RPM",
      "description": "[ECM 32731] Closed-throttle idle sits around 180-184 A/D counts. SVTv29.26 has 0.00 across all RPM rows, locking idle in Open Loop Power Demand Enrich. Raising 0/1,500 RPM to 200.00 and 2,000/2,500 RPM to 350.00 allows clean Closed Loop STFT learning at idle/cruise while retaining instant OL boost enrichment.",
      "kind": "table",
      "axis_label": "Engine RPM \\ Threshold",
      "cols": ["TPS A/D Counts"],
      "rows": ["0 RPM", "1,500 RPM", "2,000 RPM", "2,500 RPM", "5,500 RPM", "6,500 RPM", "16,384 RPM"],
      "v000_matrix": [["0.00"], ["0.00"], ["0.00"], ["0.00"], ["0.00"], ["0.00"], ["0.00"]],
      "v001_matrix": [["200.00"], ["200.00"], ["350.00"], ["350.00"], ["0.00"], ["0.00"], ["0.00"]]
    },
    {
      "id": "44519",
      "name": "Fuel Cranking vs. ECT",
      "path": "Engine / Fuel / General / Cranking Fuel / Fuel Cranking vs. ECT",
      "description": "[ECM 44519] Removes the severe 2.8x drowning cliff at 64.00 F (0.930 -> 0.335 lambda) so warm/mild starts crank smoothly without fouling plugs.",
      "kind": "table",
      "axis_label": "Coolant Temp (F) \\ Parameter",
      "cols": ["Commanded Lambda"],
      "rows": [
        "-20.000 F", "0.000 F", "20.000 F", "30.000 F", "40.000 F", "63.990 F",
        "64.000 F", "90.000 F", "120.000 F", "150.000 F", "180.000 F", "220.000 F"
      ],
      "v000_matrix": [
        ["0.850"], ["0.857"], ["0.870"], ["0.877"], ["0.886"], ["0.930"],
        ["0.335"], ["0.430"], ["0.647"], ["0.764"], ["1.000"], ["1.000"]
      ],
      "v001_matrix": [
        ["0.850"], ["0.857"], ["0.870"], ["0.877"], ["0.886"], ["0.930"],
        ["0.930"], ["0.950"], ["0.970"], ["0.985"], ["1.000"], ["1.000"]
      ]
    },
    {
      "id": "44511",
      "name": "Fuel Base vs. RPM vs. TPS",
      "path": "Engine / Fuel / Open Loop / Base / Base Fuel / Fuel Base vs. RPM vs. TPS",
      "description": "[ECM 44511] Eliminates the 2,500 RPM light-throttle lean pockets (1.07 and 1.14 lambda -> 1.00) while preserving safe rich 0.73-0.75 lambda fueling across all boost/WOT rows (31.2%-68.4%).",
      "kind": "table",
      "axis_label": "TPS (%) \\ Engine RPM",
      "cols": ["1,000", "2,500", "3,500", "4,000", "4,500", "5,000", "5,500", "6,000", "6,500", "7,400"],
      "rows": ["15.6%", "19.5%", "23.4%", "31.2%", "35.2%", "39.1%", "53.7%", "68.4%"],
      "v000_matrix": [
        ["1.00", "1.07", "1.02", "1.00", "1.00", "1.00", "1.00", "1.00", "1.00", "1.00"],
        ["1.00", "1.14", "1.02", "0.85", "1.00", "1.00", "1.00", "1.00", "1.00", "1.00"],
        ["1.00", "1.00", "1.03", "0.85", "1.00", "1.00", "1.00", "1.00", "1.00", "1.00"],
        ["1.00", "0.80", "0.80", "0.73", "0.75", "0.75", "0.75", "0.75", "0.75", "0.75"],
        ["0.80", "0.80", "0.80", "0.73", "0.75", "0.75", "0.75", "0.75", "0.75", "0.75"],
        ["0.80", "0.73", "0.73", "0.73", "0.73", "0.74", "0.74", "0.74", "0.74", "0.74"],
        ["0.80", "0.75", "0.75", "0.74", "0.73", "0.74", "0.74", "0.74", "0.75", "0.74"],
        ["0.80", "0.75", "0.75", "0.74", "0.74", "0.74", "0.74", "0.74", "0.75", "0.74"]
      ],
      "v001_matrix": [
        ["1.00", "1.00", "1.02", "1.00", "1.00", "1.00", "1.00", "1.00", "1.00", "1.00"],
        ["1.00", "1.00", "1.02", "0.85", "1.00", "1.00", "1.00", "1.00", "1.00", "1.00"],
        ["1.00", "1.00", "1.03", "0.85", "1.00", "1.00", "1.00", "1.00", "1.00", "1.00"],
        ["1.00", "0.80", "0.80", "0.73", "0.75", "0.75", "0.75", "0.75", "0.75", "0.75"],
        ["0.80", "0.80", "0.80", "0.73", "0.75", "0.75", "0.75", "0.75", "0.75", "0.75"],
        ["0.80", "0.73", "0.73", "0.73", "0.73", "0.74", "0.74", "0.74", "0.74", "0.74"],
        ["0.80", "0.75", "0.75", "0.74", "0.73", "0.74", "0.74", "0.74", "0.75", "0.74"],
        ["0.80", "0.75", "0.75", "0.74", "0.74", "0.74", "0.74", "0.74", "0.75", "0.74"]
      ]
    },
    {
      "id": "50",
      "name": "Master DTC List (FRPS & Upstream O2)",
      "path": "Engine Diagnostics / DTCs / List / Master DTC List",
      "description": "[ECM 50] Re-enables MIL reporting for Fuel Rail Pressure Sensor faults (P0190, P0192, P0193) and Bank 1 Sensor 1 O2 High Voltage (P0132) while keeping lean/rich/misfire/knock safety DTCs active.",
      "kind": "table",
      "axis_label": "DTC Code \\ Diagnostic Field",
      "cols": ["Error Reporting"],
      "rows": [
        "P0190 (FRPS A Circuit)",
        "P0192 (FRPS A Low)",
        "P0193 (FRPS A High)",
        "P0132 (O2 High Volt B1S1)",
        "P0171 (Too Lean B1)",
        "P0172 (Too Rich B1)",
        "P0300 (Random Misfire)",
        "P0325 (Knock Sensor 1)",
        "P1131 / P1132 (HO2S11 Lean/Rich)"
      ],
      "v000_matrix": [
        ["No Error Reported"],
        ["No Error Reported"],
        ["No MIL Light"],
        ["No Error Reported"],
        ["MIL Light"],
        ["MIL Light"],
        ["MIL Light"],
        ["MIL Light"],
        ["MIL Light"]
      ],
      "v001_matrix": [
        ["MIL Light"],
        ["MIL Light"],
        ["MIL Light"],
        ["MIL Light"],
        ["MIL Light"],
        ["MIL Light"],
        ["MIL Light"],
        ["MIL Light"],
        ["MIL Light"]
      ]
    },
    {
      "id": "44412",
      "name": "VCT Angle vs. RPM vs. Load",
      "path": "Engine / Airflow / Variable Camshaft / Configuration / VCT Angle vs. RPM vs. Load",
      "description": "[ECM 44412] SVTv29.26 keeps aggressive -49.50 deg cam advance in boost and -15 to -29 deg overlap up to 6,000 RPM, causing exhaust reversion and 1,500 F turbo heat. Initial v000 applies the verified v037 VCT table (flat 0.00 deg across 4,500-7,200 RPM while preserving low-RPM spool).",
      "kind": "table",
      "axis_label": "Engine Load \\ Engine RPM",
      "cols": ["1,000", "1,500", "2,000", "2,500", "3,500", "4,500", "6,000", "6,250", "6,750", "7,000", "7,200"],
      "rows": [
        "Load 0.10", "Load 0.20", "Load 0.30", "Load 0.40", "Load 0.50",
        "Load 0.60", "Load 0.70", "Load 0.80", "Load 1.00"
      ],
      "v000_matrix": [
        ["-10.00", "-20.00", "-20.00", "-20.00", "-15.00", "-15.00", "0.00", "0.00", "0.00", "0.00", "0.00"],
        ["-22.00", "-30.00", "-39.60", "-35.00", "-34.00", "-29.00", "0.00", "0.00", "5.00", "0.00", "0.00"],
        ["-25.00", "-34.80", "-42.00", "-42.00", "-31.60", "-27.50", "-5.00", "0.00", "0.00", "0.00", "0.00"],
        ["-26.00", "-35.10", "-45.00", "-49.50", "-49.50", "-25.50", "-10.00", "0.00", "0.00", "0.00", "0.00"],
        ["-28.00", "-33.50", "-45.00", "-49.50", "-49.50", "-24.50", "-15.00", "-5.00", "0.00", "0.00", "0.00"],
        ["-26.50", "-28.50", "-45.00", "-49.50", "-49.50", "-22.50", "-15.00", "-5.00", "0.00", "0.00", "0.00"],
        ["-21.00", "-23.00", "-24.00", "-49.50", "-49.50", "-18.00", "-10.00", "0.00", "0.00", "0.00", "0.00"],
        ["-17.00", "-19.00", "-19.00", "-49.50", "-49.50", "-15.00", "0.00", "0.00", "0.00", "0.00", "0.00"],
        ["-12.00", "-13.00", "-13.00", "-13.00", "-12.00", "-12.00", "0.00", "0.00", "0.00", "0.00", "0.00"]
      ],
      "v001_matrix": [
        ["0.00", "-10.00", "-15.00", "-20.00", "-15.00", "0.00", "0.00", "0.00", "0.00", "0.00", "0.00"],
        ["-10.00", "-15.00", "-20.00", "-25.00", "-20.00", "0.00", "0.00", "0.00", "0.00", "0.00", "0.00"],
        ["-10.00", "-20.00", "-25.00", "-30.00", "-25.00", "0.00", "0.00", "0.00", "0.00", "0.00", "0.00"],
        ["-10.00", "-20.00", "-30.00", "-35.00", "-25.00", "0.00", "0.00", "0.00", "0.00", "0.00", "0.00"],
        ["-10.00", "-20.00", "-30.00", "-35.00", "-25.00", "0.00", "0.00", "0.00", "0.00", "0.00", "0.00"],
        ["-10.00", "-15.00", "-25.00", "-30.00", "-20.00", "0.00", "0.00", "0.00", "0.00", "0.00", "0.00"],
        ["-10.00", "-15.00", "-25.00", "-30.00", "-20.00", "0.00", "0.00", "0.00", "0.00", "0.00", "0.00"],
        ["-10.00", "-15.00", "-25.00", "-28.00", "-18.00", "0.00", "0.00", "0.00", "0.00", "0.00", "0.00"],
        ["-10.00", "-15.00", "-20.00", "-25.00", "-15.00", "0.00", "0.00", "0.00", "0.00", "0.00", "0.00"]
      ]
    },
    {
      "id": "44218",
      "name": "Target Idle Speed Park/Neutral",
      "path": "Engine / Idle / RPM / Transmission Based Setpoint / Target Idle Speed Park/Neutral ",
      "description": "[ECM 44218] Raised from 850 to 950 RPM to stabilize idle with Siemens Deka 60 lb injectors, cooling fan engagement, and single-mass flywheel.",
      "kind": "scalar",
      "unit": "RPM",
      "v000": "850",
      "v001": "950"
    },
    {
      "id": "44217",
      "name": "Target Idle Speed Drive",
      "path": "Engine / Idle / RPM / Transmission Based Setpoint / Target Idle Speed Drive",
      "description": "[ECM 44217] Engaged idle target raised symmetrically from 850 to 950 RPM.",
      "kind": "scalar",
      "unit": "RPM",
      "v000": "850",
      "v001": "950"
    },
    {
      "id": "47996",
      "name": "Idle Spark Proportional Gain",
      "path": "Engine / Spark / Advance / Idle Spark Advance / Idle Spark Proportional Gain",
      "description": "[ECM 47996] Halved from 2.000 to 1.000 (validated in v012-v037) to eliminate idle spark timing hunting.",
      "kind": "scalar",
      "unit": "gain",
      "v000": "2.000",
      "v001": "1.000"
    },
    {
      "id": "32984",
      "name": "Idle Dashpot Decay vs. Dashpot Airflow",
      "path": "Engine / Idle / Airflow / Dashpot Airflow / Idle Dashpot Decay vs. Dashpot Airflow",
      "description": "[ECM 32984] SVTv29.26 zeroes low dashpot airflow decay (0.00 at 0.0-0.6 lb/min), causing rolling RPM hang on decel. Restores positive decay (0.02-0.05) per v028.",
      "kind": "table",
      "axis_label": "Dashpot Airflow \\ Rate",
      "cols": ["Decay"],
      "rows": ["0.0 lb/min", "0.2 lb/min", "0.4 lb/min", "0.6 lb/min", "0.8 lb/min", "1.0 lb/min", "3.0 lb/min"],
      "v000_matrix": [["0.00"], ["0.00"], ["0.00"], ["0.00"], ["0.06"], ["0.08"], ["0.10"]],
      "v001_matrix": [["0.02"], ["0.03"], ["0.04"], ["0.05"], ["0.06"], ["0.08"], ["0.10"]]
    },
    {
      "id": "32988",
      "name": "Idle Dashpot Pre-Position vs. RPM",
      "path": "Engine / Idle / Airflow / Dashpot Airflow / Idle Dashpot Pre-Position vs. RPM",
      "description": "[ECM 32988] Trims high pre-position airflow at 2,150-4,150 RPM per v028 to match decel return-to-idle.",
      "kind": "table",
      "axis_label": "Engine RPM \\ Parameter",
      "cols": ["Airflow (lb/min)"],
      "rows": ["0 RPM", "150 RPM", "1,150 RPM", "2,150 RPM", "3,150 RPM", "4,150 RPM"],
      "v000_matrix": [["0.04"], ["0.04"], ["0.35"], ["0.78"], ["1.11"], ["1.50"]],
      "v001_matrix": [["0.04"], ["0.04"], ["0.35"], ["0.55"], ["0.80"], ["1.00"]]
    },
    {
      "id": "24030",
      "name": "Fan High Speed Enable ECT",
      "path": "System / Fans / Control By ECT / Fan High Speed Enable ECT",
      "description": "[ECM 24030] Lowers High Speed radiator fan turn-on from 225.0 F to 205.0 F for tight turbo engine bay cooling.",
      "kind": "scalar",
      "unit": "F",
      "v000": "225.0",
      "v001": "205.0"
    },
    {
      "id": "24031",
      "name": "Fan High Speed Disable ECT",
      "path": "System / Fans / Control By ECT / Fan High Speed Disable ECT",
      "description": "[ECM 24031] Lowers High Speed radiator fan turn-off from 215.0 F to 199.0 F.",
      "kind": "scalar",
      "unit": "F",
      "v000": "215.0",
      "v001": "199.0"
    },
    {
      "id": "24035",
      "name": "Fan High Speed High Load Enable ECT",
      "path": "System / Fans / Control By ECT / Fan High Speed High Load Enable ECT",
      "description": "[ECM 24035] Lowers High Load High Speed fan turn-on from 235.0 F to 205.0 F.",
      "kind": "scalar",
      "unit": "F",
      "v000": "235.0",
      "v001": "205.0"
    },
    {
      "id": "24020",
      "name": "Fan Low Speed Enable ECT",
      "path": "System / Fans / Control By ECT / Fan Low Speed Enable ECT",
      "description": "[ECM 24020] VERIFY & KEEP: Already lowered to 195.0 F in SVTv29.26.hpt.",
      "kind": "scalar",
      "unit": "F",
      "v000": "195.0",
      "v001": "195.0"
    },
    {
      "id": "24021",
      "name": "Fan Low Speed Disable ECT",
      "path": "System / Fans / Control By ECT / Fan Low Speed Disable ECT",
      "description": "[ECM 24021] VERIFY & KEEP: Already set to 190.0 F in SVTv29.26.hpt.",
      "kind": "scalar",
      "unit": "F",
      "v000": "190.0",
      "v001": "190.0"
    },
    {
      "id": "6950",
      "name": "Manifold Vacuum Multiplier",
      "path": "Engine / Airflow / General / General / Manifold Vacuum Multiplier",
      "description": "[ECM 6950] VERIFY & KEEP: Already 0.484 in SVTv29.26.hpt (required for ERFS Delta-P compensation).",
      "kind": "scalar",
      "unit": "multiplier",
      "v000": "0.484",
      "v001": "0.484"
    },
    {
      "id": "43000",
      "name": "Desired Fuel Pressure Over Injector",
      "path": "Fuel System / Fuel Pressure / Desired Fuel Pressure / Desired Fuel Pressure Over Injector",
      "description": "[ECM 43000] VERIFY & KEEP: 40.00 psi target across all 7 airflow rows in SVTv29.26.hpt.",
      "kind": "scalar",
      "unit": "psi",
      "v000": "40.00",
      "v001": "40.00"
    },
    {
      "id": "12016",
      "name": "Injector Pressure Drop Reference",
      "path": "Engine / Fuel / General / Injector Control / Injector Pressure Drop Reference",
      "description": "[ECM 12016] VERIFY & KEEP: Matches Desired Fuel Pressure (40.00 psi).",
      "kind": "scalar",
      "unit": "psi",
      "v000": "40.00",
      "v001": "40.00"
    },
    {
      "id": "12011",
      "name": "Injector Flow Rate High",
      "path": "Engine / Fuel / General / Injector Control / Injector Flow Rate High",
      "description": "[ECM 12011] VERIFY & KEEP: Already scaled for Siemens Deka 60 lb/hr (~60.12 lb/hr).",
      "kind": "scalar",
      "unit": "lb/s",
      "v000": "0.016700000",
      "v001": "0.016700000"
    },
    {
      "id": "12010",
      "name": "Injector Flow Rate Low",
      "path": "Engine / Fuel / General / Injector Control / Injector Flow Rate Low",
      "description": "[ECM 12010] VERIFY & KEEP: Already scaled for Siemens Deka 60 lb/hr (~63.00 lb/hr).",
      "kind": "scalar",
      "unit": "lb/s",
      "v000": "0.017500000",
      "v001": "0.017500000"
    },
    {
      "id": "12012",
      "name": "Injector Breakpoint",
      "path": "Engine / Fuel / General / Injector Control / Injector Breakpoint",
      "description": "[ECM 12012] VERIFY & KEEP: Deka 60 fuel-mass breakpoint.",
      "kind": "scalar",
      "unit": "lb",
      "v000": "0.00003360",
      "v001": "0.00003360"
    },
    {
      "id": "12015",
      "name": "Injector PW Minimum",
      "path": "Engine / Fuel / General / Injector Control / Injector PW Minimum",
      "description": "[ECM 12015] VERIFY & KEEP: Minimum pulsewidth clamp (0.50 ms) in SVTv29.26.hpt.",
      "kind": "scalar",
      "unit": "s",
      "v000": "0.00050000",
      "v001": "0.00050000"
    },
    {
      "id": "44205",
      "name": "Standard Air Charge",
      "path": "Engine / General / Engine / Standard Air Charge",
      "description": "[ECM 44205] DO NOT CHANGE: 0.00136 lb (~0.617 g/cyl) defines the Load axis used by Spark (44583) and VCT (44412).",
      "kind": "scalar",
      "unit": "lb",
      "v000": "0.00136",
      "v001": "0.00136"
    },
    {
      "id": "12115",
      "name": "Closed Loop O2 Sensor Temp",
      "path": "Engine / Fuel / Oxygen Sensors / Feedback / Closed Loop O2 Sensor Temp",
      "description": "[ECM 12115] VERIFY & KEEP: Already 520.00 F in SVTv29.26.hpt.",
      "kind": "scalar",
      "unit": "F",
      "v000": "520.00",
      "v001": "520.00"
    },
    {
      "id": "44583",
      "name": "Spark Borderline Knock vs. RPM vs. Load",
      "path": "Engine / Spark / Advance / Borderline / Spark Borderline Knock vs. RPM vs. Load",
      "description": "[ECM 44583] DO NOT ADVANCE: SVTv29.26 already clamps Load 2.00 to 11.50-10.75 deg and Load 0.80 to 12.00 deg, protecting Nic's stock 10.2:1 pistons and powdered-metal rods.",
      "kind": "table",
      "axis_label": "Engine Load \\ Engine RPM",
      "cols": ["1,000", "1,850", "2,450", "2,800", "3,250", "5,000", "5,750", "6,000", "6,250", "6,500", "7,200"],
      "rows": ["0.10", "0.20", "0.30", "0.40", "0.50", "0.60", "0.70", "0.80 (Boost)", "2.00 (Boost)"],
      "v000_matrix": [
        ["55.00", "55.00", "55.00", "55.00", "55.00", "55.00", "55.00", "55.00", "55.00", "55.00", "55.00"],
        ["41.60", "45.40", "45.00", "45.40", "45.10", "45.00", "44.70", "40.40", "34.70", "45.60", "41.00"],
        ["36.00", "45.00", "45.00", "45.00", "41.00", "39.00", "45.11", "45.00", "44.64", "45.17", "36.33"],
        ["23.00", "29.00", "39.00", "36.50", "30.00", "32.87", "44.79", "44.52", "44.66", "44.69", "42.80"],
        ["12.50", "21.00", "30.00", "28.00", "26.00", "26.99", "33.77", "39.06", "41.72", "42.29", "45.26"],
        ["7.68", "19.00", "22.51", "27.00", "22.64", "22.37", "29.16", "32.80", "36.17", "33.00", "36.01"],
        ["6.50", "14.00", "21.00", "24.01", "20.50", "19.39", "24.49", "25.60", "29.48", "27.56", "29.00"],
        ["-7.00", "2.00", "6.73", "9.28", "9.28", "12.00", "12.00", "12.00", "12.00", "12.00", "12.00"],
        ["-7.31", "-9.00", "1.65", "4.14", "8.00", "11.50", "11.50", "11.50", "11.25", "11.00", "10.75"]
      ],
      "v001_matrix": [
        ["55.00", "55.00", "55.00", "55.00", "55.00", "55.00", "55.00", "55.00", "55.00", "55.00", "55.00"],
        ["41.60", "45.40", "45.00", "45.40", "45.10", "45.00", "44.70", "40.40", "34.70", "45.60", "41.00"],
        ["36.00", "45.00", "45.00", "45.00", "41.00", "39.00", "45.11", "45.00", "44.64", "45.17", "36.33"],
        ["23.00", "29.00", "39.00", "36.50", "30.00", "32.87", "44.79", "44.52", "44.66", "44.69", "42.80"],
        ["12.50", "21.00", "30.00", "28.00", "26.00", "26.99", "33.77", "39.06", "41.72", "42.29", "45.26"],
        ["7.68", "19.00", "22.51", "27.00", "22.64", "22.37", "29.16", "32.80", "36.17", "33.00", "36.01"],
        ["6.50", "14.00", "21.00", "24.01", "20.50", "19.39", "24.49", "25.60", "29.48", "27.56", "29.00"],
        ["-7.00", "2.00", "6.73", "9.28", "9.28", "12.00", "12.00", "12.00", "12.00", "12.00", "12.00"],
        ["-7.31", "-9.00", "1.65", "4.14", "8.00", "11.50", "11.50", "11.50", "11.25", "11.00", "10.75"]
      ]
    },
    {
      "id": "12163",
      "name": "MAF Airflow vs. Voltage",
      "path": "Engine / Airflow / General / MAF Calibration / MAF Airflow vs. Voltage",
      "description": "[ECM 12163] KEEP FOR FIRST LOG: Exact 30-point MAF transfer currently inside SVTv29.26.hpt (note known Editor UI lb/min display-label quirk). Verify physical Diablo MAFia dial & log warm idle STFT before scaling.",
      "kind": "maf",
      "v000_curve": [
        {"v": "0.00", "flow": "0.0"}, {"v": "0.38", "flow": "2.0"}, {"v": "0.40", "flow": "2.5"},
        {"v": "0.44", "flow": "3.0"}, {"v": "0.48", "flow": "3.7"}, {"v": "0.50", "flow": "3.8"},
        {"v": "0.53", "flow": "3.8"}, {"v": "0.54", "flow": "3.9"}, {"v": "0.60", "flow": "4.9"},
        {"v": "0.65", "flow": "5.0"}, {"v": "0.70", "flow": "6.9"}, {"v": "0.90", "flow": "10.2"},
        {"v": "1.00", "flow": "11.4"}, {"v": "1.10", "flow": "12.4"}, {"v": "1.20", "flow": "16.4"},
        {"v": "1.30", "flow": "18.4"}, {"v": "1.40", "flow": "22.6"}, {"v": "1.50", "flow": "25.3"},
        {"v": "1.60", "flow": "29.3"}, {"v": "1.80", "flow": "39.0"}, {"v": "2.00", "flow": "49.8"},
        {"v": "2.20", "flow": "71.2"}, {"v": "2.40", "flow": "89.3"}, {"v": "2.60", "flow": "112.9"},
        {"v": "2.80", "flow": "139.4"}, {"v": "3.00", "flow": "165.1"}, {"v": "3.20", "flow": "194.9"},
        {"v": "3.40", "flow": "239.1"}, {"v": "3.80", "flow": "329.1"}, {"v": "4.80", "flow": "410.6"}
      ],
      "v001_curve": [
        {"v": "0.00", "flow": "0.0"}, {"v": "0.38", "flow": "2.0"}, {"v": "0.40", "flow": "2.5"},
        {"v": "0.44", "flow": "3.0"}, {"v": "0.48", "flow": "3.7"}, {"v": "0.50", "flow": "3.8"},
        {"v": "0.53", "flow": "3.8"}, {"v": "0.54", "flow": "3.9"}, {"v": "0.60", "flow": "4.9"},
        {"v": "0.65", "flow": "5.0"}, {"v": "0.70", "flow": "6.9"}, {"v": "0.90", "flow": "10.2"},
        {"v": "1.00", "flow": "11.4"}, {"v": "1.10", "flow": "12.4"}, {"v": "1.20", "flow": "16.4"},
        {"v": "1.30", "flow": "18.4"}, {"v": "1.40", "flow": "22.6"}, {"v": "1.50", "flow": "25.3"},
        {"v": "1.60", "flow": "29.3"}, {"v": "1.80", "flow": "39.0"}, {"v": "2.00", "flow": "49.8"},
        {"v": "2.20", "flow": "71.2"}, {"v": "2.40", "flow": "89.3"}, {"v": "2.60", "flow": "112.9"},
        {"v": "2.80", "flow": "139.4"}, {"v": "3.00", "flow": "165.1"}, {"v": "3.20", "flow": "194.9"},
        {"v": "3.40", "flow": "239.1"}, {"v": "3.80", "flow": "329.1"}, {"v": "4.80", "flow": "410.6"}
      ]
    }
  ]
};
