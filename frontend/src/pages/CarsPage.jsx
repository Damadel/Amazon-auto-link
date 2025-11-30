// frontend/src/pages/CarsPage.jsx
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

      // Fake delay so you can SEE the loading state
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setCars(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load cars");
    } finally {
      setLoading(false);
    }
  }

  // Decide badge color and label based on availability/status
  function getStatusInfo(car) {
    const raw =
      (car.availability || car.status || "").toString().trim().toLowerCase();

    // You can adjust these rules depending on your real data
    if (raw === "available" || raw === "true") {
      return {
        label: "Available",
        textColor: "#16a34a", // green
        bgColor: "rgba(22, 163, 74, 0.12)",
        isBooked: false,
      };
    }

    if (raw === "booked" || raw === "false") {
      return {
        label: "Booked",
        textColor: "#dc2626", // red
        bgColor: "rgba(220, 38, 38, 0.12)",
        isBooked: true,
      };
    }

    if (raw === "pending") {
      return {
        label: "Pending",
        textColor: "#ea580c", // orange
        bgColor: "rgba(234, 88, 12, 0.12)",
        isBooked: true,
      };
    }

    return {
      label: car.availability || car.status || "Unknown",
      textColor: "#4b5563", // gray
      bgColor: "rgba(107, 114, 128, 0.12)",
      isBooked: false,
    };
  }

  // ------------------- UI STATES -------------------

  if (loading) {
    return (
      <main style={{ padding: "40px 16px" }}>
        <section style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
          <h1
            style={{
              fontSize: "2rem",
              marginBottom: "8px",
              fontWeight: 700,
              color: "#111827",
            }}
          >
            Available Cars 🚗
          </h1>
          <p
            style={{
              color: "#4b5563",
              marginBottom: "32px",
            }}
          >
            Loading cars...
          </p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main style={{ padding: "40px 16px" }}>
        <section style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
          <h1
            style={{
              fontSize: "2rem",
              marginBottom: "8px",
              fontWeight: 700,
              color: "#111827",
            }}
          >
            Available Cars 🚗
          </h1>
          <p style={{ color: "#b91c1c" }}>{error}</p>
        </section>
      </main>
    );
  }

  // ------------------- MAIN CARS LIST -------------------

  return (
    <main style={{ padding: "40px 16px" }}>
      <section style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <header style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1
            style={{
              fontSize: "2rem",
              marginBottom: "8px",
              fontWeight: 700,
              color: "#111827",
            }}
          >
            Available Cars <span role="img" aria-label="car">🚗</span>
          </h1>
          <p style={{ color: "#4b5563", fontSize: "0.95rem" }}>
            Browse cars ready for pickup in Nairobi and Mombasa.
          </p>
        </header>

        {/* Cards grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "24px",
          }}
        >
          {cars.map((car) => {
            const { label, textColor, bgColor, isBooked } = getStatusInfo(car);

            return (
              <article
                key={car.id}
                style={{
                  background: "white",
                  borderRadius: "16px",
                  padding: "16px",
                  boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",
                  border: "1px solid #e5e7eb",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {/* Image area */}
                <div
                  style={{
                    width: "100%",
                    height: "160px",
                    borderRadius: "12px",
                    overflow: "hidden",
                    background:
                      "linear-gradient(135deg, #e5e7eb, #f9fafb)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "8px",
                    position: "relative",
                  }}
                >
                  {car.image_url ? (
                    <img
                      src={car.image_url}
                      alt={`${car.make || ""} ${car.model || ""}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <span
                      style={{
                        color: "#9ca3af",
                        fontSize: "0.9rem",
                      }}
                    >
                      No image provided
                    </span>
                  )}

                  {/* Status badge over the image */}
                  <span
                    style={{
                      position: "absolute",
                      top: "10px",
                      left: "10px",
                      padding: "4px 10px",
                      borderRadius: "999px",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      backgroundColor: bgColor,
                      color: textColor,
                    }}
                  >
                    {label}
                  </span>
                </div>

                {/* Car title */}
                <h2
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: "#111827",
                    margin: 0,
                  }}
                >
                  {car.make} {car.model}{" "}
                  {car.year ? `(${car.year})` : null}
                </h2>

                {/* Details */}
                <div
                  style={{
                    fontSize: "0.9rem",
                    color: "#4b5563",
                    display: "grid",
                    rowGap: "4px",
                    marginTop: "4px",
                  }}
                >
                  {car.location && (
                    <p style={{ margin: 0 }}>
                      <strong>Location:</strong> {car.location}
                    </p>
                  )}
                  {car.fuel_type && (
                    <p style={{ margin: 0 }}>
                      <strong>Fuel:</strong> {car.fuel_type}
                    </p>
                  )}
                  {car.seats && (
                    <p style={{ margin: 0 }}>
                      <strong>Seats:</strong> {car.seats}
                    </p>
                  )}
                  {car.transmission && (
                    <p style={{ margin: 0 }}>
                      <strong>Transmission:</strong> {car.transmission}
                    </p>
                  )}
                  {car.price_per_day && (
                    <p style={{ margin: 0 }}>
                      <strong>Price/day:</strong> KES {car.price_per_day}
                    </p>
                  )}
                </div>

                {/* Status line (text) */}
                <p
                  style={{
                    margin: "4px 0 0",
                    fontSize: "0.9rem",
                    color: "#4b5563",
                  }}
                >
                  <strong>Status:</strong>{" "}
                  <span style={{ color: textColor }}>{label}</span>
                </p>

                {/* Book button */}
                <button
                  disabled={isBooked}
                  style={{
                    marginTop: "12px",
                    padding: "10px 16px",
                    borderRadius: "999px",
                    fontWeight: 600,
                    border: "none",
                    fontSize: "0.95rem",
                    backgroundColor: isBooked ? "#9ca3af" : "#2563eb",
                    color: "white",
                    cursor: isBooked ? "not-allowed" : "pointer",
                    opacity: isBooked ? 0.75 : 1,
                    transition: "transform 0.1s ease, box-shadow 0.1s ease",
                    boxShadow: isBooked
                      ? "none"
                      : "0 10px 20px rgba(37, 99, 235, 0.25)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isBooked) {
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {isBooked ? "Not Available" : "Book Now →"}
                </button>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
