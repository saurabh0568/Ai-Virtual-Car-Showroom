from flask import Flask, jsonify
from flask_pymongo import PyMongo

app = Flask(__name__)

# Connect to MongoDB
app.config["MONGO_URI"] = "mongodb://localhost:27017/car_list"
mongo = PyMongo(app)

@app.route('/cars')
def get_cars():
    cars = mongo.db.none.find() 
    car_list = []
    for car in cars:
        car_list.append({
            'Make': car.get('name', 'Unknown'),
            'Model': car.get('fuel', 'N/A'),
            'Year': car.get('transmission', 'N/A'),
            'Engine Size (L)': car.get('type', 'N/A'),
            'price': car.get('price', '0'),
            'status': car.get('status', '')  # New, Featured, etc.
        })
    return jsonify(car_list)

if __name__ == '__main__':
    app.run(debug=True)
