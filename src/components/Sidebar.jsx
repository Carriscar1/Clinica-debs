import { Link } from 'react-router-dom'

export default function Sidebar({ open, toggle }) {
  return (
    <div style={{
      width: open ? '220px' : '60px',
      height: '100vh',
      background: '#1e293b',
      padding: '20px',
      transition: '0.3s',
      position: 'fixed',
      left: 0,
      top: 0
    }}>
      <button onClick={toggle} style={{
        background: 'none',
        border: 'none',
        color: '#fff',
        fontSize: '20px',
        marginBottom: '20px',
        cursor: 'pointer'
      }}>
        ☰
      </button>

      <h2 style={{ marginBottom: '20px', color: '#fff' }}>
        {open ? 'Clínica' : 'C'}
      </h2>

      <nav style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
      }}>
        <Link style={linkStyle} to="/">
          📊 {open && 'Dashboard'}
        </Link>

        <Link style={linkStyle} to="/pacientes">
          👤 {open && 'Pacientes'}
        </Link>

        <Link style={linkStyle} to="/consultas">
          📅 {open && 'Consultas'}
        </Link>
      </nav>
    </div>
  )
}

const linkStyle = {
  color: '#f1f5f9',
  textDecoration: 'none',
  padding: '10px',
  borderRadius: '8px'
}