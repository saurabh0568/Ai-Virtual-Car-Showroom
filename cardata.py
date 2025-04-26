from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

# DB connection helper
def get_db_connection():
    return mysql.connector.connect(
        host='localhost',
        user='root',
        password='odd*357.',
        database='car_showroom'
    )

# 📦 Get all cars
@app.route('/api/cars')
def get_cars_json():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM cars_2010_2020")
    cars = cursor.fetchall()
    conn.close()
    return jsonify({'cars': cars})

# 🚗 Get car details by make, model, and fuel_type
@app.route('/api/cars/compare', methods=['POST'])
def compare_cars():
    data = request.get_json()
    cars_to_compare = data.get('cars')
    
    if not cars_to_compare:
        return jsonify({'status': 'error', 'message': 'No cars selected'}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cars_details = []

    # Fetch details for each car
    for car in cars_to_compare:
        make = car.get('make')
        model = car.get('model')
        fuel_type = car.get('fuel_type')
        
        cursor.execute('''
            SELECT * FROM cars_2010_2020 
            WHERE make = %s AND model = %s AND fuel_type = %s
        ''', (make, model, fuel_type))
        car_detail = cursor.fetchone()
        
        if car_detail:
            cars_details.append(car_detail)

    conn.close()

    if not cars_details:
        return jsonify({'status': 'error', 'message': 'No matching cars found'}), 404

    return jsonify({'cars': cars_details})

# Wishlist toggle

# 🚗 Render HTML page (cars.html must be in /templates)
@app.route('/cars')
def show_cars_page():
    return render_template('cars.html')


if __name__ == '__main__':
    app.run(debug=True)
