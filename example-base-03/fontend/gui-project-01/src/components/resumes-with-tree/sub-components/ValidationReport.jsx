import React from "react";
// import { Outlet } from "react-router-dom";
import CustomCollapse from "../../../common/components/CustomCollapse";
import { ValidationMessageType } from "../common/validations-v2/validation-util";

const ValidationReport = ({ data }) => {
    const { validData, messages } = data;
    const getColorByType = (type) => {
        if (type === ValidationMessageType.ERROR) {
            return "red";
        } else if (type === ValidationMessageType.WARNING) {
            return "yellow";
        } else {
            return "green";
        }
    };
    return (
        <>
            {validData ? "valid" : "Invalid"} <br />
            {messages?.map((m, idx) => (
                <div key={`id_${idx + 1}`} style={{ color: getColorByType(m.type) }}>
                    <b>{m.type.toUpperCase()}</b>: {m.message}
                </div>
            ))}
        </>
    );
};

const WithCCValidationReport = ({
    data = {},
    headerText = "No header text provided",
    showBoldTitle = true,
}) => {
    return (
        <CustomCollapse
            style={{
                border: "1px solid #ccc",
                padding: "5px",
                borderRadius: "10px",
            }}
            headerText={headerText || "No header text provided"}
            showBoldTitle={showBoldTitle}
        >
            {/* <DynamicDataRenderer data={data} /> */}
            <ValidationReport data={data} />
        </CustomCollapse>
    );
};

export { ValidationReport, WithCCValidationReport };
