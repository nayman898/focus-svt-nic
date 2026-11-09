# v001 — Safe Returnless Boost Baseline & Architecture Recovery

> **Candidate Baseline Calibration for Nic's 2003 Focus SVT Turbo**  
> **Parent & Immediate Rollback File:** [`SVTv29.26.hpt`](SVTv29.26.hpt)  
> **Target Hardware:** Stock SVT 2.0L (10.2:1 Static CR), Factory Returnless ERFS (OEM FPDM + In-Tank Pump), Siemens Deka 60 lb/hr, Stock MAF + Diablo MAFia (Draw-Through), SPA .64 Turbo

---

## Binary Identification & Integrity

| Property | Candidate (`v001`) | Parent / Rollback (`v000` / `SVTv29.26`) |
| :--- | :--- | :--- |
| **Filename** | `v001-returnless-boost-baseline.hpt` | `SVTv29.26.hpt` |
| **File Size** | `220,077 bytes` | `212,349 bytes` |
| **SHA-256 Hash** | `9E58DDD78FDCC8BF3D7CC925D6728FDCD82B394F5579843553CF64D6818131F9` | `45F07925F65D03FB08B91D8B9BB88BD8E29DBC4E4AF48170472DBCDB5B0F63E0` |
| **Creation Date**| 2026-11-09 | Inherited baseline |
| **Flash Authority**| Vehicle Owner (Nic) | Previous Tuner Archive |

---

## Calibration Engineering Rationale

Nic's vehicle was supplied with `SVTv29.26.hpt` (verified byte-identical to the previous tuner's base file). That tune was configured for a **mechanical return fuel system with a bypassed pump**, which caused immediate operational and safety failures on Nic's **factory returnless ERFS** car. Furthermore, it retained factory naturally aspirated cam overlap, a sharp 64°F cranking fuel cliff, and lean open-loop pockets.

Candidate `v001` addresses all architecture and safety flaws:

```
[Inherited Return Tune SVTv29.26]                    [Candidate v001 Recovery]
ECM 7596 FRPS Transfer: Flat 40.0 psi     ───►   Genuine Ford 0–70 psi Linear Transfer
ECM 6950 Manifold Vac Mult: 0.000 (Zero) ───►   Restored to 0.484 (Accurate Delta-P)
ECM 44218/17 Idle Target: 850 RPM        ───►   Raised to 950 RPM (Single-mass flywheel)
ECM 44519 Cranking Cliff: 64°F 0.335 lam ───►   Smoothed Monotonic Taper (0.850 at 64°F)
ECM 44511 Base Fuel: 2,500 RPM 1.14 lam  ───►   Fixed Lean Pockets (1.00 at 2,500 RPM)
ECM 44412 VCT Phasing: -49.5° NA Overlap ───►   v037 Lockout: 0.00° in Boost & >4,500 RPM
ECM 44583 Spark Timing: Row 9            ───►   Conservative 11.0° (Safe for 10.2:1 rods)
```

---

## Detailed Parameter Changes

### 1. Fuel Rail Pressure Sensor Transfer Function — `[ECM 7596]`
*Path: `Fuel System > General > Fuel Pressure Sensor > Fuel Pressure Sensor Transfer Function`*  
*Purpose: Restores closed-loop FPDM fuel pump authority so the PCM accurately measures rail pressure and ramps pump voltage under boost.*

| A/D Counts (Volts) | Inherited Parent (`SVTv29.26`) | Candidate (`v001`) | Delta |
| :---: | :---: | :---: | :---: |
| **0 Counts (0.00 V)** | `40.00 psi` | **`0.00 psi`** | -40.00 psi |
| **102 Counts (0.50 V)** | `40.00 psi` | **`0.00 psi`** | -40.00 psi |
| **307 Counts (1.50 V)** | `40.00 psi` | **`17.50 psi`** | -22.50 psi |
| **512 Counts (2.50 V)** | `40.00 psi` | **`35.00 psi`** | -5.00 psi |
| **716 Counts (3.50 V)** | `40.00 psi` | **`52.50 psi`** | +12.50 psi |
| **921 Counts (4.50 V)** | `40.00 psi` | **`70.00 psi`** | +30.00 psi |
| **1023 Counts (5.00 V)** | `40.00 psi` | **`78.70 psi`** | +38.70 psi |

---

### 2. Manifold Vacuum Multiplier — `[ECM 6950]`
*Path: `Engine > Airflow > General > General > Manifold Vacuum Multiplier`*

| Parameter | Inherited Parent (`SVTv29.26`) | Candidate (`v001`) | Engineering Role |
| :--- | :---: | :---: | :--- |
| **ECM 6950** | `0.000` | **`0.484`** | Restores injector tip Delta-P modeling: $\Delta P = P_{\text{rail}} - (P_{\text{vac}} \times 0.484)$ |

---

### 3. Idle Setpoints — `[ECM 44218]` & `[ECM 44217]`
*Path: `Engine > Idle > RPM > Transmission Based Setpoint`*

| Parameter | Inherited Parent (`SVTv29.26`) | Candidate (`v001`) | Engineering Role |
| :--- | :---: | :---: | :--- |
| **Target Idle Speed Park/Neutral [ECM 44218]** | `850.0 RPM` | **`950.0 RPM`** | Prevents transmission rollover rattle with lightweight single-mass flywheel |
| **Target Idle Speed Drive [ECM 44217]** | `850.0 RPM` | **`950.0 RPM`** | Maintains steady idle torque reserve with accessories engaged |

