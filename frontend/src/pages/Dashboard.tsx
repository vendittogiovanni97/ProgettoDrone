import React from "react";
import NavbarComponent from "../components/Navbar";


const DashboardPage: React.FC = () => {
    return (
        <div className="dashboard-container">
            <NavbarComponent />
            <div className="dashboard-content">
                <h1>Benvenuto nella Dashboard</h1>
                <p>Qui potrai accedere alle sezioni Storico e Real-Time.</p>
            </div>
        </div>
    );
};

export default DashboardPage;
