from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

# ----------------------------------------
# App + Config
# ----------------------------------------

app = Flask(__name__)
CORS(app)

# SQLite database file in backend folder
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///cars.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)


# ----------------------------------------
# Car model
# ----------------------------------------

class Car(db.Model):
    __tablename__ = "cars"

    id = db.Column(db.Integer, primary_key=True)
    brand = db.Column(db.String(100), nullable=False)
    model = db.Column(db.String(100), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    price_per_day = db.Column(db.Integer, nullable=False)
    image_url = db.Column(db.String(255), nullable=True)
    transmission = db.Column(db.String(50), nullable=True)
    fuel_type = db.Column(db.String(50), nullable=True)
    seats = db.Column(db.Integer, nullable=True)
    location = db.Column(db.String(100), nullable=True)
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


# ----------------------------------------
# Create tables + seed some demo cars
# ----------------------------------------

def setup_db():
    db.create_all()

    # Only seed if table is empty
    if Car.query.count() == 0:
        demo_cars = [
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
        db.session.add_all(demo_cars)
        db.session.commit()


# Run setup once when app starts
with app.app_context():
    setup_db()


# ----------------------------------------
# Routes
# ----------------------------------------

@app.route("/")
def home():
    return jsonify({"message": "Amazon Auto Link API is running 🚗"})


@app.route("/cars", methods=["GET"])
def get_cars():
    """Return all cars as JSON"""
    cars = Car.query.all()
    return jsonify([car.to_dict() for car in cars])


# ----------------------------------------
# Main
# ----------------------------------------

if __name__ == "__main__":
    app.run(debug=True)
