import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Loading from "./Loading";
import { useNavigate } from "react-router-dom";


// style
import "../style/MyLitts.css";

const MyLitts = ({id}) => {
    const { getAccessTokenSilently } = useAuth0();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("From litts")
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
                setPosts(data.data);
            } catch (err) {
                console.error("Error fetching posts:", err);
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [getAccessTokenSilently, id]);

    const handleDeletePost = (postId) => {
        // Logic to delete the post
        console.log(`Delete post with ID: ${postId}`);
    };

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
                        <button className="delete-button" onClick={() => handleDeletePost(post.postId)}>
                            Delete
                        </button>
                    </div>
                    <div className="my-post-content">
                        <p>{post.content}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MyLitts;
