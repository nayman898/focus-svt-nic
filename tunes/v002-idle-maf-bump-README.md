# Revision `v002` — Low-End MAFia Position `2` Fuel Bump (`+15%` Idle / Warmup)

> **Parent Tune:** [`tunes/v001-mafia-pos2.hpt`](v001-mafia-pos2.hpt) *(your currently flashed MAFia Position `2` tune — **always `File -> Save As...` `tunes/v002-idle-maf-bump.hpt` first**)*  
> **Rollback:** [`tunes/v001-mafia-pos2.hpt`](v001-mafia-pos2.hpt)  
> **Hardware Confirmed:** Stock Focus SVT MAF + `2.75"` draw-through intake + **DiabloSport MAFia at Dial Position `2` (`5.5 V -> 5.0 V`)**  
> **Only Tune Parameter Changed:** **`[ECM 12163]`** `MAF Airflow vs. Voltage` (`0.38–2.20 V` smoothly bumped **`+15%` across `0.70–1.20 V`**, tapering smoothly to **`0%` at `>= 2.40 V`**). Every other table stays identical to `v001`.

---

## Why `v002` Is Needed (`Datalog-v002.hpl` & `Datalog-v003.hpl` Findings)

1. **`v001` fixed the `2×` overfueling:**
   - Warm idle (`Datalog-v002.hpl` / [`logs/v002.csv`](../logs/v002.csv), `184–186 °F`, `944 RPM` target): `MAF AD = 190.5 counts` (`0.930 V`) -> **`0.6315 lb/min`**, `Air Load = 0.2371`, `Calc MAP = 7.04 psi` (down from `1.315 lb/min` / `14.03 psi` MAP on `SVTv29.26`).
2. **Why `v003` was aborted early (`95.5 s`, `136 -> 156 °F`):**
   - With `CmdLam = 0.970`, as warmup idle settled to `992 RPM` (`AD = 211.8` / `1.034 V`, `MAF = 0.807 lb/min`), `O2 B1S1` peaked at only **`0.3304 V`** (`t = 81 s`) and fell to **`0.0472 V`** (`t = 95.5 s`), while the cockpit **AEM wideband started reading super lean**.
   - **Important Exhaust-Leak Warning:** Once `v001` stopped flooding the engine with 2× fuel, the known **exhaust leak before the narrowband** can pull ambient `O2` into the exhaust stream at low idle flow (`< 1.0 lb/min`), causing both `O2 B1S1` and any downstream wideband to read lean (`0.05 V` / high AFR) **and** forcing Closed Loop (`>= 158 °F`, `ECM 44513`) to dump up to `+25%` false trim if activated while leaking!
3. **Why `+15%` (`v002`) is the safe step right now:**
   - Adds a smooth, convex **`+15%`** cushion across `0.70–1.20 V` (lifting warm `0.930 V` idle from `0.632 -> ~0.728 lb/min` and `1.034 V` warmup from `0.809 -> ~0.931 lb/min`), tapering cleanly down to **`0%` at `2.40–4.80 V`** so high-load/boost cells stay untouched and **still stays far below `SVTv29.26`** (`10.2–16.4`) so it won't flood plugs.

---

## Exact Edits in VCM Editor (`1` Table Only)

1. Open your flashed **`v001-mafia-pos2.hpt`** in **HP Tuners VCM Editor**.
2. Click **`File -> Save As...`** and save as **`tunes/v002-idle-maf-bump.hpt`** right away.
3. Search **`12163`** in **Parameter Navigator** (`Engine / Airflow / General / MAF Calibration / MAF Airflow vs. Voltage`).
4. Check which **Unit Label** appears beside the row (`lb/h` vs `lb/min` — HP Tuners Focus EEC-VI Editor UI sometimes labels the numeric axis `lb/min` even though the underlying numbers match `lb/h` at `~7.937 × True lb/min`):
   - **Click the `0.00 V` value cell**, verify all **`30` Voltage columns (`0.00` .. `4.80 V`)** match below, then copy-paste the single matching `30`-value row below (`Ctrl + V`):

### Option A — Editor shows **`lb/h`** (e.g. `4.63` at `0.90 V` on `v001` -> **`5.32`** for `v002`)

```text
0.00	0.92	1.01	1.20	1.41	1.53	1.73	1.80	2.23	2.61	3.07	5.32	6.79	8.49	10.46	12.60	15.00	17.66	20.41	26.79	34.17	42.95	52.90	65.33	79.50	95.51	113.45	133.43	179.83	337.71
```

### Option B — Editor shows **`lb/min`** (`÷ 60` quirk; e.g. `0.0772` at `0.90 V` on `v001` -> **`0.0887`** for `v002`)

```text
0.0000	0.0153	0.0168	0.0200	0.0235	0.0255	0.0288	0.0300	0.0372	0.0435	0.0512	0.0887	0.1132	0.1415	0.1743	0.2100	0.2500	0.2943	0.3402	0.4465	0.5695	0.7158	0.8817	1.0888	1.3250	1.5918	1.8908	2.2238	2.9972	5.6285
```

---

## Full `ECM 12163` Cell Reference (`v001` -> `v002`)

