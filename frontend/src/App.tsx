import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ForgotPasswordPage from "./pages/ForgettedPassword";
import DashboardPage from "./pages/Dashboard";
import { LoginPages } from "./pages/LoginPages.tsx";
import { RegisterPages } from "./pages/RegisterPages.tsx";
import './App.css'
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login"/>}/>
                <Route path="/login" element={<LoginPages/>}/>
                <Route path="/register" element={<RegisterPages/>}/>
                <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>
                <Route path="/dashboard" element={<DashboardPage/>}/>

            </Routes>
        </Router>
    );
}


export default App;

