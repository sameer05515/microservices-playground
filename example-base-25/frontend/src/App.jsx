import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import WelcomePage from './pages/WelcomePage'
import Sidebar from './components/Sidebar'
import './App.css'

function App() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="auth-layout">
        <Routes>
          <Route path="/" element={<Navigate to="/welcome" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/welcome" element={<WelcomePage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
