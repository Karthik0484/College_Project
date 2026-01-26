import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
import pickle

# Load data
df = pd.read_csv("machine_data.csv")

X = df[["temperature", "vibration", "power"]]
y = df["failure"]

# Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Train model
model = LogisticRegression()
model.fit(X_train, y_train)

# Save model using pickle
with open("failure_model.pkl", "wb") as f:
    pickle.dump(model, f)

print("ML Model trained and saved using pickle")
