from fastapi import FastAPI
import joblib
import pandas as pd
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

# Load trained model, encoders, and scaler
model = joblib.load("car_performance_model.pkl")
label_encoders = joblib.load("label_encoders.pkl")
scaler = joblib.load("scaler.pkl")

# Define API
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (change this for security)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Define input data model
class CarCustomization(BaseModel):
    Car_Brand: str
    Model: str
    Engine_Type: str
    Driving_Condition: str
    Temperature: int
    Road_Type: str
    Traffic_Level: str
    Weather_Condition: str
    Price: int
    Vehicle_Condition: str
    Tire_Condition: str
    Driver_Experience: str
    Performance_Optimization: str

# Prediction function
def predict_performance(custom_features):
    # Handle categorical features safely
    for col in label_encoders:
        if custom_features[col] not in label_encoders[col].classes_:
            print(f"Warning: Unseen value '{custom_features[col]}' for column '{col}'. Handling dynamically.")
            
            # Dynamically add the new label to the encoder
            label_encoders[col].classes_ = np.append(label_encoders[col].classes_, custom_features[col])

        # Transform the category
        custom_features[col] = label_encoders[col].transform([custom_features[col]])[0]

    # Convert features into a DataFrame (assuming X_train has same columns)
    features_df = pd.DataFrame([custom_features])

    # Make prediction
    prediction = model.predict(features_df)

    return {"predicted_value": prediction[0]}

    
    # Convert to DataFrame
    input_df = pd.DataFrame([custom_features])
    
    # Scale features
    input_scaled = scaler.transform(input_df)
    
    # Predict
    prediction = model.predict(input_scaled)[0]
    
    return {
        "Fuel_Efficiency": prediction[0],
        "Engine_Performance": prediction[1],
        "Braking_Performance": prediction[2],
        "Comfort_Rating": prediction[3],
        "Emissions": prediction[4],
        "Acceleration": prediction[5],
        "Suspension_Performance": prediction[6],
        "Scenario_Adaptability": prediction[7],
    }

@app.post("/predict")
async def predict(car: CarCustomization):
    car_data = car.dict()
    return predict_performance(car_data)

# Run with: uvicorn filename:app --reload
