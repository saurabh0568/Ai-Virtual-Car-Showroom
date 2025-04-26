from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests from frontend

@app.route('/recognize-car', methods=['POST'])
def recognize_car():
    # We're hardcoding the response for Nissan Versa
    car_info = {
        "make": "Nissan",
        "model": "Versa",
        "fuel_type": "Petrol",
        "year": "2021",
        "seats": "5",
        "transmission_type": "Automatic",
        "price": "16000",
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/2020_Nissan_Versa_SV_front_5.26.20.jpg/640px-2020_Nissan_Versa_SV_front_5.26.20.jpg"
    }
    return jsonify(car_info)

if __name__ == '__main__':
    app.run(port=5500)
