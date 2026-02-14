import pandas as pd
import os
from datetime import datetime

# Define the file path
file_path = 'data.xlsx'

# Define the columns matching usage
columns = [
    'Timestamp', 
    'HeartRate', 
    'SpO2', 
    'Systolic', 
    'Diastolic', 
    'Temperature', 
    'Stress', 
    'Motion' # For the graph
]

# Create a DataFrame with one initial row of default data so the dashboard isn't empty
initial_data = {
    'Timestamp': [datetime.now().strftime("%Y-%m-%d %H:%M:%S")],
    'HeartRate': [75],
    'SpO2': [98],
    'Systolic': [120],
    'Diastolic': [80],
    'Temperature': [98.6],
    'Stress': [20],
    'Motion': [0]
}

df = pd.DataFrame(initial_data)

# Save to Excel
if not os.path.exists(file_path):
    df.to_excel(file_path, index=False)
    print(f"Created {file_path} with initial data.")
else:
    print(f"{file_path} already exists. Skipping creation.")
