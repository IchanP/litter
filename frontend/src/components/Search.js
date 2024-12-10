import React, { useState } from 'react';

// style
import "../style/Search.css";

const Search = () => {
    const [query, setQuery] = useState("");

    const handleSearch = () => {
        if (query.trim()) {
            alert(`Searching for: ${query.trim()}`);

        } else {
            alert("Please enter a search term.");
        }
    };

    return (
        <div className="search">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                />
                <button onClick={handleSearch} className="search-button">Search</button>
        </div>
    );
};

export default Search;
