# README 03 — Verify & Keep Checklist (`SVTv29.26.hpt` — DO NOT CHANGE)

> **Purpose:** Confirm that your `v000` initial start file (`v000-initial-start.hpt` built from `SVTv29.26.hpt`) **retains every critical parameter below**. Do **not** overwrite these with values from `SVT Tune.hpt` (stock 30 lb NA file) or forged-engine spark tables!

---

## 1. Returnless Fuel Pressure & ERFS Pump Control (ALREADY RIGHT IN `v29.26`)

> **Correction Notice:** Older notes claimed `ECM 6950` was `0.000` in `v29.26`. Verified inspection shows `SVTv29.26.hpt` already has `6950 = 0.484` and dynamic ERFS PID active — only `[ECM 7596]` and `[ECM 50]` needed fixing!

| Search ECM | Exact Parameter Name & Navigator Path | Must Read (`Verify & Keep`) | Notes |
| :---: | :--- | :---: | :--- |
| **`6950`** | `Manifold Vacuum Multiplier`<br>`Engine / Airflow / General / General / Manifold Vacuum Multiplier` | **`0.484`** | **DO NOT zero.** `0.000` is return-style only; `0.484` converts manifold inHg -> psi on ERFS. |
| **`43000`** | `Desired Fuel Pressure Over Injector`<br>`Fuel System / Fuel Pressure / Desired Fuel Pressure / Desired Fuel Pressure Over Injector` | **`40.00` psi** (all 7 rows) | Target rail delta-P (`0.000`–`0.002 lb/min`). Must match `ECM 12016`. |
| **`12016`** | `Injector Pressure Drop Reference`<br>`Engine / Fuel / General / Injector Control / Injector Pressure Drop Reference` | **`40.00` psi** | *(Corrected ID; previously mistyped `12014` in old notes.)* Must match `ECM 43000`. |
| **`32047`** | `Injector Pressure Compensation`<br>`Engine / Fuel / General / Injector Control / Injector Pressure Compensation` | **`Enabled`** | Adjusts injector flow dynamically with FRPS delta-P. |
| **`45693`** | `Fuel Pump Fixed Duty Cycle Mode`<br>`Fuel System / Fuel Pump / Fuel Pump / Fuel Pump Fixed Duty Cycle Mode` | **`Disabled`** | Allows dynamic FPDM PID control instead of fixed duty cycle. |
| **`45694`** | `Fuel Pump Adaptive Voltage`<br>`Fuel System / Fuel Pump / Fuel Pump / Fuel Pump Adaptive Voltage` | **`Enabled`** | Keeps adaptive ERFS voltage control active. |
| **`6960`** | `Maximum Fuel Pump Duty Cycle`<br>`Fuel System / Fuel Pump / Fuel Pump / Maximum Fuel Pump Duty Cycle` | **`48.00`** | In Ford FPDM scaling, `50%` commanded ≈ `100%` physical pump output. **Never raise blindly.** Abort if logged FP duty hits `>= 45%`. |
| **`6961`** | `Minimum Fuel Pump Duty Cycle`<br>`Fuel System / Fuel Pump / Fuel Pump / Minimum Fuel Pump Duty Cycle` | **`10.00`** | Matches stock FPDM minimum floor (`~20%` physical). |
| **`23000`** | `Fuel Pump Gain - Derivative`<br>`Fuel System / Fuel Pump / Fuel Pump / Fuel Pump Gain - Derivative` | **`0.0000`** | Stock ERFS D-gain. |
| **`23001`** | `Fuel Pump Gain - Integral`<br>`Fuel System / Fuel Pump / Fuel Pump / Fuel Pump Gain - Integral` | **`0.0996`** | Stock ERFS I-gain. |
| **`23002`** | `Fuel Pump Gain - Proportional`<br>`Fuel System / Fuel Pump / Fuel Pump / Fuel Pump Gain - Proportional` | **`0.0600`** | Stock ERFS P-gain. |
| **`6002`** | `Fuel Pump Secondary Monitor`<br>`Fuel System / Fuel Pump / Fuel Pump / Fuel Pump Secondary Monitor` | **`Enabled`** | Retains FPDM return-line/driver fault monitoring. |
| **`4233`** | `FPDM KOEO Test Switch`<br>`Fuel System / Diagnostics / FPDM / FPDM KOEO Test Switch` | **`Enabled`** | Keeps FPDM KOEO diagnostic enabled. |
| **`4234`** | `FPDM KOER Test Switch`<br>`Fuel System / Diagnostics / FPDM / FPDM KOER Test Switch` | **`Enabled`** | Keeps FPDM KOER diagnostic enabled. |

