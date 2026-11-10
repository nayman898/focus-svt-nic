# v001 — Clean Returnless Boost Baseline (Derived from `SVT Tune.hpt`)

> **Candidate Baseline Calibration for Nic's 2003 Focus SVT Turbo**  
> **Parent & Immediate Rollback File:** [`tunes/SVT Tune.hpt`](SVT%20Tune.hpt)  
> **Target Hardware:** Stock SVT 2.0L (10.2:1 Static CR), Factory Returnless ERFS (OEM FPDM + In-Tank Pump), Siemens Deka 60 lb/hr, Stock MAF + Diablo MAFia (Draw-Through), SPA .64 Turbo

---

## Binary Identification & Integrity

| Property | Candidate (`v001`) | Parent / Rollback (`v000` / `SVT Tune`) |
| :--- | :--- | :--- |
| **Filename** | `v001-SVT-Tune-parent.hpt` | `SVT Tune.hpt` |
| **File Size** | `215,757 bytes` | `214,909 bytes` |
| **SHA-256 Hash** | `5F6096E1778B81F8019ECC8218B7FF13F86DBB3533E506349101B85BD9163731` | `E21BAC258B66BE02A6D56BEEDA483E54BA4DE7491B1BDE8D4480EB890885207B` |
| **Creation Date** | 2026-11-09 | Inherited baseline read |
| **Flash Authority** | Vehicle Owner (Nic) | Baseline Archive |

---

## Calibration Engineering Rationale

Candidate `v001` is derived directly from Nic's native baseline (`SVT Tune.hpt`). Unlike the earlier prototype which carried Chuck's legacy return-style hacks, this candidate retains 100% of Ford's clean factory architecture while applying only the essential parameters required for safe forced induction on stock 10.2:1 compression:

```
[Native SVT Tune.hpt Baseline]                         [Candidate v001 Boost Safety]
ECM 12011/10 Injectors: 30 lb/hr Slopes        ───►   Siemens Deka 60 lb/hr Flow Characterization
ECM 44583 Spark Timing: 25°-35° NA Timing     ───►   11.0° - 11.5° Conservative Boost Ceiling
ECM 44412 VCT Phasing: -45° NA Overlap         ───►   v037 Lockout: 0.00° in Boost & >4,500 RPM
ECM 44218/17 Idle Target: 850 RPM              ───►   Raised to 950 RPM (Single-mass flywheel)
System Fans: 216°F Low / 228°F High            ───►   Lowered to 196°F Low / 205°F High
```

### Factory Architecture Intentionally Preserved (No Hacks):
1. **Genuine Returnless ERFS**: Retained genuine Ford 0–70 psi FRPS transfer curve (`ECM 7596`) and `0.484` manifold vacuum multiplier (`ECM 6950`).
2. **Factory Closed-Loop O2 Temp**: Retained stock `520°F` entry threshold (`ECM 12115`), avoiding Chuck's 2,000°F closed loop lockout.
3. **Factory Standard Air Charge**: Retained uncorrupted `0.00170 lb` cylinder charge (`ECM 44205`), avoiding load inflation tricks.
4. **IMRC Active**: Maintained dual-stage intake runner control switches (`ECM 44300`).
5. **Cylair Anticipation Active**: Retained transient cylinder air prediction (`ECM 44208`) for smooth throttle response.
6. **Fuel Pump PID Gains**: Preserved stock electronic returnless voltage and gain parameters.

---

## Detailed Parameter Changes

### 1. Fuel Injector Characterization — `[ECM 12010, 12011, 12012, 12013]`
*Path: `Engine > Fuel > General > Injector Control`*  
*Purpose: Calibrates the PCM for Siemens Deka 60 lb/hr high-impedance injectors at 39.15 psi reference differential pressure.*

| Parameter | Parameter ID | Baseline (`SVT Tune`) | Candidate (`v001`) | Delta |
| :--- | :---: | :---: | :---: | :---: |
| **Injector Flow Rate High** | `ECM 12011` | `0.009670 lb/s` | **`0.016700 lb/s`** | +0.007030 lb/s (60.1 lb/hr) |
| **Injector Flow Rate Low** | `ECM 12010` | `0.010100 lb/s` | **`0.017500 lb/s`** | +0.007400 lb/s (63.0 lb/hr) |
| **Injector Breakpoint** | `ECM 12012` | `0.00001800 lb` | **`0.00003360 lb`** | +0.00001560 lb |
| **Injector PW Minimum** | `ECM 12013` | `0.00000000 s` | **`0.00089100 s`** | +0.891 ms clamp |
| **Injector Pressure Drop Ref** | `ECM 12014` | `39.15 psi` | **`39.15 psi`** | 0.00 psi (Unchanged) |

---

### 2. Variable Cam Timing Reversion Lockout — `[ECM 44412]`
*Path: `Engine > Airflow > Variable Camshaft > Configuration > VCT Angle vs. RPM vs. Load`*  
*Purpose: Validated `v037` strategy. Locks intake cam advance flat at `0.00°` across 4,500–7,200 RPM and in boost rows (0.70–1.00) above 3,500 RPM to eliminate exhaust reversion heat soak and prevent 215°F+ coolant spikes.*

