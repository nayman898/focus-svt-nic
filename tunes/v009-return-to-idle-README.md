# v009 Return-to-Idle Airflow

Build from the exact combined v007 + v008 file used for Datalog-v019. Save As `v009-return-to-idle.hpt`. Retain the exact parent as rollback. This replaces the unbuilt idle-target-only proposal; keep both idle targets at the parent values (expected 950 RPM).

## Purpose and evidence

One hypothesis: additional bypass air earlier in the release, retained longer at low dashpot airflow, can reduce the initial undershoot and subsequent collapse. This is a materially larger airflow trial than v007 + v008. The values below are engineering trial values, not a fitted airflow correction or a verified cure.

Rechecking the native-decoded v019 channels shows IAC command around 44.6% at 1,604 RPM during the first fall, and around 47% at 944 RPM during the later recovery. At about 209.5 seconds, RPM was already about 594 and IAC demand was 73%; 100% command followed. A late maximum command does not establish that earlier added airflow would be ineffective, nor does it establish that the valve works correctly. The two later releases also showed IAC command dropping into the mid-to-high 40% range before recovery. Sample values use the latest available sample at each timestamp; channels are asynchronous.

All three releases also had rich excursions (about 10.9-11.7 AFR). The airflow trial does not establish their cause or repair a venting, injector, or valve fault. Steady warm fueling was substantially closer to target, so these logs do not justify a blanket MAF reduction to correct the release event.

## Exact changes from the combined parent

In VCM Editor Parameter Navigator, Engine / Idle / Airflow / Dashpot Airflow:

| ECM | Table | Axis | Expected parent | v009 |
| --- | --- | --- | ---: | ---: |
| 32988 | Idle Dashpot Pre-Position vs. RPM | 1,150 RPM | 0.35 | **0.45 lb/min** |
| 32988 | Idle Dashpot Pre-Position vs. RPM | 2,150 RPM | 0.68 | **0.80 lb/min** |
| 32988 | Idle Dashpot Pre-Position vs. RPM | 3,150 RPM | 0.80 | **1.00 lb/min** |
| 32984 | Idle Dashpot Decay vs. Dashpot Airflow | 0.00 lb/min | 0.02 | **0.01** |
| 32984 | Idle Dashpot Decay vs. Dashpot Airflow | 0.20 lb/min | 0.02 | **0.01** |
| 32984 | Idle Dashpot Decay vs. Dashpot Airflow | 0.40 lb/min | 0.03 | **0.02** |
| 32984 | Idle Dashpot Decay vs. Dashpot Airflow | 0.60 lb/min | 0.05 | **0.04** |

Use the existing table units. Confirm names, axes, units and expected parent values in the actual file before editing. Preserve all other cells, including the expected 4,150 RPM pre-position value of 1.00 and decay values of 0.06 at 0.80 lb/min, 0.08 at 1.00 and 0.10 at 3.00. The pre-position sequence at 1,150/2,150/3,150/4,150 becomes 0.45/0.80/1.00/1.00. The low-flow decay sequence at 0.00/0.20/0.40/0.60 becomes 0.01/0.01/0.02/0.04.

This carries roughly 0.11 lb/min more tabulated pre-position at 1,750 RPM and 0.12 at 2,100 RPM, assuming linear interpolation. These are modeled additions, not measured airflow gains. Lower decrement values follow the existing repo's decay interpretation. Ford describes dashpot airflow as gradually decremented during deceleration; this general description does not verify the exact strategy implementation or predict a time in seconds. [Ford idle-control description](https://patents.justia.com/patent/5083541)

The expected tradeoff is a slower RPM return and possible hang or extra creep when moving. Do not zero the decay curve. Save, reopen and compare against the exact combined parent: exactly these seven cells should differ. Record parent and candidate filenames, candidate byte count and SHA-256, and retain rollback. The owner flashes with voltage above 12.4 V. Preserve all returnless fuel protections. [Repository rules](../AGENTS.md)

## One flash, then a staged validation session

1. Log from startup with live RPM, desired RPM, TPS, IAC duty, MAF volts/airflow, AEM AFR, B1S1, STFT, timing/spark source, FRPS, pump command, voltage and ECT. Include IAT PID 2127 at 1 second. Add vehicle speed and clutch switch for the moving portion; injector pulse width and dashpot airflow if supported. Note actual flashed filename and hardware changes.
2. At stable warm temperature, record 30 seconds of idle, then a gentle 1,750 RPM hold for 10 seconds and release. Progress to 2,100 and 2,500 only after each clean return. Require all three catches to stay at or above 800 RPM, settle within 75 RPM of actual target within five seconds, and avoid a second dip or sustained hang. Check ordinary fan/accessory load and stationary clutch operation. Abort for stall or RPM below 650, or any other repository stop condition.
3. If those checks pass, proceed in the same session to a short, gentle, no-boost test in a closed area with room to stop. Check walking-speed forward and reverse maneuvering, then several low-speed clutch-in stops. Avoid lugging and record any stumble. Stop for recurring undershoot, hang that pushes the car, lean stumble, or the repository limits. A parked pass alone does not validate road drivability or boost operation. Public-road use requires stable moving stops and maneuvering as well.
4. If the candidate worsens the catch or causes persistent hang, return to the combined parent. If the rich excursion and collapse persist despite earlier IAC support, prioritize the hardware/transient-fueling diagnosis rather than stacking further dashpot increases. A failed capture is sufficient; no repeated stall tests.

## Work to combine with this session

Verify the documented atmospheric bypass valve arrangement. For a draw-through MAF, a properly functioning recirculating valve returning after the MAF and before the compressor is the appropriate configuration to pursue. Garrett recommends recirculation for MAF drivability. Whether this valve opens during these neutral releases remains unmeasured; it is a candidate cause, not a confirmed diagnosis. Inspect IAC response and bypass passages, and record any repair so improvement is not attributed solely to the tune. [Garrett guidance](https://www.garrettmotion.com/racing-and-performance/choosing-a-turbocharger/turbo-system-optimization/#blow-off-valves)

[Diagnostic history and channel details](../docs/2026-11-23-idle-diagnostic-plan.md)
