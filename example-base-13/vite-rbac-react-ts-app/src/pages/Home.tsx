import { Link } from "react-router-dom";

export default function Home() {
    return <h1><nav>
    <Link to="/">Home</Link> | <Link to="/about">About</Link>
  </nav></h1>;
  }
  