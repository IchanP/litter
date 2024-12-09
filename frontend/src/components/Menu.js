import React from 'react';
import { useNavigate } from "react-router-dom";
import logo from "../assets/litter-logo.png";
import LogoutButton from "./LogoutButton";

// style
import "../style/Menu.css";

const Menu = () => {
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        navigate(path);
    };
    
    return (
        <div className="menu">
            <img src={logo} alt="litter-logo" />
            <ul>
                <li>
                    <button onClick={() => handleNavigate("/home")}>Home</button>
                </li>
                <li>
                    <button onClick={() => handleNavigate("/pedigree-chart")}>Pedeigree Chart</button>
                </li>
                <li>
                    <LogoutButton />
                </li>
            </ul>
        </div>
    );
};

export default Menu;