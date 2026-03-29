import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Pacientes from './pages/Pacientes'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/pacientes" />} />
        <Route path="/pacientes" element={<Pacientes />} />
      </Routes>
    </Layout>
  )
}