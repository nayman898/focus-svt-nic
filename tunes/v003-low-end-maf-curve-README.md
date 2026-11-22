# Revision `v003` — Low-End MAFia Position `2` Curve (`0.38–1.10 V` Warm-Idle Trim Fix)

> **Parent Tune:** [`tunes/v002-idle-maf-bump.hpt`](v002-idle-maf-bump.hpt) *(your currently flashed tune logged in `Datalog-v0004.hpl` and `Datalog-v005.hpl` — **always `File -> Save As...` `tunes/v003-low-end-maf-curve.hpt` first**)*  
> **Rollback:** [`tunes/v002-idle-maf-bump.hpt`](v002-idle-maf-bump.hpt)  
> **Hardware Confirmed:** Stock Focus SVT MAF + `2.75"` draw-through intake + **DiabloSport MAFia at Dial Position `2` (`5.5 V -> 5.0 V`)**  
> **Only Tune Parameter Changed:** **`[ECM 12163]`** `MAF Airflow vs. Voltage` (**columns `2–14` / `0.38–1.10 V` only** reshaped into a smooth, strictly convex curve anchored to `Datalog-v005.hpl` Closed Loop fuel trims; **`0.00 V` and `1.20–4.80 V` stay 100% identical to `v002`**). Every other table stays identical to `v002`.

---

## Why `v003` Is Needed (`Datalog-v0004.hpl` & `Datalog-v005.hpl` Findings)

1. **`v002` confirmed flashed, ERFS working, and continuous Closed Loop active (`~700 s`):**
   - **Verified `v002` on the ECU:** Both `Datalog-v0004.hpl` (`239.0 s`, Nov 11) and `Datalog-v005.hpl` (`761.5 s`, Nov 21 cold-to-warm idle) match `v002`'s `ECM 12163` curve (`0.90 V = 5.32`, `1.20 V = 10.48`, `1.30 V = 12.59 lb/h` UI).
   - **Returnless Fuel System (ERFS) healthy:** `Datalog-v0004.hpl` logged live `Fuel Pressure` at **`38.6–41.8 psi` (median `40.00 psi`)**, and `Datalog-v005.hpl` held `Fuel Pump Commanded DC` at **`23.8–26.4%` (median `24.69%`)** — huge margin below the `45.0%` limit.
   - **Healthy Closed Loop (`Stoich`) with zero `FMEM` dropouts:** `v005` entered Closed Loop at `t = 66 s` (`88 °F`) and remained continuously in `Stoich` for **`~700 s`** straight. During warm idle (`t = 440–761.5 s`, `164–178 °F`, `DesRPM = 944 RPM`), `O2 B1S1` switched cleanly at **`0.60 Hz`** (`1.66 s/cycle`, `p10 = 0.321 V`, `p90 = 0.788 V`, `max = 0.828 V`). `TPS ADC` stayed at `168.8–169.8` counts (cleanly `< 200` in `ECM 32731`), and `ECT` settled into normal zero-load thermostat cycling at `172–178 °F` (`68 °F` ambient IAT).
   - **Cranking fix confirmed (with one brief lean first-crank stumble):** At `70 °F`, `v005` commanded `0.870`/`0.807` lambda (`ECM 44519` `64 °F` cliff fix intact), though crank #1 (`t = 7.5–12.5 s`, `MAF = 0.52–0.64 V`) stumbled/stalled before catching immediately on crank #2 (`t = 17.0 s`).
   - **Old Scanner config still active in `v005`:** `Datalog-v005.hpl` still used the old 27-channel layout, so `Engine RPM`, `Timing Advance`, `Fuel Pressure`, and `IAC DC` dropped out and `STFT Bank 2` logged instead of `STFT Bank 1`.

