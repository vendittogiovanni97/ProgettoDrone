import React from "react";
import NavbarComponent from "../components/Navbar";
import PrincipalTableComponent from "../components/PrincipalTable.tsx";
import MapPositionComponent from "../components/MapPosition.tsx";

const DashboardPage: React.FC = () => {
    return (
        <div className="dashboard-container">
            <NavbarComponent />
            <div className="dashboard-content" style={{ minHeight: "100vh" }}>
                <div style={{ width: "100%" }}>
                    <MapPositionComponent />
                </div>



                <div className="dashboard-table" style={{ height: "50%",width:"100%", overflowY: "auto"}}>
                    <PrincipalTableComponent />
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;

