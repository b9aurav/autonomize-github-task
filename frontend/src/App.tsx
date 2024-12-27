import './App.css'
import SearchForm from './components/SearchForm'

function App() {
  
  const handleSearch = (username: string) => {
    console.log(username)
  }

  return (
    <div>
      <SearchForm onSearch={handleSearch} />
    </div>
  )
}

export default App