2. **Why warm idle pulled `+21.1%` fuel trim (`CmdLam = 0.826`):**
   - `ECM 230` (`LTFT Enable`) is `Disabled` in the `SVTv29.26` base calibration, so Closed Loop `Equivalence Ratio Commanded - Bank 1` (`CmdLam`) equals the entire active trim (`STFT = 1 / CmdLam - 1`).
   - Once idle adaptation (`STIT`) relaxed from `+0.30 lb/min` pegged (`v000`–`v002`) and `+0.128 lb/min` (`v0004`) down to **`+0.036 ± 0.021 lb/min`** in `v005`, true warm idle airflow settled around **`~0.44 lb/min`** (matching factory `ECM 44242` base idle air of `0.430 lb/min` @ `944 RPM` + `+0.036` STIT). That put warm idle down at **`0.668–0.688 V`**, where `v002` reported only `0.352–0.374 lb/min`.
   - Because `v001`/`v002` used an overly steep power-law slope below `1.10 V` (`1.00 V / 0.65 V = 2.60×` vs `~2.19×` measured), `v002` under-reported airflow monotonically as voltage dropped across clean switching Closed Loop (`t >= 98 s` in `v005`):
     - `0.668 V` (`n = 1,517`): `v002` = `2.79 lb/h` UI -> `CmdLam = 0.8229` (**`+21.5%`** trim, peaking at `0.7937` / `+26.0%` near the lean rail) -> Corrected = **`3.39 lb/h` UI**
     - `0.688 V` (`n = 2,153`): `v002` = `2.97 lb/h` UI -> `CmdLam = 0.8325` (**`+20.1%`**) -> Corrected = **`3.57 lb/h` UI**
     - `0.746 V` (`n = 774`): `v002` = `3.61 lb/h` UI -> `CmdLam = 0.8744` (**`+14.4%`**) -> Corrected = **`4.13 lb/h` UI**
     - `0.800 V` (`n = 664`): `v002` = `4.22 lb/h` UI -> `CmdLam = 0.8993` (**`+11.2%`**) -> Corrected = **`4.69 lb/h` UI**
     - `0.849 V` (`n = 565`): `v002` = `4.77 lb/h` UI -> `CmdLam = 0.9158` (**`+9.2%`**) -> Corrected = **`5.20 lb/h` UI**
     - `0.898 V` (`n = 231`): `v002` = `5.32 lb/h` UI -> `CmdLam = 0.9305` (**`+7.5%`**) -> Corrected = **`5.72 lb/h` UI**
     - `0.951 V` (`n = 210`): `v002` = `6.03 lb/h` UI -> `CmdLam = 0.9474` (**`+5.6%`**) -> Corrected = **`6.36 lb/h` UI**
     - `0.995 V` (`n = 192`): `v002` = `6.73 lb/h` UI -> `CmdLam = 0.9700` (**`+3.1%`**) -> Corrected = **`6.94 lb/h` UI**
     - `1.044 V` (`n = 148`): `v002` = `7.55 lb/h` UI -> `CmdLam = 0.9735` (**`+2.7%`**) -> Corrected = **`7.75 lb/h` UI**
   - **Why `1.20–4.80 V` stays untouched:** The brief `t = 66–84 s` swing (`CmdLam` up to `1.23` at `1.12–1.24 V`) occurred during the cold-start O2 wakeup transition right after startup enrichment (`88–96 °F`) and quickly vanished — it is **not** a `1.20 V` MAF error. Raising `0.38–1.10 V` smoothly also helps crank #1 (`0.52–0.64 V`) light off cleanly without altering anything at `>= 1.20 V`.

---

## Exact Edits in VCM Editor (`1` Table Only)

1. Open your flashed **`v002-idle-maf-bump.hpt`** in **HP Tuners VCM Editor**.
2. Click **`File -> Save As...`** immediately and save as **`tunes/v003-low-end-maf-curve.hpt`**.
3. Search **`12163`** in **Parameter Navigator** (`Engine / Airflow / General / MAF Calibration / MAF Airflow vs. Voltage`).
4. Check which **Unit Label** appears beside the row (`lb/h` vs `lb/min` — never mix the two blocks below, and never edit the grey Voltage header row `0.00..4.80 V`):
   - **Click the `0.00 V` white data cell**, confirm all `30` columns align, and paste (`Ctrl + V`) the matching row:

### Option A — Editor shows **`lb/h`** (e.g. `0.65 V = 2.61` on `v002` -> **`3.22`** for `v003`; `4.80 V = 337.71`)

```text
0.00	1.36	1.46	1.68	1.92	2.05	2.25	2.32	2.79	3.22	3.69	5.75	7.05	8.60	10.46	12.60	15.00	17.66	20.41	26.79	34.17	42.95	52.90	65.33	79.50	95.51	113.45	133.43	179.83	337.71
```

### Option B — Editor shows **`lb/min`** (`÷ 60` quirk; e.g. `0.65 V = 0.0435` on `v002` -> **`0.0537`** for `v003`; `4.80 V = 5.6285`)

