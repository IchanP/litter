import React from 'react';

// style
import "../style/MyOwnLitterBox.css";

// exempeldata att visa upp
const myPosts = [
    {
        postId: 1,
        user: "testuser1",
        createdAt: "09:05 - 8 Sep 2024",
        content: "This is my FIRST post on LitterBox",
    },
    {
        postId: 2,
        user: "testuser1",
        createdAt: "14:12 - 12 Oct 2024",
        content: "This is my SECOND post on LitterBox",
    },
    {
        postId: 3,
        user: "testuser1",
        createdAt: "20:57 - 18 Nov 2024",
        content: "This is my THIRD post on LitterBox",
    },
    {
        postId: 4,
        user: "testuser1",
        createdAt: "10:10 - 6 Dec 2024",
        content: "This is my FOURTH post on LitterBox",
    }
];

const MyOwnLitterBox = () => {
    return (
        <div className="my-litter-box">
            {myPosts.map((post) => (
                <div key={post.postId} className="my-post">
                    <div className="my-post-header">
                        <span className="my-user">@{post.user}, </span>
                        <span className="my-created-at">{post.createdAt}</span>
                    </div>
                    <div className="my-post-content">
                        <p>{post.content}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MyOwnLitterBox;
