import './App.css'
import PostsList from "./features/posts/PostsList.jsx";

function App() {

  return (
    <>
        <div className="app">
            <h1>React on Rails blog</h1>
        </div>
        <p>Find this application layout in client/src/App.jsx</p>
        <PostsList />
    </>
  )
}

export default App
