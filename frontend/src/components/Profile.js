import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Loading from "./Loading";

// style
import "../style/Profile.css";

const Profile = () => {
    const { user, getAccessTokenSilently } = useAuth0();

    const [profile, setProfile] = useState({
        followersCount: 0,
        followingCount: 0,
        joinedDate: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = await getAccessTokenSilently();

                // Fetch profile
                const response = await fetch(
                    `${process.env.REACT_APP_API_GATEWAY_URL}/users/${user.sub}`,
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
                setProfile({
                    followersCount: data.data.followers.length,
                    followingCount: data.data.following.length,
                    joinedDate: data.data.registeredAt
                });

            } catch (err) {
                console.error("Error fetching profile data:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [getAccessTokenSilently, user.sub]);

    const handleLeach = () => {
        alert(`Leash user: ${user.nickname}`);
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
                <img src={user.picture} alt={user.name} />
                <button className="leash-button" onClick={handleLeach}>
                    Leash
                </button>
            </div>

            <div className="middle-div">
                <span className="user-name">@{user.nickname}</span>
                <span className="user-joined">Joined on {profile.joinedDate}</span>
            </div>

            <div className="bottom-div">
                <span>{profile.followersCount} leashers</span>
                <span>{profile.followingCount} leashing</span>
            </div>
        </div>
    );
};

export default Profile;
