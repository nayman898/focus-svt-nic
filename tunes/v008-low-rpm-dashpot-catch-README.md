# v008 Low-RPM Dashpot Catch

Build `v008-low-rpm-dashpot-catch.hpt` from the exact post-sensor `v006-idle-fuel.hpt`. Keep that file for rollback. Use this parked candidate if [v007’s slower decay](v007-idle-handoff-README.md) leaves an undershoot during the first pass through idle speed. Both candidates start from `v006` so the comparison can distinguish added airflow at lift from airflow carried later into the return.

## VCM Editor

1. Open the exact `v006` and **Save As** `v008-low-rpm-dashpot-catch.hpt`.
2. Find **ECM 32988**, **Idle Dashpot Pre-Position vs. RPM**, under **Engine → Idle → Airflow → Dashpot Airflow**. Verify the RPM axis, lb/min units, and expected parent values of **0.35 at 1,150 RPM**, **0.55 at 2,150 RPM**, and **0.80 at 3,150 RPM**. If the values differ, record the installed table and reconcile the parent first. [Inherited calibration](../docs/02-VCT-IDLE-AND-FANS-README.md#3-return-to-idle-dashpot-fix-ecm-32984-ecm-32988)
3. Set the **2,150 RPM** cell from **0.55 to 0.68 lb/min**. The three-point sequence becomes **0.35, 0.68, 0.80**.
4. Save, reopen and compare the whole file against the exact `v006`. The comparison should show the one cell in ECM 32988. Before an owner flash, record the saved value, candidate filename, SHA-256 and byte count, the rollback file, and battery voltage above **12.4 V**. [Revision catalog](revisions.json) · [Flash and abort rules](../AGENTS.md)

## Why the 2,150 RPM cell

The last throttle closures before the three severe dips began at approximately **1,682, 2,111, and 1,775 RPM**. The earlier `v004` recipe was aimed at a roughly 3,000 RPM release. Raising the 2,150 RPM cell adds pre-position in the range Nic actually used. It is a **24%** increase at the breakpoint, between the expected parent’s **0.55** and the archived tune’s **0.78 lb/min**. Linear interpolation of the Editor table adds about **0.07–0.12 lb/min** at the observed closure speeds. Actual bypass airflow still needs to be evaluated through IAC command and RPM recovery. [Drive log](../logs/Drive-log-v001.hpl) · [Ford idle speed control patent](https://patents.justia.com/patent/5083541)

## Validate parked

1. Use the [diagnostic log plan](../docs/2026-11-23-idle-diagnostic-plan.md) to repeat the **1,750 RPM** release and proceed to **2,100 RPM** after a clean first return. Match coolant temperature, spark source, and accessory state where practical.
2. Compare minimum RPM, IAC duty during the fall, and settling time against `v006` and `v007`. A clean return stays **at or above 800 RPM** and settles within **75 RPM of target in 5 s** without a second dip or hang. Apply the [repository abort conditions](../AGENTS.md). Restore `v006` if `v008` worsens recovery or causes a hang.
3. If IAC duty rises early and RPM still collapses, inspect valve operation and the bypass passage before trying more commanded airflow. If both candidates help different portions of recovery, use the paired logs to decide whether a combined follow-up is warranted.
