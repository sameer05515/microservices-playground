import React, { useState } from 'react'
import ContainerComponent from '../common/components/ContainerComponent'
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

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
    },
    hovered: {
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
    }
};

const BaseComponent = () => {

    const location = useLocation();
    // Extract the current pathname
    const currentPath = location.pathname;
    return (
        <div>
            <ContainerComponent
                header={<GlobalBreadcrumb currentPath={currentPath} />}
                footer={() =>
                    <div style={styles.outletContainer}>
                        <Outlet />
                    </div>
                }
            />

        </div>
    )
};

const GlobalBreadcrumb = ({ currentPath }) => {
    const breadCrumItemsArray = [
        { title: 'Home', absoluteRoute: '/' },
        { title: 'OldResumeDashboard', absoluteRoute: '/old-dashboard' },
        { title: 'Resumes', absoluteRoute: '/resumes' }
    ]
    const navigate = useNavigate();

    return (
        <>            
            {breadCrumItemsArray.map(({ title, absoluteRoute }) =>
            (<>
                <BreadcrumbItem
                    item={{ title, absoluteRoute }}
                    enabled={currentPath !== absoluteRoute} />
            </>))}
            <p>Current Path: {currentPath}</p>
        </>
    );
}

const BreadcrumbItem = ({ item: { title, absoluteRoute }, enabled = false, onMouseOver = () => { }, onMouseOut = () => { } }) => {
    const navigate = useNavigate();
    const [breadCrumItemHovered, setBreadCrumItemHovered] = useState(false);


    return (
        <span
            style={{ color: 'blue', ...(enabled && breadCrumItemHovered ? styles.hovered : {}) }}
            onMouseOver={(event) => { if (enabled) { setBreadCrumItemHovered(true); onMouseOver(event, { title, absoluteRoute }); } }}
            onMouseOut={(event) => { if (enabled) { setBreadCrumItemHovered(false); onMouseOut(event, { title, absoluteRoute }); } }}
            onClick={() => navigate(absoluteRoute)}>
            {`${title} >`}
        </span>
    );
}

export default BaseComponent