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

@app.route('/wishlist/toggle', methods=['POST'])
def toggle_wishlist():
    data = request.get_json()
    user_id = data.get('user_id')
    make = data.get('make')
    model = data.get('model')
    fuel_type = data.get('fuel_type')

    if not all([user_id, make, model, fuel_type]):
        return jsonify({'status': 'error', 'message': 'Missing required fields'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    # Check if already in wishlist
    cursor.execute('''
        SELECT id FROM wishlist 
        WHERE user_id = %s AND make = %s AND model = %s AND fuel_type = %s
    ''', (user_id, make, model, fuel_type))
    result = cursor.fetchone()

    if result:
        # Already in wishlist, remove it
        cursor.execute('''
            DELETE FROM wishlist 
            WHERE user_id = %s AND make = %s AND model = %s AND fuel_type = %s
        ''', (user_id, make, model, fuel_type))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'status': 'removed'})
    else:
        # Not in wishlist, add it
        cursor.execute('''
            INSERT INTO wishlist (user_id, make, model, fuel_type) 
            VALUES (%s, %s, %s, %s)
        ''', (user_id, make, model, fuel_type))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'status': 'added'})