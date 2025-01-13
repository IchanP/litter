import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

// style
import "../style/Search.css";

const Search = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { getAccessTokenSilently } = useAuth0();
    const navigate = useNavigate();

    const handleInputChange = async (e) => {
        const input = e.target.value;
        setQuery(input);

        if (!input.trim()) {
            setResults([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const token = await getAccessTokenSilently();

            // Fetch search
            const response = await fetch(
                `${process.env.REACT_APP_API_GATEWAY_URL}/users/search?query=${encodeURIComponent(input.trim())}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to search: ${response.status}`);
            }

            const data = await response.json();
            setResults(data);
        } catch (err) {
            console.error("Error searching users:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResultClick = (userId) => {
        navigate(`/users/${userId}`); // använda id ?
    };

    return (
        <div className="search">
            <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Search..."
            />
            <div className="search-results">
                {loading && <p>Loading...</p>}
                {error && <p className="error">{error}</p>}
                {!loading && !error && results && results.length > 0 ? (
                    <ul>
                        {results.map((result, index) => (
                            <li
                                key={index}
                                onClick={() => handleResultClick(result.userId)}
                            >
                                @{result.username}
                            </li>
                        ))}
                    </ul>
                ) : (
                    query.trim() && !loading && !error && <p className="no-result">No results found</p>
                )}
            </div>
        </div>
    );
};

export default Search;

