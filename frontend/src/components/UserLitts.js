import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Loading from "./Loading";
import { useNavigate } from "react-router-dom";
// style
import "../style/MyLitts.css";

const UserLitts = ({id}) => {
    const { getAccessTokenSilently } = useAuth0();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const token = await getAccessTokenSilently();

                // Fetch profile posts
                const response = await fetch(
                    `${process.env.REACT_APP_API_GATEWAY_URL}/posts/${id}/posts`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`Failed to fetch posts: ${response.status}`);
                }

                const data = await response.json();
                console.log(data.data)
                setPosts(data.data);
            } catch (err) {
                console.error("Error fetching posts:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [getAccessTokenSilently]);

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
        <div className="my-litter-box">
            {posts.map((post) => (
                <div key={post.postId} className="my-post">
                    <div className="my-post-header">
                    <span className="user" onClick={() => handleResultClick(post.profileId)}>@{post.username} </span>
                    <span className="my-created-at">
                            {new Date(post.createdAt).toLocaleString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                            })}
                        </span>
                    </div>
                    <div className="my-post-content">
                        <p>{post.content}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UserLitts;
