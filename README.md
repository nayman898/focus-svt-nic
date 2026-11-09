# Nic's Boosted SVT Focus Tuning Repository

Calibration tracking, datalog analysis, diagnostic reviews, and VCM Scanner profiles for **Nic's boosted 2004 Ford Focus SVT**, operating on Ford's factory **Electronic Returnless Fuel System (ERFS)**.

---

## 🚀 Getting Started & Immediate Next Steps

> **👉 [Click Here for Nic's Immediate Next Steps Guide](docs/next-steps.md)**  
> Review the 4-step checklist covering tune confirmation, hardware safety checks, BOV routing, and the first baseline idle log.

1. **Hardware Info:** Completed in **[VEHICLE_INFO.md](VEHICLE_INFO.md)**.
2. **Next Steps Checklist:** See **[docs/next-steps.md](docs/next-steps.md)** for immediate under-the-hood checks.
3. **Interactive Calibration Diff Preview:** Open **[docs/index.html](docs/index.html)** (or view the [Live Web Demo](https://htmlpreview.github.io/?https://github.com/nayman898/focus-svt-nic/blob/main/docs/index.html)).
4. **First Idle Log:** Follow **[docs/first-connection.md](docs/first-connection.md)** to capture the baseline.

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
