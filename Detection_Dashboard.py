from flask import Flask, request, render_template_string, jsonify
import logging
import socket
import time

# Disable Flask's default logging
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

app = Flask(__name__)

# --- Server State ---
warning_trigger_time = 0
DELAY_SECONDS = 4

# --- Helper to get Local IP ---
def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        local_ip = s.getsockname()[0]
        s.close()
        return local_ip
    except Exception:
        return "127.0.0.1"

# --- HTML Dashboard ---
html_template = """
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Military Surveillance Dashboard</title>
  <link href="https://fonts.googleapis.com/css2?family=Black+Ops+One&family=Roboto+Mono:wght@400;700&display=swap" rel="stylesheet">
  <style>
    body {
      background-color: #0f0f0f;
      color: #00ff00;
      font-family: 'Roboto Mono', monospace;
      text-align: center;
      margin: 0;
      padding: 0;
      overflow: hidden;
      background-image: linear-gradient(0deg, transparent 24%, rgba(0, 255, 0, .03) 25%, rgba(0, 255, 0, .03) 26%, transparent 27%, transparent 74%, rgba(0, 255, 0, .03) 75%, rgba(0, 255, 0, .03) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0, 255, 0, .03) 25%, rgba(0, 255, 0, .03) 26%, transparent 27%, transparent 74%, rgba(0, 255, 0, .03) 75%, rgba(0, 255, 0, .03) 76%, transparent 77%, transparent);
      background-size: 50px 50px;
    }
    
    .container {
        display: flex;
        flex-direction: column;
        height: 100vh;
        justify-content: space-between;
        padding: 20px;
        box-sizing: border-box;
    }

    header {
      border-bottom: 2px solid #00ff00;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }

    h1 {
      font-family: 'Black Ops One', cursive;
      font-size: 48px;
      margin: 0;
      letter-spacing: 5px;
      text-transform: uppercase;
      text-shadow: 0 0 10px #00ff00;
    }

    .status-panel {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .status-box {
      border: 4px solid #00ff00;
      padding: 40px;
      border-radius: 10px;
      background-color: rgba(0, 51, 0, 0.5);
      width: 80%;
      max-width: 800px;
      box-shadow: 0 0 20px rgba(0, 255, 0, 0.2);
    }

    .status-text {
        font-size: 64px;
        font-weight: bold;
        text-transform: uppercase;
    }
    
    .safe-mode .status-box {
        border-color: #00ff00;
        background-color: rgba(0, 51, 0, 0.5);
        color: #00ff00;
        box-shadow: 0 0 20px rgba(0, 255, 0, 0.2);
    }
    
    .alert-mode .status-box {
        border-color: #ff0000;
        background-color: rgba(51, 0, 0, 0.5);
        color: #ff0000;
        box-shadow: 0 0 50px rgba(255, 0, 0, 0.6);
        animation: blink 1s infinite;
    }

    .details-grid {
        display: none;
        margin-top: 30px;
        display: grid; 
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        width: 100%;
        text-align: left;
    }
    
    .alert-mode .details-grid {
        display: grid;
    }
    
    .safe-mode .details-grid {
        display: none;
    }

    .detail-item {
        border: 1px solid #ff0000;
        padding: 15px;
        background: rgba(20, 0, 0, 0.8);
    }
    
    .detail-label {
        font-size: 14px;
        color: #ff6666;
        display: block;
        margin-bottom: 5px;
    }
    
    .detail-value {
        font-size: 24px;
        color: #ff0000;
        font-weight: bold;
    }

    .controls {
      border-top: 1px solid #333;
      padding-top: 20px;
      margin-top: auto;
    }

    button {
      background-color: transparent;
      border: 2px solid #00ff00;
      color: #00ff00;
      padding: 10px 30px;
      font-family: 'Roboto Mono', monospace;
      font-size: 18px;
      cursor: pointer;
      margin: 0 15px;
      text-transform: uppercase;
      transition: all 0.3s;
    }

    button:hover {
      background-color: #00ff00;
      color: black;
      box-shadow: 0 0 15px #00ff00;
    }
    
    .btn-sim {
        border-color: #ff9900;
        color: #ff9900;
    }
    .btn-sim:hover {
        background-color: #ff9900;
        color: black;
        box-shadow: 0 0 15px #ff9900;
    }

    @keyframes blink {
      0% { opacity: 1; border-color: #ff0000; }
      50% { opacity: 0.7; border-color: #550000; }
      100% { opacity: 1; border-color: #ff0000; }
    }
    
    .scan-line {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 5px;
        background: rgba(0, 255, 0, 0.3);
        animation: scan 3s linear infinite;
        pointer-events: none;
    }
    
    @keyframes scan {
        0% { top: 0; }
        100% { top: 100%; }
    }

  </style>
</head>
<body>
  <div class="scan-line"></div>
  <div class="container">
      <header>
        <h1>SECURE COMMAND LINK</h1>
        <div style="font-size: 14px; color: #008800;">CLASSIFIED // EYES ONLY</div>
      </header>
      
      <div id="main-panel" class="status-panel safe-mode">
        <div class="status-box">
            <div id="status-text" class="status-text">SYSTEM SECURE</div>
            <div id="sub-text" style="font-size: 20px; margin-top: 10px; opacity: 0.8;">PERIMETER MONITORING ACTIVE</div>
            
            <div class="details-grid">
                <div class="detail-item">
                    <span class="detail-label">TARGET LOCATION</span>
                    <span class="detail-value">SRM UNIVERSITY RAMAPURAM</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">COORDINATES</span>
                    <span class="detail-value">13.010600° N <br> 80.193180° E</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">IMPACT SENSOR (PIEZO)</span>
                    <span class="detail-value">LEVEL 364 (CRITICAL)</span>
                </div>
                 <div class="detail-item">
                    <span class="detail-label">THREAT ASSESSMENT</span>
                    <span class="detail-value">CONFIRMED</span>
                </div>
            </div>
        </div>
      </div>
    
      <div class="controls">
        <button class="btn-sim" onclick="simulateTap()">// SIMULATE IMPACT //</button>
        <button onclick="resetStatus()">// RESET SYSTEM //</button>
      </div>
  </div>

  <script>
    function updateDisplay(isWarning) {
      const panel = document.getElementById('main-panel');
      const statusText = document.getElementById('status-text');
      const subText = document.getElementById('sub-text');
      
      if (isWarning) {
        panel.classList.remove('safe-mode');
        panel.classList.add('alert-mode');
        statusText.innerText = "IMPACT DETECTED";
        subText.innerText = "STRUCTURAL INTEGRITY COMPROMISED";
      } else {
        panel.classList.remove('alert-mode');
        panel.classList.add('safe-mode');
        statusText.innerText = "SYSTEM SECURE";
        subText.innerText = "PERIMETER MONITORING ACTIVE";
      }
    }

    function checkStatus() {
      fetch('/get_status')
        .then(response => response.json())
        .then(data => {
          updateDisplay(data.warning);
        })
        .catch(err => console.error("Error fetching status:", err));
    }

    function resetStatus() {
      fetch('/reset')
        .then(response => response.json())
        .then(data => {
            console.log("Reset command sent");
            checkStatus(); 
        });
    }

    function simulateTap() {
      fetch('/update?command=tap')
        .then(response => response.json())
        .then(data => {
            console.log("Simulation command sent");
            // Don't update immediately, wait for server delay logic
        });
    }

    // Start checking
    setInterval(checkStatus, 500);
  </script>
</body>
</html>
"""