---

## 2. Siemens Deka 60 lb/hr (`107961`) Injector Data (ALREADY IN `v29.26`)

| Search ECM | Exact Parameter Name & Navigator Path | Must Read (`Verify & Keep`) | Notes |
| :---: | :--- | :---: | :--- |
| **`12011`** | `Injector Flow Rate High`<br>`Engine / Fuel / General / Injector Control / Injector Flow Rate High` | **`0.016700000`** lb/s | ~60.12 lb/hr (`107961` high slope). |
| **`12010`** | `Injector Flow Rate Low`<br>`Engine / Fuel / General / Injector Control / Injector Flow Rate Low` | **`0.017500000`** lb/s | ~63.00 lb/hr (`107961` low slope). |
| **`12012`** | `Injector Breakpoint`<br>`Engine / Fuel / General / Injector Control / Injector Breakpoint` | **`0.00003360`** lb | Low/high slope fuel-mass breakpoint. |
| **`12015`** | `Injector PW Minimum`<br>`Engine / Fuel / General / Injector Control / Injector PW Minimum` | **`0.00050000`** s | `0.50 ms`. *(Corrected ID; previously mistyped `12013` in old notes.)* |
| **`32050`** | `Injector Offset vs IGNV`<br>`Engine / Fuel / General / Injector Control / Injector Offset vs IGNV` | See table below | Voltage deadtime curve (`13 × 2`). |

### Verify `[ECM 32050]` Injector Offset vs IGNV Values
`0.0 V -> 0.00258000` | `0.0 V -> 0.00258000` | `0.0 V -> 0.00258000` | `6.0 V -> 0.00258000` | `8.0 V -> 0.00144000` | `10.0 V -> 0.00092100` | `11.0 V -> 0.00075800` | `12.0 V -> 0.00063600` | `13.0 V -> 0.00051700` | `14.0 V -> 0.00042900` | `15.0 V -> 0.00032700` | `15.9 V -> 0.00032700`

---

## 3. Aircharge, Closed Loop O2 & MAF Curve (DO NOT EDIT BEFORE LOGGING)

| Search ECM | Exact Parameter Name & Navigator Path | Must Read (`Verify & Keep`) | Critical Warning |
| :---: | :--- | :---: | :--- |
| **`44205`** | `Standard Air Charge`<br>`Engine / General / Engine / Standard Air Charge` | **`0.00136` lb** | **NEVER CHANGE.** `0.00136 lb` (~0.617 g/cyl) sets the `Load` axis used by Spark (`44583`) and VCT (`44412`). |
| **`12115`** | `Closed Loop O2 Sensor Temp`<br>`Engine / Fuel / Oxygen Sensors / Feedback / Closed Loop O2 Sensor Temp` | **`520.00 °F`** | Already `520.00°F` in `v29.26` *(earlier note wrongly claimed `2000°F`)*. Verify it reads `520.00`. |
| **`12163`** | `MAF Airflow vs. Voltage`<br>`Engine / Airflow / General / MAF Calibration / MAF Airflow vs. Voltage` | `0.00..4.80 V` (`0.0..410.6`) | **KEEP FOR FIRST LOG.** Has a known Editor `lb/min` display-label quirk. Verify physical **MAFia dial** & first warm idle **STFT** before touching! |
| **`1165`** | `Fore/Aft Oxygen Sensor Control`<br>`Engine / Fuel / Oxygen Sensors / General / Fore/Aft Oxygen Sensor Control` | **`Disabled`** | Already configured in `v29.26`. |
| **`44401`** | `Variable Camshaft`<br>`Engine / Airflow / Variable Camshaft / General / Variable Camshaft` | **`Enabled`** | Must be `Enabled` for `ECM 44412` VCT table to function. |
| **`2019` / `44397`** | `IMRC Switch` & `IMRC Sensor`<br>`Engine / Airflow / IMRC / General / ...` | **`Disabled` / `Disabled`** | Matches deleted/fixed IMRC turbo setup (confirm if your car keeps IMRC or matches Chuck intake). |

