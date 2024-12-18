import React, { useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";


// style
import "../style/CreateLit.css";

const CreateLit = () => {
    const [ litContent, setLitContent ] = useState("");
    const { user } = useAuth0();

    const handleCreateLit = () => {
        if (litContent.trim()) {
            alert(`Create lit with following content: ${litContent.trim()}`);
        } else {
            alert("Please enter content to create lit.");
        }
    };

    return (
        <div className="create-lit">
            <img src={user.picture} alt={user.name} />
            <textarea
                id="litContent"
                placeholder="What's up?!"
                value={litContent}
                onChange={(e) => setLitContent(e.target.value)}
                maxlength="42"
            />
            <button onClick={handleCreateLit}>Create Lit</button>
        </div>
    );
};

export default CreateLit;