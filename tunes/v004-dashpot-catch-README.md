# v004 Dashpot Catch

Build from Nic's `v003-low-end-maf-curve.hpt` and save as `v004-dashpot-catch.hpt`. Keep that exact `v003` file for rollback. The `v004` build and test are pending. The `v003` assignment comes from the reported tune for this capture and the MAF voltage/airflow match.

The audit also produced a separate low-flow decay trial, now on hold after the return to `v003`. Both build sheets use `v003` as the parent. [v005 low-airflow dashpot decay](v005-dashpot-decay-README.md)

## Edit in VCM Editor

1. Open the exact `v003` file used for the log. Use **File → Save As** to create `v004-dashpot-catch.hpt`.
2. Search for **`32988`** in Parameter Navigator under **Engine → Idle → Airflow → Dashpot Airflow → Idle Dashpot Pre-Position vs. RPM**. Check that the display units are **lb/min** and the parent shows **0.80** at **3,150 RPM**. The adjacent `v003` reference points are 0.55 at 2,150 RPM and 1.00 at 4,150 RPM. Reconcile any mismatch before editing.

3. Set **3,150 RPM** to **0.88 lb/min** and save. Reopen `v004`, load the exact `v003` parent in **Compare → Open Compare File**, and verify that the only calibration difference is that one cell. Use the Editor's stored/displayed value for the comparison record.
4. Record SHA-256 and byte length of the saved file. Before the owner writes, verify the selected file's identity, the rollback file, and battery voltage above 12.4 V. [Revision catalog](revisions.json) · [Flash and abort rules](../AGENTS.md)

The 0.08 lb/min increase is a 10% test step at the edited cell. With linear interpolation it adds about 0.036 lb/min at 2,600 RPM and 0.068 lb/min at 3,000 RPM. The experiment tests whether more dashpot pre-position improves the return to idle. The log has no IAC duty data or dashpot command, so the underlying cause remains open. The second dip followed an initial recovery, which makes the handoff to idle control, an unlogged load change, or a transient mixture problem plausible. Ford describes how dashpot airflow carries into deceleration in its [idle speed control patent](https://www.freepatentsonline.net/5083541.html).

## What Datalog-v007 showed

| Closed-loop window | Median RPM | Median MAF voltage | Median inferred fuel correction | Median rail pressure |
| --- | ---: | ---: | ---: | ---: |
| 535–565 s, off-idle hold | 2,595 | 1.235 V | +0.02% | 40.0 psi |
| 580–643 s, warm idle | 951 | 0.679 V | +0.98% | 40.0 psi |
| 650–690 s, 2,800–3,200 RPM samples during the higher hold | 3,018 | 1.396 V | −0.31% | 40.0 psi |

In matched closed-throttle samples at 172–178 °F and 0.66–0.70 V, median correction fell from **+20.95%** in `Datalog-v005` to **+4.74%** in `Datalog-v006` and **+1.13%** in `Datalog-v007`. The three logs had different intake temperatures. Correction uses `100 × (1 / commanded lambda − 1)` in Stoich, assuming the inherited LTFT-disabled setting. Direct Bank 1 STFT and measured wideband lambda are unavailable. This supports carrying the `v003` MAF curve forward.

- **572.129 s, release from about 2,600 RPM.** RPM bottomed at **749** at 573.746 s, then recovered above 900 RPM at 574.192 s. Fuel source stayed Stoich.
- **690.569 s, release from about 3,000 RPM.** RPM first dipped to about **816**, rebounded above 1,050, then fell through **619** at 694.931 s and reached **zero** at 696.051 s. The stall was confirmed by the owner team. Rail pressure stayed above 38.5 psi through the fall, and pump command remained below 45% until after RPM reached zero. The narrowband was around 0.90 V near the rebound, which leaves a transient mixture effect worth checking with the AEM.
- **701.266 s, restart.** RPM first registered cranking, reached 1,313 RPM at 701.938 s, and the PCM returned to Stoich at 727.277 s. The 75% pump command occurred during the intervening zero-RPM period.

The 803.812 s native log contains RPM, timing, and rail pressure from about 500 s onward, with a gap at about 750–754 s. IAC duty and Bank 2 STFT are blank throughout. The later samples cover both throttle releases. The calculated MAP channel provides vacuum context for the holds. This capture supports a stationary return-to-idle test.

CSVs decoded locally from the HPL preserve sample timestamps and blank channels. For the window summaries, the last available channel sample was used within 0.20–0.25 s of each commanded-lambda sample. The native log's SHA-256 is `6D0C376210B5A9D3C17F3EA921165291BB9201FAA4B4F7A50101A89EEE690E9B`. [Datalog-v007.hpl](../logs/Datalog-v007.hpl)

## Stationary validation

1. Park in neutral and hold accessory state constant. Record the flashed filename and note any clutch, fan, or accessory changes. Start the log before startup. Confirm actual and desired RPM, absolute TPS, fuel source, O2 voltage, MAF, ECT, IAT, rail pressure, and pump command are updating before the first hold. Use the existing [Scanner profile](../profiles/Focus_SVT_Returnless_Boost.Channels.xml) as a starting point. Record the AEM reading during the release if available.
2. At about **176–190 °F ECT**, verify a stable closed-loop idle and rail pressure around **38–42 psi**. Start with one gentle no-boost hold at **2,500 RPM** for 15–20 s, then release fully and log at least **20 s** at idle. Proceed to an equivalent **3,000 RPM** hold only after a clean 2,500 RPM return. Repeat the 3,000 RPM release once if the first return passes.
3. Compare minimum RPM, time below 900, any second dip, time to settle within **75 RPM** of desired, and any RPM hang against `Datalog-v007`. A clean return stays at or above **800 RPM**, settles near the 944 RPM logged target within **5 s**, and stays there through the observation window. A dip below 800 fails the run and ends progression to the next hold. Abort for a stall, RPM below **650**, rail pressure below **30 psi**, pump command at or above **45%**, ECT above **220 °F**, or the other [repository stop conditions](../AGENTS.md). Roll back to `v003` if the candidate worsens the dip or introduces a hang.
4. Save the native HPL and a full CSV export with **Interpolate Data Gaps** unchecked. Include the actual tune filename and event notes so the capture can be compared directly.
