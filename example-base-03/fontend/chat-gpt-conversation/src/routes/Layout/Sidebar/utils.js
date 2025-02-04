import { getIcon } from "../../../common/utils/IconCollection";

// Links with icons
export const links = [
  { linkHeader: "Home", linkPath: () => "/", icon: "FaHome" },
  {linkHeader:"Targetted Questions", linkPath:()=>"/targetted-questions", icon: "FaBullseye"},
  { linkHeader: "Apna Playground", linkPath: () => "/apna-playground", icon: "FaBasketballBall" },
  { linkHeader: "Resume Management", linkPath: () => "/resume", icon: "FaFileAlt" },
  { linkHeader: "CGPT Dashboard V1", linkPath: () => "/cgpt/v1", icon: "FaChartPie" },
  { linkHeader: "PragyamDashboard V2", linkPath: () => "/cgpt/v2", icon: "TbInfinity" },
  { linkHeader: "Settings", linkPath: () => "/settings", icon: "FaCog" },
  { linkHeader: "Testing", linkPath: () => "/testing", icon: "MdOutlineAssessment" },
].map((link, idx) => ({ ...link, id: `link_${idx}` }));

export const CollapsedIcon = getIcon("FaToggleOff");
export const ExpandedIcon = getIcon("FaToggleOn");
