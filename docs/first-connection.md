# First Connection & Baseline ECU Read Guide

This guide walks Nic through pulling the virgin factory read from his Focus SVT and capturing the first diagnostic datalog.

---

### Step 1: Battery & Connection Preparation
1. **Connect a Battery Charger/Tender:**
   * Reading or writing Ford Black Oak EEC-V ECUs requires stable battery voltage. If battery voltage drops below 12.0V during an ECU operation, the session can fail.
2. **Connect MPVI to OBD-II Port & Laptop:**
   * Plug the HP Tuners MPVI interface into the diagnostic port under the driver's side steering column.
   * Connect the USB cable to the laptop.
3. **Turn Ignition to KOEO (Key On, Engine Off):**
   * Turn the key to Position II (ON), but **do not crank the engine**. Ensure dash cluster lights are illuminated.
   * Turn off headlights, HVAC blower, radio, and unplug accessories to minimize electrical load.

---

### Step 2: Read the Entire ECU Calibration
1. Open **HP Tuners VCM Editor**.
2. Click **Flash $\to$ Read Entire**.
3. Select your hardware device (MPVI) and click **Read**.
4. The process takes roughly 2 to 4 minutes.
5. **Immediately save the read file twice:**
   * Primary save: `backups/v000-stock-read.hpt`
   * Working copy: `tunes/v000-stock-read.hpt`
6. *Never modify the file in `backups/`.* That is your permanent baseline.

---

### Step 3: Setup VCM Scanner Channel Config
1. Open **HP Tuners VCM Scanner**.
2. In the Channels pane on the left, click the **Folder icon (Open Channel Config)**.
3. Select `profiles/Focus_SVT_Returnless_Boost.Channels.xml` from this repository.
4. Verify the channel list populates:
   * Engine RPM, Desired RPM, ECT, IAT, Fuel Rail Pressure, Spark Advance, MAF, O2 Voltage, STFT, TPS.

---

### Step 4: First Baseline Log (Cold Start / Warm Idle)
1. With Scanner connected, turn Key On Engine Off (KOEO).
2. Click **Start Scanning (Spacebar)**. Verify that sensors show realistic numbers:
   * Coolant and IAT should roughly match ambient outdoor/garage temp.
   * Fuel Rail Pressure should show ~35–45 psi (if pump primed).
   * Battery voltage should be $> 12.2\text{V}$.
3. Crank the engine and let it idle without touching the throttle.
4. Allow it to run for 5–10 minutes until it reaches operating temperature (ECT $> 180^\circ\text{F}$).
5. Click **Stop Scanning (Spacebar)**.
6. Click **Log File $\to$ Save Log File As...**
   * Save as: `logs/nic-svt-v000-first-idle.hpl`
   * Export CSV: `logs/nic-svt-v000-first-idle.csv`
