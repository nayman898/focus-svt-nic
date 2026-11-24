# v006 Idle Fuel

**Current post-sensor baseline.** Nic confirmed `v006` in both November 23 logs after replacing the upstream O₂. Warm parked idle settled near **950 RPM** with median Bank 1 STFT of **+0.78%** and logged AEM AFR of **16.14**. The drive had three dips below **650 RPM**. Keep this exact file as the parent and rollback for the [v007 idle handoff trial](v007-idle-handoff-README.md).

**Earlier parked trial with the old sensor.** Nic reported **21 AFR** on the AEM during `Datalog-v014.hpl`. The repeat run `Datalog-v015.hpl` still read very lean and showed Bank 1 STFT reach **−12.72%** before the RPM undershoot, with steady estimated rail pressure. Both recordings end before the warm-idle comparison. The rollback for that fuel trial was the exact `v003` parent.

Build `v006-idle-fuel.hpt` from Nic’s actual `v003-low-end-maf-curve.hpt`. Keep that exact `v003` file for rollback. This parked trial assumes that the reported high AEM AFR during closed loop is a real lean mixture and tests a low-flow MAF correction.

## Edit in VCM Editor

1. Open `v003` and use **File → Save As** to create `v006-idle-fuel.hpt`.
2. In Parameter Navigator, search **`12163`** for **MAF Airflow vs. Voltage**. Confirm the voltage axis and parent values against the table below. Use the column matching the display units in Nic’s Editor. [v003 MAF table reference](v003-low-end-maf-curve-README.md#full-ecm-12163-cell-reference-v002---v003)
3. Enter the six data values individually. Save and reopen `v006`, then compare the whole file against `v003`. Verify exactly six airflow changes in ECM 12163 and check the voltage axis. Record the saved values, SHA-256, and byte count. The owner performs any flash after the file and rollback are verified and battery voltage is above 12.4 V. [Revision catalog](revisions.json) · [Flash and abort rules](../AGENTS.md)

| MAF voltage | v003 lb/h | **v006 lb/h** | v003 lb/min | **v006 lb/min** | Gain |
| ---: | ---: | ---: | ---: | ---: | ---: |
| 0.60 V | 2.79 | **2.99** | 0.0465 | **0.0498** | +7.2% |
| 0.65 V | 3.22 | **3.56** | 0.0537 | **0.0593** | +10.6% |
| 0.70 V | 3.69 | **4.13** | 0.0615 | **0.0688** | +11.9% |
| 0.90 V | 5.75 | **6.44** | 0.0958 | **0.1073** | +12.0% |
| 1.00 V | 7.05 | **7.61** | 0.1175 | **0.1268** | +7.9% |
| 1.10 V | 8.60 | **8.86** | 0.1433 | **0.1477** | +3.0% |

## Basis for the step

About 99.9% of the matched warm-idle samples in `Datalog-v012.hpl` fall from **0.70 to 0.90 V**, with a median of **0.806 V**. At 170–178 °F and an actual RPM of 900–1,025 around the 944 RPM target, median actual RPM was **950**, and estimated rail pressure held **38.9–41.8 psi**. Closed Loop Active switched to Yes at **101.137 s**, with a brief later commanded-ratio peak of **1.095** at **117.152 s**. Bank 1 STFT was blank and the AEM value is owner-reported.

The gain interpolates from zero at **0.54 V**, peaks near **12%** in the warm-idle band, and tapers to zero at **1.20 V**. At a fixed voltage, a 12% increase would move **16.5 AFR to about 14.7 AFR** if base fuel mass rose in proportion and feedback held steady. This is a first-order estimate. MAF changes also affect open-loop fueling in that voltage range, and closed-loop feedback can change the net correction. [Ford fuel-trim reference](https://www.fordservicecontent.com/ford_content/catalog/motorcraft/OBDSM407.pdf)

## Parked test

1. Log from before crank, with the throttle closed, accessory load held steady, the AEM reading timestamped, and actual RPM, O₂ B1S1, loop state, and raw rail-pressure voltage updating. Capture Bank 1 STFT where available. [Closed-loop entry Scanner profile](../profiles/Focus_SVT_Closed_Loop_Entry.Channels.xml)
2. Compare the AFR trend through closed-loop entry and at **170–178 °F** to the `v003` baseline. Look for sustained movement toward stoichiometric AFR, stable idle, and rail pressure around **40 psi**. Check for rich startup or a new stumble as well.
3. Keep this test parked with the throttle closed. If warm AFR again stays above **16.5** on the gasoline scale, or the engine runs poorly or hits a repository stop condition, end the test and save the recording. Use `v003` as rollback if `v006` worsens operation or the measured idle mixture shows no improvement. [Repository limits](../AGENTS.md)

Baseline input for the original fuel trial was `Datalog-v012.hpl`, SHA-256 `1541AEA05057C26020E9449FCA74B17F7D945E40CFB84E6CEBCA0E7181C1A858`.
