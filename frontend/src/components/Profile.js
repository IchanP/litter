import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

// style
import "../style/Profile.css";

const Profile = () => {
    const { user, isAuthenticated } = useAuth0();

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="profile">
            <img className="profile-img" src={user.picture} alt={user.name} />
            <h2 className="profile-name">{user.name}</h2>
            <p className="profile-email">{user.email}</p>
        </div>
    );
};

export default Profile;
