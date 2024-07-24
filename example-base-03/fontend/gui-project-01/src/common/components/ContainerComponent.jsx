import React from "react";

const ContainerComponent = ({
    header /** = <p>This is the header section.</p> */,
    leftSection /**= <p>This is the left section.</p>*/,
    rightSection /**= <p>This is the right section.</p>*/,
    footer /** = <p>This is the footer section.</p> */
}) => {

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid #ddd',
            borderRadius: '5px',
            padding: '16px',
            margin: '16px',
            width: '95%',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        },
        header: {
            marginBottom: '16px',
        },
        content: {
            display: 'flex',
            justifyContent: 'space-between',
        },
        leftSection: {
            flex: 1,
            borderRight: '1px solid #ddd',
            padding: '16px',
            marginRight: '16px',
        },
        rightSection: {
            flex: 5,
            padding: '16px',
            marginLeft: '16px',
        },
        footer: {
            //marginTop: '16px',
        },
    };

    return (
        <div style={styles.container}>
            {/* Header Section */}
            {header && (
                <div style={styles.header}>
                    {typeof header === 'function' ? header() : header}
                </div>
            )}

            {/* Main Content Section */}
            {(leftSection || rightSection) && <div style={styles.content}>
                {/* Left Section */}
                <div style={styles.leftSection}>
                    {/* <h2>Left Section</h2> */}
                    {typeof leftSection === 'function' ? leftSection() : leftSection}
                </div>

                {/* Right Section */}
                <div style={styles.rightSection}>
                    {/* <h2>Right Section</h2> */}
                    {typeof rightSection === 'function' ? rightSection() : rightSection}
                </div>
            </div>}

            {/* Footer Section */}
            {footer && (
                <div style={styles.footer}>
                    {typeof footer === 'function' ? footer() : footer}
                </div>
            )}
        </div>
    );
};

export default ContainerComponent;
