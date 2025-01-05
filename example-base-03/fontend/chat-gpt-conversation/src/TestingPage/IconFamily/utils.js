import * as ReactIconsAI from "react-icons/ai";
import * as ReactIconsBI from "react-icons/bi";
import * as ReactIconsBS from "react-icons/bs";
import * as ReactIconsCG from "react-icons/cg";
import * as ReactIconsCI from "react-icons/ci";
import * as ReactIconsDI from "react-icons/di";
import * as ReactIconsFA from "react-icons/fa";
import * as ReactIconsFA6 from "react-icons/fa6";
import { isValidString } from "../../common/utils/basic-validations";

const IconParents = {
  ReactIconsAI: "ReactIconsAI",
  ReactIconsBI: "ReactIconsBI",
  ReactIconsBS: "ReactIconsBS",
  ReactIconsCG: "ReactIconsCG",
  ReactIconsCI: "ReactIconsCI",
  ReactIconsDI: "ReactIconsDI",
  ReactIconsFA: "ReactIconsFA",
  ReactIconsFA6: "ReactIconsFA6",
};

// Utility to calculate index by uniqueId
const findIndexByUniqueId = (data, uniqueId) => data.findIndex((item) => item.uniqueId === uniqueId);

// Utility to calculate index by uniqueId
const findIndexByIconName = (data, iconName) => data.findIndex((item) => item.name === iconName) || -1;

const iconFamily = [
  ...Object.keys(ReactIconsAI).map((n, idx) => ({
    uniqueId: `ReactIconsAI_${idx + 1}_${n}`,
    parent: IconParents.ReactIconsAI,
    name: `ReactIconsAI_${n}`,
  })),
  ...Object.keys(ReactIconsBI).map((n, idx) => ({
    uniqueId: `ReactIconsBI_${idx + 1}_${n}`,
    parent: IconParents.ReactIconsBI,
    name: `ReactIconsBI_${n}`,
  })),
  ...Object.keys(ReactIconsBS).map((n, idx) => ({
    uniqueId: `ReactIconsBS_${idx + 1}_${n}`,
    parent: IconParents.ReactIconsBS,
    name: `ReactIconsBS_${n}`,
  })),
  ...Object.keys(ReactIconsCG).map((n, idx) => ({
    uniqueId: `ReactIconsCG_${idx + 1}_${n}`,
    parent: IconParents.ReactIconsCG,
    name: `ReactIconsCG_${n}`,
  })),
  ...Object.keys(ReactIconsCI).map((n, idx) => ({
    uniqueId: `ReactIconsCI_${idx + 1}_${n}`,
    parent: IconParents.ReactIconsCI,
    name: `ReactIconsCI_${n}`,
  })),
  ...Object.keys(ReactIconsDI).map((n, idx) => ({
    uniqueId: `ReactIconsDI_${idx + 1}_${n}`,
    parent: IconParents.ReactIconsDI,
    name: `ReactIconsDI_${n}`,
  })),
  ...Object.keys(ReactIconsFA).map((n, idx) => ({
    uniqueId: `ReactIconsFA_${idx + 1}_${n}`,
    parent: IconParents.ReactIconsFA,
    name: `ReactIconsFA_${n}`,
  })),
  ...Object.keys(ReactIconsFA6).map((n, idx) => ({
    uniqueId: `ReactIconsFA6_${idx + 1}_${n}`,
    parent: IconParents.ReactIconsFA6,
    name: `ReactIconsFA6_${n}`,
  })),
];

const iconFamilyLength = iconFamily.length;

// Utility to fetch icon by name
const getIcon = (name = "FaQuestionCircle") => {
  if (!isValidString(name)) {
    return ReactIconsFA.FaQuestionCircle;
  }

  const index = findIndexByIconName(iconFamily, name);
  if (index < 0) {
    return ReactIconsFA.FaQuestionCircle;
  }

  const parentName = iconFamily[index].parent;
  switch (parentName) {
    case IconParents.ReactIconsAI:
      return ReactIconsAI[name.split("_")[1]];
    case IconParents.ReactIconsBI:
      return ReactIconsBI[name.split("_")[1]];
    case IconParents.ReactIconsBS:
      return ReactIconsBS[name.split("_")[1]];
    case IconParents.ReactIconsCG:
      return ReactIconsCG[name.split("_")[1]];
    case IconParents.ReactIconsCI:
      return ReactIconsCI[name.split("_")[1]];
    case IconParents.ReactIconsDI:
      return ReactIconsDI[name.split("_")[1]];
    case IconParents.ReactIconsFA:
      return ReactIconsFA[name.split("_")[1]];
    case IconParents.ReactIconsFA6:
      return ReactIconsFA6[name.split("_")[1]];
    default:
      return ReactIconsFA.FaQuestionCircle;
  }
};

const getIconComponent = (selectedIcon) => (selectedIcon ? getIcon(selectedIcon.name) : null);

const getSelectedIndex = (selectedIcon) =>
  selectedIcon ? findIndexByUniqueId(iconFamily, selectedIcon.uniqueId) : -1;

export const calculateNextPrev = (selectedIndex) =>
  selectedIndex >= 0
    ? {
        next: iconFamily[(selectedIndex + 1 + iconFamilyLength) % iconFamilyLength],
        prev: iconFamily[(selectedIndex - 1 + iconFamilyLength) % iconFamilyLength],
      }
    : { next: null, prev: null };

const getIconDetails = (uniqueId) => {
  const selectedIndex = findIndexByUniqueId(iconFamily, uniqueId);
  const selectedIcon = iconFamily[selectedIndex] || null;
  const IconComponent = getIconComponent(selectedIcon);
  return {
    selectedIndex,
    selectedIcon,
    IconComponent,
    ...calculateNextPrev(selectedIndex),
  };
};

const filterIconFamilyByParentId = (parentId) => {
  if (!isValidString(parentId)) return [];

  return iconFamily.filter(({ parent }) => parent === parentId) || [];
};

const getAllIconParents = () =>
  Object.keys(IconParents).map((key) => ({
    id: IconParents[key],
    name: key,
  }));

const getIconDetailsByParentId = (uniqueId, parentId) => {
  const filteredFamily = filterIconFamilyByParentId(parentId) || [];
  const filteredFamilyLength = filteredFamily.length;
  const selectedIndex = findIndexByUniqueId(filteredFamily, uniqueId);
  const selectedIcon = filteredFamily[selectedIndex] || null;
  const IconComponent = getIconComponent(selectedIcon);
  const nextPrevObject =
    selectedIndex >= 0
      ? {
          next: filteredFamily[(selectedIndex + 1 + filteredFamilyLength) % filteredFamilyLength],
          prev: filteredFamily[(selectedIndex - 1 + filteredFamilyLength) % filteredFamilyLength],
        }
      : { next: null, prev: null };
  return {
    selectedIndex,
    selectedIcon,
    IconComponent,
    ...nextPrevObject,
  };
};

export {
  filterIconFamilyByParentId,
  findIndexByIconName,
  findIndexByUniqueId,
  getAllIconParents,
  getIcon,
  getIconComponent,
  getIconDetails,
  getIconDetailsByParentId,
  getSelectedIndex,
  iconFamily,
  iconFamilyLength,
};
