import { JSX } from "react";
import ServerV1ApiTestingV1 from "./ServerV1ApiTesting/v1";
import ServerV3ApiTestingV1 from "./ServerV3ApiTesting/v1";
import ServerV4ApiTestingV1 from "./ServerV4ApiTesting/v1";

const Components: Record<string, () => JSX.Element> = {
  ServerV1ApiTestingV1,
  ServerV3ApiTestingV1,
  ServerV4ApiTestingV1,
};

export const componentNames = Object.keys(Components);
const componentCount = componentNames.length;

export const calculateNextPrev = (selectedIndex: number) =>
  selectedIndex >= 0
    ? {
        next: componentNames[(selectedIndex + 1 + componentCount) % componentCount],
        prev: componentNames[(selectedIndex - 1 + componentCount) % componentCount],
      }
    : { next: "", prev: "" };

export const getComponentDetails = (componentName = "") => {
  const selectedIndex = componentNames.indexOf(componentName);
  return {
    Component: Components[componentName] || null,
    ...calculateNextPrev(selectedIndex),
  };
};
