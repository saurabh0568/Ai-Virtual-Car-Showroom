from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
import numpy as np
from pydantic import BaseModel

# Load trained model and encoders
model = joblib.load("car_prediction_model.pkl")
label_encoders = joblib.load("label_encoders.pkl")

# Initialize FastAPI app
app = FastAPI()

# Enable CORS (modify allow_origins in production for security)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define input model
class CarInput(BaseModel):
    Car_Brand: str
    Model: str
    Engine_Type: str
    Driving_Condition: str
    Road_Type: str
    Weather_Condition: str
    Driver_Experience: str

# Define prediction route
@app.post("/predict")
def predict(car: CarInput):
    try:
        # Ensure all categorical inputs are present in encoders
        input_data = []
        for col in ["Car_Brand", "Model", "Engine_Type", "Driving_Condition", "Road_Type", "Weather_Condition", "Driver_Experience"]:
            if col in label_encoders:
                if car.dict()[col] in label_encoders[col].classes_:
                    input_data.append(label_encoders[col].transform([car.dict()[col]])[0])
                else:
                    return {"error": f"Invalid value '{car.dict()[col]}' for {col}"}
            else:
                return {"error": f"Encoding not found for column: {col}"}

        # Convert to numpy array and reshape
        input_array = np.array(input_data).reshape(1, -1)

        # Predict
        prediction = model.predict(input_array)

        # Ensure prediction result has expected shape
        if len(prediction[0]) != 4:
            return {"error": "Unexpected model output shape"}

        return {
            "Fuel_Efficiency": round(float(prediction[0][0]), 2),
            "Safety_Rating": round(float(prediction[0][1]), 2),
            "Price": round(float(prediction[0][2]), 2),
            "Comfort_Rating": round(float(prediction[0][3]), 2)
        }
    except Exception as e:
        return {"error": str(e)}
