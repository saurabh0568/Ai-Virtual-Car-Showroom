import pandas as pd
import mysql.connector
import sys
import time

# Step 1: Read CSV
print("🔄 Reading CSV...")
df = pd.read_csv("Dataset_cars.csv")
print("✅ CSV read successfully.")

# Step 2: Rename columns
df.columns = ["Make", "Model", "Year", "Engine_Size_L", "Fuel_Type", "Price_USD"]
print("📝 Columns renamed.")

# Step 3: Clean and ensure native Python types
df.dropna(inplace=True)
df = df.astype({
    "Make": str,
    "Model": str,
    "Year": int,
    "Engine_Size_L": float,
    "Fuel_Type": str,
    "Price_USD": float
})
df = df.astype(object)  # ✅ Convert numpy types to Python-native types

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
            Price_USD DECIMAL(10, 2)
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
    cursor.execute("""
        INSERT INTO cars_2010_2020 (Make, Model, Year, Engine_Size_L, Fuel_Type, Price_USD)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, tuple(first_row))
    conn.commit()
    print("✅ Test row inserted.")
except mysql.connector.Error as err:
    print(f"❌ Test row insert error: {err}")
    conn.close()
    sys.exit(1)

# Step 7: Insert all remaining rows
print("📥 Inserting all rows...")
insert_query = """
    INSERT INTO cars_2010_2020 (Make, Model, Year, Engine_Size_L, Fuel_Type, Price_USD)
    VALUES (%s, %s, %s, %s, %s, %s)
"""

rows_inserted = 1  # already inserted the first one

for index, row in df.iloc[1:].iterrows():  # skip first since already inserted
    try:
        cursor.execute(insert_query, tuple(row))
        rows_inserted += 1
        if index % 100 == 0:
            print(f"✅ Inserted row {index}")
    except mysql.connector.Error as err:
        print(f"❌ Error inserting row {index}: {err}")

# Step 8: Finalize
conn.commit()
cursor.close()
conn.close()
print(f"🎉 Done! Total rows inserted: {rows_inserted}")
print("🚀 Script completed successfully!")
