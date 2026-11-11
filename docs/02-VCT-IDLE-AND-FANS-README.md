# README 02 — VCT Lockout, Idle, Dashpot & Cooling Fans (`SVTv29.26.hpt`)

> **Base File:** [`tunes/SVTv29.26.hpt`](../tunes/SVTv29.26.hpt)  
> **Follow [Master Build Guide](NIC_TUNE_BUILD_README.md) and [README 01](01-FUEL-ERFS-AND-DTC-README.md) first.**

These edits prevent exhaust-backpressure reversion glow (`1,500°F+`) under boost, stabilize idle with Deka 60 injectors and your lightweight single-mass flywheel, fix hanging decel RPM, and engage the high-speed cooling fan early in a tight turbo engine bay.

---

## 1. `[ECM 44412]` VCT Angle vs. RPM vs. Load (REVERSION & SPOOL FIX)

- **Search in Parameter Navigator:** `44412`
- **Full Navigator Path:** `Engine / Airflow / Variable Camshaft / Configuration / VCT Angle vs. RPM vs. Load`
- **Grid Size / Units:** `10 × 12` (`9 Load Rows × 11 RPM Columns`) — **`deg`**

### Why `SVTv29.26.hpt` Must Be Changed
`SVTv29.26.hpt` still runs **`-49.50°`** cam advance across `2,500–3,500 RPM` at Load `0.40–0.80` and keeps **`-15.00°` to `-29.00°`** active at `4,500–6,000 RPM` (plus a `+5.00°` glitch at `6,750 RPM / 0.20 Load`). Under turbo exhaust backpressure, overlap above `4,000 RPM` drives hot exhaust gas backward into the intake manifold and causes glowing turbo manifolds.

The **`v037` calibrated table** below preserves smooth low-RPM cam advance (`1,000–3,500 RPM`) for crisp turbo spool and locks VCT to a clean **`0.00°`** across **`4,500–7,200 RPM`** at every load.

### Exact Values to Set (`ECM 44412` — `v037` Table)

| Load \ RPM | `1,000` | `1,500` | `2,000` | `2,500` | `3,500` | `4,500` | `6,000` | `6,250` | `6,750` | `7,000` | `7,200` |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **`0.10`** | `0.00` | `-10.00` | `-15.00` | `-20.00` | `-15.00` | **`0.00`** | **`0.00`** | **`0.00`** | **`0.00`** | **`0.00`** | **`0.00`** |
| **`0.20`** | `-10.00` | `-15.00` | `-20.00` | `-25.00` | `-20.00` | **`0.00`** | **`0.00`** | **`0.00`** | **`0.00`** | **`0.00`** | **`0.00`** |
| **`0.30`** | `-10.00` | `-20.00` | `-25.00` | `-30.00` | `-25.00` | **`0.00`** | **`0.00`** | **`0.00`** | **`0.00`** | **`0.00`** | **`0.00`** |
| **`0.40`** | `-10.00` | `-20.00` | `-30.00` | `-35.00` | `-25.00` | **`0.00`** | **`0.00`** | **`0.00`** | **`0.00`** | **`0.00`** | **`0.00`** |
| **`0.50`** | `-10.00` | `-20.00` | `-30.00` | `-35.00` | `-25.00` | **`0.00`** | **`0.00`** | **`0.00`** | **`0.00`** | **`0.00`** | **`0.00`** |
| **`0.60`** | `-10.00` | `-15.00` | `-25.00` | `-30.00` | `-20.00` | **`0.00`** | **`0.00`** | **`0.00`** | **`0.00`** | **`0.00`** | **`0.00`** |
| **`0.70`** | `-10.00` | `-15.00` | `-25.00` | `-30.00` | `-20.00` | **`0.00`** | **`0.00`** | **`0.00`** | **`0.00`** | **`0.00`** | **`0.00`** |
| **`0.80`** | `-10.00` | `-15.00` | `-25.00` | `-28.00` | `-18.00` | **`0.00`** | **`0.00`** | **`0.00`** | **`0.00`** | **`0.00`** | **`0.00`** |
| **`1.00`** | `-10.00` | `-15.00` | `-20.00` | `-25.00` | `-15.00` | **`0.00`** | **`0.00`** | **`0.00`** | **`0.00`** | **`0.00`** | **`0.00`** |

