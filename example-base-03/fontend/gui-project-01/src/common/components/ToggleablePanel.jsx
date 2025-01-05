import React, { useState } from 'react'
import ToggleableIcon from './ToggleableIcon';

const ToggleablePanel = ({ title = "", children, showContent: initialValueToShowMetadata = false }) => {
    const [showMetadata, setShowMetadata] = useState(initialValueToShowMetadata);

    const toggleMetadataVisibility = () => setShowMetadata(prev => !prev);
    return (
        <div>
            <ToggleableIcon
                isContentVisible={showMetadata}
                onToggle={toggleMetadataVisibility}
                additionalStyleForIcon={{fontWeight: 'bold', }}
            />
            <span style={styles.title}>
                {title}
            </span>
            
            {showMetadata && children && (
                <div style={styles.metadataContainer}>
                    {children}
                </div>
            )}
        </div>
    )
};

const styles = {
    title: {
        fontWeight: 'bold',
    },
    metadataContainer: {
        //maxHeight: "200px",
        maxWidth: "90vw",
        overflow: "auto",
        padding: "10px",
        gap: "10px",
        border: "1px solid #ddd",
        borderRadius: "5px",
        backgroundColor: "#f9f9f9",
        margin: "20px 5px",
    },
};

export default ToggleablePanel