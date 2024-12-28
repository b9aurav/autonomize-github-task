import React from 'react';
import { User } from '../interfaces';

interface UserListProps {
    users: User[];
    title: string;
    onSelectUser: (username: string) => void;
}

const UserList: React.FC<UserListProps> = ({ users, title, onSelectUser }) => {
    if (!Array.isArray(users) || users.length === 0) {
        return <p>No users available.</p>;
    }

    return (
        <div style={styles.container}>
            <h3 style={styles.heading}>{title}</h3>
            <div style={styles.grid}>
                {users.map((user) => (
                    <div key={user.id} style={styles.gridItem} onClick={() => onSelectUser(user.username)}>
                        <img src={user.avatarUrl} alt={user.username} style={styles.avatar} />
                        <div style={styles.userInfo}>
                            <p style={styles.username}>{user.username}</p>
                            {user.name && <p style={styles.name}>{user.name}</p>}
                            {user.location && <p style={styles.location}>{user.location}</p>}
                            {user.bio && <p style={styles.bio}>{user.bio}</p>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

import { CSSProperties } from "react";

const styles: { [key: string]: CSSProperties } =  {
    container: {
        margin: '20px 20px',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fff',
    },
    heading: {
        margin: '0 0 20px 0',
        fontSize: '24px',
        fontWeight: 'bold',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '20px',
    },
    gridItem: {
        display: 'flex',
        alignItems: 'center',
        padding: '10px',
        borderRadius: '5px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#f9f9f9',
        cursor: 'pointer',
    },
    avatar: {
        borderRadius: '50%',
        width: '50px',
        height: '50px',
        marginRight: '10px',
    },
    userInfo: {
        display: 'flex',
        flexDirection: 'column',
    },
    username: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#333',
    },
    name: {
        fontSize: '14px',
        color: '#555',
    },
    location: {
        fontSize: '12px',
        color: '#777',
    },
    bio: {
        fontSize: '12px',
        color: '#777',
    },
};

export default UserList;