### Copy-Paste Block (`9 × 11` Body Only)
Click the single white cell at **Row `0.10` / Column `1,000`** (do **NOT** select the Load or RPM headers), copy all 9 lines below, and press **`Ctrl + V`**:

```text
0.00	-10.00	-15.00	-20.00	-15.00	0.00	0.00	0.00	0.00	0.00	0.00
-10.00	-15.00	-20.00	-25.00	-20.00	0.00	0.00	0.00	0.00	0.00	0.00
-10.00	-20.00	-25.00	-30.00	-25.00	0.00	0.00	0.00	0.00	0.00	0.00
-10.00	-20.00	-30.00	-35.00	-25.00	0.00	0.00	0.00	0.00	0.00	0.00
-10.00	-20.00	-30.00	-35.00	-25.00	0.00	0.00	0.00	0.00	0.00	0.00
-10.00	-15.00	-25.00	-30.00	-20.00	0.00	0.00	0.00	0.00	0.00	0.00
-10.00	-15.00	-25.00	-30.00	-20.00	0.00	0.00	0.00	0.00	0.00	0.00
-10.00	-15.00	-25.00	-28.00	-18.00	0.00	0.00	0.00	0.00	0.00	0.00
-10.00	-15.00	-20.00	-25.00	-15.00	0.00	0.00	0.00	0.00	0.00	0.00
```

> Verify after pasting that `1,000`–`3,500 RPM` and `4,500`–`7,200 RPM` stayed aligned and the Load (`0.10`–`1.00`) and RPM (`1,000`–`7,200`) headers did **not** shift! Also verify `[ECM 44401]` (`Variable Camshaft`) = **`Enabled`**.

---

## 2. Idle Speed & Spark Damping (`ECM 44218`, `44217`, `47996`)

Single-mass flywheels, Deka 60 low-pulsewidth idle behavior, and electric fan engagement drop voltage/RPM harder at `850 RPM`, while `2.000` idle spark gain makes timing hunt back and forth.

| Search ECM | Exact Parameter Name & Navigator Path | `SVTv29.26.hpt` (Old) | Set Value To |
| :---: | :--- | :---: | :---: |
| **`44218`** | `Target Idle Speed Park/Neutral`<br>`Engine / Idle / RPM / Transmission Based Setpoint / Target Idle Speed Park/Neutral ` | `850` RPM | **`950`** RPM |
| **`44217`** | `Target Idle Speed Drive`<br>`Engine / Idle / RPM / Transmission Based Setpoint / Target Idle Speed Drive` | `850` RPM | **`950`** RPM |
| **`47996`** | `Idle Spark Proportional Gain`<br>`Engine / Spark / Advance / Idle Spark Advance / Idle Spark Proportional Gain` | `2.000` | **`1.000`** |

---

## 3. Return-to-Idle Dashpot Fix (`ECM 32984`, `ECM 32988`)

In `SVTv29.26.hpt`, `ECM 32984` has **`0.00`** decay at `0.0–0.6 lb/min`, which traps extra dashpot airflow when coming off throttle and causes rolling RPM hang when clutching in.

### A. `[ECM 32984]` Idle Dashpot Decay vs. Dashpot Airflow
- **Search in Parameter Navigator:** `32984`
- **Full Navigator Path:** `Engine / Idle / Airflow / Dashpot Airflow / Idle Dashpot Decay vs. Dashpot Airflow`
- **Grid Size / Units:** `8 × 2` (`lb/min`)

