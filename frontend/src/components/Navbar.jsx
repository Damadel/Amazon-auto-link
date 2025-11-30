// src/components/Navbar.jsx
import { NavLink } from "react-router-dom";

const headerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "1rem 2rem",
  borderBottom: "1px solid #eee",
  marginBottom: "1.5rem",
};

const linksStyle = {
  display: "flex",
  gap: "1rem",
};

const linkStyle = {
  textDecoration: "none",
  fontWeight: 500,
};

const activeStyle = {
  textDecoration: "underline",
};

export default function Navbar() {
  return (
    <header style={headerStyle}>
      <div style={{ fontWeight: 700, fontSize: "1.2rem" }}>Amazon Auto Link</div>
      <nav style={linksStyle}>
        <NavLink
          to="/"
          end
          style={({ isActive }) =>
            isActive ? { ...linkStyle, ...activeStyle } : linkStyle
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/cars"
          style={({ isActive }) =>
            isActive ? { ...linkStyle, ...activeStyle } : linkStyle
          }
        >
          Cars
        </NavLink>
        <NavLink
          to="/contact"
          style={({ isActive }) =>
            isActive ? { ...linkStyle, ...activeStyle } : linkStyle
          }
        >
          Contact
        </NavLink>
      </nav>
    </header>
  );
}
