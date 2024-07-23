import ResumeDashboard from "../components/resume/ResumeDashboard";
import { Outlet, Route, useNavigate } from "react-router-dom";

export const routeConfig = [
    {
        path: "/",
        element: "Parent",
        children: [
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
        ],
    },
    {
        path: "*",
        element: "NotFound",
        displayInCombo: false,
    },
];



const Welcome = () => {
    const navigate = useNavigate();
    const styles = {
        container: {
            padding: '20px',
            fontFamily: 'Arial, sans-serif',
            backgroundColor: '#f0f0f0'
        },
        ul: {
            listStyleType: 'none',
            padding: 0,
        },
        li: {
            margin: '10px 0',
        },
        span: {
            cursor: 'pointer',
            color: 'blue',
            textDecoration: 'none',
            fontWeight: 'bold',
        },
        outletContainer: {
            marginTop: '20px',
        }
    };

    return (
        <div style={styles.container}>
            <ul style={styles.ul}>
                <li style={styles.li}>
                    <span style={styles.span} onClick={() => navigate('old-dashboard')}>ResumeDashboardOld</span>
                </li>
                <li style={styles.li}>
                    <span style={styles.span} onClick={() => navigate('resumes')}>ResumeDashboardNew</span>
                </li>
            </ul>
            <div style={styles.outletContainer}>
                <Outlet />
            </div>
        </div>
    )
}

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
    Parent: Welcome,
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
                    {generateRoutes(route.children)}
                </Route>
            );
        }
        return <Route key={index} path={route.path} element={<Element />} />;
    });
};
