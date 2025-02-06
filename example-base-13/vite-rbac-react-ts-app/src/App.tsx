import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/AboutThisProject";
import NotFound from "./pages/NotFound";
import TestingDashboard from "./pages/ApnaPlayground";

function App() {
  return (
    <div>
      <Routes>
        {/**Test route- for arbitrary testing from scratch*/}
        <Route path="/testing" element={<TestingDashboard />} />

        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
