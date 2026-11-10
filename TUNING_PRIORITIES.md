# Nic's Focus SVT Turbo — Calibration Priorities & Tuning Strategy Roadmap

> **CONFIDENTIAL / INTERNAL ENGINEERING BRIEFING**  
> **Vehicle:** 2003 Ford Focus SVT (Black Oak EEC-V, Strategy ZED0 / UJAHAS3)  
> **Powertrain:** 2.0L SVT Zetec Turbo (Stock 10.2:1 Internals), Electronic Returnless Fuel System (ERFS)  
> **Inherited Tune Issue:** Flashed/supplied with a Return-Style Fuel Calibration (`SVTv29.26.hpt`)

---

## Executive Summary & Core Conflict

Nic's Focus SVT was given a calibration identical to the previous tuner's `SVTv29.26.hpt` (verified byte-identical SHA-256 hash). That calibration was configured for a **mechanically regulated return-style fuel system** with a bypassed fuel pump and fixed rail pressure. 

Nic’s car, however, retains the **factory Ford Electronic Returnless Fuel System (ERFS)**:
* Factory in-tank fuel pump modulated by the **Fuel Pump Driver Module (FPDM)** via PCM duty cycle.
* Factory **Fuel Rail Pressure Sensor (FRPS)** measuring real-time differential pressure across injector tips.
* Dynamic pressure compensation tables intended to offset rail pressure variations during transients.

Running a return-style tune on factory returnless hardware disables the PCM’s closed-loop fuel pump control and pressure compensation. In combination with a **draw-through MAF with a vented-to-atmosphere (VTA) blow-off valve** and the **factory high-compression 10.2:1 bottom end**, this explains why the car runs rough, hesitates, and is at extreme risk under boost.

---

## 1. Critical Hardware Differences: Nic's Car vs. Your Car

| Hardware Subsystem | Your Focus SVT (Reference) | Nic's Focus SVT | Tuning Implication for Nic |
| :--- | :--- | :--- | :--- |
| **Engine Internals** | Built forged bottom end (85.5mm pistons, **9.25:1 static CR**) | **Stock SVT bottom end (10.2:1 static CR, factory rods)** | **CRITICAL SAFETY CEILING:** Factory rods bend and ring lands crack under detonation or boost spikes. Wastegate must be 5–7 psi. Max boost ceiling: **7–8 psi**. Spark timing under boost must be 2.0°–3.0° more conservative than yours. |
| **Fuel Delivery** | Return-style (Aeromotive 1:1 FPR, bypassed pump on relay) | **Factory Returnless ERFS (Stock FPDM + OEM pump)** | **MUST RESTORE RETURNLESS LOGIC:** PCM must actively control FPDM; sensor transfer and delta-P multipliers must be active. |
| **Fuel Pump Limit** | Upgraded Stealth pump (high headroom) | Stock SVT pump (~190 LPH) | Saturation limit is **45–48% FPDM duty cycle**. Safe limit is ~260–280 whp. Datalogging pump duty cycle under boost is a mandatory stop condition. |
| **MAF & Intake** | PMAS HPX in 3" tube, **blow-through** near TB | Stock MAF + **Diablo MAFia extension in 2.75" tube, draw-through** | Flow scaling requires exact MAFia dial setting (0–5). Draw-through meter measures pre-turbo air. |
| **Blow-Off Valve** | Recirculated / Blow-Through compatible | **Vented to Atmosphere (VTA)** | **PRIMARY CAUSE OF DRIVEABILITY STUMBLE:** Metered air vents to atmosphere on throttle lift. The PCM fuels for air that escaped, causing rich bogging, plug fouling, and deceleration stall. |
| **Injectors** | Siemens Deka 60 lb/hr | Siemens Deka 60 lb/hr | Same hardware; requires identical authentic 60lb slopes and battery offset deadtimes, but **with active returnless pressure compensation**. |

---

## 2. Inherited Tuner Errors in `SVTv29.26` That Must Be Repaired

Our 37-revision audit of the tuner's base calibrations revealed serious flaws that break returnless operation:

```
[Inherited Tune SVTv29.26] 
  ├── ECM 7596 (FRPS Transfer)        ──> FLATTENED TO 40 PSI FLAT (Kills closed-loop pump control)
  ├── ECM 6950 (Manifold Vacuum Mult)  ──> SET TO 0.000 / INACTIVE (Destroys Delta-P calculation)
  ├── ECM 32060-32064 (Pressure Mults) ──> FLATTENED TO 1.000 (Causes lean tip-in / rich lift-off)
  ├── ECM 44519 (Cranking Lambda)     ──> 64% CLIFF AT 64°F (Causes cold/warm starting flooding)
  ├── ECM 44511 (Open Loop Base Fuel) ──> LEAN POCKETS (1.07-1.14 Lambda at 2500 RPM)
  └── ECM 44412 (VCT Cam Phasing)     ──> FACTORY NA ADVANCE (1,500°F exhaust gas reversion in boost)
```

### Specific Parameter Audit & Corrections:

### A. Returnless Fuel Pressure & Pump Architecture
1. **`[ECM 7596]` — Fuel Rail Pressure Sensor Transfer Function**:
   * *The Tuner's Hack:* Set all 7 voltage breakpoints to a flat `40.00 psi`. The PCM was blinded into believing rail pressure was perpetually 40 psi.
   * *The Fix for Nic:* Restore the authentic Ford linear sensor transfer: `0.50V = 0.0 psi`, `4.50V = 70.0 psi`. Without this, the closed-loop pump PID cannot see rail pressure collapse under boost.
2. **`[ECM 6950]` — Manifold Vacuum Multiplier**:
   * *The Tuner's Hack:* Set to `0.000` (standard return conversion practice).
   * *The Fix for Nic:* Restore to factory **`0.484`**. In ERFS, true differential injector pressure is:
     $$\Delta P = P_{\text{rail}} - (P_{\text{manifold\_vac}} \times 0.484)$$
     Zeroing this causes massive fueling errors as manifold pressure transitions from vacuum (-20 inHg) to boost (+7 psi).
3. **`[ECM 32060, 32062, 32064, 32052]` — Pressure Compensation Multipliers**:
   * *The Tuner's Hack:* Set to flat `1.0000` across all cells with repeated 40 psi axes.
   * *The Fix for Nic:* Restore active dynamic curves. In an ERFS car, rail pressure fluctuates by ±3–5 psi during rapid throttle changes; these multipliers scale injector pulsewidth instantaneously to eliminate hesitation.
4. **Fuel Pump PID & Duty Bounds**:
   * Retain factory PID gains (`P = 0.0600`, `I = 0.0996`, `D = 0.0000`).
   * Set max duty cycle boundary to **`48.0%`** (Ford FPDM saturation is 50%).
   * Target Differential Pressure (`ECM 43000`): **`39.15 psi`**.

### B. Starting & Transient Fueling Bugs
1. **`[ECM 44519]` — Cranking Fuel ECT Cliff**:
   * *The Tuner's Bug:* At 63.99°F = `0.930` Lambda; at 64.00°F = `0.335` Lambda. A 64% fuel jump across 0.01°F. If started on a 65°F morning, it dumps 2.8x more fuel, soaking the plugs and causing hard extended cranking.
   * *The Fix for Nic:* Rebuild a smooth, monotonic temperature curve from 40°F to 180°F.
2. **`[ECM 44511]` — Open Loop Fuel vs. RPM vs. TPS**:
   * *The Tuner's Bug:* Pockets of lean lambda (1.07–1.14) at 2,500 RPM, transitioning sharply to 0.80.
   * *The Fix for Nic:* Establish a safe, uniform enrichment ramp. Under boost (TPS > 50%), command **0.78–0.80 Lambda (~11.4–11.7 AFR)**. On a stock 10.2:1 compression engine, running 11.5 AFR provides vital in-cylinder charge cooling to prevent pre-ignition.

### C. VCT Overlap & Exhaust Gas Reversion
1. **`[ECM 44412]` — VCT Cam Advance vs. RPM vs. Load**:
   * *The Tuner's Bug:* Retained factory NA cam advance (-49.5° between 2,500 and 4,500 RPM).
   * *The Physics:* On a turbo engine, pre-turbine exhaust backpressure (15–20 psi) exceeds intake manifold boost (6–8 psi). High overlap blows 1,500°F exhaust gas **backwards** into the intake manifold. This superheats incoming air, cooks the intake valves, spikes engine coolant temps, and triggers violent knock.
   * *The Fix for Nic (Adopt v037 Strategy):*
     * **Columns 4,500–7,200 RPM:** Lock flat at **`0.00°` across ALL loads**. Cam is parked at base timing across the high-RPM powerband.
     * **Rows 0.70–1.00 (Boost Rows):** Lock flat at **`0.00°`** above 3,500 RPM to halt reversion.
     * **Columns 1,500–3,250 RPM (Spool Window):** Retain moderate advance (`-15.0° to -25.0°`) where pre-turbine pressure is low to promote rapid spool.

### D. Spark Timing for 10.2:1 Compression Under Boost
1. **`[ECM 44583]` — Borderline Knock Ignition Advance**:
   * On your forged 9.25:1 engine, full-boost spark runs at **13.5°** with zero knock.
   * **Do NOT run 13.5° on Nic's car!** 10.2:1 static compression generates significantly higher peak cylinder pressures.
   * *The Safe Spark Curve for Nic (Row 9 / Load 2.00):*
     * 2,500–3,500 RPM (Spool/Peak Torque): **`6.0° – 8.0°`**
     * 4,000–5,000 RPM: **`9.0° – 10.0°`**
     * 5,500–7,200 RPM: **`11.0° – 11.5° max`**
   * This preserves a 2.5° safety buffer against knock on pump 93 octane.

---

## 3. Immediate Hardware Action Items for Nic

Before writing or logging a revised tune, Nic must verify four physical points:

```
[Pre-Flight Hardware Verification]
  ├── 1. MAFia Rotary Dial Setting    ──> Check dial on Diablo box (0, 1, 2, or 3?)
  ├── 2. FRPS Diaphragm Inspection    ──> Pull vacuum hose; confirm NO raw fuel smell/wetness
  ├── 3. Wastegate Spring Verification──> Must confirm 5–7 psi spring (prevent 12+ psi overboost)
  └── 4. BOV Recirculation Option     ──> Plan routing hose back to pre-turbo intake pipe
```

1. **MAFia Rotary Switch Position:**
   The MAFia has a rotary switch (usually 0 through 5). The calibration cannot scale airflow correctly without knowing this setting.
2. **Inspect FRPS Vacuum Hose for Raw Fuel:**
   Under boost, factory Ford FRPS diaphragms frequently rupture. If fuel has leaked through the vacuum line into the intake manifold, the car will run pig rich and fuel pressure readings will be corrupted.
3. **Confirm Wastegate Base Spring:**
   Nic's target boost is listed as "unknown". The wastegate spring must be verified before any full throttle pull. If a 12 or 14 psi spring is installed, factory SVT rods will bend on the first pull. Target base spring must be **5 to 7 psi**.
4. **BOV Recirculation (The Decel Cure):**
   Strongly recommend routing the BOV discharge back into the intake tube between the MAF and turbo inlet. If left VTA on a draw-through setup, every shift will trigger a rich stumble.

---

## 4. Staged Tuning Execution Roadmap

### Phase 1: Clean Architecture Restoration (`v001`)
* Take a fresh, virgin ECU read from Nic's vehicle (`v000-stock-read.hpt`) and back it up.
* Build `v001` with:
  * Restored returnless parameters (`ECM 7596` linear transfer, `ECM 6950 = 0.484`, dynamic pressure multipliers enabled).
  * Siemens Deka 60 lb/hr injector characterization (slopes, breakpoint, battery offset).
  * Target idle speed set to **950 RPM** (dampens lightweight single-mass flywheel chatter).
  * Idle spark gain set to **1.000** and spark floor to **-6.0°**.
  * Cranking fuel cliff at 64°F eliminated.

### Phase 2: Warm Idle & Fuel Rail Pressure Verification (`v002`)
* Connect MPVI4 using `profiles/Focus_SVT_Returnless_Boost.Channels.xml`.
* Record a 3–5 minute warm idle datalog (`logs/nic-svt-baseline-idle-01.hpl`).
* **Telemetry Acceptance Criteria:**
  * Fuel rail pressure holds steady at **39.0 ± 2.0 psi**.
  * FPDM duty cycle sits between **15% and 22%** at idle.
  * Short-term fuel trims (STFT) settle within **±5%**.
  * Engine idles without rhythmic surging or hunting.

### Phase 3: Off-Boost Cruising & Decel Tuning (`v003`)
* Low-speed street driving (neighborhood cruise up to 3,500 RPM, strictly in vacuum, no boost).
* Adjust low-to-mid MAF voltage points (1.2V to 2.5V) to center fuel trims.
* Tune dashpot decay to prevent RPM hanging or clutch-in stalling exacerbated by the VTA blow-off valve.

### Phase 4: Wastegate Base Spring Pulls & Thermal Lockout (`v004`)
* Apply the **v037 VCT cam angle table** (advance locked to `0.00°` above 3,500 RPM in boost rows and across 4,500–7,200 RPM).
* Set boost control strictly to **wastegate spring only** (EBC/MBC disconnected or WGDC = 0%).
* Execute a staged 3rd gear roll-on from 2,500 to 5,500 RPM:
  * **Immediate Abort Rule 1:** Fuel Pump Duty Cycle $\ge 45\%$ (indicates fuel pump starvation).
  * **Immediate Abort Rule 2:** Wideband Lambda $> 0.80$ under boost.
  * **Immediate Abort Rule 3:** Any knock retard $> 1.5^\circ$.
  * **Immediate Abort Rule 4:** Boost exceeds **8.0 psi**.

### Phase 5: Power Timing & Target Boost Acceptance (`v005+`)
* Verify rail pressure delta-P holds steady at 39–40 psi under boost without sagging.
* Incrementally advance spark timing toward the conservative 10.2:1 ceiling (11.0°–11.5°).
* Ensure intake air temperatures (PID 2127) remain safe post-intercooler.
* Hand off a smooth, fully validated, reliable daily driver tune.

---

## 5. Summary Checklist of What to Tell Nic Today

1. **Do not do any full-throttle pulls** on the current tune file. The return-style fuel logic will not command the fuel pump properly under boost.
2. **Locate the MAFia rotary dial** and tell us what number it is set to.
3. **Pull the FRPS vacuum hose** and confirm it is 100% dry inside.
4. **Confirm the wastegate spring pressure** (must be 5–7 psi).
5. **Capture the first 3-minute warm idle datalog** using the MPVI4 and the returnless scanner channel profile in `profiles/`.