```text
0.0000	0.0227	0.0243	0.0280	0.0320	0.0342	0.0375	0.0387	0.0465	0.0537	0.0615	0.0958	0.1175	0.1433	0.1743	0.2100	0.2500	0.2943	0.3402	0.4465	0.5695	0.7158	0.8817	1.0888	1.3250	1.5918	1.8908	2.2238	2.9972	5.6285
```

---

## Full `ECM 12163` Cell Reference (`v002` -> `v003`)

| Voltage (`V`) | `v002` (`lb/h` UI) | **`v003` (`lb/h` UI)** | Change vs `v002` | **`v003` (`lb/min` Editor UI)** | True Logged `lb/min` (`÷ 7.937`) |
| :---: | :---: | :---: | :---: | :---: | :---: |
| `0.00` | `0.00` | **`0.00`** | `+0.0%` | **`0.0000`** | `0.000` |
| `0.38` | `0.92` | **`1.36`** | `+47.8%` | **`0.0227`** | `0.171` |
| `0.40` | `1.01` | **`1.46`** | `+44.6%` | **`0.0243`** | `0.184` |
| `0.44` | `1.20` | **`1.68`** | `+40.0%` | **`0.0280`** | `0.212` |
| `0.48` | `1.41` | **`1.92`** | `+36.2%` | **`0.0320`** | `0.242` |
| `0.50` | `1.53` | **`2.05`** | `+34.0%` | **`0.0342`** | `0.258` |
| `0.53` | `1.73` | **`2.25`** | `+30.1%` | **`0.0375`** | `0.283` |
| `0.54` | `1.80` | **`2.32`** | `+28.9%` | **`0.0387`** | `0.292` |
| `0.60` | `2.23` | **`2.79`** | `+25.1%` | **`0.0465`** | `0.352` |
| **`0.65`** | `2.61` | **`3.22`** | **`+23.4%`** | **`0.0537`** | **`0.406`** |
| **`0.70`** | `3.07` | **`3.69`** | **`+20.2%`** | **`0.0615`** | **`0.465`** |
| **`0.90`** | `5.32` | **`5.75`** | **`+8.1%`** | **`0.0958`** | **`0.724`** |
| **`1.00`** | `6.79` | **`7.05`** | **`+3.8%`** | **`0.1175`** | **`0.888`** |
| **`1.10`** | `8.49` | **`8.60`** | **`+1.3%`** | **`0.1433`** | **`1.084`** |
| `1.20` | `10.46` | **`10.46`** | `+0.0%` | **`0.1743`** | `1.318` |
| `1.30` | `12.60` | **`12.60`** | `+0.0%` | **`0.2100`** | `1.588` |
| `1.40` | `15.00` | **`15.00`** | `+0.0%` | **`0.2500`** | `1.890` |
| `1.50` | `17.66` | **`17.66`** | `+0.0%` | **`0.2943`** | `2.225` |
| `1.60` | `20.41` | **`20.41`** | `+0.0%` | **`0.3402`** | `2.572` |
| `1.80` | `26.79` | **`26.79`** | `+0.0%` | **`0.4465`** | `3.375` |
| `2.00` | `34.17` | **`34.17`** | `+0.0%` | **`0.5695`** | `4.305` |
| `2.20` | `42.95` | **`42.95`** | `+0.0%` | **`0.7158`** | `5.412` |
| `2.40` | `52.90` | **`52.90`** | `+0.0%` | **`0.8817`** | `6.665` |
| `2.60` | `65.33` | **`65.33`** | `+0.0%` | **`1.0888`** | `8.231` |
| `2.80` | `79.50` | **`79.50`** | `+0.0%` | **`1.3250`** | `10.017` |
| `3.00` | `95.51` | **`95.51`** | `+0.0%` | **`1.5918`** | `12.034` |
| `3.20` | `113.45` | **`113.45`** | `+0.0%` | **`1.8908`** | `14.294` |
| `3.40` | `133.43` | **`133.43`** | `+0.0%` | **`2.2238`** | `16.812` |
| `3.80` | `179.83` | **`179.83`** | `+0.0%` | **`2.9972`** | `22.658` |
| `4.80` | `337.71` | **`337.71`** | `+0.0%` | **`5.6285`** | `42.551` |

---

## Predicted Closed Loop Improvement (`v002` -> `v003`)

Simulated against all clean Closed Loop bins in `Datalog-v005.hpl` (`t >= 98 s`; `Datalog-v0004.hpl` predicts `+3.5%` to `+5.8%` across `0.70–0.95 V`):

