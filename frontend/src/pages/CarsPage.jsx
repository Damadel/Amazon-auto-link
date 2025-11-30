// src/pages/CarsPage.jsx
import { useEffect, useState } from "react";
import { getCars } from "../api";
import "../App.css"; // reuse your existing styles

export default function CarsPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCars() {
      try {
        setLoading(true);
        const res = await getCars(); // Flask returns a list
        setCars(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load cars");
      } finally {
        setLoading(false);
      }
    }

    fetchCars();
  }, []);

  if (loading) return <p>Loading cars...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="cars-page">
      <h1>Amazon Auto Link – Cars</h1>
      <p>Showing cars from your Flask backend 🚗</p>

      {cars.map((car) => (
        <div key={car.id} className="car-card">
          <h2>
            {car.brand} {car.model} ({car.year})
          </h2>

          <p>
            <strong>Location:</strong> {car.location}
          </p>
          <p>
            <strong>Fuel:</strong> {car.fuel_type}
          </p>
          <p>
            <strong>Seats:</strong> {car.seats}
          </p>
          <p>
            <strong>Transmission:</strong> {car.transmission}
          </p>
          <p>
            <strong>Price per day:</strong> KES {car.price_per_day}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span style={{ color: car.is_available ? "green" : "red" }}>
              {car.is_available ? "Available" : "Not available"}
            </span>
          </p>
          <p>
            <strong>Image URL:</strong> {car.image_url}
          </p>
        </div>
      ))}
    </div>
  );
}
