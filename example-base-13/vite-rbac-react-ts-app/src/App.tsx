import { Routes, Route } from "react-router-dom";


import './App.css';
import Home from './pages/Home';
import About from './pages/AboutThisProject';
import NotFound from './pages/NotFound';
// import Layout from "./routes/Layout";

function App() {
  

  return (
    <div>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
