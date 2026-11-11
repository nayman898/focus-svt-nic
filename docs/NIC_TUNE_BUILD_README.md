# Nic's Focus SVT Turbo — Master VCM Editor Navigator Build Guide

> **Active Base Tune:** [`tunes/SVTv29.26.hpt`](../tunes/SVTv29.26.hpt) (`212,349` bytes, SHA-256 `45F07925F65D03FB08B91D8B9BB88BD8E29DBC4E4AF48170472DBCDB5B0F63E0`)  
> **Target Vehicle:** 2003 Ford Focus SVT (`Black Oak / UJAHAS3 / ZED0`), stock 10.2:1 bottom end, SPA .64 turbo, **factory Electronic Returnless Fuel System (ERFS)**, Siemens Deka 60 lb/hr injectors (`107961`), OEM SVT MAF + DiabloSport MAFia in 2.75" draw-through intake, single-mass flywheel.

This guide walks through how **you build and own your `v000` initial start tune** (`tunes/v000-initial-start.hpt`) in HP Tuners VCM Editor starting from [`tunes/SVTv29.26.hpt`](../tunes/SVTv29.26.hpt). *(For the condensed single-page `v000` sheet, see [`tunes/v000-initial-start-README.md`](../tunes/v000-initial-start-README.md).)*

Why not flash `SVTv29.26.hpt` as-is? `SVTv29.26.hpt` already has your **Siemens Deka 60 lb injector data**, **ERFS pump PID**, **0.484 vacuum multiplier**, and **safe 10.75°–11.50° full-boost spark**, **EXCEPT** it was modified for a **return-style** fuel rail (flat `40 psi` FRPS lookup, `0.00` closed-loop TPS threshold, suppressed FRPS/O2 fault codes, `-49.5°` boost VCT overlap, a 64°F cranking flood cliff, 2,500 RPM lean pockets, `0.00` dashpot decay, and `225°F` high fan).

Follow the three README guides below in order. **Never modify `SVTv29.26.hpt` in place.**

---

## Step 0 — Mandatory Physical Checks Before Flashing

1. **Pull and back up your car's current ECU read first** using [First Connection Guide](first-connection.md) -> save untouched copy to `backups/`.
2. **Confirm DiabloSport MAFia dial setting** physically under the hood (`0` passthrough vs `1/2/...` stepped scaling). **Do not edit MAF (`ECM 12163`)** until dial position and your first warm idle STFT log are reviewed.
3. **Check FRPS vacuum reference hose** on the fuel rail: make sure the hose is connected and completely dry inside (any raw fuel smell/droplets = ruptured FRPS diaphragm; replace before starting).
4. **Confirm mechanical wastegate spring (5–7 psi):** Stock 10.2:1 Focus SVT powdered-metal rods cannot tolerate uncontrolled boost spikes. Verify vacuum line to the wastegate actuator is leak-free.
5. **Confirm stable battery voltage (> 12.2V):** Connect a battery charger/tender during every ECU read/write (`Black Oak EEC-V`).

---

## Step 1 — Create Your Working File & Check VCM Editor Units

1. Open **HP Tuners VCM Editor**.
2. Open [`tunes/SVTv29.26.hpt`](../tunes/SVTv29.26.hpt).
3. Immediately click **File -> Save As...** and save a new copy as:
   `tunes/v000-initial-start.hpt`
4. Verify your display units before touching a single cell so every number in these READMEs matches your screen:
   - **Pressure:** `psi`
   - **Temperature:** `°F`
   - **Fuel / Equivalence:** `Lambda` (`1.00` = stoichiometric; `< 1.00` = richer; `> 1.00` = leaner — **never enter AFR like `14.7` into a Lambda table**)
   - **Airflow:** `lb/min` (or `lb/s` on injector flow high/low)
   - **Angle / Timing:** `deg`

---

## Step 2 — How to Search by ECM Number in Parameter Navigator

