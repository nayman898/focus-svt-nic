# Vehicle Specification & Hardware Questionnaire

> **Instructions for Nic:**  
> Please fill out as many details below as possible! Even if you aren't 100% sure about a specific part number, describe what you know. Accurate hardware specs (especially injectors, MAF, and fuel pump) are critical for a safe, reliable tune.

---

### 1. General Vehicle Information
* **Year:** [e.g. 2002 / 2003 / 2004]
* **Build Number / Mileage:** 
* **Current ECU Code / Strategy (if known):** [e.g. UJAHAS3 / 2004 SVT]
* **MPVI Device:** [e.g. MPVI2 / MPVI2+ / MPVI3 / MPVI4]
* **Interface Credits / License Status:** [e.g. 2 credits available / vehicle licensed]

---

### 2. Forced Induction (Boost Setup)
* **Type:** [•] Turbocharger  |  [ ] Supercharger (Eaton M62 / Powerworks / ProCharger / Vortech)
* **Turbo / Blower Model & Brand:**Spa .64 [e.g. Garrett GT2871R / Pulsar G25-550 / Jackson Racing M62]
* **Target Boost Pressure:** [e.g. 6 psi, 8 psi, 12 psi]
* **Boost Control Method:**Wastegate unknown spring [e.g. Wastegate spring only, Manual boost controller (MBC), Electronic boost controller (EBC), Blower pulley size]
* **Wastegate Spring / Base Pressure:** [e.g. 7 psi mechanical spring]
* **Intercooler Setup:** [•] Air-to-Air  |  [ ] Air-to-Water  |  [ ] Non-intercooled
* **Blow-off / Bypass Valve:** [ ] Recirculated to intake  |  [•] Vented to atmosphere (VTA)
---

### 3. Engine Internals & Health
* **Bottom End:** 
  * [•] Stock SVT Bottom End (10.2:1 static compression, stock powdered-metal rods)
  * [ ] Forged Internals (forged rods, forged dish pistons — specify bore & compression ratio if known)
* **Head & Valvetrain:**
  * [•] Stock SVT Head with working Variable Cam Timing (VCT) intake cam
  * [ ] Aftermarket Cams / Locked VCT
* **Head Studs / Gasket:** [e.g. ARP head studs, OEM multi-layer steel (MLS) gasket]
* **Spark Plugs:**
  * **Brand & Part #:** [e.g. NGK TR6 (copper) / NGK TR6IX (iridium)]
  * **Heat Range:** [e.g. 1-step colder than stock / 2-steps colder]
  * **Plug Gap:**0.028 [Crucial for boost! e.g. 0.028" – 0.030" recommended to prevent spark blowout under boost]
* **Ignition Coil & Wires:** [e.g. OEM Motorcraft coil pack + 8mm wires, or Screamin' Demon]

---

### 4. Fuel System (Returnless ERFS)
* **Fuel Delivery Type:** **Returnless (Factory Ford ERFS with FPDM)**
* **Fuel Pump:** 
  * [•] Stock SVT Focus in-tank pump (~190 LPH)
  * [ ] Stock pump + Kenne Bell Boost-A-Pump (BAP)
  * [ ] Upgraded in-tank pump (e.g. AEM 340, Walbro 255, DeatschWerks DW300)
* **Fuel Pump Driver Module (FPDM):** [e.g. Factory stock FPDM / Upgraded wiring]
* **Fuel Rail Pressure Sensor (FRPS):**
  * Is the factory transducer on the fuel rail connected to the intake manifold vacuum/boost reference port? [ ] Yes  |  [ ] No
  * *Important safety check:* Has the FRPS vacuum hose been inspected for wet raw fuel (checking for a blown internal diaphragm)? [ ] Inspected & Dry  |  [ ] Not checked yet
* **Fuel Filter:** [When was it last replaced? Stock returnless systems are very sensitive to filter restrictions.]
* **Fuel Grade:** [ ] 91 Octane  |  [•] 93 Octane  |  [ ] E85

---

### 5. Fuel Injectors
* **Brand & Part #:**Siemens Deka 60lb [e.g. Siemens Deka 60 lb (107961), Ford Racing 39 lb Cobra (0280156127), Ford Racing 42 lb (0280150558), Bosch EV14 52 lb]
* **Rated Flow:** [e.g. 30 lb/hr stock, 39 lb, 42 lb, 60 lb]
* **Connector Type:** [•] USCAR (direct plug-in)  |  [ ] EV1 (with adapters)
* **Characterization Data Sheet:** [ ] Have Ford Racing value summary sheet  |  [ ] Need data generated

---

### 6. Mass Airflow (MAF) & Intake
* **MAF Housing & Sensor:**
  * [ ] Stock SVT Focus housing & OEM sensor
  * [ ] PMAS HPX blade-style in 3" housing
  * [ ] SCT BA-2400 / BA-2600 / BA-3000
  * [ ] Lightning 90mm MAF
  * [•] Other: Stock MAF sensor with diablo extension
* **MAF Location:**
  * [ ] **Blow-Through** (after the turbo/intercooler, before the throttle body)
  * [•] **Draw-Through** (before the turbo inlet / supercharger, right behind the air filter)
* **Intake Piping Diameter:**2.75" [e.g. 2.75", 3.0", 3.5"]

---

### 7. Wideband O2 & Gauges
* **Wideband Controller & Sensor:**AEM [e.g. AEM X-Series, Innovate MTX-L / SCG-1, Zeitronix ZT-2]
* **Logging Integration:**
  * [ ] Standalone gauge in cockpit only (manual visual monitoring)
  * [ ] 0–5V analog output wired into HP Tuners MPVI Pro input / OBD pass-through
* **Boost Gauge:** [e.g. Independent mechanical gauge, digital sensor, none]

---

### 8. Drivetrain & Exhaust
* **Clutch / Flywheel:** [ ] Stock Dual-Mass Flywheel  |  [•] Single-Mass Flywheel with upgraded clutch disc
* **Header / Downpipe:** [ ] OEM SVT 4-2-1 Tri-Y Header  |  [•] Custom turbo manifold
* **Catalytic Converter:** [ ] Factory Cat  |  [ ] High-Flow Cat  |  [•] Catless Off-Road Test Pipe
* **Exhaust Diameter:**2.5" [e.g. Stock 2.25", 2.5", 3.0"]

---

### 9. Current Status & Driving Goals
* **Does the car currently start and idle?** [ ] Yes  |  [ ] No  |  [•] Runs rough
* **Can it be driven gently?** [•] Yes  |  [ ] Strictly stationary for now
* **Current Check Engine Light (CEL/DTCs):**None [List any codes present]
* **Primary Tuning Goals:**
  1. daily if possible 
  2. drive it hard somtimes
  3. have fun with it 
