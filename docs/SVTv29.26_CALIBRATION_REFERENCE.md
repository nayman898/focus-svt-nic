# SVTv29.26 Calibration Deep-Dive & Baseline Reference Sheet

> **Origin:** Tuner Archive ("Chuck" / SVTv29.xx series)  
> **Source Binary:** `tunes/SVTv29.26.hpt` (Identical SHA-256 to `svt-focus-tuning/tunes/Old tunes/SVTv29.26.hpt`)  
> **Strategy / Hardware:** Ford Black Oak EEC-V, Strategy `ZED0` / `UJAHAS3`  
> **Target Application:** Forced Induction Ford Focus SVT 2.0L

---

## 1. Executive Summary & Calibration Profile

`SVTv29.26.hpt` represents the 26th iterative calibration from the previous tuner ("Chuck"). It contains foundational provisions for forced induction (Siemens Deka 60 lb/hr injector slopes, an extended MAF transfer curve, and reduced WOT spark timing), but it was **built around a mechanical return fuel system conversion with a bypassed pump**.

When loaded onto a car with Ford's factory **Electronic Returnless Fuel System (ERFS)**, this tune introduces severe architecture conflicts, starting bugs, and thermal reversion hazards.

### High-Level Subsystem Status in `SVTv29.26`

| Subsystem | State in `SVTv29.26` | Safe for Returnless (Nic)? | Required Action |
| :--- | :--- | :---: | :--- |
| **Fuel Pressure Sensing** | Flat 40.0 psi (`ECM 7596`) | ❌ **CRITICAL FAIL** | Restore genuine Ford 0–70 psi transfer curve |
| **Manifold Vac Multiplier**| Set to 0.000 (`ECM 6950`) | ❌ **CRITICAL FAIL** | Restore to 0.484 for injector tip $\Delta P$ |
| **Pressure Comp Multipliers**| All flat 1.000 (`ECM 32060–64`)| ❌ **POOR TRANSIENTS** | Restore active dynamic compensation |
| **Injector Slopes** | Siemens Deka 60 lb/hr | ✅ **MATCHED** | Retain verified 60/63 lb slopes & offsets |
| **Cranking Fueling** | 64°F Cliff (`ECM 44519`) | ❌ **PLUG FOULING** | Smooth 0.335 cliff to 0.850 monotonic taper |
| **Open-Loop Fueling** | 2.5k RPM Lean Pockets (`ECM 44511`)| ⚠️ **DRIVABILITY STUMBLE**| Normalize 1.07/1.14 pockets to 1.00 |
| **WOT Boost Fueling** | 0.73–0.75 Lambda (~10.8 AFR) | ✅ **SAFE / RICH** | Maintain safe 11.2–11.5 AFR cushion |
| **Variable Cam Timing** | Factory NA Overlap (-49.5°) | ❌ **SEVERE OVERHEAT** | Apply v037 reversion lockout (0.00° in boost) |
| **Borderline Spark (Boost)**| 10.75°–11.50° on Load 2.00 | ✅ **SAFE FOR 10.2:1** | Retain conservative timing (do NOT advance to 13.5°) |
| **Idle Speed** | 850 RPM Target (`ECM 44218/17`) | ⚠️ **FLYWHEEL CHATTER** | Raise to 950 RPM for single-mass flywheel |
| **Dashpot Airflow Decay** | 0.00 at low airflow (`ECM 32984`)| ⚠️ **HANGING IDLE** | Decay rate tuning needed for decel return |

---

## 2. Fuel System & ERFS Architecture Audit (The Core Conflict)

In a mechanical return fuel system, an external vacuum-referenced regulator mechanically forces fuel rail pressure to track manifold pressure, while the in-tank pump runs at constant 100% battery voltage via a relay.

On Nic's car, fuel delivery is entirely electronic:
1. The PCM monitors the **Fuel Rail Pressure Sensor (FRPS)** mounted on the rail.
2. The PCM computes real-time injector pressure drop: $\Delta P = P_{\text{rail}} - (P_{\text{manifold\_vac}} \times 0.484)$.
3. The PCM pulses a PWM command to the **Fuel Pump Driver Module (FPDM)**, varying pump speed to maintain exactly 39.15 psi across the injector tip.

