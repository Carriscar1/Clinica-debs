import { useState } from "react";

export default function Pacientes() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    console.log(nome, email);
  }

  return (
    <div>
      <h1 style={{
        fontSize: "28px",
        marginBottom: "20px",
        color: "#0f172a"
      }}>
        Cadastro de Pacientes
      </h1>

      <form onSubmit={handleSubmit} style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        maxWidth: "400px"
      }}>
        
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          style={inputStyle}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

<input
          type="text"
          placeholder="Telefone"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>
          Cadastrar
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "8px",
  border: "1px solid #cbd5f5",
  outline: "none"
};

const buttonStyle = {
  width: "100%",
  padding: "10px",
  background: "#1e293b",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
};