S.P.I.T.A.S (Solar-Powered Impact-Triggered Alert System)

🛡️ Tactical Perimeter Defense & Intrusion Detection

S.P.I.T.A.S. is an autonomous, event-driven "Digital Tripwire" designed for remote security monitoring. The system remains dormant in a deep-sleep state until a physical impact or seismic vibration is detected, at which point it transmits a high-priority alert to a centralized command dashboard.

🚀 Technical Architecture

The system is built on the Seeed Studio XIAO ESP32-C6, chosen for its support of Wi-Fi 6 and advanced power-management features.

Hardware Stack

Microcontroller: ESP32-C6 (RISC-V 160MHz)

Sensing: 35mm Passive Piezoelectric Disc (Seismic/Impact detection)

Power: 3.7V 300mAh LiPo Battery

Harvesting: 5.5V / 160mA Monocrystalline Solar Panel

Efficiency: ~15µA Deep Sleep consumption

Software Stack

Firmware: C++ / Arduino (Interrupt-driven logic)

Backend: Python / Flask (Tactical Dashboard)

Frontend: HTML5/CSS3 (Night-vision optimized UI)

Communication: RESTful API over Wi-Fi 6

🛠️ Operational Logic

Hibernate: The device enters EXT0 deep sleep, monitoring the GPIO interrupt from the piezo sensor.

Trigger: A kinetic event generates a voltage spike, waking the RISC-V core instantly.

Report: The device joins the pre-configured network and sends a JSON payload containing the alert message and preset coordinates.

Conserve: Immediately after server confirmation, the device re-enters deep sleep to maximize battery longevity.

📈 Performance Metrics

Wake-to-Alert Latency: < 1.5 Seconds

Solar Recovery: 1 hour of sunlight = ~1,500 alert transmissions

Cost Efficiency: Built for under ₹1,100 ($13 USD) per node.

Developed by: [Your Team Name/Kailaashrao]
