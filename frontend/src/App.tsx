<<<<<<< HEAD
import './App.css'

function App() {


  return (
<h1>CIAO BRO</h1>
  )
=======
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/Login.tsx";
import RegisterPage from "./pages/Register";
import ForgotPasswordPage from "./pages/ForgettedPassword";
import DashboardPage from "./pages/Dashboard";

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />

        </Routes>
      </Router>
  );
>>>>>>> 5b096fac218d3d0cc20e8809dda77ad3e7c946be
}

export default App;

