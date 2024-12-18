import React from "react";
import Menu from "../components/Menu";
import Profile from "../components/Profile";
import Search from "../components/Search";
import MyOwnLitterBox from "../components/MyOwnLitterBox";

// style
import "../style/PedigreeChart.css"

const PedigreeChart = () => {
    return (
        <div className="container">
            <div className="pedigree-chart">
                <div className="left-column">
                    <Menu />
                </div>

                <div className="middle-column">
                    <Profile />
                    <MyOwnLitterBox />
                </div>

                <div className="right-column">
                    <Search />
                </div>
            </div>
        </div>
    );
};

export default PedigreeChart;
