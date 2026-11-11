# `v000` Initial Start Tune README — Build `v000-initial-start.hpt` from `SVTv29.26.hpt`

> **Base File to Open:** [`SVTv29.26.hpt`](SVTv29.26.hpt) (`212,349` bytes, `UJAHAS3 / ZED0`)  
> **Target File to Save As:** `tunes/v000-initial-start.hpt`  
> **Goal:** Get Nic's turbo Focus SVT cranking cleanly, firing up without flooding, idling smoothly, reading real returnless fuel rail pressure, entering Closed Loop, and cooling reliably — with stock 10.2:1 rods protected.

---

## Step 0 — Quick Pre-Flight Hardware Checks (Before Flashing)

1. **Back up what is currently in your ECU first** using [`docs/first-connection.md`](../docs/first-connection.md) -> save untouched to `backups/`.
2. **Pull & inspect the FRPS vacuum reference hose** on the fuel rail: make sure it is hooked up and **completely dry inside** (any wet fuel = failed FRPS diaphragm).
3. **Check the DiabloSport MAFia dial** physically and write down the number (`0` vs `1` vs `2`+). **Leave `ECM 12163` (MAF) untouched in `v000`** until the dial setting and first warm-idle STFT log are checked.
4. **Confirm wastegate spring (`5–7 psi`)** and intact wastegate vacuum hose.
5. **Hook up a battery charger/tender** (`> 12.2 V` required for safe Ford `Black Oak EEC-V` flashing).

---

## Step 1 — Create `v000-initial-start.hpt` & Set VCM Editor Units

1. Open **HP Tuners VCM Editor** and open [`tunes/Current Tune.hpt`](Current Tune.hpt).
2. Immediately click **File -> Save As...** and save as:
   `tunes/v000-initial-start.hpt`
   *(Never overwrite `Current Tune.hpt` in place.)*
3. Confirm your VCM Editor units match these before editing any cell:
   - **Pressure:** `psi`
   - **Temperature:** `°F`
   - **Fuel Base / Cranking:** **`Lambda`** (`1.00` = stoichiometric; `< 1.00` = richer; `> 1.00` = leaner — **never enter AFR like `14.7` into a Lambda cell**)
   - **Airflow / Flow:** `lb/min` (`lb/s` for injector flow high/low)
   - **Timing / Cam Angle:** `deg`

---

## Step 2 — Search Each ECM Number in Parameter Navigator

Open **Parameter Navigator** (`Edit -> Parameter Navigator` or **`Ctrl + Shift + N`**) and type the **numeric `ECM` ID** (or use the exact Name & Tree Path beside it). Double-click to open and confirm `[ECM] xxxxx` in the window title bar.

> **Table Editing Rule:** Never overwrite grey top/left axis headers. Edit only white data cells and press **`Enter`**.

---

## Step 3 — Every `ECM` Number You Must Change for `v000` (In Order)

### A. Returnless Fuel Pressure, Cranking & Closed Loop (Gets It Started Cleanly)

#### 1. `[ECM 7596]` — `Fuel Pressure Sensor Transfer Function` (`8 × 2`, **`psi`**)
- **Navigator Search:** `7596` (`Fuel System / General / Fuel Pressure Sensor / Fuel Pressure Sensor Transfer Function`)
- **Current in `SVTv29.26.hpt`:** Every row (`0, 0, 0, 0, 102, 921, 1,023` AD counts) is flat at **`40` psi**. That blinds the FPDM on a returnless rail.
- **Set Right Column (`psi`) To:**
  - `0` Counts -> **`0.00`**
  - `0` Counts -> **`0.00`**
  - `0` Counts -> **`0.00`**
  - `0` Counts -> **`0.00`**
  - `102` Counts (~0.50 V) -> **`0.00`**
  - `921` Counts (~4.50 V) -> **`70.00`**
  - `1,023` Counts (~5.00 V) -> **`78.72`**
  *(If an alternate view displays `307, 512, 716` in rows 2–4 instead of `0`, use `17.50, 35.00, 52.50` psi.)*

