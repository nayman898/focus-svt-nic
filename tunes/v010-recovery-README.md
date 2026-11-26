# v010 Recovery — VTA-BOV Return-to-Idle Build Sheet

**Status: Ready to build and test (parked-to-closed-area progression).**

Build via **File → Save As** from the exact `v009` file used for `Datalog-v020.hpl` (`v009-return-to-idle.hpt`). Save as **`v010-recovery.hpt`**. Retain that exact `v009` file as rollback and record its filename, byte count, and SHA-256 alongside `v010-recovery.hpt`.

---

## Why these 4 edits (and no MAF/fuel cuts)

`Datalog-v020` showed that `v009`'s dashpot edits already improved the **initial** catch (`841 / 897 / 886 RPM` vs. `618 / 861 / 788 RPM` in `v019`), but Release #1 still stalled after a post-catch rich→lean oscillation (`1,024 RPM` rebound at `11.74 AFR` → IAC closed to `46.7%` and spark pulled to `4.8°` → snap to `17.97 AFR` → `0 RPM`).

Inspecting the `UJAHAS3` (`SVTv29.26`) calibration inventory revealed two hidden limiters causing that collapse when running a vented-to-atmosphere (VTA) BOV:
1. **`ECM 32945` (`Idle Dashpot Max Clip vs. VSS`)** hard-clips dashpot airflow to **`0.10 lb/min`** at `0 / 10 / 15 mph`, neutralizing `v009`'s `0.80–1.00 lb/min` dashpot pre-position during parked tests and low-speed stops.
2. **`ECM 44582` (`Spark Idle Control Minimum`)** allows idle spark to drop to **`-6.00°`** during the rich rebound right before the lean snap.

No MAF or blanket fuel edits are included in `v010` — the `-19% to -25%` post-restart STFT window in `Datalog-v020` decayed back to `0%` on its own and requires `LTFT` / `Injector Pulse Width` / `EVAP Purge` logging to diagnose.

---

## Exact edits from `v009` (`File → Save As → v010-recovery.hpt`)

Preserve all other `v009` / ERFS / FRPS (`ECM 6950 = 0.484`, `ECM 7596` linear transfer) / MAF / VCT / spark / fan cells.

| ECM ID | Parameter & Navigator Path | `v009` (`SVTv29.26`) | **`v010` Target** | Purpose |
| :---: | :--- | :---: | :---: | :--- |
| **`32945`** | `Idle Dashpot Max Clip vs. VSS`<br>`Engine / Idle / Airflow / Dashpot Clip / Idle Dashpot Max Clip vs. VSS` | `0 / 10 / 15 mph`: **`0.10`**<br>*(keep `20/40/100` = `0.60/0.60/1.00`)* | `0 / 10 / 15 mph`: **`0.25`** lb/min | Unclips `v009`'s dashpot at `0–15 mph` so IAC holds open through the post-lift lean snap |
| **`44582`** | `Spark Idle Control Minimum`<br>`Engine / Spark / Advance / Idle Spark Advance / Spark Idle Control Minimum` | **`-6.00°`** | **`+4.00°`** | Prevents negative timing from killing combustion torque during the rich rebound |
| **`44218`** | `Target Idle Speed Park/Neutral`<br>`Engine / Idle / RPM / Transmission Based Setpoint / Target Idle Speed Park/Neutral` | **`950 RPM`** | **`1,050 RPM`** | Adds 100 RPM stall cushion, raises baseline IAC (~52–54%), and prevents `~1,024 RPM` rebound from triggering overspeed IAC closure |
| **`44217`** | `Target Idle Speed Drive`<br>`Engine / Idle / RPM / Transmission Based Setpoint / Target Idle Speed Drive` | **`950 RPM`** | **`1,050 RPM`** | Keeps Drive idle target symmetric with Park/Neutral |
| **`2291`** | `Maximum RPM to Disable DFCO`<br>`Engine / Fuel / Cutoff, DFCO / Deceleration Fuel Cutoff / Maximum RPM to Disable DFCO` | **`750 RPM`** | **`1,100 RPM`** | Restores fuel above the `1,050 RPM` idle target on `> 35 mph` clutch-in decels (keep `ECM 2290` entry at `1,200 RPM` and speed gates `44491/44492` at `35/12 mph`) |

---

## Verification & Flash Safety

1. Save, reopen `v010-recovery.hpt`, and run a **whole-file Compare** against the exact `v009` parent to confirm only `ECM 32945` (`0/10/15 mph`), `ECM 44582`, `ECM 44218`, `ECM 44217`, and `ECM 2291` changed.
2. Record parent and candidate filenames, byte counts, and SHA-256 hashes in [`revisions.json`](revisions.json) and retain `v009` as rollback.
3. Owner performs all ECU writes with battery voltage **above `12.4 V`**. Preserve all returnless ERFS protections and FRPS calibration. [Repository rules](../AGENTS.md)

---

## Staged Validation & Mandatory Logging

1. **Mandatory Scanner additions for this log:** Add **`Bank 1 LTFT`**, **`Injector Pulse Width`**, and **`EVAP Purge`** (if supported) to the existing channels (keep `IAT` PID `2127` at `1 s`) so the same session resolves the `-19% to -25%` post-restart STFT shift seen in `Datalog-v020`.
2. **Parked progression:** At warm ECT (`~175–190 °F`), record `30 s` of steady idle, then `1,750 → 2,100 → 2,500 → 3,000 RPM` holds (`~10 s` each) and clean throttle releases.
   - **Pass criteria:** Stay `>= 850 RPM` (no second dip `< 800 RPM`), settle within **`±75 RPM`** of `1,050 RPM` within `5 s`, no sustained hang.
   - **Abort criteria:** Stall, `RPM < 650`, `FRPS < 30 psi`, `FP Cmd DC >= 45%`, or `ECT > 220 °F`.
3. **Closed-area moving check (only if parked passes):** Test walking-speed forward/reverse maneuvering and low-speed clutch-in stops in a closed area before any public-road driving. `v010` is not public-road cleared until moving stops pass.

[Full v020 review](../docs/2026-11-25-v020-review.md) | [v009 build sheet](v009-return-to-idle-README.md)
