# README 01 — Returnless Fuel, Closed Loop & DTCs (`SVTv29.26.hpt`)

> **Base File:** [`tunes/SVTv29.26.hpt`](../tunes/SVTv29.26.hpt)  
> **Follow [`tunes/v000-initial-start-README.md`](../tunes/v000-initial-start-README.md) or [Master Build Guide](NIC_TUNE_BUILD_README.md) first** so you are working in `v000-initial-start.hpt` with `psi`, `°F`, and `Lambda` units active.

These **5 edits** fix the broken return-style assumptions inside `SVTv29.26.hpt` so your factory Electronic Returnless Fuel System (ERFS) controls rail pressure dynamically, enters Closed Loop cleanly at idle/light cruise, starts without flooding above `64°F`, eliminates `2,500 RPM` lean pockets, and alerts you if the FRPS or upstream O2 sensor fails.

---

## 1. `[ECM 7596]` Fuel Pressure Sensor Transfer Function (CRITICAL ERFS FIX)

- **Search in Parameter Navigator:** `7596`
- **Full Navigator Path:** `Fuel System / General / Fuel Pressure Sensor / Fuel Pressure Sensor Transfer Function`
- **Grid Size / Units:** `8 × 2` table (`AD Counts` -> **`psi`**)

### What `SVTv29.26.hpt` Currently Has (BROKEN for Returnless)
Every row from `0` to `1,023` A/D counts is flattened to **`40`** psi. That blinds the PCM to real fuel rail pressure changes under vacuum and boost on a returnless rail.

### Exact Values to Set (`ECM 7596`)

| Row | AD Counts (Left Column — Leave Alone) | `SVTv29.26.hpt` (Old) | Set Pressure (`psi`) To |
| :---: | :---: | :---: | :---: |
| 1 | `0` | `40` | **`0.00`** |
| 2 | `0` | `40` | **`0.00`** |
| 3 | `0` | `40` | **`0.00`** |
| 4 | `0` | `40` | **`0.00`** |
| 5 | `102` (~0.50 V) | `40` | **`0.00`** |
| 6 | `921` (~4.50 V) | `40` | **`70.00`** |
| 7 | `1,023` (~5.00 V) | `40` | **`78.72`** |

> **Important Check:** Verify the left `AD Counts` column reads `0, 0, 0, 0, 102, 921, 1,023` and set only the right column (`0.00, 0.00, 0.00, 0.00, 0.00, 70.00, 78.72`). *(If an alternate table view ever shows `307`, `512`, `716` in rows 2–4 instead of duplicate `0`s, the matching linear values for those counts are `17.50`, `35.00`, `52.50` psi.)*

---

## 2. `[ECM 32731]` Open Loop Fuel TPS Thresh vs. RPM (FIXES STUCK OPEN LOOP)

- **Search in Parameter Navigator:** `32731`
- **Full Navigator Path:** `Engine / Fuel / Open Loop / Base / Open Loop / Open Loop Fuel TPS Thresh vs. RPM`
- **Grid Size / Units:** `8 × 2` table (`RPM` -> **`TPS A/D Counts`**)

### Why You Must Change This
On a Focus SVT, closed-throttle idle sits around **`~180–184` A/D counts** (`Throttle Position ADC (Absolute)`). In `SVTv29.26.hpt`, all rows are set to **`0.00`** counts — which forces the PCM into **`Power Demand Enrich` (Open Loop)** even at idle and gentle cruise, preventing Closed Loop fuel learning (`STFT`) from ever activating!

### Exact Values to Set (`ECM 32731`)

| Row | RPM Breakpoint | `SVTv29.26.hpt` (Old) | Set Threshold (`counts`) To | Why |
| :---: | :---: | :---: | :---: | :--- |
| 1 | `0` | `0.00` | **`200.00`** | Above `~182` closed-throttle idle -> enables warm Closed Loop idle |
| 2 | `1,500` | `0.00` | **`200.00`** | Keeps gentle off-idle taper in Closed Loop |
| 3 | `2,000` | `0.00` | **`350.00`** | (~34% TPS) Stops premature Open Loop dump during light 2,000 RPM cruise |
| 4 | `2,500` | `0.00` | **`350.00`** | (~34% TPS) Keeps steady 2,500 RPM light cruise in Closed Loop stoich |
| 5 | `5,500` | `0.00` | **`0.00`** (Keep) | Immediate Open Loop power enrichment above 5,500 RPM |
| 6 | `6,500` | `0.00` | **`0.00`** (Keep) | Immediate Open Loop power enrichment |
| 7 | `16,384` | `0.00` | **`0.00`** (Keep) | High-RPM clamp unchanged |

