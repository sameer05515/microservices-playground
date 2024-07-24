// import { element } from "prop-types";
import ResumeDashboard from "../components/resume-old/ResumeDashboard";
import { Route, useNavigate, BrowserRouter as Router, Routes } from "react-router-dom";
import WelcomeIndex from "../components/WelcomeIndex";
import BaseComponent from "../components/BaseComponent";

export const routeConfig = [
    {
        path: "/",
        element: "Parent",
        children: [
            {
                index: true,
                element: "WelcomeIndex"
            },
            {
                path: "old-dashboard",
                element: "ResumeDashboardOld",
                displayInCombo: true,
            },
            {
                path: "resumes",
                element: "Child2",
                displayInCombo: true,
            },
        ]
    },
    {
        path: "*",
        element: "NotFound",
        displayInCombo: false,
    },
];

const NotFound = () => {
    const navigate = useNavigate();
    return (
        <div>
            <h1>404 Not Found</h1>
            <p>Oops! Page not found.</p>
            <button onClick={() => navigate(-1)}>Back</button>
        </div>
    );
};

// Define a mapping from string to component
const componentMap = {
    Parent: BaseComponent,
    WelcomeIndex: WelcomeIndex,
    ResumeDashboardOld: () => (
        <div>
            <h1>Resume Dashboard</h1>
            <ResumeDashboard />
        </div>
    ),
    Child2: () => <>Development in progress</>,
    NonExistingElement: () => <>I am the boss</>,
    NotFound: NotFound,
};

export const generateRoutes = (config = routeConfig) => {
    return config.map((route, index) => {
        const Element = componentMap[route.element];
        if (route.children) {
            return (
                <Route key={index} path={route.path} element={<Element />}>
                    {route.children.map((child, idx) => {
                        const ChildElement = componentMap[child.element];
                        return child.index ? (
                            <Route key={idx} index element={<ChildElement />} />
                        ) : (
                            <Route key={idx} path={child.path} element={<ChildElement />} />
                        );
                    })}
                </Route>
            );
        }
        return <Route key={index} path={route.path} element={<Element />} />;
    });
};

/**
 * @param parentRouteName 
 *  
 * @returns childComponentNameObj having fields as :  "Child component display name": "route" 
 * 
 * Example:
 * 
    {
    "Child 1": "child1",
    "Child 2": "child2"
    } 
 *
 *  */
const getChildRouteNames = (parentRouteName = "/") => {
    let childComponentNameObj = {};
    if (parentRouteName) {
        const parentRoute = routeConfig.find((rc) => rc.path === parentRouteName);
        if (parentRoute && parentRoute.children) {
            childComponentNameObj = parentRoute.children
                .filter((ch) => ch.displayInCombo && ch.displayInCombo === true)
                .reduce((acc, rcc) => {
                    acc[rcc.element] = rcc.path;
                    return acc;
                }, {});
        }
    }
    return childComponentNameObj;
};

export const childComponentNames = getChildRouteNames();

const App = () => {
    return (
        <Router>
            <Routes>
                {generateRoutes(routeConfig)}
            </Routes>
        </Router>
    );
};

export default App;
