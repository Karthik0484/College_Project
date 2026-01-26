import pandas as pd
import random

data = []

for i in range(1000):
    temperature = random.uniform(60, 95)
    vibration = random.uniform(0.2, 3.0)
    power = random.uniform(20, 65)

    failure = 0
    if temperature > 85 and vibration > 2.0:
        failure = 1
    elif vibration > 2.5 and power > 55:
        failure = 1

    data.append([temperature, vibration, power, failure])

df = pd.DataFrame(data, columns=["temperature", "vibration", "power", "failure"])

df.to_csv("machine_data.csv", index=False)
print("Dataset generated")