### Reference: Actual `SVTv29.26.hpt` `[ECM 12163]` 30-Point MAF Values (Verify Untouched)
- **Volts (`0.00` to `4.80 V`):** `0.00, 0.38, 0.40, 0.44, 0.48, 0.50, 0.53, 0.54, 0.60, 0.65, 0.70, 0.90, 1.00, 1.10, 1.20, 1.30, 1.40, 1.50, 1.60, 1.80, 2.00, 2.20, 2.40, 2.60, 2.80, 3.00, 3.20, 3.40, 3.80, 4.80`
- **Editor Displayed Flow (`lb/min` UI label):** `0.0, 2.0, 2.5, 3.0, 3.7, 3.8, 3.8, 3.9, 4.9, 5.0, 6.9, 10.2, 11.4, 12.4, 16.4, 18.4, 22.6, 25.3, 29.3, 39.0, 49.8, 71.2, 89.3, 112.9, 139.4, 165.1, 194.9, 239.1, 329.1, 410.6`

---

## 4. Stock 10.2:1 Bottom-End Spark Ceiling & Rev Limiters (DO NOT ADVANCE)

- **Search `[ECM 44583]`:** `Spark Borderline Knock vs. RPM vs. Load` (`Engine / Spark / Advance / Borderline / Spark Borderline Knock vs. RPM vs. Load`)
- **Search `[ECM 32265]`:** `Spark MBT vs. RPM vs. Load` (`Engine / Spark / Advance / MBT / Spark MBT vs. RPM vs. Load`)
- **Search `[ECM 2070]`:** `RPM Limit Cutoff` (`Engine / Fuel / Cutoff, DFCO / RPM Limits / RPM Limit Cutoff`) -> Verify **`7,400` RPM**
- **Search `[ECM 44473]`:** `RPM Limit Neutral Cutoff` (`Engine / Fuel / Cutoff, DFCO / RPM Limits / RPM Limit Neutral Cutoff`) -> Verify **`7,400` RPM**

> **CRITICAL ENGINE SAFETY:** `SVTv29.26.hpt` ALREADY clamps `ECM 44583` at **`12.00°`** on Load `0.80` (`5,000–7,200 RPM`) and **`11.50°` tapering to `10.75°`** on Load `2.00`, strictly below `ECM 32265` (`13.75°` MBT). **Do NOT copy higher `13.5°` spark tables onto your 10.2:1 stock-rod motor.**

### Verify `[ECM 44583]` Values Match `SVTv29.26.hpt`

| Load \ RPM | `1,000` | `1,850` | `2,450` | `2,800` | `3,250` | `5,000` | `5,750` | `6,000` | `6,250` | `6,500` | `7,200` |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **`0.10`** | `55.00` | `55.00` | `55.00` | `55.00` | `55.00` | `55.00` | `55.00` | `55.00` | `55.00` | `55.00` | `55.00` |
| **`0.20`** | `41.60` | `45.40` | `45.00` | `45.40` | `45.10` | `45.00` | `44.70` | `40.40` | `34.70` | `45.60` | `41.00` |
| **`0.30`** | `36.00` | `45.00` | `45.00` | `45.00` | `41.00` | `39.00` | `45.11` | `45.00` | `44.64` | `45.17` | `36.33` |
| **`0.40`** | `23.00` | `29.00` | `39.00` | `36.50` | `30.00` | `32.87` | `44.79` | `44.52` | `44.66` | `44.69` | `42.80` |
| **`0.50`** | `12.50` | `21.00` | `30.00` | `28.00` | `26.00` | `26.99` | `33.77` | `39.06` | `41.72` | `42.29` | `45.26` |
| **`0.60`** | `7.68` | `19.00` | `22.51` | `27.00` | `22.64` | `22.37` | `29.16` | `32.80` | `36.17` | `33.00` | `36.01` |
| **`0.70`** | `6.50` | `14.00` | `21.00` | `24.01` | `20.50` | `19.39` | `24.49` | `25.60` | `29.48` | `27.56` | `29.00` |
| **`0.80`** | `-7.00` | `2.00` | `6.73` | `9.28` | `9.28` | `12.00` | `12.00` | `12.00` | `12.00` | `12.00` | `12.00` |
| **`2.00`** | `-7.31` | `-9.00` | `1.65` | `4.14` | `8.00` | `11.50` | `11.50` | `11.50` | `11.25` | `11.00` | `10.75` |

---

**Done checking? Return to [Master Build Guide — Step 4 Compare Self-Audit](NIC_TUNE_BUILD_README.md#step-4--mandatory-compare-verification-before-flashing).**
