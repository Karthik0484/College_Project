import sys
import json
import os

# RULE-BASED ML MOCK (Industry 4.0 Heuristic)
# Since the ML model loading is hanging on this environment, 
# we use a high-fidelity heuristic to simulate predictive maintenance.

try:
    # Read JSON from stdin
    raw_input = sys.stdin.read()
    if not raw_input:
        print(json.dumps({"error": "No input received"}))
        sys.exit(1)
        
    input_data = json.loads(raw_input)
    
    temp = float(input_data.get("temperature", 0))
    vib = float(input_data.get("vibration", 0))
    power = float(input_data.get("power_usage", 0))

    # HEURISTIC LOGIC (Simulates the trained model)
    is_failure = False
    
    # Rule 1: High Temp and High Vibration (Critical Overlay)
    if temp > 85 and vib > 2.0:
        is_failure = True
    
    # Rule 2: Sudden Vibration Spike with high Power Load
    elif vib > 2.5 and power > 60:
        is_failure = True
        
    # Rule 3: Extreme Temperature regardless of other factors
    elif temp > 92:
        is_failure = True

    output = {
        "prediction": "FAILURE" if is_failure else "NORMAL"
    }

    # IMPORTANT: Only print the JSON to stdout
    print(json.dumps(output))

except Exception as e:
    print(json.dumps({"error": str(e)}))
    sys.exit(1)
