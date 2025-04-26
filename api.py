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

# Debug: Print available wheel size classes
if "Rim_Wheel_Size" in label_encoders:
    print(f"Available wheel size classes: {label_encoders['Rim_Wheel_Size'].classes_}")

# Define input model
class CarInput(BaseModel):
    Car_Brand: str
    Model: str
    Engine_Type: str
    Driving_Condition: str
    Rim_Wheel_Size: str
    Rim_Wheel_Style: str
    Rim_Wheel_Material: str
    Power_Upgrade: str
    Turbo_Supercharger: str
    Weather_Condition: str
    Driver_Experience: str

# Define prediction route
@app.post("/predict")
def predict(car: CarInput):
    try:
        # List of feature columns that match the training data
        feature_columns = [
            "Car_Brand", "Model", "Engine_Type", "Driving_Condition", 
            "Rim_Wheel_Size", "Rim_Wheel_Style", "Rim_Wheel_Material",
            "Power_Upgrade", "Turbo_Supercharger", "Weather_Condition", 
            "Driver_Experience"
        ]
        
        # Ensure all categorical inputs are present in encoders
        input_data = []
        for col in feature_columns:
            value = car.dict()[col]
            
            # Special handling for Rim_Wheel_Size
            if col == "Rim_Wheel_Size":
                # Simply use the value directly if it exists in the classes
                if value in label_encoders[col].classes_:
                    input_data.append(label_encoders[col].transform([value])[0])
                else:
                    # Convert to integer if possible
                    try:
                        value_int = int(float(value))
                        # Try to find a string representation of this number
                        str_value = str(value_int)
                        if str_value in label_encoders[col].classes_:
                            input_data.append(label_encoders[col].transform([str_value])[0])
                        else:
                            # If not found, use the first class as a fallback
                            fallback = label_encoders[col].classes_[0]
                            print(f"Using fallback wheel size: {fallback}")
                            input_data.append(label_encoders[col].transform([fallback])[0])
                    except (ValueError, TypeError):
                        return {"error": f"Invalid wheel size: '{value}'"}
            else:
                # For all other features, perform normal encoding
                if col in label_encoders:
                    if value in label_encoders[col].classes_:
                        input_data.append(label_encoders[col].transform([value])[0])
                    else:
                        return {"error": f"Invalid value '{value}' for {col}"}
                else:
                    return {"error": f"Encoding not found for column: {col}"}

        # Convert to numpy array and reshape
        input_array = np.array(input_data).reshape(1, -1)

        # Predict
        prediction = model.predict(input_array)

        # Ensure prediction result has expected shape
        if len(prediction[0]) != 6:  # Now expecting 6 output values
            return {"error": f"Unexpected model output shape: got {len(prediction[0])} values, expected 6"}

        return {
            "Fuel_Efficiency": round(float(prediction[0][0]), 2),
            "Safety_Rating": round(float(prediction[0][1]), 2),
            "Price_IR": round(float(prediction[0][2]), 2),
            "Comfort_Rating": round(float(prediction[0][3]), 2),
            "Engine_Performance": round(float(prediction[0][4]), 2),
            "Suspension_Performance": round(float(prediction[0][5]), 2)
        }
    except Exception as e:
        print(f"Error in prediction: {str(e)}")
        return {"error": str(e)}

# Add health check endpoint
@app.get("/health")
def health_check():
    return {"status": "ok"}