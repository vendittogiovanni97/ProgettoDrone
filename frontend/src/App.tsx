import { BrowserRouter as  Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import LoginPage from './pages/Login';
import DashboardPage from './pages/Dashboard';
import RegisterPage from './pages/Register';

function App() {
  return (
    <>
    <BrowserRouter> 
    <Routes>
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path='/dashboard' element={<DashboardPage/>} />
          {/* Reindirizza alla pagina di login se la route non è specificata */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          {/* Altre route della tua applicazione... */}
        </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;