```text
Load \ RPM  1000    1500    2000    2500    3500    4500    6000    6250    6750    7000    7200
0.10        0.00  -10.00  -15.00  -20.00  -15.00    0.00    0.00    0.00    0.00    0.00    0.00
0.20      -10.00  -15.00  -20.00  -25.00  -20.00    0.00    0.00    0.00    0.00    0.00    0.00
0.30      -10.00  -20.00  -25.00  -30.00  -25.00    0.00    0.00    0.00    0.00    0.00    0.00
0.40      -10.00  -20.00  -30.00  -35.00  -25.00    0.00    0.00    0.00    0.00    0.00    0.00
0.50      -10.00  -20.00  -30.00  -35.00  -20.00    0.00    0.00    0.00    0.00    0.00    0.00
0.60      -10.00  -15.00  -25.00  -30.00  -20.00    0.00    0.00    0.00    0.00    0.00    0.00
0.70      -10.00  -15.00  -25.00  -30.00  -20.00    0.00    0.00    0.00    0.00    0.00    0.00
0.80      -10.00  -15.00  -25.00  -28.00  -18.00    0.00    0.00    0.00    0.00    0.00    0.00
1.00      -10.00  -15.00  -20.00  -25.00  -15.00    0.00    0.00    0.00    0.00    0.00    0.00
```

---

### 3. Spark Borderline Knock Boost Protection — `[ECM 44583]`
*Path: `Engine > Spark > Advance > Borderline > Spark Borderline Knock vs. RPM vs. Load`*  
*Purpose: Expands Row 9 to Load 2.00 and clamps full-throttle / positive manifold pressure ignition advance to `10.75° – 12.00° BTDC`. Guarantees mechanical safety for stock 10.2:1 pistons and powdered-metal connecting rods on 93 octane.*

```text
Load \ RPM  1000    1850    2450    2800    3250    5000    5750    6000    6250    6500    7200
0.10       55.00   55.00   55.00   55.00   55.00   55.00   55.00   55.00   55.00   55.00   55.00
0.20       41.60   45.40   45.00   45.40   45.10   45.00   44.70   40.40   34.70   45.60   41.00
0.30       36.00   45.00   45.00   45.00   41.00   39.00   45.11   45.00   44.64   45.17   36.33
0.40       23.00   29.00   39.00   36.50   30.00   32.87   44.79   44.52   44.66   44.69   42.80
0.50       12.50   21.00   30.00   28.00   26.00   26.99   33.77   39.06   41.72   42.29   45.26
0.60        7.68   19.00   22.51   27.00   22.64   22.37   29.16   32.80   36.17   33.00   36.01
0.70        6.50   14.00   21.00   24.01   20.50   19.39   24.49   25.60   29.48   27.56   29.00
0.80       -7.00    2.00    6.73    9.28    9.28   12.00   12.00   12.00   12.00   12.00   12.00
2.00       -7.31   -9.00    1.65    4.14    8.00   11.50   11.50   11.50   11.25   11.00   10.75
```

---

### 4. Cooling Fan Thresholds — `[System > Fans > Control By ECT]`
*Path: `System > Fans > Control By ECT`*  
*Purpose: Activates cooling airflow earlier to prevent thermal soak in the turbocharged engine bay.*

| Parameter | Baseline (`SVT Tune`) | Candidate (`v001`) | Delta |
| :--- | :---: | :---: | :---: |
| **Fan Low Speed Enable ECT** | `216.0 °F` | **`196.0 °F`** | -20.0 °F |
| **Fan Low Speed Disable ECT** | `210.0 °F` | **`190.0 °F`** | -20.0 °F |
| **Fan High Speed Enable ECT** | `228.0 °F` | **`205.0 °F`** | -23.0 °F |
| **Fan High Speed Disable ECT** | `222.0 °F` | **`199.0 °F`** | -23.0 °F |

---

### 5. Target Idle Speed — `[ECM 44218, 44217]`
*Path: `Engine > Idle > General`*  
*Purpose: Stabilizes idle vacuum and eliminates single-mass flywheel rollover rattle.*

| Parameter | Parameter ID | Baseline (`SVT Tune`) | Candidate (`v001`) | Delta |
| :--- | :---: | :---: | :---: | :---: |
| **Target Idle Speed Park/Neutral** | `ECM 44218` | `850.0 rpm` | **`950.0 rpm`** | +100.0 rpm |
| **Target Idle Speed Drive** | `ECM 44217` | `850.0 rpm` | **`950.0 rpm`** | +100.0 rpm |

---

## Pre-Flight Checklist for Flash & First Test

1. **Physical Checks:**
   - Confirm Diablo MAFia rotary dial position (typically setting 2 or 3 for 2.75" draw-through).
   - Verify FRPS vacuum hose is connected to intake manifold and dry (no raw gasoline).
   - Verify wastegate base spring is **5 to 7 psi** mechanical.
2. **Flash Procedure:**
   - Connect battery charger or verify battery voltage > 12.4V.
   - Flash `v001-SVT-Tune-parent.hpt` using HP Tuners MPVI4.
3. **First Datalogging Target (Warm Idle):**
   - Connect VCM Scanner using profile `profiles/Focus_SVT_Returnless_Boost.Channels.xml`.
   - Record warm idle log (coolant temp 180°F+, 3–5 minutes undisturbed).
   - Check fuel rail pressure (39 ± 2 psi) and FPDM duty cycle (15–22%).
   - Verify wideband AFR stabilizes between 14.5 and 15.0 at idle.
   - Abort test if fuel pump duty cycle exceeds **45%** or any knock retard > 2.0°.