### The Return-Style Shortcuts in `SVTv29.26`:
1. **`[ECM 7596]` Fuel Rail Pressure Sensor Transfer Function:**
   * **Values:** `0 counts = 40.0 psi`, `102 counts = 40.0 psi`, `921 counts = 40.0 psi`, `1023 counts = 40.0 psi`.
   * **Flaw:** All 7 displayed rows were forced to `40.00 psi`. The PCM is completely blinded. If rail pressure collapses under boost from 40 psi down to 25 psi, the PCM still reads 40.0 psi and will never command the FPDM to increase pump duty cycle!
2. **`[ECM 6950]` Manifold Vacuum Multiplier:**
   * **Value:** `0.000` (disabled).
   * **Flaw:** The PCM ignores manifold vacuum/boost in its injector pressure calculation. As the engine transitions from 20 inHg of vacuum to 7 psi of boost, the effective pressure drop across the injector changes by over 17 psi, but the PCM assumes it is zero.
3. **`[ECM 32060, 32062, 32064, 32052]` Pressure Multipliers:**
   * **Values:** All flat `1.0000` across all cells with repeated 40.0 psi breakpoints.
   * **Flaw:** Eliminates injector pulsewidth trim during rail pressure ripple, causing hesitations on tip-in and rich bogs on throttle lift.
4. **`[ECM 43000]` Desired Fuel Pressure Over Injector:**
   * **Value:** `40.00 psi` across all 7 rows.
5. **`[ECM 43005]` Desired Fuel Pressure Over Injector AAT Adder:**
   * **Values:** 40 psi at $<144^\circ\text{F}$ ambient, rising to 57 psi at $170^\circ\text{F}$ and 62 psi at $200^\circ\text{F}+$.

---

## 3. Injector Characterization Data (Siemens Deka 60 lb/hr)

`SVTv29.26` has proper baseline characterization for Siemens Deka 60 lb (107961) high-impedance injectors:

| Parameter | ECM ID | Value in `SVTv29.26` | Engineering Notes |
| :--- | :---: | :---: | :--- |
| **Injector Flow Rate High** | `12011` | `0.016700000 lb/s` | Equivalent to **60.12 lb/hr** at 39.15 psi reference |
| **Injector Flow Rate Low** | `12010` | `0.017500000 lb/s` | Equivalent to **63.00 lb/hr** (non-linear low PW slope) |
| **Injector Breakpoint** | `12012` | `0.00003360 lb` | Slope transition mass threshold |
| **Injector PW Minimum** | `12015` | `0.00050000 s` | Minimum pulsewidth clamp: 0.50 ms |
| **Injector Pressure Ref** | `32040` | `40.00 psi` | Baseline differential reference pressure |

### Battery Voltage Offset Curve — `[ECM 32050]`
*Units: Seconds deadtime compensation vs. Module Voltage*

| Voltage (V) | Offset (s) | Offset (ms) |
| :---: | :---: | :---: |
| **6.0 V** | `0.003395` | 3.40 ms |
| **8.0 V** | `0.001928` | 1.93 ms |
| **10.0 V** | `0.001099` | 1.10 ms |
| **11.0 V** | `0.000832` | 0.83 ms |
| **12.0 V** | `0.000636` | 0.64 ms |
| **13.0 V** | `0.000517` | 0.52 ms |
| **14.0 V** | `0.000429` | 0.43 ms |
| **15.0 V** | `0.000327` | 0.33 ms |

---

## 4. Cold Start & Cranking Fueling Discontinuity

### `[ECM 44519]` — Fuel Cranking vs. ECT
The inherited tune contains an extreme calibration error at 64°F:

| ECT (°F) | Commanded Lambda | Delivered Fuel Multiplier Effect |
| :---: | :---: | :--- |
| **40.0°F** | `0.886` | Normal cold start enrichment |
| **63.99°F** | `0.930` | Normal cold start enrichment |
| **64.00°F** | **`0.335`** | **CRASH: 64% drop across 0.01°F! Dumps 2.78× MORE fuel** |
| **90.0°F** | `0.430` | Excessively rich cranking command |
| **120.0°F** | `0.647` | Extended rich cranking command |
| **150.0°F** | `0.764` | Warm cranking enrichment |
| **180.0°F** | `1.000` | Stoichiometric cranking |

*Why this matters:* If Nic cranks the car on an autumn morning when coolant temp is between 64°F and 90°F, the PCM commands 0.335 to 0.430 lambda. On 60 lb injectors, this drenches the combustion chamber with raw gasoline, washes the cylinder walls, and fouls the spark plugs before the engine can catch.

