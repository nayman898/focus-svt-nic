# Nic's Focus SVT Turbo — Immediate Next Steps

> **Welcome to the build, Nic!**  
> We reviewed your details in `VEHICLE_INFO.md` and inspected the files you uploaded. Your turbo setup is going to be a blast, but because your engine has the **factory stock SVT high-compression bottom end (10.2:1)**, our #1 priority is keeping it 100% safe, reliable, and fun without bending rods.

Here is the exact 4-step checklist of what to check and do next:

---

### Step 1: Tell Us Which Tune is in the Car
You uploaded two tune files to the `tunes/` folder:
* `tunes/SVT Tune.hpt`
* `tunes/SVTv29.26.hpt`

**We need to know:**
1. **Which of these two files is currently written/flashed to the car?**
2. What is the history of `SVTv29.26.hpt`? (Was it a previous tuner's revision, an SCT conversion, or a base tune from someone else?)

*(If neither is currently in the car, or you aren't sure, let us know! We can do a fresh read with your MPVI4 using [docs/first-connection.md](first-connection.md)).*

---

### Step 2: 4 Quick Under-the-Hood Hardware Checks

Before we start doing diagnostic logs and tuning, check these four items in the engine bay:

1. **Check the Diablosport MAFia Dial:**
   * Locate the small plastic MAFia box plugged into your MAF sensor harness.
   * There is a small rotary dial on it with numbers (usually 0 through 5).
   * **What number is the dial currently set to?**  
     *(We need this exact number so our MAF airflow math in the tune matches the voltage scaling).*

2. **Inspect the Fuel Rail Pressure Sensor (FRPS) Vacuum Hose:**
   * Find the sensor mounted directly on the fuel rail.
   * Pull the small rubber vacuum hose off the sensor nipple.
   * **Is the hose dry inside, or is there liquid gasoline / strong fuel smell inside the vacuum line?**  
     *(Boost pressure spikes can rupture the sensor's internal diaphragm, causing raw fuel to leak directly into the intake manifold. If it's completely dry, you're good!)*

3. **Check Your Wastegate Spring Pressure:**
   * You mentioned your target boost is "unknown" and you have a wastegate spring.
   * **Do you know what psi spring is installed in the SPA wastegate?** (e.g. 5 psi, 7 psi, or higher?)
   * *Critical safety note:* Because your engine has stock SVT rods, we want to make sure you have a **5 to 7 psi spring**. We do not want an accidental 14+ psi pull on factory rods!

4. **Replace That Fuel Filter:**
   * You noted you are about to replace it—go ahead and knock that out. Factory returnless fuel pumps hate clogged filters!

---

### Step 3: The Blow-Off Valve (Why the Car "Runs Rough" on Decel)

In `VEHICLE_INFO.md`, you noted that your **MAF is before the turbo (draw-through)** and your **Blow-Off Valve is vented to atmosphere (VTA)**.

* **Here is why the car runs rough when driving:**  
  When you step on the gas, the MAF measures incoming air. When you let off the throttle to shift or slow down, the blow-off valve vents that pressurized air out into the engine bay. But the ECU *already measured that air* and injects fuel for it anyway! This causes an instant massive rich spike, unburned fuel bogging, popping, and stumbling on clutch-in.
* **Can you recirculate it?**  
  If your intake pipe has a port (or if you can easily route the BOV dump hose back into the intake tube between the MAF and the turbo inlet), doing so will dramatically improve driveability.  
  *(If you can't recirculate it right now, no stress! We can tune the dashpot decay and fuel cutoff to help mask it, but recirculating is the cleanest mechanical fix).*

---

### Step 4: Record Your First Baseline Idle Log

Once the checks above are done, let's grab our first real data:

1. **Load the Scanner Profile:**
   * Open **HP Tuners VCM Scanner**.
   * Open the channel configuration: `profiles/Focus_SVT_Returnless_Boost.Channels.xml`.
2. **Start Scanning:**
   * Connect your MPVI4 to your laptop and OBD-II port.
   * Turn the key to **KOEO (Key On, Engine Off)** and hit the Spacebar to start scanning.
   * Verify battery voltage is $> 12.2\text{V}$ and coolant/IAT temps look reasonable.
3. **Record a Warm Idle Session:**
   * Start the engine and let it warm up until coolant temp reaches **$180^\circ\text{F}$**.
   * Let it idle untouched for **3 to 5 minutes** without touching the gas pedal.
4. **Save & Upload:**
   * Stop scanning (Spacebar).
   * Save the log file in `logs/` as: `logs/nic-svt-baseline-idle-01.hpl`.
   * Export the CSV file as: `logs/nic-svt-baseline-idle-01.csv`.
   * Push or upload the log to GitHub!

---

*Once we have the answers from Steps 1–3 and your first idle log from Step 4, we will immediately dive into the calibration to smooth out that rough idle and get the returnless fueling dialed in!*