1. Open **Parameter Navigator** (`Edit -> Parameter Navigator` or **`Ctrl + Shift + N`**).
2. Click inside the **Search / Filter** box at the top of Parameter Navigator.
3. Type **only the numeric ECM ID** (for example: `7596` or `44412`).
   - *Tip:* If your VCM Editor view filters only by parameter text unless ID display/search is enabled, use the exact **Parameter Name & Tree Path** printed beside every `ECM xxxxx` ID in the guides, double-click to open the parameter, and confirm `[ECM] xxxxx` in the popup window's title bar (`[ECM] 7596 - Fuel Pressure Sensor Transfer Function`).
4. **Table editing rule:** On 2D/3D tables (`ECM 7596`, `44412`, `44511`, etc.), **never overwrite grey axis headers** (top RPM/volts header or left Load/TPS/ECT header) unless specifically instructed. Click into the white interior data cells, type the value, and press **`Enter`**. For `ECM 44412`, you can copy the entire `9 × 11` tab-delimited block provided, click the top-left white cell (`Load 0.10` / `1,000 RPM`), and press **`Ctrl + V`**.

---

## Step 3 — Edit & Verification Modules (Do In Order)

| Guide | What You Will Do | Parameters Covered |
| :--- | :--- | :--- |
| **[01 — Fuel, Closed Loop & DTCs](01-FUEL-ERFS-AND-DTC-README.md)** | Restore ERFS pressure sensing, fix idle/cruise Closed Loop entry, remove the 64°F cranking drowning cliff & 2,500 RPM lean pockets, re-enable safety MILs | **`ECM 7596`**, **`32731`**, **`44519`**, **`44511`**, **`50`** |
| **[02 — VCT, Idle, Dashpot & Cooling Fans](02-VCT-IDLE-AND-FANS-README.md)** | Lock boost VCT to `0.00°` above 4,500 RPM, raise idle for lightweight flywheel & Deka 60s, stop idle timing hunt & RPM hang, lower high-speed radiator fan | **`ECM 44412`**, **`44218`**, **`44217`**, **`47996`**, **`32984`**, **`32988`**, **`24030`**, **`24031`**, **`24035`** |
| **[03 — Verify & Keep Checklist](03-VERIFY-AND-KEEP-CHECKLIST-README.md)** | Confirm `SVTv29.26.hpt` still holds Deka 60 injector data, `0.484` vacuum multiplier, FPDM PID, conservative `10.75°–11.50°` boost spark, and `7,400` rev limit — **DO NOT CHANGE** | **`ECM 6950`**, **`43000`**, **`12010–12016`**, **`32047`**, **`32050`**, **`45693–45694`**, **`6960–6961`**, **`23000–23002`**, **`6002`**, **`4233–4234`**, **`44205`**, **`12115`**, **`12163`**, **`44583`**, **`32265`**, **`2070`**, **`44473`**, **`24020–24021`**, **`45804`**, **`44224`**, **`44401`** |

---

## Quick Master Checklist (`SVTv29.26.hpt` -> `v000-initial-start.hpt`)

