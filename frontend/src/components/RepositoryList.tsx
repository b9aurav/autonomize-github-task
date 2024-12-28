import React from 'react';
import { Repository } from '../interfaces';

interface RepositoryListProps {
    repositories: Repository[];
    ownerAvatarUrl?: string;
    onSelectRepository: (repoName: string) => void;
}

const RepositoryList: React.FC<RepositoryListProps> = ({ repositories, ownerAvatarUrl, onSelectRepository }) => {
    if (!Array.isArray(repositories)) {
        return <p>No repositories available.</p>;
    }

    return (
        <div style={styles.container}>
            <h3 style={styles.heading}>Repositories</h3>
            <div style={styles.grid}>
                {repositories.map((repo) => (
                    <div key={repo.id} style={styles.gridItem} onClick={() => onSelectRepository(repo.name)}>
                        <div style={styles.repoContainer}>
                    <div style={styles.avatarContainer}>
                        <img src={ownerAvatarUrl} alt={repo.name} style={styles.avatar} />
                    </div>
                    <div style={styles.repoInfo}>
                        <a style={styles.link}>
                            {repo.name}
                        </a>
                        <p style={styles.description}>{repo.description}</p>
                    </div>
                    </div>
                </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: {
        margin: '20px 20px',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fff',
    },
    repoContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    heading: {
        margin: '0 0 20px 0',
        fontSize: '24px',
        fontWeight: 'bold',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '20px',
    },
    gridItem: {
        padding: '10px',
        borderRadius: '5px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#f9f9f9',
    },
    avatarContainer: {
        marginRight: '10px',
    },
    avatar: {
        borderRadius: '50%',
        width: '50px',
        height: '50px',
        boxShadow: '0 0 5px 0',
    },
    repoInfo: {
        flex: 1,
    },
    link: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#007bff',
        textDecoration: 'none',
        cursor: 'pointer',
    },
    description: {
        margin: '10px 0 0 0',
        fontSize: '14px',
        color: '#555',
    },
};

export default RepositoryList;