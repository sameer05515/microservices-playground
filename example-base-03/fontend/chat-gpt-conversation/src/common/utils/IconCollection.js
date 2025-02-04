import * as ReactIconsFA from "react-icons/fa";
import * as ReactIconsMd from "react-icons/md";
// import { AiOutlineBulb } from "react-icons/ai";
import * as ReactIconsAi from "react-icons/ai";
// import { TbInfinity } from "react-icons/tb";
import * as ReactIconsTb from "react-icons/tb";
import { isValidString } from "./basic-validations";

// Utility to fetch icons by name
export const getIcon = (name = "FaQuestionCircle") => {
  if (!isValidString(name)) {
    console.warn(`invalid icon name '${name}'`);
    return ReactIconsFA.FaQuestionCircle;
  }
  if (name.toLowerCase().startsWith("fa")) {
    return ReactIconsFA[name];
  } else if (name.toLowerCase().startsWith("md")) {
    return ReactIconsMd[name];
  } else if (name.toLowerCase().startsWith("ai")) {
    return ReactIconsAi[name];
  } else if (name.toLowerCase().startsWith("tb")) {
    return ReactIconsTb[name];
  } else {
    console.warn("unknown icon name", name);
    return ReactIconsFA.FaQuestionCircle;
  }
};