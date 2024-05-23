import React from "react";
import { Route } from "react-router-dom";
import ResumeDashboardV1 from "../components/resume-old/ResumeDashboardV1";
import WelcomeIndex from "../components/WelcomeIndex";
import Parent from "../components/BaseComponent";
import ResumeList from "../components/resumes/ResumeList";
import ResumeCard from "../components/resumes/ResumeCard";
import ResumeBase from "../components/resumes-with-tree/ResumeBase";
import CompanyCard from "../components/resumes/CompanyCard";
import ProjectCard from "../components/resumes/ProjectCard";
import Playground from "../components/playground/Playground";
import NotFound from "./NotFound";

// Merged Route Configuration with Components
const routeConfig = [
    {
        path: "/",
        element: Parent,
        children: [
            { index: true, element: WelcomeIndex },
            { path: "playground", element: Playground, displayInCombo: true },
            { path: "old-dashboard", element: ResumeDashboardV1, displayInCombo: true },
            {
                path: "resumes",
                element: ResumeList,
                displayInCombo: true,
                children: [
                    { path: ":id", element: ResumeCard },
                    { path: ":id/:companyUID", element: CompanyCard },
                    { path: ":id/:companyUID/:projectUID", element: ProjectCard },
                ],
            },
            { path: "resumes-tree-view", element: ResumeBase, displayInCombo: true },
        ],
    },
    { path: "*", element: NotFound },
];

// Dynamically Prepare Component Map
const prepareComponentMap = (routes) => {
    const map = {};

    const traverseRoutes = (routes) => {
        routes.forEach(({ element, children }) => {
            if (element) {
                // Use the component's name as the key
                map[element.name] = element;
            }
            if (children) {
                traverseRoutes(children);
            }
        });
    };

    traverseRoutes(routes);
    return map;
};

// Create a dynamic component map
const componentMap = prepareComponentMap(routeConfig);

/**
 * Get Component for a given key (component name).
 * 
 * @param {string} key - The name of the component.
 * @returns {React.Component} The corresponding React component.
 */
const getComponentForKey = (key) => componentMap[key] || NotFound;

// Generate Routes Dynamically
const generateRoutes = (routes = routeConfig) =>
    routes.map((route, index) => {
        const { path, element, children, index: isIndexRoute } = route;
        const Element = element || NotFound;

        return (
            <Route
                key={index}
                path={path}
                element={<Element />}
            >
                {children && generateRoutes(children)}
                {isIndexRoute && <Route index element={<Element />} />}
            </Route>
        );
    });

/**
 * Get child component names for a given parent route.
 * 
 * @param {string} parentRouteName - The name of the parent route.
 * @returns {Object} Object containing child component names and paths.
 */
const getChildRouteNames = (parentRouteName = "/") => {
    const parentRoute = routeConfig.find((rc) => rc.path === parentRouteName);
    return parentRoute?.children
        ?.filter((child) => child.displayInCombo)
        ?.reduce((acc, { element, path }) => {
            acc[element.name] = path;
            return acc;
        }, {}) ?? {};
};

// Extract child component names
const childComponentNames = getChildRouteNames();

// Uncomment this section if you want to use the generated routes in your main App component

// const App = () => (
//     <Router>
//         <Routes>{generateRoutes(routeConfig)}</Routes>
//     </Router>
// );

// export default App;

// Accumulating all exports at the end of the file
export {
    // routeConfig,
    // componentMap,
    getComponentForKey,
    generateRoutes,
    // getChildRouteNames,
    childComponentNames,
    // NotFound
};