#### 2. `[ECM 44519]` — `Fuel Cranking vs. ECT` (`13 × 2`, **`Lambda`**)
- **Navigator Search:** `44519` (`Engine / Fuel / General / Cranking Fuel / Fuel Cranking vs. ECT`)
- **Why:** `SVTv29.26.hpt` drops from `0.930` (`63.99°F`) to **`0.335` (`64.00°F`)** — ~4.9:1 AFR! Removing that `64°F` cliff prevents flooding spark plugs on startup.
- **Exact Edits:**
  - Keep `-20.000°F (0.850)`, `0.000°F (0.857)`, `20.000°F (0.870)`, `30.000°F (0.877)`, `40.000°F (0.886)`, `63.990°F (0.930)` unchanged
  - **`64.000°F`**: `0.335` -> **`0.930`**
  - **`90.000°F`**: `0.430` -> **`0.950`**
  - **`120.000°F`**: `0.647` -> **`0.970`**
  - **`150.000°F`**: `0.764` -> **`0.985`**
  - Keep `180.000°F` and `220.000°F` at **`1.000`**

#### 3. `[ECM 32731]` — `Open Loop Fuel TPS Thresh vs. RPM` (`8 × 2`, **`A/D Counts`**)
- **Navigator Search:** `32731` (`Engine / Fuel / Open Loop / Base / Open Loop / Open Loop Fuel TPS Thresh vs. RPM`)
- **Why:** Closed-throttle idle sits around `180–184` A/D counts. `SVTv29.26.hpt` has `0.00` across every RPM row, locking idle permanently into Open Loop `Power Demand Enrich`.
- **Exact Edits:**
  - **`0 RPM`**: `0.00` -> **`200.00`**
  - **`1,500 RPM`**: `0.00` -> **`200.00`**
  - **`2,000 RPM`**: `0.00` -> **`350.00`**
  - **`2,500 RPM`**: `0.00` -> **`350.00`**
  - Keep `5,500 / 6,500 / 16,384 RPM` at **`0.00`**
  *(Check logged `Throttle Position ADC (Absolute)` at warm idle: if your stop reads > 190 counts, set `0` and `1,500 RPM` to `idle_counts + 20`.)*

#### 4. `[ECM 44511]` — `Fuel Base vs. RPM vs. TPS` (`9 × 11`, **`Lambda`**)
- **Navigator Search:** `44511` (`Engine / Fuel / Open Loop / Base / Base Fuel / Fuel Base vs. RPM vs. TPS`)
- **Exact Edits (Fix `2,500 RPM` Lean Pockets Only):**
  - Row **`15.6%`** TPS, Column **`2,500` RPM**: `1.07` -> **`1.00`**
  - Row **`19.5%`** TPS, Column **`2,500` RPM**: `1.14` -> **`1.00`**
  - *(Optional light-cruise cleanup: Column `3,500 RPM` at `15.6% (1.02)`, `19.5% (1.02)`, `23.4% (1.03)` -> `1.00`.)*
  - **Keep all `31.2%–68.4%` boost/WOT rows untouched (`0.73–0.80` lambda).**

#### 5. `[ECM 50]` — `Master DTC List` (`164 × 3`)
- **Navigator Search:** `50` (`Engine Diagnostics / DTCs / List / Master DTC List`)
- **Why:** Re-enables FRPS and upstream O2 fault reporting so the PCM alerts you if rail pressure or O2 fails.
- **Exact Edits (Set to `MIL Light`):**
  - **`P0190`** (FRPS Circuit A): `No Error Reported` -> **`MIL Light`**
  - **`P0192`** (FRPS Circuit A Low): `No Error Reported` -> **`MIL Light`**
  - **`P0193`** (FRPS Circuit A High): `No MIL Light` -> **`MIL Light`**
  - **`P0132`** (O2 Circuit High Voltage B1S1): `No Error Reported` -> **`MIL Light`**
  - Confirm `P0171`, `P0172`, `P0300–P0304`, `P0320`, `P0325`, `P1130–P1132` stay **`MIL Light`**.

