import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { url } from '../config';

// style
import "../style/CreateLitt.css";

const CreateLitt = () => {
    const [littContent, setLittContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user, getAccessTokenSilently } = useAuth0();

    const handleCreateLitt = async () => {
        if (!littContent.trim()) {
            alert("Please enter content to create litt.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const token = await getAccessTokenSilently();

            // Fetch create litt
            const response = await fetch(
                `${url}/write/posts/create`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        userId: user.sub,
                        content: littContent.trim(),
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to create litt: ${response.status}`);
            }

            alert("Litt created successfully!");
            setLittContent("");
        } catch (err) {
            console.error("Error creating litt:", err);
            setError(err.message);
            alert("Failed to create litt. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-litt">
            <img src={user.picture} alt={user.name} />
            <textarea
                id="littContent"
                placeholder="What's up?!"
                value={littContent}
                onChange={(e) => setLittContent(e.target.value)}
                maxLength="42"
                disabled={loading}
            />
            <button onClick={handleCreateLitt} disabled={loading}>
                {loading ? "Creating..." : "Create Litt"}
            </button>
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default CreateLitt;