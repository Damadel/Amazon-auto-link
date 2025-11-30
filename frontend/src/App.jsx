// src/App.jsx
import { useEffect, useState } from "react";
import { getCars } from "./api";

function App() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCars() {
      try {
        setLoading(true);
        const res = await getCars();
        setCars(res.data); // Flask returns a list
      } catch (err) {
        console.error(err);
        setError("Failed to load cars");
      } finally {
        setLoading(false);
      }
    }

    fetchCars();
  }, []);

  if (loading) return <div style={{ padding: "2rem" }}>Loading cars...</div>;
  if (error) return <div style={{ padding: "2rem", color: "red" }}>{error}</div>;

  return (
    <div style={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto" }}>
      <h1>Amazon Auto Link – Cars</h1>
      <p>Showing cars from your Flask backend 🚗</p>

      {cars.length === 0 && <p>No cars available.</p>}

      <div style={{ marginTop: "1.5rem", display: "grid", gap: "1rem" }}>
        {cars.map((car) => (
          <div
            key={car.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "1rem",
            }}
          >
            <h2>
              {car.brand} {car.model} ({car.year})
            </h2>
            <p>Location: {car.location}</p>
            <p>Fuel: {car.fuel_type}</p>
            <p>Seats: {car.seats}</p>
            <p>Transmission: {car.transmission}</p>
            <p>Price per day: KES {car.price_per_day}</p>
            <p>
              Status:{" "}
              <strong style={{ color: car.is_available ? "green" : "red" }}>
                {car.is_available ? "Available" : "Not available"}
              </strong>
            </p>
            <p>Image URL: {car.image_url}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