---

### B. Idle Stability, VCT Lockout & Cooling Fans (Keeps It Idling & Protected)

#### 6–8. Idle Targets & Spark Damping (`ECM 44218`, `44217`, `47996`)
- **`ECM 44218`** (`Target Idle Speed Park/Neutral`, `Engine / Idle / RPM / Transmission Based Setpoint / ...`): `850` -> **`950` RPM**
- **`ECM 44217`** (`Target Idle Speed Drive`, `Engine / Idle / RPM / Transmission Based Setpoint / ...`): `850` -> **`950` RPM**
- **`ECM 47996`** (`Idle Spark Proportional Gain`, `Engine / Spark / Advance / Idle Spark Advance / ...`): `2.000` -> **`1.000`** *(eliminates idle timing hunt)*

#### 9–10. Idle Dashpot Decay & Pre-Position (`ECM 32984`, `32988`)
- **`ECM 32984`** (`Idle Dashpot Decay vs. Dashpot Airflow`, `Engine / Idle / Airflow / Dashpot Airflow / ...`, `lb/min`):
  - `0.0`: `0.00` -> **`0.02`** | `0.2`: `0.00` -> **`0.03`** | `0.4`: `0.00` -> **`0.04`** | `0.6`: `0.00` -> **`0.05`**
  - Keep `0.8 (0.06)`, `1.0 (0.08)`, `3.0 (0.10)`.
- **`ECM 32988`** (`Idle Dashpot Pre-Position vs. RPM`, `Engine / Idle / Airflow / Dashpot Airflow / ...`, `lb/min`):
  - Keep `0 (0.04)`, `150 (0.04)`, `1,150 (0.35)`
  - `2,150 RPM`: `0.78` -> **`0.55`** | `3,150 RPM`: `1.11` -> **`0.80`** | `4,150 RPM`: `1.50` -> **`1.00`**

#### 11. `[ECM 44412]` — `VCT Angle vs. RPM vs. Load` (`10 × 12` -> `9 × 11` body, **`deg`**)
- **Navigator Search:** `44412` (`Engine / Airflow / Variable Camshaft / Configuration / VCT Angle vs. RPM vs. Load`)
- **Why:** `SVTv29.26.hpt` commands `-49.50°` in boost and keeps `-15°` to `-29°` active at `4,500–6,000 RPM`, causing extreme exhaust reversion heat. Click the single white cell at **Load `0.10` / `1,000 RPM`** (do NOT select axis headers), copy the `9 × 11` block below (`1,000` to `7,200 RPM`), and press **`Ctrl + V`**:

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

#### 12. High-Speed Cooling Fans (`ECM 24030`, `24031`, `24035`, **`°F`**)
- Keep Low Speed already set in `SVTv29.26.hpt`: **`ECM 24020 = 195.0°F`**, **`ECM 24021 = 190.0°F`**, **`ECM 45804 = Enabled`**, **`ECM 44224 = Enabled`**.
- Lower High Speed (`System / Fans / Control By ECT / ...`):
  - **`ECM 24030`** (`Fan High Speed Enable ECT`): `225.0` -> **`205.0°F`**
  - **`ECM 24031`** (`Fan High Speed Disable ECT`): `215.0` -> **`199.0°F`**
  - **`ECM 24035`** (`Fan High Speed High Load Enable ECT`): `235.0` -> **`205.0°F`**

---

## Step 4 — Quick "Verify & Keep" Check (Already Correct in `SVTv29.26.hpt`)

Verify these match in `v000-initial-start.hpt` and **DO NOT CHANGE THEM**:

