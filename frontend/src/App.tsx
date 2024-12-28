import { useState } from 'react';
import './App.css';
import SearchForm from './components/SearchForm';
import { fetchRepositories, fetchUser } from './api';
import { Repository, User } from './interfaces';
import UserInfo from './components/UserInfo';
import RepositoryList from './components/RepositoryList';
import RepositoryDetails from './components/RepositoryDetails';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [view, setView] = useState<'repositories' | 'followers' | 'repositoryDetails'>('repositories');
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

  return (
    <div>
      <SearchForm onSearch={handleSearch} />
      {user && <UserInfo user={user} />}
      {view === 'repositories' && (
        <>
          {/* <button onClick={handleViewFollowers}>View Followers</button> */}
          <RepositoryList repositories={repositories} onSelectRepository={handleSelectRepository} ownerAvatarUrl={user?.avatarUrl} />
        </>
      )}
      {view === 'repositoryDetails' && selectedRepository && (
        <>
          <button onClick={handleBackToRepositories} style={styles.backButton}>Back to Repositories</button>
          <RepositoryDetails repository={selectedRepository} avatarUrl={user?.avatarUrl} />
        </>
      )}
    </div>
  );
}

const styles = {
  backButton: {
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