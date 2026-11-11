# SVTv29.26.hpt — Verified Calibration Reference Sheet

- **File:** [`tunes/SVTv29.26.hpt`](../tunes/SVTv29.26.hpt) (`212,349` bytes, SHA-256 `45F07925F65D03FB08B91D8B9BB88BD8E29DBC4E4AF48170472DBCDB5B0F63E0`)
- **Strategy / Controller:** `UJAHAS3 / ZED0` (2003 Ford Focus SVT, Black Oak EEC-V)
- **Status:** Nic's active starting base tune for manual `v000` VCM Editor build ([`tunes/v000-initial-start-README.md`](../tunes/v000-initial-start-README.md)).

> **Accuracy Note (2026-11-11 Audit):** Earlier notes misstated several values and IDs in `SVTv29.26.hpt`. Direct inspection verified that **`ECM 6950` is already `0.484`**, **`ECM 12115` is already `520.00°F`**, **`ECM 24020/24021` Low Fan is already `195.0/190.0°F`**, **`ECM 12015`** is Injector PW Minimum (not `12013`), **`ECM 12016`** is Pressure Drop Reference (not `12014`), **`ECM 7596`** uses A/D rows `0, 0, 0, 0, 102, 921, 1023`, and **`ECM 12163`** runs `0.00` to `4.80 V`.

---

## 1. Returnless vs. Return-Style Audit (`SVTv29.26.hpt` Actual Values)

| ECM ID | Parameter Name | Value in `SVTv29.26.hpt` | Status on Nic's ERFS Car | Required Target (`v000`) |
| :---: | :--- | :---: | :--- | :--- |
| **`7596`** | Fuel Pressure Sensor Transfer Function | `0,0,0,0,102,921,1023` -> all `40` psi | **BROKEN** (flatlined FRPS) | `0,0,0,0,0.00,70.00,78.72` psi |
| **`32731`** | Open Loop Fuel TPS Thresh vs. RPM | All 7 rows (`0..16,384 RPM`) = `0.00` | **BROKEN** (locks idle in Open Loop) | `200, 200, 350, 350, 0, 0, 0` |
| **`50`** | Master DTC List (`P0190/P0192/P0193/P0132`) | `No Error Reported` / `No MIL Light` | **UNSAFE** (hides FRPS/O2 faults) | All 4 -> `MIL Light` |
| **`6950`** | Manifold Vacuum Multiplier | `0.484` | **OK** (already returnless!) | Keep `0.484` |
| **`43000`** | Desired Fuel Pressure Over Injector | `40.00` psi (`0.000–0.002 lb/min`) | **OK** | Keep `40.00` psi |
| **`12016`** | Injector Pressure Drop Reference | `40.00` psi | **OK** (matches `43000`) | Keep `40.00` psi |
| **`32047`** | Injector Pressure Compensation | `Enabled` | **OK** | Keep `Enabled` |
| **`45693`** | Fuel Pump Fixed Duty Cycle Mode | `Disabled` | **OK** (dynamic ERFS active) | Keep `Disabled` |
| **`45694`** | Fuel Pump Adaptive Voltage | `Enabled` | **OK** | Keep `Enabled` |
| **`6960`** | Maximum Fuel Pump Duty Cycle | `48.00` (~96% physical FPDM scale) | **OK** | Keep `48.00` |
| **`6961`** | Minimum Fuel Pump Duty Cycle | `10.00` (~20% physical FPDM scale) | **OK** | Keep `10.00` |
| **`23000`** | Fuel Pump Gain - Derivative | `0.0000` | **OK** | Keep `0.0000` |
| **`23001`** | Fuel Pump Gain - Integral | `0.0996` | **OK** | Keep `0.0996` |
| **`23002`** | Fuel Pump Gain - Proportional | `0.0600` | **OK** | Keep `0.0600` |
| **`6002`** | Fuel Pump Secondary Monitor | `Enabled` | **OK** | Keep `Enabled` |
| **`4233 / 4234`** | FPDM KOEO / KOER Test Switch | `Enabled / Enabled` | **OK** | Keep `Enabled` |

---

## 2. Siemens Deka 60 lb/hr (`107961`) Injectors, Aircharge & O2 Gate

| ECM ID | Parameter Name | Value in `SVTv29.26.hpt` | Target (`v000`) |
| :---: | :--- | :---: | :---: |
| **`12011`** | Injector Flow Rate High | `0.016700000` lb/s (~60.12 lb/hr) | Keep |
| **`12010`** | Injector Flow Rate Low | `0.017500000` lb/s (~63.00 lb/hr) | Keep |
| **`12012`** | Injector Breakpoint | `0.00003360` lb | Keep |
| **`12015`** | Injector PW Minimum | `0.00050000` s (`0.50 ms`) | Keep |
| **`32050`** | Injector Offset vs IGNV (`13×2`) | `0–6V: 0.00258`, `8V: 0.00144`, `10V: 0.000921`, `11V: 0.000758`, `12V: 0.000636`, `13V: 0.000517`, `14V: 0.000429`, `15–15.9V: 0.000327` | Keep |
| **`44205`** | Standard Air Charge | `0.00136` lb (~0.617 g/cyl) | **KEEP (defines Load axis)** |
| **`12115`** | Closed Loop O2 Sensor Temp | `520.00 °F` | Keep |
| **`1165`** | Fore/Aft Oxygen Sensor Control | `Disabled` | Keep |
| **`44401`** | Variable Camshaft | `Enabled` | Keep |
| **`2019 / 44397`** | IMRC Switch / IMRC Sensor | `Disabled / Disabled` | Keep |

---

