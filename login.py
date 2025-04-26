from flask import Flask, jsonify, request, render_template, session, redirect, url_for, flash
from flask_cors import CORS
import mysql.connector
import hashlib
import os

app = Flask(__name__)
app.secret_key = os.urandom(24)  # Session secret key for security
CORS(app)

# DB connection helper
def get_db_connection():
    return mysql.connector.connect(
        host='localhost',
        user='root',
        password='odd*357.',
        database='car_showroom'
    )

# 🧑‍🤝‍🧑 User Registration Route
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')

        if not username or not email or not password:
            return "Please fill all fields", 400

        hashed_password = hashlib.sha256(password.encode()).hexdigest()

        conn = get_db_connection()
        cursor = conn.cursor()

        try:
            cursor.execute(
                "INSERT INTO users (username, email, password) VALUES (%s, %s, %s)",
                (username, email, hashed_password)
            )
            conn.commit()
            return redirect(url_for('login'))
        except mysql.connector.Error as err:
            return f"Database error: {err}", 500
        finally:
            conn.close()

    return render_template('register.html')

# 🔒 User Login Route
@app.route('/login', methods=['POST', 'GET'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        # Hardcoded admin check
        if username == 'admin' and password == '45678901':
            session['user_id'] = 0
            session['username'] = 'admin'
            flash("Admin login successful!", "success")
            return render_template('admin.html')  # Or: redirect(url_for('admin_dashboard'))

        # For regular users - check in database
        hashed_password = hashlib.sha256(password.encode()).hexdigest()

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
        user = cursor.fetchone()

        conn.close()

        if user and user['password'] == hashed_password:
            session['user_id'] = user['id']
            session['username'] = user['username']
            flash("Login successful!", "success")
            return render_template('cars.html', username=session['username'])  # show cars
        else:
            flash("Invalid credentials. Please try again.", "danger")

    return render_template('login.html')

# 🔒 User Logout Route
@app.route('/logout')
def logout():
    session.clear()  # Clear the session
    flash("You have been logged out.", "success")
    return redirect(url_for('login'))

# 🏠 User Dashboard Route (after login)
@app.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        flash("You must log in first!", "danger")
        return redirect(url_for('login'))

    return render_template('dashboard.html', username=session['username'])

# 📦 Get all cars (For logged-in users)
@app.route('/api/cars')
def get_cars_json():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM cars_2010_2020")
    cars = cursor.fetchall()
    conn.close()
    return jsonify({'cars': cars})

# 🚗 Render HTML page (cars.html must be in /templates)
@app.route('/cars')
def show_cars_page():
    return render_template('cars.html')

if __name__ == '__main__':
    app.run(debug=True, port=5500)

