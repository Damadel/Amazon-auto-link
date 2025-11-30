import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

# ---------------------------------
# App + Config
# ---------------------------------

app = Flask(__name__, instance_relative_config=True)
CORS(app)

# Make sure instance/ folder exists (for the SQLite file)
os.makedirs(app.instance_path, exist_ok=True)

db_path = os.path.join(app.instance_path, "cars.db")
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{db_path}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)


# ---------------------------------
# Helpers
# ---------------------------------

def error_response(status_code, message):
    """Standard JSON error response."""
    return jsonify({"error": message}), status_code


# ---------------------------------
# Car model
# ---------------------------------

class Car(db.Model):
    __tablename__ = "cars"

    id = db.Column(db.Integer, primary_key=True)
    brand = db.Column(db.String(80), nullable=False)
    model = db.Column(db.String(80), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    price_per_day = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String(255), nullable=False)
    transmission = db.Column(db.String(50), nullable=False)
    fuel_type = db.Column(db.String(50), nullable=False)
    seats = db.Column(db.Integer, nullable=False)
    location = db.Column(db.String(100), nullable=False)
    is_available = db.Column(db.Boolean, default=True)

    def to_dict(self):
        return {
            "id": self.id,
            "brand": self.brand,
            "model": self.model,
            "year": self.year,
            "price_per_day": self.price_per_day,
            "image_url": self.image_url,
            "transmission": self.transmission,
            "fuel_type": self.fuel_type,
            "seats": self.seats,
            "location": self.location,
            "is_available": self.is_available,
        }


# ---------------------------------
# DB setup + seed data
# ---------------------------------

def setup_db():
    """Create tables and add some sample cars if DB is empty."""
    with app.app_context():
        db.create_all()

        if Car.query.count() == 0:
            sample_cars = [
                Car(
                    brand="Toyota",
                    model="Corolla",
                    year=2020,
                    price_per_day=4500,
                    image_url="https://example.com/toyota-corolla.jpg",
                    transmission="Automatic",
                    fuel_type="Petrol",
                    seats=5,
                    location="Nairobi",
                    is_available=True,
                ),
                Car(
                    brand="Mercedes",
                    model="C200",
                    year=2019,
                    price_per_day=12000,
                    image_url="https://example.com/mercedes-c200.jpg",
                    transmission="Automatic",
                    fuel_type="Petrol",
                    seats=5,
                    location="Nairobi",
                    is_available=True,
                ),
                Car(
                    brand="Nissan",
                    model="X-Trail",
                    year=2018,
                    price_per_day=8000,
                    image_url="https://example.com/nissan-xtrail.jpg",
                    transmission="Automatic",
                    fuel_type="Diesel",
                    seats=7,
                    location="Mombasa",
                    is_available=True,
                ),
            ]

            db.session.add_all(sample_cars)
            db.session.commit()


# ---------------------------------
# Routes
# ---------------------------------

@app.route("/")
def home():
    return jsonify({"message": "Amazon Auto Link API is running 🚗"})


# GET all cars
@app.route("/cars", methods=["GET"])
def get_cars():
    cars = Car.query.all()
    return jsonify([car.to_dict() for car in cars])


# GET one car by id
@app.route("/cars/<int:car_id>", methods=["GET"])
def get_car(car_id):
    car = Car.query.get(car_id)
    if not car:
        return error_response(404, "Car not found")
    return jsonify(car.to_dict())


# CREATE car (POST /cars)
@app.route("/cars", methods=["POST"])
def create_car():
    data = request.get_json() or {}

    required_fields = [
        "brand",
        "model",
        "year",
        "price_per_day",
        "image_url",
        "transmission",
        "fuel_type",
        "seats",
        "location",
    ]

    missing = [f for f in required_fields if f not in data]
    if missing:
        return error_response(400, f"Missing required fields: {', '.join(missing)}")

    try:
        car = Car(
            brand=data["brand"],
            model=data["model"],
            year=int(data["year"]),
            price_per_day=float(data["price_per_day"]),
            image_url=data["image_url"],
            transmission=data["transmission"],
            fuel_type=data["fuel_type"],
            seats=int(data["seats"]),
            location=data["location"],
            is_available=bool(data.get("is_available", True)),
        )

        db.session.add(car)
        db.session.commit()
        return jsonify(car.to_dict()), 201

    except Exception as e:
        db.session.rollback()
        return error_response(500, f"Could not create car: {e}")


# UPDATE full car (PUT /cars/<id>)
@app.route("/cars/<int:car_id>", methods=["PUT"])
def update_car(car_id):
    car = Car.query.get(car_id)
    if not car:
        return error_response(404, "Car not found")

    data = request.get_json() or {}

    for field in [
        "brand",
        "model",
        "year",
        "price_per_day",
        "image_url",
        "transmission",
        "fuel_type",
        "seats",
        "location",
        "is_available",
    ]:
        if field in data:
            setattr(car, field, data[field])

    try:
        db.session.commit()
        return jsonify(car.to_dict())
    except Exception as e:
        db.session.rollback()
        return error_response(500, f"Could not update car: {e}")


# DELETE car (DELETE /cars/<id>)
@app.route("/cars/<int:car_id>", methods=["DELETE"])
def delete_car(car_id):
    car = Car.query.get(car_id)
    if not car:
        return error_response(404, "Car not found")

    try:
        db.session.delete(car)
        db.session.commit()
        return jsonify({"message": "Car deleted"})
    except Exception as e:
        db.session.rollback()
        return error_response(500, f"Could not delete car: {e}")


# PATCH availability only (PATCH /cars/<id>/availability)
@app.route("/cars/<int:car_id>/availability", methods=["PATCH"])
def update_availability(car_id):
    car = Car.query.get(car_id)
    if not car:
        return error_response(404, "Car not found")

    data = request.get_json() or {}
    if "is_available" not in data:
        return error_response(400, "Field 'is_available' is required")

    try:
        car.is_available = bool(data["is_available"])
        db.session.commit()
        return jsonify(car.to_dict())
    except Exception as e:
        db.session.rollback()
        return error_response(500, f"Could not update availability: {e}")


# ---------------------------------
# Main
# ---------------------------------

if __name__ == "__main__":
    setup_db()
    app.run(debug=True)
