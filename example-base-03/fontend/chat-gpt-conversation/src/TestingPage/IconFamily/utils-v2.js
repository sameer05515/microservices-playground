import * as ReactIconsAI from "react-icons/ai";
import * as ReactIconsBI from "react-icons/bi";
import * as ReactIconsBS from "react-icons/bs";
import * as ReactIconsCG from "react-icons/cg";
import * as ReactIconsCI from "react-icons/ci";
import * as ReactIconsDI from "react-icons/di";
import * as ReactIconsFA from "react-icons/fa";
import * as ReactIconsFA6 from "react-icons/fa6";
import * as ReactIconsFC from "react-icons/fc";
import * as ReactIconsFI from "react-icons/fi";
import * as ReactIconsGI from "react-icons/gi";
import * as ReactIconsGO from "react-icons/go";
import * as ReactIconsGR from "react-icons/gr";
import * as ReactIconsHI from "react-icons/hi";
import * as ReactIconsHI2 from "react-icons/hi2";
import * as ReactIconsIM from "react-icons/im";
import * as ReactIconsIO from "react-icons/io";
import * as ReactIconsIO5 from "react-icons/io5";
import * as ReactIconsLIA from "react-icons/lia";
import * as ReactIconsLIB from "react-icons/lib";
import * as ReactIconsLU from "react-icons/lu";
import * as ReactIconsMD from "react-icons/md";
import * as ReactIconsPI from "react-icons/pi";
import * as ReactIconsRI from "react-icons/ri";
import * as ReactIconsRX from "react-icons/rx";
import * as ReactIconsSI from "react-icons/si";
import * as ReactIconsSL from "react-icons/sl";
import * as ReactIconsTB from "react-icons/tb";
import * as ReactIconsTFI from "react-icons/tfi";
import * as ReactIconsTI from "react-icons/ti";
import * as ReactIconsVSC from "react-icons/vsc";
import * as ReactIconsWI from "react-icons/wi";

/**
 * WARNING: this version of utils is not fully reviewed and should not be used in production.
 *
 * Please use [utils.js](./utils.js)
 *
 */

const IconLibraries = {
  ReactIconsAI,
  ReactIconsBI,
  ReactIconsBS,
  ReactIconsCG,
  ReactIconsCI,
  ReactIconsDI,
  ReactIconsFA,
  ReactIconsFA6,
  ReactIconsFC,
  ReactIconsFI,
  ReactIconsGI,
  ReactIconsGO,
  ReactIconsGR,
  ReactIconsHI,
  ReactIconsHI2,
  ReactIconsIM,
  ReactIconsIO,
  ReactIconsIO5,
  ReactIconsLIA,
  ReactIconsLIB,
  ReactIconsLU,
  ReactIconsMD,
  ReactIconsPI,
  ReactIconsRI,
  ReactIconsRX,
  ReactIconsSI,
  ReactIconsSL,
  ReactIconsTB,
  ReactIconsTFI,
  ReactIconsTI,
  ReactIconsVSC,
  ReactIconsWI,
};

// const IconParents = {
//   ReactIconsAI: "ReactIconsAI",
//   ReactIconsBI: "ReactIconsBI",
//   ReactIconsBS: "ReactIconsBS",
//   ReactIconsCG: "ReactIconsCG",
//   ReactIconsCI: "ReactIconsCI",
//   ReactIconsDI: "ReactIconsDI",
//   ReactIconsFA: "ReactIconsFA",
//   ReactIconsFA6: "ReactIconsFA6",
// };
const IconParents = Object.keys(IconLibraries).reduce((acc, key) => {
  acc[key] = key;
  return acc;
}, {});

// Utility to generate the `iconFamily`
const generateIconFamily = () =>
  Object.entries(IconLibraries).flatMap(([library, icons]) =>
    Object.keys(icons).map((name, idx) => ({
      uniqueId: `${library}_${idx + 1}_${name}`,
      parent: IconParents[library],
      name: `${library}_${name}`,
    }))
  );

const iconFamily = generateIconFamily();
const iconFamilyLength = iconFamily.length;

// Utility to find index
const findIndex = (data, key, value) => data.findIndex((item) => item[key] === value);

// Get Icon by name
const getIcon = (name = "FaQuestionCircle") => {
  const { parent } = iconFamily.find((icon) => icon.name === name) || {};
  return IconLibraries[parent]?.[name.split("_")[1]] || ReactIconsFA.FaQuestionCircle;
};

const getIconComponent = (selectedIcon) => (selectedIcon ? getIcon(selectedIcon.name) : null);

// Calculate next and previous icons
const calculateNextPrev = (data, index) => {
  if (index < 0) return { next: null, prev: null };
  const length = data.length;
  return {
    next: data[(index + 1) % length],
    prev: data[(index - 1 + length) % length],
  };
};

const getIconDetails = (uniqueId) => {
  const selectedIndex = findIndex(iconFamily, "uniqueId", uniqueId);
  const selectedIcon = iconFamily[selectedIndex] || null;
  const IconComponent = getIconComponent(selectedIcon);
  return {
    selectedIndex,
    selectedIcon,
    IconComponent,
    ...calculateNextPrev(iconFamily, selectedIndex),
  };
};

// Filter icons by parent
const filterIconFamilyByParentId = (parentId) => iconFamily.filter((icon) => icon.parent === parentId);

const getIconDetailsByParentId = (uniqueId, parentId) => {
  const filteredFamily = filterIconFamilyByParentId(parentId);
  const selectedIndex = findIndex(filteredFamily, "uniqueId", uniqueId);
  const selectedIcon = filteredFamily[selectedIndex] || null;
  const IconComponent = getIconComponent(selectedIcon);
  return {
    selectedIndex,
    selectedIcon,
    IconComponent,
    ...calculateNextPrev(filteredFamily, selectedIndex),
  };
};

const getAllIconParents = () => Object.entries(IconParents).map(([key, id]) => ({ id, name: key }));

export {
  filterIconFamilyByParentId,
  getAllIconParents,
  getIcon,
  getIconComponent,
  getIconDetails,
  getIconDetailsByParentId,
  iconFamily,
  iconFamilyLength,
};