@app.route('/')
def index():
    return render_template_string(html_template)

@app.route('/update')
def update():
    global warning_trigger_time
    command = request.args.get('command', '')
    print(f"Received command: {command}")

    if command == 'tap':
        # Start the 4 second timer
        warning_trigger_time = time.time() + DELAY_SECONDS
        print(f"⚠️ Impact detected! Warning scheduled for {DELAY_SECONDS}s from now.")
    
    return {"status": "ok"}

@app.route('/reset')
def reset():
    global warning_trigger_time
    warning_trigger_time = 0
    print("System reset.")
    return jsonify({"status": "reset"})

@app.route('/get_status')
def get_status():
    global warning_trigger_time
    
    is_warning = False
    if warning_trigger_time > 0 and time.time() >= warning_trigger_time:
        is_warning = True
        
    return jsonify({
        "warning": is_warning,
        "location": "SRM University Ramapuram",
        "coordinates": "13.010600, 80.193180",
        "impact_level": 364
    })

if __name__ == '__main__':
    local_ip = get_local_ip()
    print("==============================================")
    print("      MILITARY SURVEILLANCE SERVER ONLINE     ")
    print("==============================================")
    print(f"Access Interface: http://{local_ip}:5000")
    print("==============================================")
    app.run(host='0.0.0.0', port=5000, debug=False)