| Voltage (`V`) | `v001` (`lb/h` UI) | **`v002` (`lb/h` UI)** | Change vs `v001` | **`v002` (`lb/min` Editor UI)** | True Logged `lb/min` (`÷ 7.937`) |
| :---: | :---: | :---: | :---: | :---: | :---: |
| `0.00` | `0.00` | **`0.00`** | `0.0%` | **`0.0000`** | `0.000` |
| `0.38` | `0.85` | **`0.92`** | `+8.2%` | **`0.0153`** | `0.116` |
| `0.40` | `0.93` | **`1.01`** | `+8.6%` | **`0.0168`** | `0.127` |
| `0.44` | `1.09` | **`1.20`** | `+10.1%` | **`0.0200`** | `0.151` |
| `0.48` | `1.27` | **`1.41`** | `+11.0%` | **`0.0235`** | `0.178` |
| `0.50` | `1.37` | **`1.53`** | `+11.7%` | **`0.0255`** | `0.193` |
| `0.53` | `1.53` | **`1.73`** | `+13.1%` | **`0.0288`** | `0.218` |
| `0.54` | `1.59` | **`1.80`** | `+13.2%` | **`0.0300`** | `0.227` |
| `0.60` | `1.95` | **`2.23`** | `+14.4%` | **`0.0372`** | `0.281` |
| `0.65` | `2.29` | **`2.61`** | `+14.0%` | **`0.0435`** | `0.329` |
| `0.70` | `2.67` | **`3.07`** | `+15.0%` | **`0.0512`** | `0.387` |
| **`0.90`** | `4.63` | **`5.32`** | **`+14.9%`** | **`0.0887`** | **`0.670`** |
| **`1.00`** | `5.90` | **`6.79`** | **`+15.1%`** | **`0.1132`** | **`0.856`** |
| **`1.10`** | `7.38` | **`8.49`** | **`+15.0%`** | **`0.1415`** | **`1.070`** |
| **`1.20`** | `9.10` | **`10.46`** | **`+14.9%`** | **`0.1743`** | **`1.318`** |
| `1.30` | `11.05` | **`12.60`** | `+14.0%` | **`0.2100`** | `1.588` |
| `1.40` | `13.27` | **`15.00`** | `+13.0%` | **`0.2500`** | `1.890` |
| `1.50` | `15.77` | **`17.66`** | `+12.0%` | **`0.2943`** | `2.225` |
| `1.60` | `18.55` | **`20.41`** | `+10.0%` | **`0.3402`** | `2.572` |
| `1.80` | `25.04` | **`26.79`** | `+7.0%` | **`0.4465`** | `3.376` |
| `2.00` | `32.86` | **`34.17`** | `+4.0%` | **`0.5695`** | `4.305` |
| `2.20` | `42.11` | **`42.95`** | `+2.0%` | **`0.7158`** | `5.412` |
| `2.40` | `52.90` | **`52.90`** | `0.0%` | **`0.8817`** | `6.665` |
| `2.60` | `65.33` | **`65.33`** | `0.0%` | **`1.0888`** | `8.231` |
| `2.80` | `79.50` | **`79.50`** | `0.0%` | **`1.3250`** | `10.017` |
| `3.00` | `95.51` | **`95.51`** | `0.0%` | **`1.5918`** | `12.034` |
| `3.20` | `113.45` | **`113.45`** | `0.0%` | **`1.8908`** | `14.294` |
| `3.40` | `133.43` | **`133.43`** | `0.0%` | **`2.2238`** | `16.812` |
| `3.80` | `179.83` | **`179.83`** | `0.0%` | **`2.9972`** | `22.658` |
| `4.80` | `337.71` | **`337.71`** | `0.0%` | **`5.6285`** | `42.551` |

---

## Compare Check & Next Test Protocol (IMPORTANT)

1. Save `v002-idle-maf-bump.hpt`, run **`Compare -> Open Compare File... -> v001-mafia-pos2.hpt`** -> confirm **ONLY `ECM 12163` (`0.38–2.20 V`)** changed.
2. **Do BEFORE starting `v002`:**
   - **Seal the pre-O2 exhaust leak** (as soon as possible — while leaking, `O2 B1S1` and any downstream wideband can still falsely read lean at idle and fool Closed Loop `STFT` once `ECT >= 158 °F`).
   - Quick physical check: confirm the **`VTA` BOV** isn't cracked open under idle vacuum, couplers/vac lines are tight, and **`Fuel Filter`** isn't starving rail pressure.
   - **Import [`Focus_SVT_Returnless_Boost.Channels.xml`](../profiles/Focus_SVT_Returnless_Boost.Channels.xml) into VCM Scanner!** We MUST see live **`Fuel Pressure Sensor` (`6507`)**, **`STFT B1` (`6304`)**, **`RPM` (`2135`)**, **`TPS ADC` (`3017`)**, and **`Open Loop FMEM` (`12947`)** — the old Scanner config drops `RPM`/`FP` and logs `(1 - CmdLam)*100` in place of `STFT Bank 2`.
3. **Warm Idle Test (`0 psi` boost):**
   - Key On (`KOEO`): confirm **`FRPS` (`6507`) reads `~2.7–3.0 V` (`~38–42 psi`)** with prime.
   - Crank & idle warm past **`180–195 °F`** so fans cycle, noting what the **AEM wideband** reads at warmup vs warm idle. Save log as `logs/Datalog-v004.hpl`.
   - **Abort immediately if:** wideband stays `> 16.5 AFR` warm without an exhaust leak (stop and check fuel pressure/BOV leak first), `FPDM Cmd DC >= 45%`, `FRPS < 2.2 V` (`< 30 psi`) running, or `ECT > 220 °F`.
