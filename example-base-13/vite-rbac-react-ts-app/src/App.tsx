import { Routes, Route, Link } from "react-router-dom";


import './App.css';
import Home from './pages/Home';
import About from './pages/AboutThisProject';
import NotFound from './pages/NotFound';

function App() {
  

  return (
    <div>
      <nav>
        <Link to="/">Home</Link> | <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
