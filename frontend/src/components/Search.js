import React, { useState } from 'react';

// style
import "../style/Search.css";

const Search = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);

    // exempeldata
    const search_database = ["johndoe", "jamescooper", "hannahwest", "haroldfischer"];

    const handleInputChange = (e) => {
        const input = e.target.value;
        setQuery(input);

        if (input.trim()) {
            const filteredResults = search_database.filter((name) =>
                name.toLowerCase().includes(input.trim().toLowerCase())
            );
            setResults(filteredResults);
        } else {
            setResults([]);
        }
    };

    const handleResultClick = (username) => {
        alert(`Navigating to pedigree-chart for user: @${username}`);
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
                {results && results.length > 0 ? (
                    <ul>
                        {results.map((result, index) => (
                            <li
                                key={index}
                                onClick={() => handleResultClick(result)}
                            >
                                @{result}
                            </li>
                        ))}
                    </ul>
                ) : query.trim() ? (
                    <p className="no-result">No results found</p>
                ) : null}
            </div>
        </div>
    );
};

export default Search;
