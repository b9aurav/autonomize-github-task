import { useState } from 'react';
import './App.css';
import SearchForm from './components/SearchForm';
import { fetchRepositories, fetchUser, fetchFriends, fetchConnections } from './api';
import { Repository, User } from './interfaces';
import UserInfo from './components/UserInfo';
import RepositoryList from './components/RepositoryList';
import RepositoryDetails from './components/RepositoryDetails';
import UserList from './components/UserList';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [friends, setFriends] = useState<User[]>([]);
  const [view, setView] = useState<'repositories' | 'followers' | 'following' | 'friends' | 'repositoryDetails'>('repositories');
  const [selectedRepository, setSelectedRepository] = useState<Repository | null>(null);

  const handleSearch = async (username: string) => {
    const userData = await fetchUser(username);
    setUser(userData);
    const repoData = await fetchRepositories(username);
    setRepositories(repoData);
    setView('repositories');
  };

  const handleSelectRepository = (repoName: string) => {
    const repo = repositories.find((repo) => repo.name === repoName);
    if (repo) {
      setSelectedRepository(repo);
    }
    setView('repositoryDetails');
  };

  const handleBackToRepositories = () => {
    setView('repositories');
    setSelectedRepository(null);
  };

  const handleViewFriends = async () => {
    if (user) {
      const friendsData = await fetchFriends(user.username);
      setFriends(friendsData);
      setView('friends');
    }
  };

  const handleViewFollowers = async () => {
    if (user) {
      const followersData = await fetchConnections(user.username, 'follower');
      setFollowers(followersData);
      setView('followers');
    }
  }

  const handleViewFollowing = async () => {
    if (user) {
      const followingData = await fetchConnections(user.username, 'following');
      setFollowing(followingData);
      setView('following');
    }
  }

  const handleSelectUser = async (username: string) => {
    await handleSearch(username);
  };

  return (
    <div>
      <SearchForm onSearch={handleSearch} />
      {user && <UserInfo user={user} />}
      {user && view === 'repositories' && (
        <>
          <button onClick={handleViewFollowers} style={styles.button}>View Followers</button>
          <button onClick={handleViewFollowing} style={styles.button}>View Following</button>
          <button onClick={handleViewFriends} style={styles.button}>View Friends</button>
          <RepositoryList repositories={repositories} onSelectRepository={handleSelectRepository} ownerAvatarUrl={user?.avatarUrl} />
        </>
      )}
      {user && view === 'repositoryDetails' && selectedRepository && (
        <>
          <button onClick={handleBackToRepositories} style={styles.button}>Back to Repositories</button>
          <RepositoryDetails repository={selectedRepository} avatarUrl={user?.avatarUrl} />
        </>
      )}
      {user && view === 'friends' && (
        <>
          <button onClick={handleBackToRepositories} style={styles.button}>Back to Repositories</button>
          <UserList users={friends} title="Friends" onSelectUser={handleSelectUser} />
        </>
      )}
      {user && view === 'followers' && (
        <>
          <button onClick={handleBackToRepositories} style={styles.button}>Back to Repositories</button>
          <UserList users={followers} title="Followers" onSelectUser={handleSelectUser} />
        </>
      )}
      {user && view === 'following' && (
        <>
          <button onClick={handleBackToRepositories} style={styles.button}>Back to Repositories</button>
          <UserList users={following} title="Following" onSelectUser={handleSelectUser} />
        </>
      )}
    </div>
  );
}

const styles = {
  button: {
    margin: '0 20px',
    padding: '10px 20px',
    borderRadius: '5px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  },
};

export default App;