## 3. Cranking Fuel (`ECM 44519`) & Base Fuel (`ECM 44511`)

- **`ECM 44519` (`Fuel Cranking vs. ECT`):** `-20°F -> 0.850`, `0°F -> 0.857`, `20°F -> 0.870`, `30°F -> 0.877`, `40°F -> 0.886`, `63.99°F -> 0.930`, **`64.00°F -> 0.335`**, **`90°F -> 0.430`**, **`120°F -> 0.647`**, **`150°F -> 0.764`**, `180°F -> 1.000`, `220°F -> 1.000`.  
  **Fix:** Remove the `64.00°F` flooding cliff -> set `64 / 90 / 120 / 150°F` monotonically to **`0.930 / 0.950 / 0.970 / 0.985`**.
- **`ECM 44511` (`Fuel Base vs. RPM vs. TPS`):** `15.6% @ 2,500 = 1.07` and `19.5% @ 2,500 = 1.14` (lean pockets; `3,500 RPM` at `15.6–23.4%` also sits slightly lean at `1.02–1.03`), while rows `31.2%–68.4%` command safe rich fueling `0.73–0.80` lambda.  
  **Fix:** Set `2,500 RPM @ 15.6%` and `19.5%` to **`1.00`** (optional `3,500 RPM` light rows -> `1.00`); leave boost/WOT rows untouched.

---

## 4. VCT Angle (`ECM 44412`) & Spark Ceiling (`ECM 44583`, `32265`)

- **`ECM 44412` (`VCT Angle vs. RPM vs. Load`):** `SVTv29.26.hpt` commands up to **`-49.50°`** at `2,500–3,500 RPM` (`0.40–0.80` Load), `-12.00°` to `-29.00°` across **`4,500 RPM`**, and `-5.00°` to `-15.00°` even at **`6,000–6,250 RPM`**.  
  **Fix:** Paste the validated `v037` table (retaining spool advance below `4,500 RPM`, flat `0.00°` across all loads from `4,500–7,200 RPM`). See [`02-VCT-IDLE-AND-FANS-README.md`](02-VCT-IDLE-AND-FANS-README.md#1-ecm-44412-vct-angle-vs-rpm-vs-load-reversion--spool-fix).
- **`ECM 44583` (`Spark Borderline Knock`):** Already boost-clamped in `SVTv29.26.hpt`:
  - Load `0.80`: `-7.00, 2.00, 6.73, 9.28, 9.28, 12.00, 12.00, 12.00, 12.00, 12.00, 12.00`
  - Load `2.00`: `-7.31, -9.00, 1.65, 4.14, 8.00, 11.50, 11.50, 11.50, 11.25, 11.00, 10.75`
  - **`ECM 32265` (`Spark MBT`):** `16.00°` at `0.80` (`3,250–7,200`), `13.00–13.75°` at `2.00` (`5,000–7,200`). **KEEP BOTH UNTOUCHED** for Nic's stock 10.2:1 rods.
- **Rev Limiters (`ECM 2070` Cutoff, `ECM 44473` Neutral):** Both **`7,400` RPM** -> Keep.

---

## 5. Idle Speed, Dashpot & Cooling Fans

- **`ECM 44218 / 44217` (`Target Idle Speed P/N & Drive`):** `850` -> **`950` RPM**
- **`ECM 47996` (`Idle Spark Proportional Gain`):** `2.000` -> **`1.000`**
- **`ECM 32984` (`Idle Dashpot Decay`):** `0.0, 0.2, 0.4, 0.6 lb/min` = `0.00` -> **`0.02, 0.03, 0.04, 0.05`** (keep `0.8=0.06`, `1.0=0.08`, `3.0=0.10`)
- **`ECM 32988` (`Idle Dashpot Pre-Position`):** `0=0.04`, `150=0.04`, `1150=0.35`, `2150=0.78 -> 0.55`, `3150=1.11 -> 0.80`, `4150=1.50 -> 1.00`
- **Cooling Fans:**
  - `ECM 24020` Low Enable = **`195.0 °F`** (Keep), `ECM 24021` Low Disable = **`190.0 °F`** (Keep)
  - `ECM 24030` High Enable: `225.0` -> **`205.0 °F`**, `ECM 24031` High Disable: `215.0` -> **`199.0 °F`**, `ECM 24035` High-Load Enable: `235.0` -> **`205.0 °F`**
  - `ECM 45804` Electric Fan = **`Enabled`**, `ECM 44224` Fan High Speed Idle = **`Enabled`**

---

## 6. Actual `ECM 12163` MAF Curve in `SVTv29.26.hpt` (`0.00` to `4.80 V`)

Keep untouched until the **Diablo MAFia** dial position is verified and first warm-idle `STFT` is logged *(note: `UJAHAS3` has a documented VCM Editor `lb/min` display-label quirk on `ECM 12163`)*:

- **Voltage (`V`):** `0.00, 0.38, 0.40, 0.44, 0.48, 0.50, 0.53, 0.54, 0.60, 0.65, 0.70, 0.90, 1.00, 1.10, 1.20, 1.30, 1.40, 1.50, 1.60, 1.80, 2.00, 2.20, 2.40, 2.60, 2.80, 3.00, 3.20, 3.40, 3.80, 4.80`
- **Editor UI Display (`lb/min` label):** `0.0, 2.0, 2.5, 3.0, 3.7, 3.8, 3.8, 3.9, 4.9, 5.0, 6.9, 10.2, 11.4, 12.4, 16.4, 18.4, 22.6, 25.3, 29.3, 39.0, 49.8, 71.2, 89.3, 112.9, 139.4, 165.1, 194.9, 239.1, 329.1, 410.6`