---

## 5. Airflow & Mass Airflow (MAF) Calibration

* **Primary MAF Transfer Function `[ECM 12163]`:** 30-point curve configured for OEM SVT MAF sensor with a **Diablosport MAFia interface box**.
* **Key Voltage Flow Anchors:**
  * `0.50 V` $\rightarrow$ `0.420 lb/min` (~3.17 g/s)
  * `1.00 V` $\rightarrow$ `1.856 lb/min` (~14.03 g/s, near warm idle)
  * `2.00 V` $\rightarrow$ `8.650 lb/min` (moderate cruise)
  * `3.00 V` $\rightarrow$ `23.400 lb/min` (entering boost)
  * `4.00 V` $\rightarrow$ `49.500 lb/min` (peak airflow ~490 hp equivalent scaling)
  * `4.90 V` $\rightarrow$ `86.500 lb/min` (extended headroom)
* **Idle Dashpot Decay `[ECM 32984]`:** Set to `0.00` across airflow breakpoints 0.0, 0.2, 0.4, and 0.6 lb/min. This prevents the idle air valve from closing smoothly during off-throttle transitions, leading to a noticeable RPM hang when depressing the clutch while coasting.

---

## 6. Open Loop Base Fuel Map — `[ECM 44511]`

Grid: 11 RPM Columns ($1,000$ to $7,400\text{ RPM}$) $\times$ 8 TPS Rows ($15.6\%$ to $68.4\%$).

| TPS % / RPM | 1,000 | 2,500 | 3,500 | 4,000 | 4,500 | 5,000 | 5,500 | 6,000 | 6,500 | 7,400 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Row 1 (15.6%)** | 1.00 | **1.07** | 1.02 | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 |
| **Row 2 (19.5%)** | 1.00 | **1.14** | 1.02 | 0.85 | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 |
| **Row 3 (23.4%)** | 1.00 | 1.00 | 1.03 | 0.85 | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 |
| **Row 4 (31.2%)** | 1.00 | 0.80 | 0.80 | 0.73 | 0.75 | 0.75 | 0.75 | 0.75 | 0.75 | 0.75 |
| **Row 5 (35.2%)** | 0.80 | 0.80 | 0.80 | 0.73 | 0.75 | 0.75 | 0.75 | 0.75 | 0.75 | 0.75 |
| **Row 6 (39.1%)** | 0.80 | 0.73 | 0.73 | 0.73 | 0.73 | 0.74 | 0.74 | 0.74 | 0.74 | 0.74 |
| **Row 7 (53.7% WOT)**| 0.80 | 0.75 | 0.75 | 0.74 | 0.73 | 0.74 | 0.74 | 0.74 | 0.75 | 0.74 |

* **Analysis:**
  * **The 2,500 RPM Lean Pockets:** At Rows 1 and 2, commanded lambda jumps to **1.07** and **1.14** (~15.7–16.7 AFR). This causes lean stumbles and hitching during light-throttle cruising and city acceleration.
  * **WOT Enrichment:** Rows 6 and 7 command **0.73–0.75 Lambda (~10.7–11.0 AFR)**. While rich, this provides a safe fuel-cooling margin on pump gas.

---

## 7. Variable Cam Timing (VCT) — `[ECM 44412]` (The Overheating Hazard)

`SVTv29.26` retains the **factory Naturally Aspirated intake cam timing table**:

| Load / RPM | 1,000 | 1,500 | 2,000 | 2,500 | 3,500 | 4,500 | 6,000 | 6,250 | 6,750 | 7,000 | 7,200 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **0.10** | 0.00 | -10.00 | -15.00 | -20.00 | -15.00 | -15.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| **0.20** | -10.00 | -22.00 | -30.00 | -39.60 | -35.00 | -34.00 | 0.00 | 0.00 | 5.00 | 0.00 | 0.00 |
| **0.30** | -10.00 | -25.00 | -34.80 | -42.00 | -42.00 | -31.60 | -5.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| **0.40** | -10.00 | -26.00 | -35.10 | -45.00 | **-49.50** | **-49.50** | -10.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| **0.50** | -10.00 | -28.00 | -33.50 | -45.00 | **-49.50** | **-49.50** | -15.00 | -5.00 | 0.00 | 0.00 | 0.00 |
| **0.60** | -10.00 | -26.50 | -28.50 | -45.00 | **-49.50** | **-49.50** | -15.00 | -5.00 | 0.00 | 0.00 | 0.00 |
| **0.70 (Boost)** | -10.00 | -21.00 | -23.00 | -24.00 | **-49.50** | **-49.50** | -10.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| **0.80 (Boost)** | -10.00 | -17.00 | -19.00 | -19.00 | **-49.50** | **-49.50** | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| **1.00 (Boost)** | -10.00 | -12.00 | -13.00 | -13.00 | -13.00 | -12.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |

