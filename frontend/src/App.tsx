import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ForgotPasswordPage from "./pages/ForgettedPassword";
import DashboardPage from "./pages/Dashboard";
import { LoginPages } from "./pages/LoginPages.tsx";
import { RegisterPages } from "./pages/RegisterPages.tsx";
import Storico from "./pages/storico.tsx";
import MissionePage from "./pages/GraficowithMapHistory.tsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPages />} />
        <Route path="/register" element={<RegisterPages />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/storico/:deviceId" element={<Storico />} />
        <Route path="/missione/:uniqueId" element={<MissionePage />} />
      </Routes>
    </Router>
  );
}

export default App;
