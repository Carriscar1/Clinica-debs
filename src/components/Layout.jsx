import { useState } from "react";
import { Link } from "react-router-dom";

export default function Layout({ children }) {
  const [open, setOpen] = useState(true);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      
      {/* SIDEBAR */}
      <div
        style={{
          width: open ? "220px" : "60px",
          background: "#0f172a",
          color: "#fff",
          transition: "0.3s",
          padding: "10px"
        }}
      >
        <button
          onClick={() => setOpen(!open)}
          style={{
            marginBottom: "20px",
            background: "none",
            border: "none",
            color: "#fff",
            fontSize: "20px",
            cursor: "pointer"
          }}
        >
          ☰
        </button>

        <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Link to="/pacientes" style={{ color: "#fff", textDecoration: "none" }}>
            👤 {open && "Pacientes"}
          </Link>
        </nav>
      </div>

      {/* CONTEÚDO */}
      <div
        style={{
          flex: 1,
          padding: "20px",
          background: "#f1f5f9"
        }}
      >
        {children}
      </div>
    </div>
  );
}