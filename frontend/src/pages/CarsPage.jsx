import { useEffect, useState } from "react";
import { getCars } from "../api";

export default function CarsPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCars();
  }, []);

  async function fetchCars() {
    setLoading(true);
    try {
      const res = await getCars();

      // TEMP: delay only for testing loading UI → remove later
      await new Promise(resolve => setTimeout(resolve, 1200));

      setCars(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load cars");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
        Available Cars 🚗
      </h2>

      {loading && (
        <p style={{ textAlign: "center", fontSize: "18px" }}>Loading cars…</p>
      )}

      {error && (
        <p style={{ textAlign: "center", color: "red", fontSize: "18px" }}>
          {error}
        </p>
      )}

      {!loading && !error && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
          }}
        >
          {cars.map((car) => (
            <div
              key={car.id}
              style={{
                border: "1px solid #eee",
                borderRadius: "16px",
                padding: "20px",
                textAlign: "center",
                backgroundColor: "white",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                transition: "0.2s",
              }}
            >
              {/* IMAGE */}
              <div
                style={{
                  width: "100%",
                  height: "150px",
                  borderRadius: "12px",
                  marginBottom: "16px",
                  overflow: "hidden",
                  background: "#e5e7eb",
                }}
              >
                {car.image_url ? (
                  <img
                    src={car.image_url}
                    alt={`${car.brand} ${car.model}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                ) : null}
              </div>

              <h3>
                {car.brand} {car.model} ({car.year})
              </h3>

              <p><b>Location:</b> {car.location}</p>
              <p><b>Fuel:</b> {car.fuel_type}</p>
              <p><b>Seats:</b> {car.seats}</p>
              <p><b>Transmission:</b> {car.transmission}</p>
              <p><b>Price/day:</b> KES {car.price_per_day}</p>

              <p>
                <b>Status:</b>{" "}
                <span style={{ color: car.status === "Available" ? "green" : "red" }}>
                  {car.status}
                </span>
              </p>

              <button
                style={{
                  background: "#1d4ed8",
                  padding: "10px 25px",
                  borderRadius: "8px",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  marginTop: "10px",
                }}
              >
                Book Now →
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
