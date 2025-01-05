import FormImplementationsPlayground from "../forms/FormImplementationsPlayground";
import FormVersionsPlayground from "../forms/FormVersionsPlayground";
import TechStackViewer from "../tech-stack/TechStackViewer";

// Utility Functions
const removeSuffix = (input = "", suffix = "Playground") =>
    suffix ? input.replace(new RegExp(`${suffix}$`), "") : input;

const addSuffix = (input = "", suffix = "Playground") =>
    input.endsWith(suffix) ? input : input + suffix;

const convertToKebabCase = (input = "") =>
    input
        .split(/(?=[A-Z])/)
        .join("-")
        .toLowerCase();

const convertToCamelCase = (input = "") =>
    input
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join("");

// Playground Area Components Map
const PlaygroundArea = {
    FormVersionsPlayground: <FormVersionsPlayground />,
    FormImplementationsPlayground: <FormImplementationsPlayground />,
    TechStackViewerPlayground:<TechStackViewer/>
};

// Action List for HoverActions
const hoverActions = Object.keys(PlaygroundArea).map((key, idx) => ({
    id: `action_${idx + 1}`,
    label: removeSuffix(key),
    area: convertToKebabCase(removeSuffix(key)),
}));

const getComponentForKey = (key) => PlaygroundArea[key] || null;

export {
    removeSuffix,
    addSuffix,
    convertToKebabCase,
    convertToCamelCase,
    hoverActions,
    getComponentForKey,
};
