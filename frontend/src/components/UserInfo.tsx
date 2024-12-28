import React from "react";
import { User } from "../interfaces";

interface UserInfoProps {
  user: User;
}

const UserInfo: React.FC<UserInfoProps> = ({ user }) => {
  return (
    <div style={styles.container}>
      <div style={styles.imageContainer}>
        <img
          src={user.avatarUrl}
          alt={user.name}
          style={styles.avatar}
        />
      </div>
      <div style={styles.infoContainer}>
        <h2 style={styles.name}>{user.name} <span style={styles.username}>({user.username})</span></h2>
        <p style={styles.bio}>{user.bio}</p>
        <p style={styles.location}>{user.location}</p>
        <table style={styles.table}>
          <tbody>
            {user.blog && (
              <tr>
                <td style={styles.tableCell}>Blog:</td>
                <td style={styles.tableCell}><a href={user.blog} target="_blank" rel="noopener noreferrer">{user.blog}</a></td>
              </tr>
            )}
            <tr>
              <td style={styles.tableCell}>Public Repos:</td>
              <td style={styles.tableCell}>{user.publicRepos}</td>
            </tr>
            <tr>
              <td style={styles.tableCell}>Public Gists:</td>
              <td style={styles.tableCell}>{user.publicGists}</td>
            </tr>
            <tr>
              <td style={styles.tableCell}>Followers:</td>
              <td style={styles.tableCell}>{user.followers}</td>
            </tr>
            <tr>
              <td style={styles.tableCell}>Following:</td>
              <td style={styles.tableCell}>{user.following}</td>
            </tr>
            <tr>
              <td style={styles.tableCell}>Created At:</td>
              <td style={styles.tableCell}>{new Date(user.createdAt).toLocaleDateString()}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    margin: '20px',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
  },
  imageContainer: {
    marginRight: '20px',
  },
  avatar: {
    borderRadius: '50%',
    width: '150px',
    height: '150px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    margin: '0 0 10px 0',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  username: {
    fontSize: '18px',
    color: '#555',
  },
  bio: {
    margin: '10px 0',
    fontSize: '16px',
    color: '#333',
  },
  location: {
    margin: '10px 0',
    fontSize: '16px',
    color: '#777',
  },
  table: {
    width: '100%',
    marginTop: '20px',
    borderCollapse: 'collapse',
  },
  tableCell: {
    padding: '10px',
    borderBottom: '1px solid #ddd',
  },
};

export default UserInfo;