import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

// style
import "../style/Profile.css";

const followers_count = 112;
const following_count = 98;
const user_joined = "August 2024"

const Profile = () => {
    const { user } = useAuth0();
    console.log(user);

    const handleLeach = () => {
        alert(`Leach user: ${user.nickname}`);
    };

    return (
        <div className="profile">
            <div className="top-div">
                <img src={user.picture} alt={user.name} />
                <button className="leash-button" onClick={handleLeach}>Leash</button>
            </div>

            <div className="middle-div">
                <span className="user-name">@{user.nickname}</span>
                <span className="user-joined">Joined in {user_joined}</span>
            </div>

            <div className="bottom-div">
                <span>{followers_count} leashers</span>
                <span>{following_count} leashing</span>
            </div>
        </div>
    );
};

export default Profile;
