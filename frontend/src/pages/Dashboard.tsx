import React from "react";
import NavbarComponent from "../components/Navbar";
import PrincipalTableComponent from "../components/PrincipalTable.tsx";
import MapPositionComponent from "../components/MapPosition.tsx";
import "../css/dashboard.css";


const DashboardPage: React.FC = () => {
    return (
    <div className="dashboard-container">
        <NavbarComponent />
<div className="component-container">
    <div className="table-container">
        <PrincipalTableComponent />
    </div>
    <div className="map-container">
        <MapPositionComponent />
    </div>
</div>
    </div>



    );
};

export default DashboardPage;

