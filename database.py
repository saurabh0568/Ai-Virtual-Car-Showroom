from flask import Flask, render_template
from flask_pymongo import PyMongo

app = Flask(__name__)

# Make sure your DB name is correct here
app.config["MONGO_URI"] = "mongodb://localhost:27017/car_list"
mongo = PyMongo(app)

@app.route('/')
def show_cars():
    # Convert cursor to list
    cars = list(mongo.db.cars.find())
    print("Fetched cars:", cars) 
    return render_template('da.html', cars=cars)

if __name__ == '__main__':
    app.run(debug=True)
