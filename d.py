import pandas as pd
import mysql.connector
import sys
import time

# Step 1: Read CSV
print("🔄 Reading CSV...")
df = pd.read_csv("car_information.csv")
print("✅ CSV read successfully.")

# Step 2: Rename columns
df.columns = ["Make", "Model", "Year", "Engine_Size_L", "Fuel_Type", "Price_IR", "Car_Type", "Power", "Torque", "Transmission_type", "Transmission", "Mileage", "Seats"]
print("📝 Columns renamed.")

# Step 3: Clean and ensure native Python types
df.dropna(inplace=True)
df = df.astype({
    "Make": str,
    "Model": str,
    "Year": int,
    "Engine_Size_L": float,
    "Fuel_Type": str,
    "Price_IR": float,
    "Car_Type": str,
    "Power": str,
    "Torque": str,
    "Transmission_type": str,
    "Transmission": str,
    "Mileage": str,
    "Seats": int
})
df = df.astype(object)  # Ensure Python-native types

# Step 4: Connect to MySQL
print("🔌 Connecting to MySQL...")
start = time.time()
try:
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="odd*357.",
        database="car_showroom",
        connection_timeout=5
    )
    print("✅ Connected to MySQL.")
except mysql.connector.Error as err:
    print(f"❌ MySQL connector error: {err}")
    sys.exit(1)
except Exception as ex:
    print(f"❌ General error: {ex}")
    sys.exit(1)
end = time.time()
print(f"⏱️ Connection took {end - start:.2f} seconds")

cursor = conn.cursor()

# Step 5: Create table if not exists
try:
    print("🧱 Creating table if not exists...")
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS cars_2010_2020 (
            id INT AUTO_INCREMENT PRIMARY KEY,
            Make VARCHAR(50),
            Model VARCHAR(50),
            Year INT,
            Engine_Size_L FLOAT,
            Fuel_Type VARCHAR(20),
            Price_IR DECIMAL(10, 2),
            Car_Type VARCHAR(50),
            Power VARCHAR(50),
            Torque VARCHAR(50),
            Transmission_type VARCHAR(50),
            Transmission VARCHAR(50),
            Mileage VARCHAR(50),
            Seats INT
        )
    """)
    print("✅ Table created or already exists.")
except mysql.connector.Error as err:
    print(f"❌ Table creation error: {err}")
    conn.close()
    sys.exit(1)

# Step 6: Insert a test row
print("🔎 Inserting a test row...")
try:
    first_row = df.iloc[0]
    insert_query = """
        INSERT INTO cars_2010_2020 
        (Make, Model, Year, Engine_Size_L, Fuel_Type, Price_IR, Car_Type, Power, Torque, Transmission_type, Transmission, Mileage, Seats)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    cursor.execute(insert_query, tuple(first_row))
    conn.commit()
    print("✅ Test row inserted.")
except mysql.connector.Error as err:
    print(f"❌ Test row insert error: {err}")
    conn.close()
    sys.exit(1)

# Step 7: Insert all remaining rows
print("📥 Inserting all remaining rows...")
try:
    cursor.executemany(insert_query, [tuple(row) for row in df.iloc[1:].values])
    conn.commit()
    print(f"✅ Inserted {len(df) - 1} remaining rows.")
except mysql.connector.Error as err:
    print(f"❌ Error inserting remaining rows: {err}")
    conn.close()
    sys.exit(1)

# Step 8: Finalize
cursor.close()
conn.close()
print(f"🎉 Done! Total rows inserted: {len(df)}")
print("🚀 Script completed successfully!")
