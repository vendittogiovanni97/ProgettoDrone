import React from 'react';
import {useNavigate} from 'react-router-dom';

const LogoutButtonComponent: React.FC = () =>
{
    const navigate = useNavigate();
    const handleLogout = () => {
        sessionStorage.removeItem("sessionUser"); // Rimuove solo la sessione attuale
        alert("Sei uscito dalla sessione!");
        navigate("/login");
    };
    return (
        <button onClick={handleLogout} className="logout-button">
            Logout
        </button>
    );
};

export default LogoutButtonComponent;