> **Log Check:** On your first KOEO/idle log, check `Throttle Position ADC (Absolute)`. If your physical throttle body stop reads higher than `190` counts at idle, set `0` and `1,500 RPM` to `idle_counts + 20`. Any real throttle push past ~34% (`350` counts) or any RPM >= 5,500 still drops right back into safe rich boost fueling (`0.73–0.75` lambda).

---

## 3. `[ECM 44519]` Fuel Cranking vs. ECT (REMOVES 64°F FLOOD CLIFF)

- **Search in Parameter Navigator:** `44519`
- **Full Navigator Path:** `Engine / Fuel / General / Cranking Fuel / Fuel Cranking vs. ECT`
- **Grid Size / Units:** `13 × 2` table (`°F` -> **`Lambda`**) — **VERIFY UNITS ARE `Lambda`!**

### What `SVTv29.26.hpt` Currently Has (DROWNING CLIFF AT 64°F)
Between `63.99°F` (`0.930` lambda) and `64.00°F` (`0.335` lambda, ~4.9:1 gas AFR!), `SVTv29.26.hpt` nearly triples cranking fuel in one degree — drowning plugs on mild `64–120°F` days.

### Exact Values to Set (`ECM 44519`)

| Row | ECT (`°F`) | `SVTv29.26.hpt` (Old) | Set Target (`Lambda`) To | Action |
| :---: | :---: | :---: | :---: | :--- |
| 1 | `-20.000` | `0.850` | `0.850` | Keep |
| 2 | `0.000` | `0.857` | `0.857` | Keep |
| 3 | `20.000` | `0.870` | `0.870` | Keep |
| 4 | `30.000` | `0.877` | `0.877` | Keep |
| 5 | `40.000` | `0.886` | `0.886` | Keep |
| 6 | `63.990` | `0.930` | `0.930` | Keep |
| 7 | **`64.000`** | `0.335` | **`0.930`** | **CHANGE** |
| 8 | **`90.000`** | `0.430` | **`0.950`** | **CHANGE** |
| 9 | **`120.000`** | `0.647` | **`0.970`** | **CHANGE** |
| 10 | **`150.000`** | `0.764` | **`0.985`** | **CHANGE** |
| 11 | `180.000` | `1.000` | `1.000` | Keep |
| 12 | `220.000` | `1.000` | `1.000` | Keep |

> **Tuning Note:** `0.930` at `60°F` has already been verified on Deka 60 injectors for crisp catching without flooding. If your engine ever takes extra cranking revolutions on warm restarts (`64–120°F`), step `64 / 90 / 120°F` richer carefully in small `-0.03` lambda increments (for example `0.90 / 0.92 / 0.95`) — never return to `0.335`.

---

## 4. `[ECM 44511]` Fuel Base vs. RPM vs. TPS (FIXES 2,500 RPM LEAN POCKETS)

- **Search in Parameter Navigator:** `44511`
- **Full Navigator Path:** `Engine / Fuel / Open Loop / Base / Base Fuel / Fuel Base vs. RPM vs. TPS`
- **Grid Size / Units:** `9 × 11` (`8 TPS Rows × 10 RPM Columns`) — **VERIFY UNITS ARE `Lambda`!**

### Exact Cells to Edit (`ECM 44511`)
At `2,500 RPM` and light-to-part throttle (`15.6%` and `19.5%` TPS), `SVTv29.26.hpt` commands **`1.07` and `1.14` lambda** (lean of stoich under part-throttle spool/transition!). You must zero out those lean pockets while **leaving every boost/WOT row (`31.2%`–`68.4%` TPS at `0.73–0.80` lambda) untouched**.

1. **REQUIRED Edits:**
   - Row **`15.6`** (`15.625%` TPS), Column **`2,500` RPM**: change **`1.07`** -> **`1.00`**
   - Row **`19.5`** (`19.531%` TPS), Column **`2,500` RPM**: change **`1.14`** -> **`1.00`**
