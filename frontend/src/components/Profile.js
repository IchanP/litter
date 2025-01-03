import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

// style
import "../style/Profile.css";

// exempeldata
const followers_count = 112;
const following_count = 98;
const user_joined = "August 2024"

const Profile = () => {
    const { user, getAccessTokenSilently } = useAuth0();
    const [accessToken, setAccessToken] = useState("");

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const token = await getAccessTokenSilently();
                setAccessToken(token);
                // Använd token för att göra API-anrop
            } catch (error) {
                console.error("Fel vid hämtning av access token:", error);
            }
        };
    
        fetchToken();
    }, [getAccessTokenSilently]);

    const handleLeach = () => {
        alert(`Leash user: ${user.nickname}`);
    };

    console.log(accessToken);
    console.log(user.sub);

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
