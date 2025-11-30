import { useEffect, useState } from "react";
import { getCars } from "../api";

export default function CarsPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getCars();
        setCars(res.data);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Loading cars...</p>;

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>Available Cars 🚗</h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "20px",
        marginTop: "20px"
      }}>
        {cars.map((car) => (
          <div key={car.id} style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "16px",
            background: "white",
            boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
          }}>
            <img
              src={car.image_url}
              alt={car.name}
              style={{
                width: "100%",
                height: "180px",
                objectFit: "cover",
                borderRadius: "10px"
              }}
            />
            <h3 style={{ marginTop: "10px" }}>
              {car.name} ({car.year})
            </h3>
            <p><strong>Location:</strong> {car.location}</p>
            <p><strong>Fuel:</strong> {car.fuel_type}</p>
            <p><strong>Seats:</strong> {car.seats}</p>
            <p><strong>Price/day:</strong> KES {car.price_per_day}</p>
            <button style={{
              marginTop: "10px",
              width: "100%",
              padding: "10px",
              background: "#2563eb",
              color: "white",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer"
            }}>
              Book Now →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
