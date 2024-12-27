import React, { useState } from 'react';

interface SearchFormProps {
    onSearch: (username: string) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
    const [username, setUsername] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(username);
    };

    return (
        <form onSubmit={handleSubmit} style={{ width: '100vw' }}>
            <div style={{ margin: "10px", justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter GitHub username"
            />
            <button type="submit">Search</button>
            </div>
        </form>
    );
};

export default SearchForm;