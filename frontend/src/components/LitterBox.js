import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Loading from "./Loading";
import { useNavigate } from "react-router-dom";

// style
import "../style/LitterBox.css";

const LitterBox = () => {
    const { user, getAccessTokenSilently } = useAuth0();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                const token = await getAccessTokenSilently();

                // Fetch feed for current user
                const response = await fetch(
                    `${process.env.REACT_APP_API_GATEWAY_URL}/posts/${user.sub}/feed`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`Failed to fetch feed: ${response.status}`);
                }

                const data = await response.json();
                setPosts(data.data);
            } catch (err) {
                console.error("Error fetching feed:", err);
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchFeed();
    }, [getAccessTokenSilently, user.sub]);

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const handleResultClick = (userId) => {
        navigate(`/profile/${userId}`);
    };
    return (
        <div className="litter-box">
            {posts.map((post) => (
                <div key={post._id} className="post">
                    <div className="post-header">
                        <span className="user" onClick={() => handleResultClick(post.profileId)}>@{post.username} </span>
                        <span className="created-at"> 
                            {new Date(post.createdAt).toLocaleString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                            })}
                        </span>
                    </div>
                    <div className="post-content">
                        <p>{post.content}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LitterBox;
