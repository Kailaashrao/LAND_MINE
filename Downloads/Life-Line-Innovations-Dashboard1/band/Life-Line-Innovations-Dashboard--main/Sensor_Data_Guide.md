# System Data & Sensor Guide

## 1. Data Stored (Excel Database)
The following data points are saved in `data.xlsx` every time the ESP32 sends a reading:

| Excel Column | Data Type | Description |
| :--- | :--- | :--- |
| **Timestamp** | String | Date and time of the reading (e.g., "2026-02-14 10:30:05") |
| **HeartRate** | Number | Heart beats per minute (BPM) |
| **SpO2** | Number | Blood oxygen saturation percentage (%) |
| **Systolic** | Number | Upper blood pressure number (mmHg) |
| **Diastolic** | Number | Lower blood pressure number (mmHg) |
| **Temperature** | Number | Body temperature (°F) |
| **Stress** | Number | Calculated stress level (0-100%) |
| **Motion** | Number | Movement/Activity level |

## 2. Data Shown (Website Dashboard)
The dashboard displays the following real-time metrics fetched from the Excel file:

-   **Stress Level**: Displayed as a percentage (0-100%) with a progress bar.
-   **Blood Pressure**: Displayed as `Systolic/Diastolic` (e.g., "120/80 mmHg").
-   **Heart Rate**: Displayed in BPM with a heartbeat animation.
-   **SpO2**: Displayed as a percentage.
-   **Temperature**: Displayed in Fahrenheit (°F).
-   **Charts**:
    -   **Stress Trend**: Line chart showing historical stress levels.
    -   **Blood Pressure Trend**: Line chart showing Systolic vs Diastolic history.
-   **Wellness Score**: A calculated score (0-100) based on Stress, Heart Rate, and SpO2.

## 3. Sensors Used
Based on the data requirements, the following sensors are expected to be connected to your ESP32:

-   **MAX30102**: Measures **Heart Rate** and **SpO2**.
-   **MPU6050**: Measures **Motion** (Accelerometer/Gyroscope).
-   **MLX90614** (or similar): Measures **Temperature** (Contactless).
-   **Blood Pressure**: Typically estimated using algorithm from Heart Rate/SpO2 data (PPG), or requires a specialized dedicated sensor.
-   **Stress**: Typically derived/calculated from Heart Rate Variability (HRV) or simple Heart Rate zones.
