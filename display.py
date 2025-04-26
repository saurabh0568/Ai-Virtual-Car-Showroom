from flask import Flask, render_template, request
import pandas as pd

app = Flask(__name__)

# Load CSV
df = pd.read_csv("car_information.csv")

@app.route("/")
def show_car():
    make = request.args.get("make", "").lower()
    model = request.args.get("model", "").lower()
    year = request.args.get("year", "")

    car_row = df[
        (df['Make'].str.lower() == make) &
        (df['Model'].str.lower() == model) &
        (df['Year'].astype(str) == year)
    ]

    car_data = car_row.iloc[0].to_dict() if not car_row.empty else None
    return render_template("car_details.html", car=car_data)
