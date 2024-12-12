import React from 'react';

// style
import "../style/LitterBox.css";

// exempeldata
const posts = [
    {
        postId: 1,
        user: "johndoe",
        createdAt: "10:45 - 4 Sep 2024",
        content: "This is my first post on LitterBox",
    },
    {
        postId: 2,
        user: "janesmith",
        createdAt: "18:22 - 22 Oct 2024",
        content: "Loving this community!",
    },
    {
        postId: 3,
        user: "alexjohnson",
        createdAt: "19:38 - 14 Nov 2024",
        content: "Sup followers any plans for the weekend?",
    },
    {
        postId: 4,
        user: "sarahhunt",
        createdAt: "23:59 - 30 Nov 2024",
        content: "December in less than a minute!",
    }
];

const LitterBox = () => {
    return (
        <div className="litter-box">
            {posts.map((post) => (
                <div key={post.postId} className="post">
                    <div className="post-header">
                        <span className="user">@{post.user}, </span>
                        <span className="created-at">{post.createdAt}</span>
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