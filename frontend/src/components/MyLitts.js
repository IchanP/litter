import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Loading from "./Loading";
import { url } from '../config';

// style
import "../style/MyLitts.css";

const MyLitts = () => {
    const { user, getAccessTokenSilently } = useAuth0();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const token = await getAccessTokenSilently();

                // Fetch profile posts
                const response = await fetch(
                    `${url}/posts/${user.sub}/posts`,
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
                setPosts(data);
            } catch (err) {
                console.error("Error fetching posts:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [getAccessTokenSilently, user.sub]);

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="my-litter-box">
            {posts.map((post) => (
                <div key={post._id} className="my-post">
                    <div className="my-post-header">
                        <span className="my-user">@{post.user}, </span>
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

export default MyLitts;
