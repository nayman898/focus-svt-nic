# v005 Low-Airflow Dashpot Decay

Build `v005-dashpot-decay.hpt` from Nic’s `v003-low-end-maf-curve.hpt`. Use the exact `v003` file as rollback. This is the first trial for the **second** RPM dip in `Datalog-v007.hpl`. If Nic has already built or tested `v004`, keep that file and any log as a separate pre-position trial. The `v005` build and vehicle test are pending.

## Edit in VCM Editor

1. Open the exact `v003` file and use **File → Save As** to create `v005-dashpot-decay.hpt`.
2. Search **`32984`** in Parameter Navigator under **Engine → Idle → Airflow → Dashpot Airflow → Idle Dashpot Decay vs. Dashpot Airflow**. Check the airflow axis in **lb/min** and confirm the expected parent values below. Check the parameter description in Nic’s Editor before entering values. The archived Navigator capture for this ECM ID describes smaller values as slower decay. [Ford idle speed control patent](https://www.freepatentsonline.net/5083541.html)
3. Enter the two decay values below in the data column. Save and reopen the candidate, then compare it to the exact `v003` file. Verify the airflow axis and confirm that the whole-file comparison reports only the two decay cell changes. Record the actual saved values, file size, and SHA-256 before the owner writes. [Revision catalog](revisions.json) · [Flash and abort rules](../AGENTS.md)

| Dashpot airflow (lb/min) | Expected `v003` decay | `v005` decay |
| ---: | ---: | ---: |
| 0.20 | 0.03 | **0.02** |
| 0.40 | 0.04 | **0.03** |

The resulting low-flow decay sequence at 0.0, 0.2, 0.4, and 0.6 lb/min is **0.02, 0.02, 0.03, 0.05**. The 0.01 steps reduce the rate by 33% and 25% at the two edited points. This keeps decay positive and tests whether extending the low-flow portion helps the engine settle after the initial catch.

## Calibration audit

- **The dashpot values came from a different use case.** The `v003` build inherits the four low-airflow decay values introduced by the `v000` instructions. They match the other SVT’s `v028` changes for a 1,300–1,500 RPM rolling hang. The 2,150 and 3,150 RPM pre-position values also match cuts made on the other car for engine braking. Nic’s log has an undershoot and stall after release. Slowing the last part of decay tests idle handoff using Nic’s own baseline. The exact installed values still require comparison in VCM Editor. [Inherited dashpot table](../docs/02-VCT-IDLE-AND-FANS-README.md#3-return-to-idle-dashpot-fix-ecm-32984-ecm-32988)
- **Timing advanced after RPM was already falling.** The throttle closed at 690.569 s. RPM reached **816** at 692.352 s, then **1,066** at 693.138 s. It was already back down to about **845 RPM** when spark source switched from Idle Feedback to Base / MBT at 694.485 s and logged timing reached **30°**. RPM then crossed **619** at 694.931 s. That sequence gives no direct reason to raise idle spark gain.
- **Throttle and fuel-pressure data narrow the search.** The PCM reported Closed throttle at about **169 ADC counts** through the second dip. Fuel source stayed Stoich through the fall and logged rail pressure remained above **38.5 psi**. Coolant was **190 °F**, the highest reading before the stall and below the documented 195 °F low-fan ECT enable. Fan command, A/C state, clutch state and battery voltage were unavailable.
- **The mixture transient still needs a wideband trace.** The upstream narrowband reached approximately **0.91 V** after the first dip and before the second. That is consistent with a rich indication. With a draw-through MAF and atmospheric valve, vented metered air is a plausible contributor. Inspect the valve’s seal and manifold reference hose, and check the intake and the previously reported upstream exhaust leak. The AEM can determine the direction and timing of the measured mixture excursion. [Garrett’s bypass-valve guidance](https://www.garrettmotion.com/racing-and-performance/choosing-a-turbocharger/turbo-system-optimization/)
- **The IAC channel has worked on this car.** `Datalog-v002.hpl` and `Datalog-v003.hpl` recorded **523** and **2,336** samples of PID **2082**, respectively. Those recordings had no actual RPM samples and represent earlier operating conditions. `Datalog-v007.hpl` has zero IAC samples. Use the focused profile below to try for both channels in the same capture. [HP Tuners on Scanner polling](https://docs.hptuners.com/VCM_Scanner/Channels/Channels/)

## Parked validation

1. In neutral, start with the same fan, clutch and accessory conditions throughout the hold and return. Load the [return-to-idle Scanner profile](../profiles/Focus_SVT_Return_to_Idle.Channels.xml) and confirm actual RPM, desired RPM, IAC duty and rail pressure update together in a short stationary preview. Log the AEM wideband if connected. Note any fan, A/C or clutch event and record any pending IAC or misfire codes. If PID 2082 stays blank, document that so RPM behavior can be evaluated without attributing it to IAC command.
2. Near **180–190 °F ECT** with steady closed-loop idle and rail pressure around **38–42 psi**, hold **2,500 RPM** gently for 15–20 s without boost, then release fully and observe for at least **20 s**. Proceed to a **3,000 RPM** hold only after a clean 2,500 RPM return. The first 3,000 RPM return needs to pass before repeating it.
3. Record minimum RPM, the second dip if present, and time to settle within **75 RPM** of desired. A clean return stays at or above **800 RPM** and settles within **5 s** without a hang. Stop escalating if it drops below 800 RPM. Abort for a stall, RPM below 650, fuel pressure below 30 psi, fuel pump command at or above 45%, or the other repository limits. Roll back to `v003` for a worse undershoot or new hang. [Repository stop conditions](../AGENTS.md)
4. Save the full HPL and CSV with interpolation off. Note the exact tune filename. If the second dip persists, look at the IAC command and AEM trace together. Falling IAC duty ahead of RPM points toward the command or handoff. Rising duty with falling RPM warrants checking valve response and available bypass airflow. A measured rich excursion ahead of the RPM loss warrants investigating the blow-off valve and transient fueling.
