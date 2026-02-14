from flask import Flask, request, jsonify, send_from_directory
import pandas as pd
import os
from datetime import datetime

app = Flask(__name__, static_url_path='', static_folder='.')

DATA_FILE = 'data.xlsx'

def read_data():
    if not os.path.exists(DATA_FILE):
        return None
    try:
        df = pd.read_excel(DATA_FILE)
        if df.empty:
            return None
        # Return the last row as a dictionary
        return df.iloc[-1].to_dict()
    except Exception as e:
        print(f"Error reading Excel: {e}")
        return None

def write_data(data):
    # Prepare new row
    new_entry = {
        'Timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        'HeartRate': data.get('heartRate', 0),
        'SpO2': data.get('spo2', 0),
        'Systolic': data.get('systolic', 120),
        'Diastolic': data.get('diastolic', 80),
        'Temperature': data.get('temperature', 98.6),
        'Stress': data.get('stress', 0),
        'Motion': data.get('motion', 0)
    }
    
    try:
        if os.path.exists(DATA_FILE):
            df = pd.read_excel(DATA_FILE)
            new_df = pd.DataFrame([new_entry])
            df = pd.concat([df, new_df], ignore_index=True)
            # Optional: Keep only last 1000 rows to prevent file from getting too huge
            if len(df) > 1000:
                df = df.iloc[-1000:]
        else:
            df = pd.DataFrame([new_entry])
            
        df.to_excel(DATA_FILE, index=False)
        return True
    except Exception as e:
        print(f"Error writing to Excel: {e}")
        return False

@app.route('/')
def serve_index():
    return send_from_directory('.', 'dashboard.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/api/data', methods=['GET'])
def get_data():
    data = read_data()
    if data:
        return jsonify(data)
    else:
        return jsonify({
            'HeartRate': 0, 'SpO2': 0, 'Systolic': 120, 'Diastolic': 80, 
            'Temperature': 98.6, 'Stress': 0, 'Motion': 0, 'Timestamp': 'N/A'
        })

@app.route('/api/data', methods=['POST'])
def post_data():
    content = request.json
    if not content:
        return jsonify({'error': 'No JSON data received'}), 400
    
    success = write_data(content)
    if success:
        return jsonify({'status': 'success', 'message': 'Data saved to Excel'}), 200
    else:
        return jsonify({'status': 'error', 'message': 'Failed to save data'}), 500

if __name__ == '__main__':
    # Listen on all interfaces so ESP32 can connect
    app.run(host='0.0.0.0', port=5000, debug=True)
