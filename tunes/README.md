# Tune Revision Catalog

All tune binaries (`.hpt`) and calibration documentation live here.

### Revision Guides

- **Next Trial (`v010`):** [Recovery Build Sheet](v010-recovery-README.md). Unclips low-speed dashpot (`ECM 32945`), raises idle spark floor (`ECM 44582`), sets `1,050 RPM` idle (`ECM 44218/44217`), and raises DFCO exit (`ECM 2291`) on `v009`.

- **Latest Assumed Logged Recipe (`v009`):** [Return-to-Idle Airflow Build Sheet](v009-return-to-idle-README.md). Add earlier and longer dashpot airflow support from the exact combined v007 + v008 file used for Datalog-v019; includes a staged path to a controlled moving test.
- **Earlier Decay Recipe (`v007`):** [Idle Handoff Build Sheet](v007-idle-handoff-README.md). Test two low-flow dashpot decay edits from the exact `v006` file, with `v006` as rollback.
- **Earlier Pre-Position Recipe (`v008`):** [Low-RPM Dashpot Catch Build Sheet](v008-low-rpm-dashpot-catch-README.md). Test more pre-position at 2,150 RPM from the exact `v006` file if the first idle catch still undershoots.
- **Current Baseline (`v006`):** [Idle Fuel Build Sheet](v006-idle-fuel-README.md). Confirmed after the upstream O₂ replacement in `Datalog-v016.hpl` and `Drive-log-v001.hpl`.
- **Trial on Hold (`v005`):** [Low-Airflow Dashpot Decay Build Sheet](v005-dashpot-decay-README.md). Idle AFR briefly improved on `v003` before the lean reading recurred. The `v012` capture gives the Scanner reference for the parked fuel trial.
- **Pre-Position Trial (`v004`):** [Dashpot Catch Build Sheet](v004-dashpot-catch-README.md). Test a single `ECM 32988` adjustment from `v003`.
- **Fresh `v000` README Doc:** **[`v000-initial-start-README.md`](v000-initial-start-README.md)**
- **MAFia Position `2` Base (`v001`):** **[`v001-mafia-pos2-README.md`](v001-mafia-pos2-README.md)** — `ECM 12163` 30-point Position `2` MAF curve (`lb/h` & `lb/min` tables) and 20-channel VCM Scanner XML import steps.
- **Low-End Bump (`v002`):** **[`v002-idle-maf-bump-README.md`](v002-idle-maf-bump-README.md)** — Smooth `+15%` low-end `ECM 12163` bump (`0.70–1.20 V`, tapering to `0%` at `>= 2.40 V`) after `v003` lean cutoff + pre-O2 exhaust leak & Scanner XML checklist.
- **`v006` Parent (`v003`):** **[`v003-low-end-maf-curve-README.md`](v003-low-end-maf-curve-README.md)** — Strictly convex `0.38–1.10 V` `ECM 12163` reshape (`1.20–4.80 V` untouched) calibrated from `Datalog-v005.hpl` Closed Loop trims (`+21.1%` at `0.678 V` -> `+2.7%` at `1.044 V`), plus mandatory 18-channel XML import & parked `1,500–2,500 RPM` test protocol.
- **Starting Base Tune:** [`SVTv29.26.hpt`](SVTv29.26.hpt) (`212,349` bytes) — **DO NOT modify in place.**
- **Target Output Files:** `tunes/v000-initial-start.hpt` (`File -> Save As` from `SVTv29.26.hpt`) -> `tunes/v001-mafia-pos2.hpt` -> `tunes/v002-idle-maf-bump.hpt` -> `tunes/v003-low-end-maf-curve.hpt`.

### Modular Navigator Docs (`docs/`)
1. [Master Build & Navigator Guide](../docs/NIC_TUNE_BUILD_README.md)
2. [01 — Returnless Fuel, Closed Loop & DTCs](../docs/01-FUEL-ERFS-AND-DTC-README.md)
3. [02 — VCT Lockout, Idle/Dashpot & Cooling Fans](../docs/02-VCT-IDLE-AND-FANS-README.md)
4. [03 — Verify & Keep Checklist](../docs/03-VERIFY-AND-KEEP-CHECKLIST-README.md)

### Versioning Rules
1. **`v000` (`v000-initial-start.hpt`)** is Nic's initial self-built startup & idle tune derived from `SVTv29.26.hpt`. Future MAF, drivability, and boost revisions increment cleanly from **`v001`**, **`v002`**, etc.
2. **Never edit an existing `.hpt` file in place.** Always `Save As` the next revision before making changes and record its SHA-256 hash in [`revisions.json`](revisions.json).
3. Keep an untouched ECU read from the vehicle in `../backups/` per [`docs/first-connection.md`](../docs/first-connection.md).
