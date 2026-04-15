import joblib

model = joblib.load("failure_model.pkl")

def predict_failure(data):
    input_data = [[
        data["temperature"],
        data["vibration"],
        data["power_usage"]
    ]]

    prediction = model.predict(input_data)[0]
    return "FAILURE" if prediction == 1 else "NORMAL"

sample = {
    "temperature": 90,
    "vibration": 2.6,
    "power_usage": 60
}

print("Prediction:", predict_failure(sample))