| MAF Voltage Bin (`V`) | Measured Median (`V`) | `v002` Closed Loop Trim (`STFT`) | **Predicted `v003` Trim (`STFT`)** | **Predicted `v003` `CmdLam`** |
| :---: | :---: | :---: | :---: | :---: |
| `0.65` | `0.668` | `+21.5%` | **`+0.1%`** | `0.9994` |
| `0.70` | `0.688` | `+20.1%` | **`-0.2%`** | `1.0017` |
| `0.75` | `0.746` | `+14.4%` | **`-0.9%`** | `1.0089` |
| `0.80` | `0.800` | `+11.2%` | **`-0.6%`** | `1.0057` |
| `0.85` | `0.849` | `+9.2%` | **`-0.3%`** | `1.0034` |
| `0.90` | `0.898` | `+7.5%` | **`-0.1%`** | `1.0007` |
| `0.95` | `0.951` | `+5.6%` | **`-0.8%`** | `1.0085` |
| `1.00` | `0.995` | `+3.1%` | **`-0.7%`** | `1.0070` |
| `1.05` | `1.044` | `+2.7%` | **`+0.3%`** | `0.9969` |

---

## Compare Check & Next Test Protocol (`Datalog-v006.hpl`)

1. **Pre-Flash Compare Check:** Save `tunes/v003-low-end-maf-curve.hpt`, then run **`Compare -> Open Compare File... -> v002-idle-maf-bump.hpt`** -> confirm **ONLY `ECM 12163` (`0.38–1.10 V`)** changed and `1.20–4.80 V` is untouched.
2. **Mandatory — Load the 18-Channel VCM Scanner Profile Before Connecting:**
   `Datalog-v005.hpl` still used the old 27-channel layout, which dropped `Engine RPM`, `Timing Advance`, `Fuel Pressure`, and `IAC DC`.
   1. Open **VCM Scanner**, right-click inside the **Channels** window -> **Open Channel Config...**.
   2. Select **`focus-svt-nic/profiles/Focus_SVT_Returnless_Boost.Channels.xml`**.
   3. Confirm **18 channels** load (including `Engine RPM 2135`, `Timing Advance 2500`, `STFT Bank 1 6304`, `Fuel Pressure 6502 (psi)`, `Fuel Pump Commanded DC 6506`, `Idle Adapt STIT 2240`, and `IAC DC 2082`) and save the Scanner config.
3. **AEM Wideband & Physical Leak Cross-Check at Warm Idle (`170–180 °F`):**
   - Watch what the cockpit **AEM wideband** reads once `STFT Bank 1` settles near `0%` (`±5%`):
     - **`~14.5–14.9 AFR`:** Confirms clean airflow metering with no active exhaust leak skewing the O2 sensor — cleared for Stage B off-idle holds.
     - **`< 13.5 AFR`** while `O2 B1S1` switches around stoich: Proves a remaining **pre-O2 exhaust leak** pulling fresh air into the narrowband and biasing trims rich.
   - Also check the **VTA blow-off valve** and intake/vacuum hoses for any small leak under `~19 inHg` idle vacuum before driving.
4. **Two-Stage Parked Log (`0 psi` boost — save as `logs/Datalog-v006.hpl`):**
   - **Stage A (Idle):** Cold-to-warm stationary idle to `>= 170–180 °F`. Confirm `STFT Bank 1` within **`±6%`**, `Fuel Source = Stoich` (Closed Loop active), `Fuel Pressure` (`6502`) `~38–42 psi`, `FPDM Cmd DC` `~24–28%`, `Open Loop FMEM = No`, and all 18 channels populated.
   - **Stage B (Only if Stage A passes cleanly):** In neutral, perform 3 gentle steady holds at **`1,500`**, **`2,000`**, and **`2,500 RPM`** for **`15–20 s` each**, with **`20 s` idle returns** between them. That safely maps `1.10–1.80 V` Closed Loop trims at `0 psi` boost before any street cruising.
5. **Hard Abort Rules:**
   - **`FPDM Cmd DC >= 45.0%`** or **`Fuel Pressure < 30 psi`** while running
   - **Wideband `> 16.5 AFR`** at warm idle or **`Lambda > 0.80`** under boost (`> 3 psi`)
   - **`ECT > 220 °F`**, **`Knock Retard > 1.5°–2.0°`**, or idle stall/hunting **`< 650 RPM`**
