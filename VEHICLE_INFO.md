# Vehicle Specification & Hardware Questionnaire

> **Instructions for Nic:**  
> Please fill out as many details below as possible! Even if you aren't 100% sure about a specific part number, describe what you know. Accurate hardware specs (especially injectors, MAF, and fuel pump) are critical for a safe, reliable tune.

---

### 1. General Vehicle Information
* **Year:** [e.g. 2002 / 2003 / 2004] 2003
* **Build Number / Mileage:** 10k or less on engine; 145,603 on body 
* **Current ECU Code / Strategy (if known):** [e.g. UJAHAS3 / 2004 SVT] ZED0
* **MPVI Device:** [e.g. MPVI2 / MPVI2+ / MPVI3 / MPVI4] MPVI4
* **Interface Credits / License Status:** [e.g. 2 credits available / vehicle licensed] 2 credits 

---

### 2. Forced Induction (Boost Setup)
* **Type:** [x] Turbocharger  |  [ ] Supercharger (Eaton M62 / Powerworks / ProCharger / Vortech)
* **Turbo / Blower Model & Brand:**Spa .64 [e.g. Garrett GT2871R / Pulsar G25-550 / Jackson Racing M62]
* **Target Boost Pressure:** [e.g. 6 psi, 8 psi, 12 psi] unknown
* **Boost Control Method:** [e.g. Wastegate spring only, Manual boost controller (MBC), Electronic boost controller (EBC), Blower pulley size] Wastegate
* **Wastegate Spring / Base Pressure:** [e.g. 7 psi mechanical spring] Unknown spring 
* **Intercooler Setup:** [x] Air-to-Air  |  [ ] Air-to-Water  |  [ ] Non-intercooled
* **Blow-off / Bypass Valve:** [ ] Recirculated to intake  |  [x] Vented to atmosphere (VTA)
---

### 3. Engine Internals & Health
* **Bottom End:** 
  * [x] Stock SVT Bottom End (10.2:1 static compression, stock powdered-metal rods)
  * [ ] Forged Internals (forged rods, forged dish pistons — specify bore & compression ratio if known)
* **Head & Valvetrain:**
  * [x] Stock SVT Head with working Variable Cam Timing (VCT) intake cam
  * [ ] Aftermarket Cams / Locked VCT
* **Head Studs / Gasket:** [e.g. ARP head studs, OEM multi-layer steel (MLS) gasket]
* **Spark Plugs:** NGK 
  * **Brand & Part #:** [e.g. NGK TR6 (copper) / NGK TR6IX (iridium)] Can not remember 
  * **Heat Range:** [e.g. 1-step colder than stock / 2-steps colder] Should be 2 step colder 
  * **Plug Gap:** [Crucial for boost! e.g. 0.028" – 0.030" recommended to prevent spark blowout under boost] 0.028
* **Ignition Coil & Wires:** [e.g. OEM Motorcraft coil pack + 8mm wires, or Screamin' Demon] CFM Coilpack and wires 

---

### 4. Fuel System (Returnless ERFS)
* **Fuel Delivery Type:** **Returnless (Factory Ford ERFS with FPDM)** Factory 
* **Fuel Pump:** 
  * [x] Stock SVT Focus in-tank pump (~190 LPH)
  * [ ] Stock pump + Kenne Bell Boost-A-Pump (BAP)
  * [ ] Upgraded in-tank pump (e.g. AEM 340, Walbro 255, DeatschWerks DW300)
* **Fuel Pump Driver Module (FPDM):** [e.g. Factory stock FPDM / Upgraded wiring] Factory 
* **Fuel Rail Pressure Sensor (FRPS):** Fuel Rail Pressure Gauge
  * Is the factory transducer on the fuel rail connected to the intake manifold vacuum/boost reference port? [•] Yes  |  [ ] No
  * *Important safety check:* Has the FRPS vacuum hose been inspected for wet raw fuel (checking for a blown internal diaphragm)? [ ] Inspected & Dry  |  [•] Not checked yet
* **Fuel Filter:** [When was it last replaced? Stock returnless systems are very sensitive to filter restrictions.] About to replace 
* **Fuel Grade:** [ ] 91 Octane  |  [•] 93 Octane  |  [ ] E85

---

### 5. Fuel Injectors
* **Brand & Part #:** [e.g. Siemens Deka 60 lb (107961), Ford Racing 39 lb Cobra (0280156127), Ford Racing 42 lb (0280150558), Bosch EV14 52 lb] Siemens Deka 60lbs
* **Rated Flow:** [e.g. 30 lb/hr stock, 39 lb, 42 lb, 60 lb] 60 lb 
* **Connector Type:** [x] USCAR (direct plug-in)  |  [ ] EV1 (with adapters)
* **Characterization Data Sheet:** [ ] Have Ford Racing value summary sheet  |  [•] Need data generated

---

### 6. Mass Airflow (MAF) & Intake
* **MAF Housing & Sensor:**
  * [ ] Stock SVT Focus housing & OEM sensor
  * [ ] PMAS HPX blade-style in 3" housing
  * [ ] SCT BA-2400 / BA-2600 / BA-3000
  * [ ] Lightning 90mm MAF
  * [x] Other: Stock MAF sensor with diablo extension
* **MAF Location:**
  * [ ] **Blow-Through** (after the turbo/intercooler, before the throttle body)
  * [x] **Draw-Through** (before the turbo inlet / supercharger, right behind the air filter)
* **Intake Piping Diameter:** [e.g. 2.75", 3.0", 3.5"] 2.75"

---

### 7. Wideband O2 & Gauges
* **Wideband Controller & Sensor:** [e.g. AEM X-Series, Innovate MTX-L / SCG-1, Zeitronix ZT-2] AEM
* **Logging Integration:**
  * [•] Standalone gauge in cockpit only (manual visual monitoring)
  * [ ] 0–5V analog output wired into HP Tuners MPVI Pro input / OBD pass-through
* **Boost Gauge:** [e.g. Independent mechanical gauge, digital sensor, none] Glowshift gauge

---

### 8. Drivetrain & Exhaust
* **Clutch / Flywheel:** [ ] Stock Dual-Mass Flywheel  |  [x] Single-Mass Flywheel with upgraded clutch disc
* **Header / Downpipe:** [ ] OEM SVT 4-2-1 Tri-Y Header  |  [x] Custom turbo manifold
* **Catalytic Converter:** [ ] Factory Cat  |  [ ] High-Flow Cat  |  [x] Catless Off-Road Test Pipe
* **Exhaust Diameter:** [e.g. Stock 2.25", 2.5", 3.0"] 2.5"

---

### 9. Current Status & Driving Goals
* **Does the car currently start and idle?** [ ] Yes  |  [ ] No  |  [x] Runs rough
* **Can it be driven gently?** [x] Yes  |  [ ] Strictly stationary for now
* **Current Check Engine Light (CEL/DTCs):** [List any codes present] None
* **Primary Tuning Goals:**
  1. daily if possible 
  2. drive it hard somtimes
  3. have fun with it 
