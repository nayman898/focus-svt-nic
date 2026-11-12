# Nic's 2003 Focus SVT Turbo — Returnless Tuning Repository

**Base Tune:** [`tunes/SVTv29.26.hpt`](tunes/SVTv29.26.hpt) (`212,349` bytes, `UJAHAS3 / ZED0`)  
**Initial Start Tune (`v000`):** Nic writes `tunes/v000-initial-start.hpt` himself in **HP Tuners VCM Editor** from [`SVTv29.26.hpt`](tunes/SVTv29.26.hpt) using exact **Parameter Navigator `ECM` numbers**.

> [!IMPORTANT]
> Start from **`tunes/SVTv29.26.hpt`**, NOT `tunes/SVT Tune.hpt` (factory 30 lb NA read).  
> Never edit `SVTv29.26.hpt` in place — always **`File -> Save As...`** `tunes/v000-initial-start.hpt` first.

---

## Start Here — Initial Start (`v000`), MAFia Pos 2 (`v001`) & Low-End Bump (`v002`)

- **[`tunes/v000-initial-start-README.md`](tunes/v000-initial-start-README.md)** — **Everything in one doc to build `v000-initial-start.hpt` and get the car started safely** (`ECM` numbers, exact current vs target values, copy-paste VCT matrix, verify-only table, Compare self-check, first-crank warmup log & abort rules).
- **[`tunes/v001-mafia-pos2-README.md`](tunes/v001-mafia-pos2-README.md)** — **`v001`: `ECM 12163` MAF curve for Diablo MAFia Position `2` + 20-channel VCM Scanner XML import** (fixes the `~2.2x` rich overfueling/FMEM lockout seen in `v000`/`v001` logs).
- **[`tunes/v002-idle-maf-bump-README.md`](tunes/v002-idle-maf-bump-README.md)** — **Current calibration (`v002`): smooth `+15%` low-end `ECM 12163` bump (`0.70–1.20 V`, tapering to `0%` at `>= 2.40 V`)** after `v003` lean cutoff + pre-O2 exhaust leak & Scanner XML checklist.

### Modular Navigator Reference Guides
1. **[Master Build & Navigator Guide](docs/NIC_TUNE_BUILD_README.md)** — Hardware pre-flight, VCM Editor units, Navigator workflow, Compare check & abort thresholds.
2. **[01 — Returnless Fuel, Closed Loop & DTCs](docs/01-FUEL-ERFS-AND-DTC-README.md)** — Detailed walkthrough for `ECM 7596`, `ECM 44519`, `ECM 32731`, `ECM 44511`, and `ECM 50`.
3. **[02 — VCT Lockout, Idle/Dashpot & Cooling Fans](docs/02-VCT-IDLE-AND-FANS-README.md)** — Detailed walkthrough for `ECM 44412`, `44218`, `44217`, `47996`, `32984`, `32988`, `24030`, `24031`, `24035`.
4. **[03 — Verify & Keep Checklist](docs/03-VERIFY-AND-KEEP-CHECKLIST-README.md)** — Existing `SVTv29.26.hpt` values (`6950 = 0.484`, Deka 60s, FPDM PID, `10.75°–11.50°` boost spark, `12163` MAF curve) to confirm intact and **never overwrite**.

---

## Quick `v000` ECM Number Cheat Sheet (`SVTv29.26.hpt` -> `v000-initial-start.hpt`)

| Search ECM ID | Parameter Name | Current (`SVTv29.26`) | Set `v000` To |
| :---: | :--- | :---: | :---: |
| **`7596`** | `Fuel Pressure Sensor Transfer Function` | All `40` psi | `0, 0, 0, 0, 0.00, 70.00, 78.72` psi |
| **`44519`** | `Fuel Cranking vs. ECT` | `64–150°F`: `0.335–0.764` | `0.930, 0.950, 0.970, 0.985` lambda |
| **`32731`** | `Open Loop Fuel TPS Thresh vs. RPM` | `0.00` across all RPM | `200, 200, 350, 350, 0, 0, 0` |
| **`44511`** | `Fuel Base vs. RPM vs. TPS` | `2,500 RPM @ 15.6/19.5%`: `1.07 / 1.14` | `1.00 / 1.00` lambda |
| **`50`** | `Master DTC List` (`P0190/P0192/P0193/P0132`) | Disabled / No MIL | `MIL Light` |
| **`44412`** | `VCT Angle vs. RPM vs. Load` | `-49.5°` boost / active at 6k | `v037` table (`0.00°` across `4,500–7,200`) |
| **`44218` / `44217`** | `Target Idle Speed` (`P/N` & `Drive`) | `850` RPM | `950` RPM |
| **`47996`** | `Idle Spark Proportional Gain` | `2.000` | `1.000` |
| **`32984`** | `Idle Dashpot Decay vs. Dashpot Airflow` | `0.0–0.6 lb/min`: `0.00` | `0.02, 0.03, 0.04, 0.05` |
| **`32988`** | `Idle Dashpot Pre-Position vs. RPM` | `2150/3150/4150`: `0.78/1.11/1.50` | `0.55 / 0.80 / 1.00` |
| **`24030` / `24031` / `24035`** | `Fan High Speed` ECT thresholds | `225 / 215 / 235°F` | `205.0 / 199.0 / 205.0°F` |

---

## Reference & Tooling Docs

- **[Hardware & Build Profile](VEHICLE_INFO.md)** — Stock 10.2:1 Focus SVT bottom end, SPA .64 turbo, ERFS, Deka 60 lb injectors, MAFia setup.
- **[Tuning Priorities & Safety Boundaries](TUNING_PRIORITIES.md)** — Phased tuning progression and hard abort thresholds.
- **[SVTv29.26 Deep Calibration Reference](docs/SVTv29.26_CALIBRATION_REFERENCE.md)** — Verified table/scalar dump of `tunes/SVTv29.26.hpt`.
- **[First Connection Guide](docs/first-connection.md)** & **[Next Steps](docs/next-steps.md)** — Pull untouched backup, setup Scanner channels, warm idle validation.
- **[Visual Diff Viewer (`docs/index.html`)](docs/index.html)** — Browser compare page (`SVTv29.26.hpt` vs `v000-initial-start.hpt`).
- **[VCM Scanner Profile](profiles/Focus_SVT_Returnless_Boost.Channels.xml)** — Proven 20-channel `UJAHAS3` Black Oak layout (`2135` RPM, `2500` Timing, `6304` STFT B1, `6507` FRPS Volts, `6506` FP Cmd DC, `2300/2302` MAF, `2082` IAC, `12942/12947` CL/FMEM).
- **Privacy Check:** Run `python tools/verify-privacy.py --all` before committing any logs or docs.
