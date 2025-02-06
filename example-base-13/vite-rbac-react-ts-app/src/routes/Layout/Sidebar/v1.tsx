import { Link } from "react-router-dom";
// import { FiHome, FiUser, FiSettings } from "react-icons/fi";
import { AvailableLinks, LinkProps } from "../../available-links";
import { getIcon } from "../../../common/utils/IconCollection";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-blue-800 text-white h-screen p-5">
      <h2 className="text-2xl font-bold mb-5">Dashboard</h2>
      <nav>
        <ul className="space-y-2">
          {/* <li>
            <Link to="/" className="flex items-center gap-2 p-2 hover:bg-blue-700 rounded">
              <FiHome /> Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="flex items-center gap-2 p-2 hover:bg-blue-700 rounded">
              <FiUser /> About
            </Link>
          </li>
          <li>
            <Link to="/settings" className="flex items-center gap-2 p-2 hover:bg-blue-700 rounded">
              <FiSettings /> Settings
            </Link>
          </li> */}

          {AvailableLinks.map((link) => (
            <ModuleLink
              key={link.id}
              link={link}
              //   onLinkClick={handleLinkClick}
            />
          ))}
        </ul>
      </nav>
    </aside>
  );
}

const ModuleLink = ({ link }: { link: LinkProps }) => {
  const { linkPath, linkHeader, icon } = link;
  const IconComponent = getIcon(icon);
  return (
    <li>
      <Link to={linkPath()} className="flex items-center gap-2 p-2 hover:bg-blue-700 rounded">
        <IconComponent /> {linkHeader}
      </Link>
    </li>
  );
};
