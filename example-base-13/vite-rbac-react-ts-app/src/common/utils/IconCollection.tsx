import * as ReactIconsFA from "react-icons/fa";
import * as ReactIconsMd from "react-icons/md";
import * as ReactIconsAi from "react-icons/ai";
import * as ReactIconsTb from "react-icons/tb";
import { IconType } from "react-icons";
import { isValidString } from "./basic-validations";

// Utility to fetch icons by name
export const getIcon = (name: string = "FaQuestionCircle"): IconType => {
  if (!isValidString(name)) {
    console.warn(`Invalid icon name '${name}'`);
    return ReactIconsFA.FaQuestionCircle;
  }

  if (name.toLowerCase().startsWith("fa")) {
    return (ReactIconsFA as Record<string, IconType>)[name] || ReactIconsFA.FaQuestionCircle;
  } else if (name.toLowerCase().startsWith("md")) {
    return (ReactIconsMd as Record<string, IconType>)[name] || ReactIconsFA.FaQuestionCircle;
  } else if (name.toLowerCase().startsWith("ai")) {
    return (ReactIconsAi as Record<string, IconType>)[name] || ReactIconsFA.FaQuestionCircle;
  } else if (name.toLowerCase().startsWith("tb")) {
    return (ReactIconsTb as Record<string, IconType>)[name] || ReactIconsFA.FaQuestionCircle;
  } else {
    console.warn("Unknown icon name", name);
    return ReactIconsFA.FaQuestionCircle;
  }
};
