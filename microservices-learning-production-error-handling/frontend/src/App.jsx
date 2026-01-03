import { Link, Route, Routes, useLocation } from "react-router-dom";
import Users from "./pages/Users";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
export default function App() {
  const loc = useLocation();
  return (
    <div className="shell">
      <header>
        <div>
          <h1>Microservices Learning</h1>
          <p>React → API Gateway → Spring Boot Microservices</p>
        </div>
        <nav>
          <Link className={loc.pathname === "/" ? "active" : ""} to="/">
            Users
          </Link>
          <Link className={loc.pathname === "/products" ? "active" : ""} to="/products">
            Products
          </Link>
          <Link className={loc.pathname === "/orders" ? "active" : ""} to="/orders">
            Orders
          </Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Users />} />
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </main>
    </div>
  );
}
