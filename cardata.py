from flask import Flask, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)  # Allow all origins for now

@app.route('/api/cars')
def get_cars_json():
    conn = mysql.connector.connect(
        host='localhost',
        user='root',
        password='odd*357.',
        database='car_showroom'
    )
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM cars_2010_2020")
    cars = cursor.fetchall()
    conn.close()
    return jsonify({'cars': cars})

if __name__ == '__main__':
    app.run(debug=True)