| Row | Dashpot Airflow (`lb/min`) | `SVTv29.26.hpt` (Old) | Set Decay To | Action |
| :---: | :---: | :---: | :---: | :--- |
| 1 | `0.0` | `0.00` | **`0.02`** | **CHANGE** |
| 2 | `0.2` | `0.00` | **`0.03`** | **CHANGE** |
| 3 | `0.4` | `0.00` | **`0.04`** | **CHANGE** |
| 4 | `0.6` | `0.00` | **`0.05`** | **CHANGE** |
| 5 | `0.8` | `0.06` | `0.06` | Keep |
| 6 | `1.0` | `0.08` | `0.08` | Keep |
| 7 | `3.0` | `0.10` | `0.10` | Keep |

### B. `[ECM 32988]` Idle Dashpot Pre-Position vs. RPM
- **Search in Parameter Navigator:** `32988`
- **Full Navigator Path:** `Engine / Idle / Airflow / Dashpot Airflow / Idle Dashpot Pre-Position vs. RPM`
- **Grid Size / Units:** `7 × 2` (`RPM` -> **`lb/min`**)

| Row | RPM | `SVTv29.26.hpt` (Old) | Set Pre-Position (`lb/min`) To | Action |
| :---: | :---: | :---: | :---: | :--- |
| 1 | `0` | `0.04` | `0.04` | Keep |
| 2 | `150` | `0.04` | `0.04` | Keep |
| 3 | `1,150` | `0.35` | `0.35` | Keep |
| 4 | **`2,150`** | `0.78` | **`0.55`** | **CHANGE** |
| 5 | **`3,150`** | `1.11` | **`0.80`** | **CHANGE** |
| 6 | **`4,150`** | `1.50` | **`1.00`** | **CHANGE** |

---

## 4. Cooling Fan High-Speed Thresholds (`ECM 24030`, `24031`, `24035`)

`SVTv29.26.hpt` **already** has Low Speed fans lowered (`195.0°F` Enable / `190.0°F` Disable), so leave Low Speed alone and lower High Speed (`225/215/235°F` -> `205/199/205°F`) so turbo underhood heat doesn't build.

| Search ECM | Exact Parameter Name & Navigator Path | `SVTv29.26.hpt` Value | Set To | Action |
| :---: | :--- | :---: | :---: | :--- |
| **`24020`** | `Fan Low Speed Enable ECT`<br>`System / Fans / Control By ECT / Fan Low Speed Enable ECT` | `195.0 °F` | `195.0 °F` | **VERIFY & KEEP** |
| **`24021`** | `Fan Low Speed Disable ECT`<br>`System / Fans / Control By ECT / Fan Low Speed Disable ECT` | `190.0 °F` | `190.0 °F` | **VERIFY & KEEP** |
| **`24030`** | `Fan High Speed Enable ECT`<br>`System / Fans / Control By ECT / Fan High Speed Enable ECT` | `225.0 °F` | **`205.0 °F`** | **CHANGE** |
| **`24031`** | `Fan High Speed Disable ECT`<br>`System / Fans / Control By ECT / Fan High Speed Disable ECT` | `215.0 °F` | **`199.0 °F`** | **CHANGE** |
| **`24035`** | `Fan High Speed High Load Enable ECT`<br>`System / Fans / Control By ECT / Fan High Speed High Load Enable ECT` | `235.0 °F` | **`205.0 °F`** | **CHANGE** |
| **`45804`** | `Electric Fan Enabled`<br>`System / Fans / Hardware / Electric Fan Enabled` | `Enabled` | `Enabled` | **VERIFY & KEEP** |
| **`44224`** | `Fan High Speed Idle`<br>`Engine / Idle / RPM / Idle Adders / Fan High Speed Idle` | `Enabled` | `Enabled` | **VERIFY & KEEP** |

---

**Next Step -> [README 03 — Verify & Keep Checklist (Do Not Break)](03-VERIFY-AND-KEEP-CHECKLIST-README.md)**
