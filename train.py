import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn.pipeline import Pipeline
import joblib

# Load dataset
file_path = "car_performance_dataset.csv"
df = pd.read_csv(file_path)

# Selecting relevant features
features = ["Car_Brand", "Model", "Engine_Type", "Driving_Condition", "Road_Type", "Weather_Condition", "Driver_Experience"]
targets = ["Fuel_Efficiency", "Safety_Rating", "Price", "Comfort_Rating"]

# Drop rows with missing values
df = df.dropna(subset=features + targets)

# Encode categorical variables
label_encoders = {col: LabelEncoder().fit(df[col]) for col in features}
for col, encoder in label_encoders.items():
    df[col] = encoder.transform(df[col])

# Split data
X = df[features]
y = df[targets]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Create and train model
model = Pipeline([
    ("scaler", StandardScaler()),
    ("regressor", RandomForestRegressor(n_estimators=100, random_state=42))
])
model.fit(X_train, y_train)

# Save model and encoders
joblib.dump(model, "car_prediction_model.pkl")
joblib.dump(label_encoders, "label_encoders.pkl")

print("Model trained and saved successfully!")