### The Physics Failure Mode:
On a turbo engine under boost, pre-turbine exhaust manifold backpressure reaches 18–24 psi, while intake boost is only 6–8 psi. Commanding **-49.50° of intake valve advance** creates huge valve overlap. Because pre-turbine exhaust pressure is higher than intake pressure, **superheated 1,500°F exhaust gas blows backwards into the intake runners**, baking the intake valves, superheating charge air, causing violent knock, and driving rapid coolant temperature spikes (+12°F rise during a single pull).

---

## 8. Spark Advance & Knock Protection

### `[ECM 44583]` — Spark Borderline Knock vs. RPM vs. Load
*Units: Degrees Ignition Advance (BTDC)*

| Load / RPM | 1,000 | 1,850 | 2,450 | 2,800 | 3,250 | 5,000 | 5,750 | 6,000 | 6,250 | 6,500 | 7,200 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **0.30 (Cruise)** | 42.0° | 42.0° | 42.0° | 42.0° | 42.0° | 42.0° | 42.0° | 42.0° | 42.0° | 42.0° | 42.0° |
| **0.50 (Moderate)**| 32.0° | 32.0° | 32.0° | 32.0° | 32.0° | 34.0° | 34.0° | 34.0° | 34.0° | 34.0° | 34.0° |
| **0.70 (Spool)** | 18.0° | 20.0° | 21.0° | 22.0° | 23.0° | 24.0° | 24.0° | 24.0° | 24.0° | 24.0° | 24.0° |
| **0.80 (Boost)** | 6.5° | 13.5° | 15.0° | 16.5° | 17.0° | 18.0° | 18.0° | 18.0° | 18.0° | 18.0° | 18.0° |
| **2.00 (Full Boost)**| -7.31°| -9.00°| 1.65° | 4.14° | 8.00° | **11.50°**| **11.50°**| **11.50°**| **11.25°**| **11.00°**| **10.75°**|

* **Analysis for Nic's Engine:**
  * Unlike your built engine (9.25:1 static compression ratio which safely carries 13.50° timing at WOT), Nic has **factory 10.2:1 compression with stock powdered-metal rods**.
  * The timing values on Row 9 (**10.75° – 11.50°**) are conservative and appropriate. **They should NOT be advanced further until intercooler performance and knock retard are thoroughly logged.**

---

## 9. Master DTC Diagnostic Mask

`SVTv29.26` configured emissions and sensor reporting for an off-road turbo setup:
* **Downstream O2 / Catalyst (Disabled):** P0136, P0138, P0140, P0141, P0420, P0430 (allows catless downpipe without CEL).
* **EGR System (Disabled):** Standard for turbo exhaust manifold swap.
* **Fuel Rail Pressure Diagnostics:** P0190, P0191, P0192, and P0193 were suppressed or blinded due to the 40 psi flat transfer table.

---

## 10. Verdict: What Happens if Flashed Unmodified on Nic's Car?

1. **Fuel Pump Collapse:** The PCM believes rail pressure is permanently 40 psi. Under boost, as manifold pressure climbs and fuel demand peaks, the PCM will not command sufficient FPDM duty cycle. Rail pressure will drop, causing an extreme lean event under boost.
2. **Hard Starting & Plug Wetting:** Morning starts around 64°F–75°F will flood the engine with 2.8× commanded fuel mass.
3. **Thermal Reversion & Knock:** At WOT, VCT overlap will push 1,500°F exhaust gas into the intake runners, rapidly spiking coolant temperatures past 215°F and provoking detonation on stock 10.2:1 rods.
4. **Rough Decel & Idle Chatter:** The 850 RPM idle will rattle the lightweight clutch/flywheel, and the 0.00 dashpot airflow cells will cause RPM hangs.
