import React from "react";
import LogoutButton from "../components/LogoutButton";
import Profile from "../components/Profile";

// style
import "../style/PedigreeChart.css"

const PedigreeChart = () => {
    return (
        <div className="pedigree-chart">
            <h1>Your Pedigree Chart</h1>
            <Profile />
            <LogoutButton />
        </div>
    );
};

export default PedigreeChart;
