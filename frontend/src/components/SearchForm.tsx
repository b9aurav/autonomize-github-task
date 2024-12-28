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
        <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputContainer}>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter GitHub username"
                    style={styles.input}
                />
                <button type="submit" style={styles.button}>Search</button>
            </div>
        </form>
    );
};

const styles = {
    form: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '20px 0',
    },
    inputContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '10px',
    },
    input: {
        padding: '10px',
        fontSize: '16px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        width: '250px',
    },
    button: {
        padding: '10px 20px',
        fontSize: '16px',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#007bff',
        color: '#fff',
        cursor: 'pointer',
    },
};

export default SearchForm;