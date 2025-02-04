import { Route, Routes } from "react-router-dom";
import TestingDashboard from "../pages/ApnaPlayground";
import Home from "../pages/Home";
import About from "../pages/AboutThisProject";
import NotFound from "./NotFound/v2";
import Layout from "./Layout";
import Settings from "../pages/Settings";

const RBACPracticeRoutes = () => {
  return (
    <div>
      <Routes>
        {/**Test route- for arbitrary testing from scratch*/}
        <Route path="/testing" element={<TestingDashboard />} />

        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/settings" element={<Settings/>}/>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default RBACPracticeRoutes;
