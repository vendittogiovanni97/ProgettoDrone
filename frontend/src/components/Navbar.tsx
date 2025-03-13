import React from "react";
import LogoutButtonComponent from "./ButtonLogOut";
import "../css/navbar.css"
import Navbar from 'react-bootstrap/Navbar';


const NavbarComponent: React.FC = () => {
    return (
        <Navbar className="bg-body-tertiary justify-content-between">
            <img
                src="./images/share.png"
                alt="Drone Logo" className="drone-logo"/>
            <LogoutButtonComponent/>

        </Navbar>
    );
}

export default NavbarComponent;