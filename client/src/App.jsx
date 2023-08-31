import './App.css';
import PostsList from "./features/posts/PostsList.jsx";
import { BrowserRouter as Router } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";
import AppRoutes from "./components/AppRoutes.jsx";

function App() {

  return (
    <Router>
        <div className="app">
            <h1>React on Rails blog</h1>
        </div>
        <p>Find this application layout in client/src/App.jsx</p>
        <NavBar />
        <AppRoutes />
    </Router>
  )
}

export default App
