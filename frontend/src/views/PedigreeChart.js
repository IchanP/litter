import React from "react";
import Menu from "../components/Menu";
import Search from "../components/Search";
import { useAuth0 } from "@auth0/auth0-react";

// style
import "../style/PedigreeChart.css"
import UserProfile from "../components/UserProfile";
import UserLitts from "../components/UserLitts";

const PedigreeChart = () => {
    const {user} = useAuth0()
    return (
        <div className="container">
            <div className="pedigree-chart">
                <div className="left-column">
                    <Menu />
                </div>

                <div className="middle-column">
                    <UserProfile userId={user.sub} />
                    <UserLitts id={user.sub} />
                </div>

                <div className="right-column">
                    <Search />
                </div>
            </div>
        </div>
    );
};

export default PedigreeChart;
