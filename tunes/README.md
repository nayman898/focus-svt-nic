# Tune Revision Catalog

All tune binaries (`.hpt`) and calibration documentation live here.

### Start Here — Initial Start (`v000`) & MAFia Position 2 (`v001`)
- **Fresh `v000` README Doc:** **[`v000-initial-start-README.md`](v000-initial-start-README.md)**
- **Next `v001` MAF Calibration (`MAFia Pos 2`):** **[`v001-mafia-pos2-README.md`](v001-mafia-pos2-README.md)** — `ECM 12163` 30-point Position `2` MAF curve (`lb/h` & `lb/min` tables), rich/FMEM & `174–178 °F` ECT notes, and 20-channel VCM Scanner XML import steps.
- **Starting Base Tune:** [`SVTv29.26.hpt`](SVTv29.26.hpt) (`212,349` bytes) — **DO NOT modify in place.**
- **Target Output Files:** `tunes/v000-initial-start.hpt` (`File -> Save As` from `SVTv29.26.hpt`) -> `tunes/v001-mafia-pos2.hpt` (`File -> Save As` from your flashed `v000`).

### Modular Navigator Docs (`docs/`)
1. [Master Build & Navigator Guide](../docs/NIC_TUNE_BUILD_README.md)
2. [01 — Returnless Fuel, Closed Loop & DTCs](../docs/01-FUEL-ERFS-AND-DTC-README.md)
3. [02 — VCT Lockout, Idle/Dashpot & Cooling Fans](../docs/02-VCT-IDLE-AND-FANS-README.md)
4. [03 — Verify & Keep Checklist](../docs/03-VERIFY-AND-KEEP-CHECKLIST-README.md)

### Versioning Rules
1. **`v000` (`v000-initial-start.hpt`)** is Nic's initial self-built startup & idle tune derived from `SVTv29.26.hpt`. Future MAF, drivability, and boost revisions increment cleanly from **`v001`**, **`v002`**, etc.
2. **Never edit an existing `.hpt` file in place.** Always `Save As` the next revision before making changes and record its SHA-256 hash in [`revisions.json`](revisions.json).
3. Keep an untouched ECU read from the vehicle in `../backups/` per [`docs/first-connection.md`](../docs/first-connection.md).
