# Next Steps — Nic's Build & Validation Workflow

1. **Pull and preserve your car's current ECU calibration first:**
   - Follow [`docs/first-connection.md`](first-connection.md) using VCM Editor (`Flash -> Read Entire`) and save an untouched copy into `backups/`.

2. **Perform under-hood hardware checks before building/flashing `v000`:**
   - Confirm physical **DiabloSport MAFia** dial position (`0` vs `1` vs `2`+) — **do not alter `ECM 12163`** yet.
   - Pull and inspect the **FRPS vacuum reference hose** to ensure it is hooked up and completely dry (zero fuel).
   - Confirm mechanical **wastegate spring (~5–7 psi)** and intact vacuum reference line.

3. **Write `tunes/v000-initial-start.hpt` yourself starting from `tunes/SVTv29.26.hpt`:**
   - Follow [`tunes/v000-initial-start-README.md`](../tunes/v000-initial-start-README.md) (or the detailed breakdown in [`docs/NIC_TUNE_BUILD_README.md`](NIC_TUNE_BUILD_README.md)).
   - Apply every `ECM xxxxx` edit in [`01-FUEL-ERFS-AND-DTC-README.md`](01-FUEL-ERFS-AND-DTC-README.md) and [`02-VCT-IDLE-AND-FANS-README.md`](02-VCT-IDLE-AND-FANS-README.md).
   - Verify every critical baseline setting in [`03-VERIFY-AND-KEEP-CHECKLIST-README.md`](03-VERIFY-AND-KEEP-CHECKLIST-README.md) (`6950 = 0.484`, Deka 60 injectors, `44205 = 0.00136`, `44583` `10.75°–11.50°` boost spark).
   - Run **Compare -> Open Compare File -> `tunes/SVTv29.26.hpt`** -> confirm only your intended edits differ.

4. **First Flash & Stationary Warm-Idle Log (`0 psi` boost):**
   - Load [`profiles/Focus_SVT_Returnless_Boost.Channels.xml`](../profiles/Focus_SVT_Returnless_Boost.Channels.xml) in VCM Scanner.
   - Flash `tunes/v000-initial-start.hpt` with a battery tender connected.
   - KOEO check: verify Fuel Rail Pressure moves dynamically (~`35–45 psi` primed), ECT ≈ IAT ≈ ambient, battery `> 12.2 V`.
   - Warm engine smoothly at stationary idle through `ECT >= 180°F`, Low Fan (`195°F`), and High Fan (`205°F`) cycles.
   - Verify Closed Loop enters cleanly (`Closed Loop Active = Yes`, `STFT` within reason) and save `.hpl` + `.csv` log as `logs/nic-svt-v000-first-start.*` before any street drive.

5. **Post-Idle Iterative Tuning (`v001+`):**
   - Dial in low-end **`ECM 12163`** MAF cells strictly from verified warm-idle and steady light-cruise `STFT` logs (once MAFia setting is known).
   - Only after cruise trims and return-to-idle decel (`32984` / `32988`) are clean, advance to **3–5 psi** spring validation with wideband logging and strict abort checks (`FPDM Duty >= 45%`, boost `Lambda > 0.80`, `KR > 1.5°–2.0°`).
