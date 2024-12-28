import { useState } from 'react'
import './App.css'
import SearchForm from './components/SearchForm'
import { fetchRepositories, fetchUser } from './api'
import { Repository, User } from './interfaces'
import UserInfo from './components/UserInfo'
import RepositoryList from './components/RepositoryList'

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [view, setView] = useState<'repositories' | 'followers'>('repositories')

  const handleSearch = async (username: string) => {
    const userData = await fetchUser(username);
    setUser(userData);
    const repoData = await fetchRepositories(username);
    setRepositories(repoData);
    setView('repositories');
  }

  const handleSelectRepository = (repoName: string) => {
    const repository = repositories.find(repo => repo.name === repoName);
    if (repository) {
      window.open(repository.url, '_blank');
    }
  }

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
    </div>
  )
}

export default App
