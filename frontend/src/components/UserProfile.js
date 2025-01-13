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
                // Get token with Management API permissions
                const token = await getAccessTokenSilently();
                console.log("Got access token");

                // First fetch user data from your API
                const response = await fetch(
                    `${process.env.REACT_APP_API_GATEWAY_URL}/users/${userId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                
                if (!response.ok) {
                    throw new Error(`Failed to fetch profile: ${response.status}`);
                }

                const data = await response.json();
                console.log("Got user data:", data);
                const oauthId = data.data.userId;

                // Then fetch the Auth0 profile info using the oauthId
                const auth0Response = await fetch(
                    `https://${process.env.REACT_APP_AUTH0_DOMAIN}/api/v2/users/${oauthId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!auth0Response.ok) {
                    const errorText = await auth0Response.text();
                    console.error("Auth0 error:", errorText);
                    throw new Error(`Failed to fetch Auth0 profile: ${auth0Response.status}`);
                }

                const auth0Data = await auth0Response.json();
                console.log("Got Auth0 data:", auth0Data);

                setProfile({
                    followersCount: data.data.followers.length,
                    followingCount: data.data.following.length,
                    joinedDate: data.data.registeredAt,
                    nickname: auth0Data.nickname || auth0Data.name,
                    name: auth0Data.name,
                    picture: auth0Data.picture
                });
            } catch (err) {
                console.error("Error details:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchProfile();
        } else {
            setLoading(false);
        }
    }, [getAccessTokenSilently, userId]);

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