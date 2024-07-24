import React, { useEffect, useState } from 'react';
import ContainerComponent from '../common/components/ContainerComponent';
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
        textDecoration: 'underline',
    }
};

const BaseComponent = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <div>
            <ContainerComponent
                header={<GlobalBreadcrumb currentPath={currentPath} />}
                footer={
                    <div style={styles.outletContainer}>
                        <Outlet />
                    </div>
                }
            />
        </div>
    );
};

const GlobalBreadcrumb = ({ currentPath }) => {
    const PATH_IDS = {
        HOME: 'PATH_ID_HOME',
        OLD_DASHBOARD: 'PATH_ID_OLD_DASHBOARD',
        RESUMES_LIST: 'PATH_ID_RESUMES_LIST'
    }
    const breadcrumbItems = [
        { id: PATH_IDS.HOME, title: 'Home', path: '/' },
        { id: PATH_IDS.OLD_DASHBOARD, title: 'Old Resume Dashboard', path: '/old-dashboard' },
        { id: PATH_IDS.RESUMES_LIST, title: 'Resumes', path: '/resumes' },
    ];

    const getBreadcrumbItemsForId = (id) => breadcrumbItems.find(bci => bci.id === id) || null;

    const [itemsForPath, setItemsForPath] = useState([]);

    useEffect(() => {
        if (currentPath) {
            const arr = [];
            switch (currentPath) {
                case '/':
                    arr.push(getBreadcrumbItemsForId(PATH_IDS.HOME));
                    setItemsForPath(() => [...arr]);
                    break;
                case '/old-dashboard':
                    arr.push(getBreadcrumbItemsForId(PATH_IDS.HOME));
                    arr.push(getBreadcrumbItemsForId(PATH_IDS.OLD_DASHBOARD));
                    setItemsForPath(() => [...arr]);
                    break;
                case '/resumes':
                    arr.push(getBreadcrumbItemsForId(PATH_IDS.HOME));
                    arr.push(getBreadcrumbItemsForId(PATH_IDS.RESUMES_LIST));
                    setItemsForPath(() => [...arr]);
                    break;

                default: break;
            }
        }

    }, [currentPath]);

    return (
        <div>
            {itemsForPath.map((item, index) => (
                <BreadcrumbItem
                    key={index}
                    item={item}
                    isActive={currentPath === item.path}
                />
            ))}
            <p>Current Path: {currentPath}</p>
        </div>
    );
};

const BreadcrumbItem = ({ item, isActive }) => {
    const navigate = useNavigate();
    const [hovered, setHovered] = useState(false);

    return (
        <span
            style={{
                //...styles.span,
                color: 'blue',
                textDecoration: 'none',
                ...(hovered && styles.hovered),
                ...(isActive && { color: 'black' })
            }}
            onMouseOver={() => { if (!isActive) setHovered(true) }}
            onMouseOut={() => { if (!isActive) setHovered(false) }}
            onClick={() => navigate(item.path)}
        >
            {item.title}
            {!isActive && ' > '}
        </span>
    );
};

export default BaseComponent;