2. **OPTIONAL Light-Cruise Cleanup (Recommended, or verify after cruise STFT log):**
   - Column **`3,500` RPM**, Row **`15.6`**: **`1.02`** -> **`1.00`**
   - Column **`3,500` RPM**, Row **`19.5`**: **`1.02`** -> **`1.00`**
   - Column **`3,500` RPM**, Row **`23.4`**: **`1.03`** -> **`1.00`**

### Full `SVTv29.26.hpt` Reference Table (`ECM 44511`, Required `2,500 RPM` Edits Highlighted)

| TPS % \ RPM | `1,000` | `2,500` | `3,500` | `4,000` | `4,500` | `5,000` | `5,500` | `6,000` | `6,500` | `7,400` |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **`15.6`** | `1.00` | ~~1.07~~ -> **`1.00`** | `1.02` *(opt 1.00)* | `1.00` | `1.00` | `1.00` | `1.00` | `1.00` | `1.00` | `1.00` |
| **`19.5`** | `1.00` | ~~1.14~~ -> **`1.00`** | `1.02` *(opt 1.00)* | `0.85` | `1.00` | `1.00` | `1.00` | `1.00` | `1.00` | `1.00` |
| **`23.4`** | `1.00` | `1.00` | `1.03` *(opt 1.00)* | `0.85` | `1.00` | `1.00` | `1.00` | `1.00` | `1.00` | `1.00` |
| **`31.2`** | `1.00` | `0.80` | `0.80` | `0.73` | `0.75` | `0.75` | `0.75` | `0.75` | `0.75` | `0.75` |
| **`35.2`** | `0.80` | `0.80` | `0.80` | `0.73` | `0.75` | `0.75` | `0.75` | `0.75` | `0.75` | `0.75` |
| **`39.1`** | `0.80` | `0.73` | `0.73` | `0.73` | `0.73` | `0.74` | `0.74` | `0.74` | `0.74` | `0.74` |
| **`53.7`** | `0.80` | `0.75` | `0.75` | `0.74` | `0.73` | `0.74` | `0.74` | `0.74` | `0.75` | `0.74` |
| **`68.4`** | `0.80` | `0.75` | `0.75` | `0.74` | `0.74` | `0.74` | `0.74` | `0.74` | `0.75` | `0.74` |

---

## 5. `[ECM 50]` Master DTC List (RESTORE FRPS & UPSTREAM O2 SAFETY CODES)

- **Search in Parameter Navigator:** `50`
- **Full Navigator Path:** `Engine Diagnostics / DTCs / List / Master DTC List`
- **Why:** Chuck disabled fuel rail pressure codes (`P0190`, `P0192`, `P0193`) and upstream O2 rich circuit reporting (`P0132`) for a return-rail conversion. With live returnless ERFS control restored, the PCM **must** flag FRPS wiring/rail faults and pegged-rich O2 faults immediately.

### Exact DTC Rows to Set (`ECM 50`)

| Code | Description | `SVTv29.26.hpt` (Old) | Set Reporting Mode To |
| :---: | :--- | :---: | :---: |
| **`P0190`** | Fuel Rail Pressure Sensor A Circuit | `No Error Reported` | **`MIL Light`** |
| **`P0192`** | Fuel Rail Pressure Sensor A Circuit Low | `No Error Reported` | **`MIL Light`** |
| **`P0193`** | Fuel Rail Pressure Sensor A Circuit High | `No MIL Light` | **`MIL Light`** |
| **`P0132`** | O2 Circuit High Voltage (Bank 1, Sensor 1) | `No Error Reported` | **`MIL Light`** |

### Safety DTCs to Verify Are ALREADY `MIL Light` (DO NOT DISABLE)
`P0171` (Too Lean B1), `P0172` (Too Rich B1), `P0300`–`P0304` (Misfires), `P0320` (RPM/CKP Input), `P0325` (Knock Sensor 1 Circuit), `P1130`, `P1131`, `P1132` (Upstream HO2S switching faults). Leave catless rear-O2 / deleted-IMRC codes as already set in `SVTv29.26.hpt` unless hardware differs.

---

**Next Step -> [README 02 — VCT Lockout, Idle/Dashpot & Cooling Fans](02-VCT-IDLE-AND-FANS-README.md)**
