# `v001` MAF Calibration (`Diablo MAFia` Position `2`) + VCM Scanner XML Guide

> **Open Your Flashed Initial-Start Tune (`v000`) — NOT raw `SVTv29.26.hpt`:**  
> *(Or if rebuilding from `SVTv29.26.hpt`, apply all `v000` edits in [`v000-initial-start-README.md`](v000-initial-start-README.md) first!)*  
> **Target File to Save As:** `tunes/v001-mafia-pos2.hpt`  
> **Hardware Match:** Stock Focus SVT MAF sensor in `2.75"` draw-through intake + **DiabloSport MAFia on Position `2`** (`5.5 V -> 5.0 V`, `+31.6%` headroom)

---

## 1. Keep DiabloSport MAFia on Position `2` (Do NOT Move to `4`)

- **Confirmed Setting:** Keep the rotary dial cleanly clicked on **Position `2`** (NEVER turn the dial with Key ON).
- **Why Position `2` is the sweet spot here:**
  - Setting `2` scales a `0–5.5 V` sensor signal down to `0–5.0 V` at the PCM (`~0.909x` voltage, `0.76x` stock airflow / `+31.6%` airflow headroom before pegging).
  - Position `4` (`6.5 V`, `-53%`) crushes idle into very low A/D resolution where stock sensor electronics saturate before `6.5 V` anyway.
  - Position `0` (`5.0 V` passthrough) risks pegging the stock Focus SVT MAF sensor above ~`4.7–5.0 V` once spooling `5–7 psi` on the SPA `.64` turbo.
  - At Position `2`, your `v001.csv` log ALREADY shows clean idle A/D resolution (`188.8` counts = **`0.922 V`**) with **`~4.08 V` (`835` AD counts)** of clean upward range remaining for boost.

---

## 2. Why Your First Logs Ran Rich & Hung at `174–178 °F`

1. **Why the engine overfueled (`O2 = 0.95–0.97 V` pegged rich) and dropped out of Closed Loop:**
   - `SVTv29.26.hpt` carries a `PMAS HPX 3.0"` MAF curve (`0.90 V = 1.285 lb/min`).
   - With your stock Focus SVT sensor in a `2.75"` intake + MAFia at Position `2`, warm `944 RPM` idle sends **`0.922 V`** (`188.8` AD counts). The untouched `SVTv29.26` table turns `0.922 V` into **`1.315 lb/min`** — more than **double (`~2.2x`)** a 2.0L SVT engine's actual `944 RPM` idle airflow (`~0.58–0.61 lb/min`).
   - In `v000.csv`, Closed Loop briefly engaged (`t = 62.9–102.6 s`) and pulled fuel all the way to its `+22.4%` lean rail (`CmdLam = 1.2244`), couldn't break the `O2` sensor off rich (`>= 0.853 V`), and tripped **`Open Loop FMEM`**, which locks `Closed Loop Active = No` (`Fuel Source = Power Demand Enrich`, `CmdLam = 1.000`) once warm in `v001.csv`.
2. **Why coolant (`ECT`) hovered `174–178 °F` before climbing to `188 °F`:**
   - In `v001.csv`, `ECT` oscillated **`174–180 °F`** from `t = 1.9 s` to `163.2 s`, then slowly crept **`182 -> 184 -> 186 -> 188 °F`** over the final 90 seconds (`187–275 s`).
   - That plateau comes from two physical effects: **(a)** the mechanical thermostat cracking open around `~175–180 °F` and cycling cooler radiator water into the head under zero-load idle, and **(b)** heavy overfueling cooling the combustion chambers via excess unburned fuel latent heat.
   - It is **not** caused by the ECU cooling fan settings (`ECM 24020` Low Fan Enable = `195.0 °F`, `ECM 24030` High Fan Enable = `205.0 °F` are both above `188 °F`). Fixing the MAF fueling will help the engine warm smoothly past `180 °F` into normal fan cycling.
