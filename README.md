# Nic's Boosted SVT Focus Tuning Repository

Calibration tracking, datalog analysis, diagnostic reviews, and VCM Scanner profiles for **Nic's boosted 2004 Ford Focus SVT**, operating on Ford's factory **Electronic Returnless Fuel System (ERFS)**.

---

## 🚀 Getting Started (Step-by-Step for Nic)

1. **Fill out the Hardware Questionnaire:**
   * Open and complete **[VEHICLE_INFO.md](VEHICLE_INFO.md)**.
   * Provide as much detail as possible regarding the turbo/supercharger kit, target boost, injector part numbers, fuel pump, MAF housing, and wideband O2.
2. **Pull the Virgin ECU Backup:**
   * Follow the step-by-step instructions in **[docs/first-connection.md](docs/first-connection.md)**.
   * Read the ECU via VCM Editor and save the baseline to `backups/v000-stock-read.hpt` and `tunes/v000-stock-read.hpt`.
3. **Load the Scanner Profile:**
   * Open VCM Scanner and load `profiles/Focus_SVT_Returnless_Boost.Channels.xml`.
4. **Record the First Diagnostic Idle Log:**
   * Capture a cold-start to warm-idle log and save it in `logs/`.

---

## ⚙️ Calibration Architecture: Returnless (ERFS)

Unlike mechanical return-style systems with 1:1 regulators, this calibration relies on Ford's factory Electronic Returnless architecture:
* **Dynamic Delta-P Modeling:**
  * `ECM 6950` (Manifold Vacuum Multiplier) is preserved at `0.484`.
  * Pressure Compensation Multipliers (`ECM 32060`, `32062`, `32064`, `32052`) remain dynamic active curves to compensate for rail pressure fluctuations during throttle transitions.
* **FPDM Pump Control:**
  * The ECU actively commands the Fuel Pump Driver Module via closed-loop PID.
  * Commanded pump duty cycle is monitored closely (48% indicates pump saturation).
* **Thermal Monitoring (IAT):**
  * Post-compressor / intercooler charge temperature is tracked via PID 2127 (1.0s interval) to protect against heat soak and spark detonation.

---

## 📁 Repository Layout

* **`VEHICLE_INFO.md`**: Hardware checklist and vehicle configuration.
* **`vehicle.json`**: Machine-readable specification parsed by tuning scripts.
* **`AGENTS.md`**: Strict safety rules, stop conditions, and tuning procedures.
* **`backups/`**: Permanent repository for the untouched factory ECU read.
* **`tunes/`**: Versioned calibration files (`v001`, `v002`, etc.) and `revisions.json` catalog.
* **`profiles/`**: Ready-to-use VCM Scanner channel profiles with returnless PIDs.
* **`logs/`**: Raw `.hpl` datalogs and exported `.csv` files.
* **`reports/`**: Detailed telemetry reviews, wideband tracking, and pull comparisons.
* **`docs/`**: Setup guides, testing roadmaps, and run cards.
* **`tools/`**: Analysis utilities and log processors.

---

## 🛡️ Safety & Rules of Engagement

* **The owner performs all ECU writes.** No tune is flashed without a confirmed parent revision and an immediate rollback file.
* **Stop Conditions:** Any run is immediately aborted if:
  * Fuel Pump Duty Cycle exceeds **45%** or rail pressure collapses under boost.
  * Wideband lambda exceeds **0.80** (AFR $> 11.8$) under boost $> 3$ psi.
  * Verified knock retard exceeds **$2.0^\circ$**.
  * Coolant temp exceeds **$220^\circ\text{F}$**.
