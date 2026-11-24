# v007 Idle Handoff

Build `v007-idle-handoff.hpt` from the exact `v006-idle-fuel.hpt` used with the replacement upstream O₂. Keep that `v006` file for rollback. This trial applies the two low-airflow decay edits from the earlier [v005 build sheet](v005-dashpot-decay-README.md) to the post-sensor baseline.

## VCM Editor

1. Open the exact `v006` and use **File → Save As** to create `v007-idle-handoff.hpt`.
2. In Parameter Navigator, search **ECM 32984** for **Idle Dashpot Decay vs. Dashpot Airflow** under **Engine → Idle → Airflow → Dashpot Airflow**. Verify the airflow axis, the four parent values from 0.00 to 0.60 lb/min (**0.02, 0.03, 0.04, 0.05**), and the Editor description of decay direction. If they differ, record the installed table before choosing new values.
3. Apply the two edits below. The decay sequence becomes **0.02, 0.02, 0.03, 0.05** across those four breakpoints. The edited values are **33%** and **25%** lower, respectively.
4. Reopen the saved file and run a whole-file compare against the exact `v006`. Confirm the two saved cells in ECM 32984 as the full delta. Record the candidate and rollback filenames, the candidate SHA-256 and byte count, and battery voltage above 12.4 V before the owner flashes. [Revision catalog](revisions.json) · [Flash and abort rules](../AGENTS.md)

| Dashpot airflow (lb/min) | Expected `v006` decay | `v007` decay |
| ---: | ---: | ---: |
| 0.20 | 0.03 | **0.02** |
| 0.40 | 0.04 | **0.03** |

## Why these cells

On the first drive after the upstream O₂ replacement, the three severe dips occurred **1.9–3.2 seconds after throttle closure**, with IAC duty falling as RPM approached idle. Throttle closure is estimated as the last return to 172 ADC counts or lower before each minimum. The ECU requested 944 RPM. A slower low-flow decay tests whether carrying bypass airflow longer improves the catch. The scanner logs IAC duty, which is the total valve command. The dashpot airflow component and clutch state were unavailable. [Drive-log-v001.hpl](../logs/Drive-log-v001.hpl) · [Ford idle speed control patent](https://patents.justia.com/patent/5083541)

| Throttle closure | RPM at closure | RPM minimum | Time to minimum |
| ---: | ---: | ---: | ---: |
| 166.569 s | 1,682 | 551 | 2.46 s |
| 241.203 s | 2,111 | 525 | 1.92 s |
| 260.538 s | 1,775 | 482 | 3.19 s |

The parked log on the same calibration held a median **950 RPM** at a **944 RPM** target after warmup. The AEM showed **16.14 AFR** at that idle while B1S1 switched and median Bank 1 STFT was **+0.78%**. The AEM signal and actual mixture still need a cross-check. The two decay edits isolate the RPM recovery question. [Datalog-v016.hpl](../logs/Datalog-v016.hpl)

## Parked comparison

Use the [next-log diagnostic plan](../docs/2026-11-23-idle-diagnostic-plan.md) and [Scanner profile](../profiles/Focus_SVT_Idle_Diagnostic.Channels.xml) for the matched captures.

1. Confirm actual and desired RPM, TPS, IAC duty, spark source, timing, B1S1, Bank 1 STFT, AEM AFR, IAT, ECT, and raw fuel pressure are updating. Confirm fuel-pump duty is updating as it did in `Datalog-v016`. Add dashpot airflow and clutch switch if available. Use the same fan, A/C and clutch state for every release.
2. Park in neutral with idle settled in closed loop at about **175–190 °F**. Compare the live AEM display against Scanner while parked. If the idle and pressures are stable, try a gentle **1,750 RPM** hold for about **10 s**, release fully, and log **20 s** after release. Run the same check at **2,100 RPM** only after a clean 1,750 RPM return. Use comparable coolant temperature, time since start and spark mode when a matched `v006` parked trace is available.
3. Use the existing parked criteria of **800 RPM minimum** and settling within **75 RPM of target in 5 s** without a second dip or a hang. Stop progression if the return fails either criterion. Abort under the [repository stop conditions](../AGENTS.md), including a stall or a severe RPM dip below 650. Restore the exact `v006` file if `v007` worsens the undershoot or introduces a hang.
4. Save the full HPL and CSV with interpolation off. Record the flashed filename and note minimum RPM, time to settle, IAC duty before the minimum, and any change in spark source or accessory load.
