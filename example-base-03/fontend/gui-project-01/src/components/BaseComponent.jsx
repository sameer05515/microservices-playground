import React, { useEffect, useState } from 'react';
import ContainerComponent from '../common/components/ContainerComponent';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import FlexContainer, { FlexItem } from '../common/components/FlexContainer';
import CustomCollapse from '../common/components/CustomCollapse';

const styles = {
    container: {
        // padding: '20px',
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
    },
    whitespacePreWrap: { whiteSpace: 'pre-wrap' }
};

const BaseComponent = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <FlexContainer>

            <FlexItem flex={1}>
                <GlobalBreadcrumb currentPath={currentPath} />
            </FlexItem>

            <FlexItem flex={10}>
                <Outlet />
            </FlexItem>


            {/* <ContainerComponent
                header={<GlobalBreadcrumb currentPath={currentPath} />}
                footer={
                    <div style={styles.outletContainer}>
                        <Outlet />
                    </div>
                }
            /> */}
        </FlexContainer>
    );
};

const PATH_IDS = {
    HOME: 'PATH_ID_HOME',
    OLD_DASHBOARD: 'PATH_ID_OLD_DASHBOARD',
    RESUMES_LIST: 'PATH_ID_RESUMES_LIST'
};

const breadcrumbItems = [
    { id: PATH_IDS.HOME, title: 'Home', path: '/' },
    { id: PATH_IDS.OLD_DASHBOARD, title: 'Old Resume Dashboard', path: '/old-dashboard' },
    { id: PATH_IDS.RESUMES_LIST, title: 'Resumes', path: '/resumes' },
];

const GlobalBreadcrumb = ({ currentPath }) => {
    const [itemsForPath, setItemsForPath] = useState([]);

    useEffect(() => {
        const paths = currentPath.split('/').filter(Boolean);
        const newItemsForPath = paths.map((_, index) => {
            const path = `/${paths.slice(0, index + 1).join('/')}`;
            return breadcrumbItems.find(item => item.path === path);
        }).filter(Boolean);

        setItemsForPath([{ id: PATH_IDS.HOME, title: 'Home', path: '/' }, ...newItemsForPath]);
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
            <CustomCollapse headerText='About: Resume Application' showBoldTitle>
                <div id='Purpose-of-the-Project'>
                    <b>Purpose of the project</b>
                    <pre style={styles.whitespacePreWrap}>
                        {
                            `
                        ######################################################
                        Welcome to this project
                        Overall Purpose:
                            - Fetch and save Resumes data
                            - Display Resume, Company and Projects analytics for quick revision for interview
                            - Add validation for metadata object, before saving it in database.
                            - In place of a bulky form for Resume, Company and Projects, create small forms with 1 field and support partial upsert of resume/company/projects data.
                            - Improve UX of application
                            - Add support for showing validation errors, before submitting a Resume, Company or Project form.
                        ######################################################

                        `
                        }
                    </pre>
                </div>

                <div id='project-milestones'>
                    <pre style={styles.whitespacePreWrap}>
                        {
                            `
                        #######################################
                        Milestones:
                            - [Complete]: 1. Create basic structure to perform CRUD on Resume. (No validations, everything on same page)
                            - [Planned]: 2. Modularize project. 
                            - [Planned]: 3. Add validations before upserting. 
                            - [Planned]: 4. Remove reliability on metadata objects.
                            - [Planned]: 5. Save Company and Project in separate collection
                                - This will start once points 2-4 done successfully.
                                - 
                        #######################################
                        `
                        }
                    </pre>
                </div>

            </CustomCollapse>
            {/* <p>Current Path: {currentPath}</p> */}
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
                fontWeight: 'bold',
                ...(hovered && styles.hovered),
                ...(isActive && { color: 'black' })
            }}
            onMouseOver={() => !isActive && setHovered(true)}
            onMouseOut={() => !isActive && setHovered(false)}
            onClick={() => navigate(item.path)}
        >
            {item.title}
            {!isActive && ' > '}
        </span>
    );
};

export default BaseComponent;
