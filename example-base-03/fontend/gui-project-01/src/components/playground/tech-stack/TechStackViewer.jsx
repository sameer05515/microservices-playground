import React from "react";
import { getAllTechStacks } from "../../../common/utilities/tech-stack";
import { renderCard } from "../../../common/components/custom-card/Card";

const TechStackViewer = () => {
    const { succcess, data: techstacks, messages } = getAllTechStacks();
    if (!succcess) {
        return (
            <>
                {messages?.map((m) => <div style={{ color: "red" }}>{m}</div>) || (
                    <div style={{ color: "red" }}>
                        Error occurred, but detailed messages missing. Please contact
                        administrator.
                    </div>
                )}
            </>
        );
    }
    return (
        <div>
            <h1>TechStackViewer</h1>
            {renderCard({ title: "All Tech Stacks", objectToBeRendered: techstacks })}
        </div>
    );
};

export default TechStackViewer;
