import random
import time
import requests
from datetime import datetime

URL = "http://localhost:5000/api/machine-data"

def generate_machine_data():
    return {
        "machine_id": "M-101",
        "temperature": round(random.uniform(60, 90), 2),
        "vibration": round(random.uniform(0.2, 2.5), 2),
        "power_usage": round(random.uniform(20, 60), 2),
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

while True:
    data = generate_machine_data()
    response = requests.post(URL, json=data)
    print(response.json())
    time.sleep(2)
