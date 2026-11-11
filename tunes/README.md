# Tune Revision Catalog

All tune binaries (`.hpt`) and calibration documentation live here.

### Start Here — Building `v000` Initial Start Tune
- **Fresh `v000` README Doc:** **[`v000-initial-start-README.md`](v000-initial-start-README.md)**
- **Starting Base Tune:** [`SVTv29.26.hpt`](SVTv29.26.hpt) (`212,349` bytes) — **DO NOT modify in place.**
- **Target `v000` Output File:** `tunes/v000-initial-start.hpt` (`File -> Save As` from `SVTv29.26.hpt`).

### Modular Navigator Docs (`docs/`)
1. [Master Build & Navigator Guide](../docs/NIC_TUNE_BUILD_README.md)
2. [01 — Returnless Fuel, Closed Loop & DTCs](../docs/01-FUEL-ERFS-AND-DTC-README.md)
3. [02 — VCT Lockout, Idle/Dashpot & Cooling Fans](../docs/02-VCT-IDLE-AND-FANS-README.md)
4. [03 — Verify & Keep Checklist](../docs/03-VERIFY-AND-KEEP-CHECKLIST-README.md)

### Versioning Rules
1. **`v000` (`v000-initial-start.hpt`)** is Nic's initial self-built startup & idle tune derived from `SVTv29.26.hpt`. Future MAF, drivability, and boost revisions increment cleanly from **`v001`**, **`v002`**, etc.
2. **Never edit an existing `.hpt` file in place.** Always `Save As` the next revision before making changes and record its SHA-256 hash in [`revisions.json`](revisions.json).
3. Keep an untouched ECU read from the vehicle in `../backups/` per [`docs/first-connection.md`](../docs/first-connection.md).
