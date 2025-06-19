import React from "react";
import Menu from "../components/Menu";
import CreateLitt from "../components/CreateLitt";
import LitterBox from "../components/LitterBox";
import Search from "../components/Search";

// style
import "../style/Home.css"
import Auth0SignupHandler from "../components/Auth0SignupHandler";

const Home = () => {
    return (
        <div className="container">
            <div className="home">
                <div className="left-column">
                    <Menu />
                </div>

                <div className="middle-column">
                    <Auth0SignupHandler />
                    <CreateLitt />
                    <LitterBox />
                </div>

                <div className="right-column">
                    <Search />
                </div>
            </div>
        </div>
    );
};

export default Home;
