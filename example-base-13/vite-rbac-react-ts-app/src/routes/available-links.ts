import { getIcon } from "../common/utils/IconCollection";

type LinkProps = {
  id: string;
  linkHeader: string;
  linkPath: () => string;
  icon: string;
};
// Links with icons
const prepareLinks = () =>
  [
    { linkHeader: "Home", linkPath: () => "/", icon: "FaHome" },
    // { linkHeader: "Targetted Questions", linkPath: () => "/targetted-questions", icon: "FaBullseye" },
    { linkHeader: "Apna Playground", linkPath: () => "/testing", icon: "FaBasketballBall" },
    { linkHeader: "About", linkPath: () => "/about", icon: "FaFileAlt" },
    // { linkHeader: "Resume Management", linkPath: () => "/resume", icon: "FaFileAlt" },
    // { linkHeader: "CGPT Dashboard V1", linkPath: () => "/cgpt/v1", icon: "FaChartPie" },
    // { linkHeader: "PragyamDashboard V2", linkPath: () => "/cgpt/v2", icon: "TbInfinity" },
    { linkHeader: "Settings", linkPath: () => "/settings", icon: "FaCog" },
    // { linkHeader: "Testing", linkPath: () => "/testing", icon: "MdOutlineAssessment" },
  ].map((link, idx) => ({ ...link, id: `link_${idx}` }));

const AvailableLinks: LinkProps[] = prepareLinks();

const CollapsedIcon = getIcon("FaToggleOff");
const ExpandedIcon = getIcon("FaToggleOn");

export { type LinkProps, AvailableLinks, CollapsedIcon, ExpandedIcon };
// export { type LinkProps, prepareLinks };
