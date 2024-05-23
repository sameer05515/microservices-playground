import { useNavigate } from "react-router-dom";
import FlexContainer from "../common/components/FlexContainer";

const navigationArr = [
    {
        navigationPath: "old-dashboard",
        title: "ResumeDashboardV1",
    },
    {
        navigationPath: "resumes",
        title: "ResumeDashboardNew",
    },
    {
        navigationPath: "resumes-tree-view",
        title: "ResumeDashboard- TreeView",
    },
    {
        navigationPath: "playground",
        title: "Playground",
    },
].map((p, idx) => ({ ...p, id: `nav_item_${idx + 1}` }));

const WelcomeIndex = () => {
    const navigate = useNavigate();

    return (
        <FlexContainer>
            <ul style={styles.ul}>
                {navigationArr.map(({ id, navigationPath, title }) => (
                    <li style={styles.li} key={id}>
                        <span                            
                            style={styles.span}
                            onClick={() => navigate(navigationPath)}
                        >
                            {title}
                        </span>
                    </li>
                ))}
            </ul>
        </FlexContainer>
    );
};

const styles = {
    container: {
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f0f0f0",
    },
    ul: {
        listStyleType: "none",
        padding: 0,
    },
    li: {
        margin: "10px 0",
    },
    span: {
        cursor: "pointer",
        color: "blue",
        textDecoration: "none",
        fontWeight: "bold",
    },
    outletContainer: {
        marginTop: "20px",
    },
};

export default WelcomeIndex;
