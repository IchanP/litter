import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Loading from "./Loading";
import "../style/Profile.css";

const Profile = ({ userId }) => {
    const { getAccessTokenSilently, user } = useAuth0();
    const [profile, setProfile] = useState({
        followersCount: 0,
        followingCount: 0,
        joinedDate: "",
        name: "",
        username: "",
        picture: ""
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false)
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Get token with Management API permissions
                const token = await getAccessTokenSilently();

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
                followCheck(data.data.followers)
                setProfile({
                    followersCount: data.data.followers.length,
                    followingCount: data.data.following.length,
                    joinedDate: data.data.registeredAt,
                    name: data.data.name,
                    username: data.data.username,
                    picture: data.data.picture
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

    const followCheck = (followers) => {
        console.log(followers.filter(value => value = user.sub).length)
        if (followers.filter(value => value = user.sub).length > 0) {
            setIsFollowing(true)
        }
    }

    const handleLeash = async () => {
        const token = await getAccessTokenSilently();
        try {
        const response = await fetch(`${process.env.REACT_APP_API_GATEWAY_URL}/write/follow/${userId}`, {
            method:  isFollowing ? "DELETE" : "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                followerId: user.sub
            }),
        })

        if (!response.ok) {
            throw new Error(`Failed to follow user: ${response.status}`);
        }
        setIsFollowing(!isFollowing)
        const data = await response.json()
        console.log(data)
    } catch (e) {
        console.error("error")
    }
    };

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    // Check if logged in user to remove leash button
    const isOwnProfile = user && user.sub === userId;

    return (
        <div className="profile">
            <div className="top-div">
                <img src={profile.picture} alt={profile.name} />
                {!isOwnProfile && (
                    <button className="leash-button" onClick={() => handleLeash()}>
                        {isFollowing ? "Unleash" : "Leash"}
                    </button>
                )}
            </div>
            <div className="middle-div">
                <span className="user-name">@{profile.username}</span>
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