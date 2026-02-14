# Implementation Plan - Excel DB & Local Server

## Goal
Replace client-side currency simulation with a real-time data flow using an Excel file as the database.
**Flow:** ESP32 -> (POST) -> Flask Server -> (Write) -> Excel File -> (Read) -> Flask Server -> (GET) -> Website

## User Review Required
> [!IMPORTANT]
> - You must run `python app.py` to start the server.
> - The website will be available at `http://localhost:5000`.
> - **ESP32 Configuration**: Configure your ESP32 to send HTTP POST requests to `http://<YOUR_PC_IP>:5000/api/data` with JSON body: `{"heartRate": 75, "spo2": 98, ...}`.

## Proposed Changes

### Backend (Python)
#### [NEW] [requirements.txt](file:///c:/Users/Admin/Downloads/Life-Line-Innovations-Dashboard1/Life-Line-Innovations-Dashboard--main/requirements.txt)
- `flask`, `pandas`, `openpyxl`.

#### [NEW] [init_db.py](file:///c:/Users/Admin/Downloads/Life-Line-Innovations-Dashboard1/Life-Line-Innovations-Dashboard--main/init_db.py)
- Creates `data.xlsx` with headers: `Timestamp`, `HeartRate`, `SpO2`, `Systolic`, `Diastolic`, `Temperature`, `Stress`, `Motion`.

#### [NEW] [app.py](file:///c:/Users/Admin/Downloads/Life-Line-Innovations-Dashboard1/Life-Line-Innovations-Dashboard--main/app.py)
- **POST /api/data**: Receives JSON from ESP32, appends to `data.xlsx`.
- **GET /api/data**: Returns the last row of `data.xlsx` as JSON for the frontend.
- **Static File Serving**: Serves `index.html` and assets.

### Frontend (JavaScript)
#### [MODIFY] [js/storage.js](file:///c:/Users/Admin/Downloads/Life-Line-Innovations-Dashboard1/Life-Line-Innovations-Dashboard--main/js/storage.js)
- **Delete**: `generateHealthReadings`, `rand`, `randFloat`.
- **Add**: `fetchLatestReadings()` which calls `fetch('/api/data')`.
- **Update**: `getCurrentSnapshot` to use the fetched data.

## Verification Plan
1.  **Setup**: `pip install -r requirements.txt` and `python init_db.py`.
2.  **Run**: `python app.py`.
3.  **Test Write** (Simulate ESP32): `curl -X POST -H "Content-Type: application/json" -d '{"heartRate": 80, "spo2": 99}' http://localhost:5000/api/data`
4.  **Test Read**: Open `http://localhost:5000` and verify values update.
