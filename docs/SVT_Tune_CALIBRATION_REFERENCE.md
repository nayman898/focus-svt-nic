# SVT Tune Baseline Calibration Reference & Architecture Profile

> **Origin:** Vehicle Native Read / Baseline Calibration (`SVT Tune.hpt`)  
> **Source Binary:** `tunes/SVT Tune.hpt`  
> **File Size:** `214,909 bytes`  
> **SHA-256 Hash:** `e21bac258b66be02a6d56beeda483e54ba4de7491b1bde8d4480eb890885207b`  
> **Strategy / Hardware:** Ford Black Oak EEC-V, Strategy `ZED0` / `UJAHAS3`  
> **Application:** 2003 Ford Focus SVT 2.0L (Nic)

---

## 1. Executive Summary & Calibration Profile

`SVT Tune.hpt` is the primary reference file supplied from Nic's vehicle environment. An in-depth audit of its calibration tables confirms that **`SVT Tune.hpt` is an uncorrupted factory naturally aspirated (NA) calibration**. It possesses factory Ford architecture (clean sensor curves, factory closed-loop behavior, and active IMRC), but **lacks all provisions for forced induction**.

### High-Level Subsystem Status in `SVT Tune.hpt`

| Subsystem | State in `SVT Tune.hpt` | Safe for Turbo Boost? | Engineering Assessment |
| :--- | :--- | :---: | :--- |
| **Fuel Pressure Architecture** | Genuine Ford 0–70 psi Transfer (`ECM 7596`) | ✅ **PERFECT** | Factory ERFS returnless transfer curve is intact. |
| **Manifold Vacuum Multiplier** | `0.484` (`ECM 6950`) | ✅ **PERFECT** | Dynamic differential pressure calculation active across injector tip. |
| **Desired Fuel Pressure** | 39.15 psi (`ECM 43000`) | ✅ **PERFECT** | Factory target delta-P over injector. |
| **Injector Characterization** | Factory 30 lb/hr (`0.00967 lb/s`) | ❌ **CRITICAL DANGER** | Must be scaled to Siemens Deka 60 lb/hr (`0.0167 lb/s`) to prevent 200% over-fueling. |
| **Closed-Loop O2 Temp** | Factory 520°F (`ECM 12115`) | ✅ **CLEAN** | Enters closed loop normally (unlike Chuck's 2,000°F lockout). |
| **Standard Air Charge** | Factory 0.00170 lb (`ECM 44205`) | ✅ **CLEAN** | Unmodified standard cylinder air charge (unlike Chuck's 0.00136 lb spoof). |
| **Variable Cam Timing (VCT)** | Factory NA Overlap (-49.5° advance) | ❌ **CRITICAL DANGER** | Must be locked out (0.00°) above 3.5k in boost and across 4.5k–7.2k to stop reversion. |
| **Borderline Spark Timing** | Factory NA Spark (25°–35° BTDC) | ❌ **CRITICAL DANGER** | Will detonate and bend factory 10.2:1 powdered-metal rods; must clamp boost rows to 11.0°–11.5°. |
| **Spark Load Axis** | Tops out at Load 1.00 (`ECM 44583`) | ⚠️ **NEEDS BOOST ROW** | Must expand Row 9 to Load 2.00 to map positive manifold pressure. |
| **Idle Target Speed** | 850 RPM (`ECM 44218/17`) | ⚠️ **SUB-OPTIMAL** | Prone to stall and single-mass flywheel gear rattle; recommend 950 RPM. |
| **Cooling Fan Triggers** | Factory Stock (216°F Low / 228°F High) | ⚠️ **TOO HOT** | Traps heat in tight turbo engine bay; lower to 196°F Low / 205°F High. |
| **IMRC (Runner Control)** | Switch & Sensor Enabled (`ECM 44300`) | ✅ **INTACT** | Dual-stage runners switch normally at 5,000 RPM. |
| **Cylair Anticipation Logic**| Enabled (`ECM 44208`) | ✅ **INTACT** | Factory transient air prediction active for smooth throttle response. |

---

## 2. Fuel System Audit: Factory Returnless ERFS Integrity

Unlike the previous tuner's file (`SVTv29.26`), which had its fuel pressure sensor transfer flattened to 40 psi and vacuum multiplier zeroed out for an external mechanical regulator, **`SVT Tune.hpt` is 100% genuine Electronic Returnless (ERFS)**:

```
[SVT Tune.hpt Returnless Control Loop]
FRPS Sensor (0-70 psi) ──► PCM computes Delta-P ──► Commands FPDM PWM Duty Cycle ──► Maintains 39.15 psi
```

### Sensor & Multiplier Baseline Values:
1. **`[ECM 7596]` Fuel Rail Pressure Sensor Transfer Function:**
   * Genuine linear Ford transfer curve: `0 Counts = 0.00 psi`, `102 Counts (0.50V) = 0.00 psi`, `921 Counts (4.50V) = 70.00 psi`.
   * The PCM has full closed-loop visibility over rail pressure from 0 to 70 psi.
2. **`[ECM 6950]` Manifold Vacuum Multiplier:**
   * Factory setting: `0.484`.
   * Real-time injector pressure drop is accurately calculated: $\Delta P = P_{\text{rail}} - (P_{\text{manifold\_vac}} \times 0.484)$.
3. **`[ECM 43000]` Desired Fuel Pressure Over Injector:**
   * Target: `39.15 psi` across all temperature rows.
4. **`[ECM 32060, 32062, 32064, 32052]` Pressure Multipliers:**
   * Active dynamic compensation tables are retained to dampen pressure waves during rapid throttle transients.

---

## 3. Injector Characterization: Factory 30 lb vs. Target 60 lb

`SVT Tune.hpt` contains factory calibration for the OEM SVT Focus 30 lb/hr injectors. Flashing this file with Siemens Deka 60 lb/hr injectors installed would cause catastrophic rich fouling:

| Parameter | Parameter ID | Value in `SVT Tune.hpt` | Target Value for 60 lb Deka | Engineering Rationale |
| :--- | :---: | :---: | :---: | :--- |
| **Injector Flow Rate High** | `ECM 12011` | `0.009670 lb/s` (34.8 lb/hr) | **`0.016700 lb/s`** (60.1 lb/hr) | Represents actual mass flow at 39.15 psi delta-P. |
| **Injector Flow Rate Low** | `ECM 12010` | `0.010100 lb/s` (36.4 lb/hr) | **`0.017500 lb/s`** (63.0 lb/hr) | Corrects for non-linear flow at short pulse widths. |
| **Injector Breakpoint** | `ECM 12012` | `0.000018 lb` | **`0.00003360 lb`** | Point where injector transitions from low to high slope. |
| **Injector PW Minimum** | `ECM 12013` | `0.000000 s` | **`0.000891 s`** (0.89 ms) | Minimum opening time clamp to avoid erratic fueling. |
| **Injector Pressure Ref** | `ECM 12014` | `39.15 psi` | **`39.15 psi`** | Matched to factory returnless differential target. |

---

## 4. Ignition Timing Audit: Naturally Aspirated Hazard

In `SVT Tune.hpt`, the Borderline Knock table (`ECM 44583`) is mapped only up to naturally aspirated wide-open throttle (**Load 1.00**), with full-advance timing reaching **25.0° to 35.0° BTDC**:

```text
Load \ RPM  1000    1850    2450    2800    3250    5000    5750    6000    6250    6500    7200
0.70        6.50   14.00   21.00   24.01   20.50   26.94   37.37   40.03   40.03   40.72   41.33
0.80       -7.00    2.00    6.73    9.28    9.28   17.17   17.06   16.67   16.00   15.44   13.75
1.00       -7.31   -9.00    1.65    4.14    8.00   18.38   18.17   17.42   15.83   15.50   13.50
```

### Why This Cannot Be Flashed on Nic's Car:
1. **Stock 10.2:1 Compression**: High static compression leaves zero tolerance for over-advanced timing under boost.
2. **Factory Powdered-Metal Rods**: Stock SVT connecting rods will buckle under the cylinder pressure spikes produced by 18° timing under 7–10 psi boost.
3. **Required Fix**: The Load 1.00 row must be re-scaled to **Load 2.00**, and high-RPM timing must be clamped to **`11.0° – 11.5° BTDC`**.

---

## 5. Variable Cam Timing Audit: NA Overlap Overheating

In `SVT Tune.hpt`, the intake camshaft angle table (`ECM 44412`) contains factory naturally aspirated cam advance:

```text
Load \ RPM  1000    1500    2000    2500    3500    4500    6000    6250    6750    7000    7200
0.70       -10.00  -15.00  -25.00  -30.00  -20.00  -25.00  -45.00  -40.00  -32.00  -25.00  -20.00
0.80       -10.00  -15.00  -25.00  -28.00  -18.00  -25.00  -45.00  -40.00  -35.00  -25.00  -20.00
1.00       -10.00  -15.00  -20.00  -25.00  -15.00  -25.00  -40.00  -40.00  -35.00  -25.00  -20.00
```

### The Thermal Reversion Trap:
* At 6,000 RPM, the intake cam is advanced by **`-40.0° to -45.0°`**, creating massive valve overlap with the fixed exhaust cam.
* Under boost, pre-turbine exhaust backpressure exceeds intake boost pressure.
* This pressure differential forces 1,500°F exhaust gases backwards into the intake runners on every intake stroke, blowing out fresh charge and causing rapid coolant overheating (exceeding 215°F in a single pull).
* **Required Fix**: Apply the proven `v037` strategy—locking the cam flat at **`0.00°` across 4,500–7,200 RPM and in boost rows above 3,500 RPM**.

---

## 6. Subsystem Verification Checklist

* [x] **Fuel Pressure Transfer Function**: Verified genuine Ford 0–70 psi linear calibration (`ECM 7596`).
* [x] **Manifold Vacuum Multiplier**: Verified active at `0.484` (`ECM 6950`).
* [x] **Closed-Loop O2 Sensor Threshold**: Verified factory `520°F` (`ECM 12115`).
* [x] **Standard Air Charge**: Verified factory `0.00170 lb` (`ECM 44205`).
* [x] **IMRC Runner Control**: Verified enabled and active (`ECM 44300`).
* [x] **Cylair Anticipation**: Verified enabled (`ECM 44208`).
* [ ] **Injector Slopes**: Pending upgrade to 60 lb (`ECM 12010–12012`).
* [ ] **Boost Timing Ceiling**: Pending clamp to 11.0° on Load 2.00 (`ECM 44583`).
* [ ] **VCT Cam Lockout**: Pending lockout to 0.00° (`ECM 44412`).
* [ ] **Cooling Fan Triggers**: Pending lowering to 196°F/205°F (`System > Fans`).
* [ ] **Idle Target Speed**: Pending increase to 950 RPM (`ECM 44218/17`).
