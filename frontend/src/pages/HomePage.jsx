// src/pages/HomePage.jsx
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <section style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h1>Welcome to Amazon Auto Link</h1>
      <p>
        Find reliable cars for hire in Nairobi and Mombasa – daily, weekly, or
        monthly rentals.
      </p>
      <p>
        Browse available cars, see full details, and send us an inquiry for your
        trip or transfer.
      </p>

      <Link
        to="/cars"
        style={{
          display: "inline-block",
          marginTop: "1rem",
          padding: "0.6rem 1.2rem",
          borderRadius: "999px",
          border: "none",
          backgroundColor: "#2563eb",
          color: "white",
          fontWeight: 600,
        }}
      >
        Browse cars →
      </Link>
    </section>
  );
}
