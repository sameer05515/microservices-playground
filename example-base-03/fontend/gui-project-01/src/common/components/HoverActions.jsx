import React, { useState } from "react";

const HoverActions = () => {
    const [isHovered, setIsHovered] = useState(false);

    const actions = ["Action 1", "Action 2", "Action 3"]; // Replace with actual actions

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                position: "relative",
                display: "inline-block",
                // padding: "10px",
                border: "1px solid #ccc",
                cursor: "pointer",
                width: "200px",
            }} // Set the width here
        >
            Actions
            {isHovered && (
                <div
                    style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        backgroundColor: "#fff",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                        border: "1px solid #ddd",
                        width: "100%",
                    }}
                >
                    {" "}
                    {/* Use width: '100%' to inherit width from outer div */}
                    {actions.map((action, index) => (
                        <span
                            key={index}
                            style={{ display: "block", padding: "10px", cursor: "pointer" }}
                            onMouseEnter={(e) => (e.target.style.backgroundColor = "#f0f0f0")}
                            onMouseLeave={(e) => (e.target.style.backgroundColor = "#fff")}
                        >
                            {action}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HoverActions;
