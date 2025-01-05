import React, { useMemo, useState } from "react";
import styles from "./HoverActions.module.css";

const defaultActions = ["Action 1", "Action 2", "Action 3"];

const HoverActions = ({ actions = [], title }) => {
    const [isHovered, setIsHovered] = useState(false);

    const calculatedActions = useMemo(() => {
        return actions.length > 0 ? actions : defaultActions;
    }, [actions]);

    const calculatedTitle = useMemo(() => {
        return title ? title : "Select Action";
    }, [title, calculatedActions]);

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={styles.container}
        >
            <span title={`Actions: Total Actions ${calculatedActions?.length}`}>
                {calculatedTitle}
            </span>
            {isHovered && (
                <div className={styles.actionsDropdown}>
                    {calculatedActions.map((action, index) => (
                        <span key={index} className={styles.actionItem}>
                            {action}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HoverActions;