- [ ] **`ECM 7596`** (`Fuel Pressure Sensor Transfer Function`): Replace flat `40` psi table with `0 / 0 / 0 / 0 / 0 / 70.00 / 78.72 psi`
- [ ] **`ECM 32731`** (`Open Loop Fuel TPS Thresh vs. RPM`): Lift `0` & `1,500 RPM` from `0.00` to `200.00`; `2,000` & `2,500 RPM` from `0.00` to `350.00`
- [ ] **`ECM 44519`** (`Fuel Cranking vs. ECT`): Smooth `64–150°F` (`0.335/0.430/0.647/0.764` -> `0.930/0.950/0.970/0.985` lambda)
- [ ] **`ECM 44511`** (`Fuel Base vs. RPM vs. TPS`): Fix `2,500 RPM` lean pockets (`15.6% TPS: 1.07 -> 1.00`, `19.5% TPS: 1.14 -> 1.00`)
- [ ] **`ECM 50`** (`Master DTC List`): Set `P0190`, `P0192`, `P0193`, and `P0132` to `MIL Light`
- [ ] **`ECM 44412`** (`VCT Angle vs. RPM vs. Load`): Apply full `v037` `9 × 11` lockout (`0.00°` across `4,500–7,200 RPM`)
- [ ] **`ECM 44218` & `44217`** (`Target Idle Speed P/N` & `Drive`): `850 -> 950 RPM`
- [ ] **`ECM 47996`** (`Idle Spark Proportional Gain`): `2.000 -> 1.000`
- [ ] **`ECM 32984`** (`Idle Dashpot Decay vs. Dashpot Airflow`): Set `0.0–0.6 lb/min` from `0.00` to `0.02, 0.03, 0.04, 0.05`
- [ ] **`ECM 32988`** (`Idle Dashpot Pre-Position vs. RPM`): Trim `2,150 / 3,150 / 4,150 RPM` (`0.78 / 1.11 / 1.50` -> `0.55 / 0.80 / 1.00`)
- [ ] **`ECM 24030`, `24031`, `24035`** (`High Speed Fan ECTs`): `225 / 215 / 235°F` -> `205.0 / 199.0 / 205.0°F`
- [ ] Run full **[03 — Verify & Keep Checklist](03-VERIFY-AND-KEEP-CHECKLIST-README.md)** before saving

---

## Step 4 — Mandatory Compare Verification Before Flashing

1. With `v000-initial-start.hpt` open, press **`Ctrl + S`** to save.
2. Click **Compare -> Open Compare File...** and select [`tunes/SVTv29.26.hpt`](../tunes/SVTv29.26.hpt).
3. Click **Compare -> View Comparison Log**.
4. Confirm **ONLY** the parameters listed in the Master Checklist above (plus `Calibration Details -> Notes`, if you document your build) appear in the Comparison Log.
   - If you see `12010`, `12011`, `12012`, `12015`, `12016`, `12163`, `32050`, `44205`, `44583`, or `6950` in the diff list, **STOP — revert that parameter from the compare file before closing!**
5. Close and **re-open `tunes/v000-initial-start.hpt` from disk** once to confirm your saved edits persisted cleanly.

---

## Step 5 — First Flash, Idle Log & Hard Abort Rules

1. Open **VCM Scanner** and load [`profiles/Focus_SVT_Returnless_Boost.Channels.xml`](../profiles/Focus_SVT_Returnless_Boost.Channels.xml).
2. Flash `tunes/v000-initial-start.hpt` with a battery charger connected.
3. Turn Key ON (KOEO) and scan before cranking:
   - Coolant (`ECT`) and `IAT` should read near ambient temperature.
   - `Fuel Rail Pressure` should read realistic `~35–45 psi` when primed (NOT stuck at `40.0 psi` with zero movement).
   - Battery voltage `> 12.2 V`.
4. Crank and let the engine warm up **at stationary idle only** until **`ECT >= 180°F`** and verify **Low Fan (`195°F`)** and **High Fan (`205°F`)** cycle smoothly with no stall or wild RPM hunting.
5. **Do not drive under boost yet.** Export your idle `.hpl` + `.csv` log to `logs/` and review warm STFT + fuel rail pressure behavior first.

### Immediate Abort Thresholds (Lift Immediately / Shut Down)
- **FPDM Duty Cycle `>= 45.0%`** (PCM ceiling is `48.0%`, meaning pump capacity is nearly exhausted)
- **Wideband Lambda `> 0.80`** (`> 11.75:1` gas) above `3 psi` boost
- **Knock Retard `> 1.5°–2.0°`**
- **Peak Boost `> 8.0 psi`** on first test spring
- **Coolant Temp `> 220°F`**
