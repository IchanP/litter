import React from "react";
import logo from "../assets/litter-logo.png";
import LoginButton from "../components/LoginButton";

// style
import "../style/Landing.css"; 

const Landing = () => {
    return (
        <div className="container">
            <div className="landing">
                <div className="logo">
                    <img src={logo} alt="litter-logo" />
                    <h1>litter</h1>
                </div>

                <h2>Welcome, please log in.</h2>
                <LoginButton />
            </div>
        </div>
    );
};

export default Landing;
