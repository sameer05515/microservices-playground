import { JSX } from "react";

const Components: Record<string, () => JSX.Element> = {
  Test: () => (
    <div>
      This is our first component in this playground. <br /> We will mainly focus on following
      <ul>
        <li>Axios config usage</li>
        <li>RBAC usage with Axios</li>
      </ul>
    </div>
  ),
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
