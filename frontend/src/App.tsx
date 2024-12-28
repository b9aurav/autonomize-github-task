import { useState } from 'react'
import './App.css'
import SearchForm from './components/SearchForm'
import { fetchUser } from './api'
import { User } from './interfaces'
import UserInfo from './components/UserInfo'

function App() {
  const [user, setUser] = useState<User | null>(null)
  
  const handleSearch = async (username: string) => {
    const userData = await fetchUser(username);
    setUser(userData);
    console.log(user);
  }

  return (
    <div>
      <SearchForm onSearch={handleSearch} />
      {user && <UserInfo user={user} />}
    </div>
  )
}

export default App