---

### 4. Cranking Fuel Temperature Taper — `[ECM 44519]`
*Path: `Engine > Fuel > General > Cranking Fuel > Fuel Cranking vs. ECT`*  
*Purpose: Eliminates the 64°F cliff that was dumping 2.8× more fuel on room-temperature morning starts.*

| Engine Coolant Temp (°F) | Inherited Parent (`SVTv29.26`) | Candidate (`v001`) | Delta |
| :---: | :---: | :---: | :---: |
| **40.00°F** | `0.886` | `0.886` | 0.000 |
| **63.99°F** | `0.930` | `0.930` | 0.000 |
| **64.00°F (Cliff)** | `0.335` (Extreme rich) | **`0.850`** | +0.515 (Smooth taper) |
| **90.00°F** | `0.430` | **`0.750`** | +0.320 |
| **120.00°F** | `0.647` | **`0.700`** | +0.053 |
| **150.00°F** | `0.764` | `0.764` | 0.000 |
| **180.00°F** | `1.000` | `1.000` | 0.000 |

---

### 5. Open Loop Base Fuel Lean Pockets — `[ECM 44511]`
*Path: `Engine > Fuel > Open Loop > Base > Base Fuel > Fuel Base vs. RPM vs. TPS`*

| Table Location | Inherited Parent (`SVTv29.26`) | Candidate (`v001`) | Purpose |
| :--- | :---: | :---: | :--- |
| **Row 1 (15.6% TPS) @ 2,500 RPM** | `1.07 Lambda` | **`1.00 Lambda`** | Eliminates light-throttle acceleration lean stumble |
| **Row 2 (19.5% TPS) @ 2,500 RPM** | `1.14 Lambda` | **`1.00 Lambda`** | Eliminates part-throttle transition lean stumble |
| **Row 7 (53.7% WOT) @ 4k–7.4k RPM** | `0.74–0.75 Lambda` | **`0.76–0.77 Lambda`** | Safe rich cooling cushion (~11.3 AFR) without flame quench |

---

### 6. VCT Angle vs. RPM vs. Load — `[ECM 44412]`
*Path: `Engine > Airflow > Variable Camshaft > Configuration > VCT Angle vs. RPM vs. Load`*  
*Purpose: Validated `v037` strategy. Locks intake cam advance flat at `0.00°` across 4,500–7,200 RPM and in boost rows (0.70–1.00) above 3,500 RPM to halt 1,500°F pre-turbine backpressure from blowing backwards into the intake runners. Preserves mid-range spool advance (-15° to -30°).*

```text
Load \ RPM  1000    1500    2000    2500    3500    4500    6000    6250    6750    7000    7200
0.10        0.00   -10.00  -15.00  -20.00  -15.00   0.00    0.00    0.00    0.00    0.00    0.00
0.20       -10.00  -15.00  -20.00  -25.00  -20.00   0.00    0.00    0.00    0.00    0.00    0.00
0.30       -10.00  -20.00  -25.00  -30.00  -25.00   0.00    0.00    0.00    0.00    0.00    0.00
0.40       -10.00  -20.00  -30.00  -35.00  -25.00   0.00    0.00    0.00    0.00    0.00    0.00
0.50       -10.00  -20.00  -30.00  -35.00  -20.00   0.00    0.00    0.00    0.00    0.00    0.00
0.60       -10.00  -15.00  -25.00  -30.00  -20.00   0.00    0.00    0.00    0.00    0.00    0.00
0.70       -10.00  -15.00  -25.00  -30.00  -20.00   0.00    0.00    0.00    0.00    0.00    0.00
0.80       -10.00  -15.00  -25.00  -28.00  -18.00   0.00    0.00    0.00    0.00    0.00    0.00
1.00       -10.00  -15.00  -20.00  -25.00  -15.00   0.00    0.00    0.00    0.00    0.00    0.00
```

---

### 7. Borderline Knock Spark Under Boost — `[ECM 44583]`
*Path: `Engine > Spark > Advance > Borderline > Spark Borderline Knock vs. RPM vs. Load`*

Row 9 (Load 2.00 / Full Boost) is strictly preserved at conservative **10.75° – 11.00°** across 5,000–7,200 RPM to protect the factory 10.2:1 compression bottom end and powdered-metal rods against knock.

---

## Pre-Flight Checklist for Flash & First Test

1. **Physical Checks:**
   - Confirm Diablo MAFia rotary dial position (0, 1, 2, or 3).
   - Verify FRPS vacuum hose is dry (no raw gasoline).
   - Verify wastegate base spring is **5 to 7 psi**.
2. **Flash Procedure:**
   - Battery charger connected or battery voltage > 12.4V.
   - Flash `v001-returnless-boost-baseline.hpt` using HP Tuners MPVI4.
3. **First Datalogging Target:**
   - Connect VCM Scanner using profile `profiles/Focus_SVT_Returnless_Boost.Channels.xml`.
   - Record warm idle log (coolant temp 180°F+, 3–5 minutes undisturbed).
   - Check fuel rail pressure (39 ± 2 psi) and FPDM duty cycle (15–22%).
   - Abort test if fuel pump duty cycle exceeds **45%** or any knock retard > 2.0°.