3. **Why `Engine RPM`, `Timing`, `STFT`, `IAC`, and `Fuel Pressure` were blank in the first logs:**
   - Your first logs polled `27` channels (VCM Scanner's default overload list including unsupported PIDs like Bank 2 STFT `6306`, `19061`, `19074`, and `6502`), choking the Focus EEC-V J1850 bus. Use the updated **20-channel XML profile** in **Section 5** below.

---

## 3. Step-by-Step `ECM 12163` Edit (Check Your Units First!)

1. Open your flashed **`v000` tune** (`tunes/v000-initial-start.hpt`) in **HP Tuners VCM Editor**.
2. Click **File -> Save As...** immediately and save as: **`tunes/v001-mafia-pos2.hpt`**.
3. Open **Parameter Navigator** (`Ctrl + Shift + N`), search **`12163`**, and open **`[ECM] 12163 - MAF Airflow vs. Voltage`** (`Engine / Airflow / General / MAF Calibration / MAF Airflow vs. Voltage`).

> [!CAUTION]
> **CHECK YOUR DISPLAY UNITS IN `[ECM] 12163` BEFORE TYPING A SINGLE NUMBER!**  
> On Black Oak `UJAHAS3`, VCM Editor displays `ECM 12163` scaled by `7.93664x` vs VCM Scanner `lb/min`. Check what your **rightmost column (`4.80 V`)** currently reads before editing:
> - **If `4.80 V` currently reads `410.6` (unit header `lb/h`):** Enter or paste **ONLY** the **`Editor lb/h`** values below (`0.90 V = 4.63`, `4.80 V = 337.71`).
> - **If `4.80 V` currently reads `6.843` (unit header `lb/min`):** Enter or paste **ONLY** the **`Editor lb/min`** values below (`0.90 V = 0.0772`, `4.80 V = 5.6285`).
> - **Do NOT mix the two columns (`60x` fueling error!) and NEVER edit the grey Voltage header row (`0.00` to `4.80 V`).**

### Design Basis of This Curve
- Anchors your measured `944 RPM` warm idle (**`0.922 V`** at MAFia Position `2`) to **`4.91 lb/h` UI** (**`0.619 lb/min`** true PCM airflow — a deliberate **`+4–5%` rich safety cushion** over `0.59 lb/min` true SVT idle airflow so `STFT B1` settles safely around `-2%` to `-6%` instead of leaning out).
- Preserves clean `~1.0–1.15 lb/min` cold fast-idle scaling near `1.10–1.20 V` and tapers smoothly with conservative rich margin (`~42.6 lb/min` ceiling at `4.80 V`) up through boost until steady-state cruise `STFT` and wideband WOT trims are verified.

### Fast Horizontal Paste Blocks (Click white cell under `0.00 V` -> `Ctrl + V`)

**Use ONLY if `4.80 V` currently shows `410.6` (`lb/h` display):**
```text
0.00	0.85	0.93	1.09	1.27	1.37	1.53	1.59	1.95	2.29	2.67	4.63	5.90	7.38	9.10	11.05	13.27	15.77	18.55	25.04	32.86	42.11	52.90	65.33	79.50	95.51	113.45	133.43	179.83	337.71
```

**Use ONLY if `4.80 V` currently shows `6.843` (`lb/min` display):**
```text
0.0000	0.0142	0.0155	0.0182	0.0212	0.0228	0.0255	0.0265	0.0325	0.0382	0.0445	0.0772	0.0983	0.1230	0.1517	0.1842	0.2212	0.2628	0.3092	0.4173	0.5477	0.7018	0.8817	1.0888	1.3250	1.5918	1.8908	2.2238	2.9972	5.6285
```

### Cell-by-Cell Reference Table (`ECM 12163` — `30` Columns)

| Col | Volts (`V`) | Current `SVTv29.26` (`lb/h`) | Type if Editor=`lb/h` | Type if Editor=`lb/min` | Target Real PCM (`lb/min`) | Region |
| :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| 1 | `0.00` | `0.0` | **`0.00`** | **`0.0000`** | `0.000` | KOEO zero |
| 2 | `0.38` | `2.0` | **`0.85`** | **`0.0142`** | `0.107` | Sub-idle taper |
| 3 | `0.40` | `2.5` | **`0.93`** | **`0.0155`** | `0.117` | Sub-idle taper |
| 4 | `0.44` | `3.0` | **`1.09`** | **`0.0182`** | `0.137` | Sub-idle taper |
| 5 | `0.48` | `3.7` | **`1.27`** | **`0.0212`** | `0.160` | Sub-idle taper |
| 6 | `0.50` | `3.8` | **`1.37`** | **`0.0228`** | `0.173` | Sub-idle taper |
| 7 | `0.53` | `3.8` | **`1.53`** | **`0.0255`** | `0.193` | Sub-idle taper |
| 8 | `0.54` | `3.9` | **`1.59`** | **`0.0265`** | `0.200` | Sub-idle taper |
| 9 | `0.60` | `4.9` | **`1.95`** | **`0.0325`** | `0.246` | Decel / low flow |
| 10 | `0.65` | `5.0` | **`2.29`** | **`0.0382`** | `0.289` | Decel / low flow |
| 11 | `0.70` | `6.9` | **`2.67`** | **`0.0445`** | `0.336` | Below idle |
| 12 | `0.90` | `10.2` | **`4.63`** | **`0.0772`** | `0.583` | **Warm idle lower bound (`0.922 V` ≈ `4.91 lb/h`)** |
| 13 | `1.00` | `11.4` | **`5.90`** | **`0.0983`** | `0.743` | **Warm idle upper / fan recovery** |
| 14 | `1.10` | `12.4` | **`7.38`** | **`0.1230`** | `0.930` | **Cold idle transition** |
| 15 | `1.20` | `16.4` | **`9.10`** | **`0.1517`** | `1.147` | **Cold fast idle (`~1,400–1,500 RPM`)** |
| 16 | `1.30` | `18.4` | **`11.05`** | **`0.1842`** | `1.392` | Off-idle tip-in |
| 17 | `1.40` | `22.6` | **`13.27`** | **`0.2212`** | `1.672` | Light cruise |
| 18 | `1.50` | `25.3` | **`15.77`** | **`0.2628`** | `1.987` | Light cruise |
| 19 | `1.60` | `29.3` | **`18.55`** | **`0.3092`** | `2.337` | Cruise |
| 20 | `1.80` | `39.0` | **`25.04`** | **`0.4173`** | `3.155` | Cruise |
| 21 | `2.00` | `49.8` | **`32.86`** | **`0.5477`** | `4.140` | Part-throttle cruise |
| 22 | `2.20` | `71.2` | **`42.11`** | **`0.7018`** | `5.306` | Moderate cruise |
| 23 | `2.40` | `89.3` | **`52.90`** | **`0.8817`** | `6.665` | Transition / low load |
| 24 | `2.60` | `112.9` | **`65.33`** | **`1.0888`** | `8.231` | Transition / spool onset |
| 25 | `2.80` | `139.4` | **`79.50`** | **`1.3250`** | `10.017` | Mid load |
| 26 | `3.00` | `165.1` | **`95.51`** | **`1.5918`** | `12.034` | Spool / low boost |
| 27 | `3.20` | `194.9` | **`113.45`** | **`1.8908`** | `14.294` | Mid RPM / boost |
| 28 | `3.40` | `239.1` | **`133.43`** | **`2.2238`** | `16.812` | Boost |
| 29 | `3.80` | `329.1` | **`179.83`** | **`2.9972`** | `22.658` | Boost |
| 30 | `4.80` | `410.6` | **`337.71`** | **`5.6285`** | `42.551` | Top headroom ceiling |

---

## 4. Quick Pre-Save Compare Check

1. Press **`Ctrl + S`** to save `tunes/v001-mafia-pos2.hpt`.
2. Click **Compare -> Open Compare File... -> select your flashed `v000` tune**: confirm **ONLY `[ECM] 12163 - MAF Airflow vs. Voltage`** changed between `v000` and `v001`.
3. Click **Compare -> Open Compare File... -> select `tunes/SVTv29.26.hpt`**: confirm **`ECM 7596`**, **`ECM 32731` (`200/200/350/350`)**, **`ECM 44519`**, **`ECM 44511`**, **`ECM 50`**, **`ECM 44412`**, **`ECM 44218/17`**, **`ECM 47996`**, **`ECM 32984/88`**, **`ECM 24030/31/35`**, AND **`ECM 12163`** are ALL present (nothing reverted to `SVTv29.26`'s broken return-style `40 psi` / `0.00` TPS threshold / `-49.5°` boost VCT).

---

## 5. Import the New 20-Channel VCM Scanner XML Profile

Your first logs dropped `Engine RPM`, `Timing Advance`, `Idle Air Solenoid DC`, and `Fuel Pressure` because the scanner requested 27 channels (including unsupported IDs). We trimmed [`profiles/Focus_SVT_Returnless_Boost.Channels.xml`](../profiles/Focus_SVT_Returnless_Boost.Channels.xml) to **20 proven `UJAHAS3` channels**:

- Keeps fast polling (`50–100 ms`) on `Engine RPM` (`2135`), `Timing Advance` (`2500`), `Spark Source` (`19046`), `Fuel Source` (`19047`), `Commanded Lambda` (`6005`), `O2 Voltage B1S1` (`6100`), `Mass Airflow` (`2300`), `TPS ADC Abs` (`3017`), and `IAC DC` (`2082`).
- Replaces blank `6502` with live **`Fuel Pressure Sensor` volts (`6507`)** + **`Fuel Pump Commanded DC` (`6506`)**, plus **`Mass Airflow Sensor` volts (`2302`)**, **`STFT Bank 1` (`6304`)**, **`Air Load (Hi Res)` (`18008`)**, **`Closed Loop Active` (`12942`)**, and **`Open Loop FMEM` (`12947`)**.

### How to Import in VCM Scanner
1. Open **VCM Scanner**.
2. Go to the **Channels** window (top/left table), right-click inside it -> **Open Channel Config...** (or click the **Open Folder** icon on the Channels toolbar).
3. Select **`focus-svt-nic/profiles/Focus_SVT_Returnless_Boost.Channels.xml`**.
4. Verify the channel list now shows **20 channels** (with `Engine RPM`, `Timing Advance`, `STFT Bank 1`, `Fuel Pressure Sensor`, `Fuel Pump Commanded DC`, and `Open Loop FMEM` present), then **save your Scanner layout/channel config** before connecting.

---

## 6. Stationary Warm-Idle Test & Abort Rules (`v001`)

1. Flash `tunes/v001-mafia-pos2.hpt` with a battery charger (`> 12.2 V`) connected.
2. Start and warm up **stationary at idle only** (no driving or boost yet) until **`ECT >= 180 °F`** and the low fan (`195 °F`) cycles if reachable.
3. Verify ALL 6 health checks in your exported `logs/Datalog-v001-maf.csv`:
   - **`Closed Loop Active = Yes`** (`Fuel Source = Stoich`) stays active once warm, **`Open Loop FMEM = No`**
   - **`STFT Bank 1`** settles inside **`-10%` to `+10%`** and **`O2 Voltage B1S1`** actively switches between **`~0.1 V` and `~0.85 V`**
   - **`Fuel Pressure Sensor` (`6507`)** reads live **`~2.4–2.9 V`** (`psi = 17.5 * (V - 0.50)` under `ECM 7596`; e.g., `2.79 V ≈ 40 psi`, **`NOT` a frozen flatline**)
   - **`Fuel Pump Commanded DC` (`6506`)** stays **`~20–30%`** at idle (`<= 45%` ceiling)
   - **`Engine RPM` (`2135`)**, **`Timing Advance` (`2500`)**, **`IAC DC` (`2082`)** all populate without blanks.
4. **Abort Immediately If:** `FPDM Cmd DC >= 45%`, wideband `Lambda > 0.80` under any load, `ECT > 220 °F`, or `Fuel Pressure Sensor < 2.2 V` (`< 30 psi`) while running.