| ECM ID | Parameter | Expected Value (`Verify & Keep`) |
| :---: | :--- | :--- |
| **`6950`** | `Manifold Vacuum Multiplier` | **`0.484`** *(DO NOT zero)* |
| **`43000` & `12016`** | `Desired FP Over Injector` & `Inj Pressure Drop Ref` | **`40.00 psi`** (must match) |
| **`32047`** | `Injector Pressure Compensation` | **`Enabled`** |
| **`45693` / `45694`** | `FP Fixed DC Mode` / `FP Adaptive Voltage` | **`Disabled`** / **`Enabled`** |
| **`6960` / `6961`** | `Max FP Duty Cycle` / `Min FP Duty Cycle` | **`48.00`** / **`10.00`** |
| **`23000 / 23001 / 23002`** | `FP Gain - Derivative / Integral / Proportional` | **`0.0000` / `0.0996` / `0.0600`** |
| **`6002 / 4233 / 4234`** | `FP Secondary Monitor` / `FPDM KOEO & KOER` | **`Enabled`** |
| **`12011 / 12010 / 12012 / 12015`** | `Deka 60 Flow High / Low / Breakpoint / PW Min` | **`0.016700000` / `0.017500000` / `0.00003360` / `0.00050000`** |
| **`32050`** | `Injector Offset vs IGNV` | Keep Deka 60 table intact |
| **`44205`** | `Standard Air Charge` | **`0.00136 lb`** *(DO NOT change — defines Load)* |
| **`12115`** | `Closed Loop O2 Sensor Temp` | **`520.00 °F`** |
| **`12163`** | `MAF Airflow vs. Voltage` | Keep `SVTv29.26` (`0.00–4.80 V`) until first warm idle log |
| **`44583` & `32265`** | `Spark Borderline Knock` & `Spark MBT` | Keep Load `2.00` at **`11.50°–10.75°`** *(stock 10.2:1 rods!)* |
| **`2070` / `44473`** | `RPM Limit Cutoff` / `RPM Limit Neutral Cutoff` | **`7,400 RPM`** |
| **`44401`** | `Variable Camshaft` | **`Enabled`** |

*(Full reference tables for `32050`, `44583`, and `12163` are in [`docs/03-VERIFY-AND-KEEP-CHECKLIST-README.md`](../docs/03-VERIFY-AND-KEEP-CHECKLIST-README.md) and [`docs/SVTv29.26_CALIBRATION_REFERENCE.md`](../docs/SVTv29.26_CALIBRATION_REFERENCE.md).)*

---

## Step 5 — Compare Self-Check & First Startup Log

1. Save `tunes/v000-initial-start.hpt` (`Ctrl + S`).
2. Click **Compare -> Open Compare File...** and select [`tunes/SVTv29.26.hpt`](SVTv29.26.hpt).
3. Open **Compare -> View Comparison Log** and verify **ONLY** the Step 3 ECM IDs (`7596`, `44519`, `32731`, `44511`, `50`, `44218`, `44217`, `47996`, `32984`, `32988`, `44412`, `24030`, `24031`, `24035`) differ. Re-open from disk once to verify values stuck.
4. Load [`profiles/Focus_SVT_Returnless_Boost.Channels.xml`](../profiles/Focus_SVT_Returnless_Boost.Channels.xml) in **VCM Scanner** and flash `v000-initial-start.hpt` with a battery tender connected.
5. **Key ON (KOEO) Check Before Cranking:** Verify `Fuel Rail Pressure` reads `~35–45 psi` when primed, `ECT ≈ IAT ≈ ambient`, and battery `> 12.2 V`.
6. **Crank & Warm Idle Only (`0 psi` boost):** Let the engine idle untouched to `ECT >= 180°F`, confirm Closed Loop turns `Yes` with `STFT` stable, and confirm both radiator fans cycle (`195°F` / `205°F`). Save log to `logs/nic-svt-v000-first-start.hpl` and export `.csv` before any driving or MAF tuning (`v001+`).

### Abort Immediately If You See:
- **`FPDM Fuel Pump Duty Cycle >= 45.0%`** (`48.0%` ceiling = ~`96–100%` physical pump capacity)
- **Wideband `Lambda > 0.80`** (`> 11.75:1` gas) above `3 psi` boost
- **`Knock Retard > 1.5°–2.0°`**
- **`Boost > 8.0 psi`** on first test spring
- **`ECT > 220°F`**
