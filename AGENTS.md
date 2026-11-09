# Agent & Pairing Rules of Engagement: Focus SVT Returnless Boost

This repository contains calibration files, datalogs, analysis reports, and documentation for tuning Nic's boosted 2004 Ford Focus SVT using HP Tuners (VCM Editor & VCM Scanner).

---

## 1. Safety & Flash Authority
* **The vehicle owner performs all ECU writes, readbacks, and DTC clears.** The assistant never initiates writes or assumes a write was performed without explicit confirmation.
* **Pre-Flash Verification:** Before flashing any file, verify:
  1. Exact filename, size, and SHA-256 hash match the candidate.
  2. The candidate has an identified parent and an immediate rollback file.
  3. Battery voltage is adequate (>12.4V) before writing.
* **Stop Conditions (Immediate Test Abort):**
  * **Fuel Pressure Drop / FPDM Saturation:** FPDM duty cycle $\ge$ 45.0% or Fuel Rail Pressure dropping under boost.
  * **Lean Under Boost:** Measured wideband $\lambda > 0.80$ (AFR $> 11.8$) under boost $> 3$ psi.
  * **Knock Retard:** Any audible knock or verified knock retard $> 2.0^\circ$.
  * **Thermal Alarm:** Engine Coolant Temp (ECT) $> 220^\circ\text{F}$ or rapid uncommanded thermal spike.
  * **Severe Idle Hunting / Stall:** RPM falling below $650\text{ RPM}$ on clutch-in.

---

## 2. Returnless Fueling Architecture (ERFS) Rules
This vehicle utilizes Ford's **Electronic Returnless Fuel System (ERFS)**. Do NOT apply return-style shortcuts from other repositories:
1. **Never Zero Out ECM 6950:** The Manifold Vacuum Multiplier must remain at its factory value (`0.484`) so the ECU accurately computes differential pressure across the injector tip.
2. **Never Flatten Pressure Multipliers:** Keep the dynamic pressure compensation multipliers active (ECM 32060, 32062, 32064, 32052). In returnless systems, rail pressure fluctuates during rapid transients; these tables prevent lean tip-in stumbles and lift-off bogging.
3. **Preserve Accurate FRPS Transfer (ECM 7596):** Ensure the 0–70 psi linear calibration is retained. A flat pressure curve will disable the ECU's ability to regulate the fuel pump.
4. **Injector Characterization Integrity:** When changing injectors, use full official Ford characterization data (High Slope, Low Slope, Breakpoint, Battery Voltage Offset curve, and pressure multipliers).

---

## 3. Systematic Iteration & Traceability
* **One Hypothesis per Revision:** Isolate changes (e.g. idle air vs. MAF low-flow vs. tip-in spark vs. VCT cam phasing).
* **Catalog Every Tune:** Every candidate binary placed in `tunes/` must be registered in `tunes/revisions.json` with SHA-256 hash, parent revision, rationale, and specific parameter deltas.
* **Native Datalog Preservation:** Always retain raw `.hpl` Scanner logs alongside `.csv` exports in `logs/`. Do not overwrite or discard original data.
* **IAT Logging:** Include Intake Air Temperature (PID 2127) at a 1.0-second interval to monitor post-compressor / intercooler charge temperatures without saturating the OBD polling bus.
