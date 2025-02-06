import { Link } from "react-router-dom";
import { AvailableLinks } from "../../routes/available-links";

export default function Home() {
  return (
    <h1>
      <nav>
        {AvailableLinks.map((link) => (
          <Link key={link.id} to={link.linkPath()}>
            {link.linkHeader} |{" "}
          </Link>
        ))}
      </nav>
    </h1>
  );
}
