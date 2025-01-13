import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Loading from "./Loading";
import "../style/Profile.css";

const UserProfile = ({ userId }) => {
    const { getAccessTokenSilently } = useAuth0();
    const [profile, setProfile] = useState({
        followersCount: 0,
        followingCount: 0,
        joinedDate: "",
        nickname: "",
        name: "",
        picture: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = await getAccessTokenSilently({
                    audience: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/api/v2/`,
                    scope: "read:users"
                });

                const response = await fetch(
                    `${process.env.REACT_APP_API_GATEWAY_URL}/users/${userId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                
                if (!response.ok) {
                    console.log("API Response not OK:", response.status); // Log error status
                    throw new Error(`Failed to fetch profile: ${response.status}`);
                }

                const data = await response.json();
                console.log("User data received:", data); // Check API response

                const oauthId = data.data.userId;

                console.log("Fetching Auth0 profile..."); // Check Auth0 API call
                const auth0Response = await fetch(
                    `https://${process.env.REACT_APP_AUTH0_DOMAIN}/api/v2/users/${oauthId}`,
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                    }
                );

                if (!auth0Response.ok) {
                    const errorText = await auth0Response.text();
                    console.log("Auth0 error response: ", errorText);
                    console.log("Auth0 Response not OK:", auth0Response.status); // Log Auth0 error
                    console.log(auth0Response)
                    throw new Error(`Failed to fetch Auth0 profile: ${auth0Response.status}`);
                }
                console.log(auth0Response)
                const auth0Data = await auth0Response.json();
                console.log("Auth0 data received:", auth0Data); // Check Auth0 response

                setProfile({
                    followersCount: data.data.followers.length,
                    followingCount: data.data.following.length,
                    joinedDate: data.data.registeredAt,
                    nickname: auth0Data.nickname,
                    name: auth0Data.name,
                    picture: auth0Data.picture
                });
            } catch (err) {
                console.error("Error details:", err); // Detailed error logging
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            console.log("UserId present, calling fetchProfile"); // Check if condition met
            fetchProfile();
        } else {
            console.log("No userId provided"); // Check if userId is missing
            setLoading(false);
        }
    }, [getAccessTokenSilently, userId]);

    // Rest of the component remains the same
    const handleLeash = () => {
        alert(`Leash user: ${profile.nickname}`);
    };

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="profile">
            <div className="top-div">
                <img src={profile.picture} alt={profile.name} />
                <button className="leash-button" onClick={handleLeash}>
                    Leash
                </button>
            </div>
            <div className="middle-div">
                <span className="user-name">@{profile.nickname}</span>
                <span className="user-joined">Joined on {profile.joinedDate}</span>
            </div>
            <div className="bottom-div">
                <span>{profile.followersCount} leashers</span>
                <span>{profile.followingCount} leashing</span>
            </div>
        </div>
    );
};

export default UserProfile;