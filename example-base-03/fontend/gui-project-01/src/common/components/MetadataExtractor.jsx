import React, { useState, useEffect } from "react";
import yaml from "js-yaml";
import { COLORS } from '../utilities/constants';
import CustomCollapse from "./CustomCollapse";
import TextRenderer from "./TextRenderer";

const MetadataExtractor = ({ rawText, textType = "yaml", onExtractionDone = () => { } }) => {
    const [errorMessage, setErrorMessage] = useState("");
    const [metadata, setMetadata] = useState(null);

    useEffect(() => {
        const processText = () => {
            let metadata = {};
            let error = "";

            if (textType === "yaml") {
                try {
                    metadata = yaml.load(rawText);
                } catch (e) {
                    if (e.mark) {
                        // If the error has 'mark' property, it contains line and column information
                        const errorLine = e.mark.line + 1; // Adjust for 0-based index
                        error = `Error parsing YAML at line ${errorLine}: ${e.message}`;
                    } else {
                        // If the error does not have 'mark' property, it's a general parsing error
                        error = `Error parsing YAML: ${e.message}`;
                    }
                }
            } else {
                // Handle other text types (Markdown, plain text) here
                error = `Metadata extraction for Text type ${textType} is not supported yet!`;
            }

            setErrorMessage(error);
            setMetadata(metadata);
            onExtractionDone({ error, metadata })
        };

        processText();
    }, [rawText, textType]); // Run when rawText or textType changes

    return (
        <div>
            {
                errorMessage && (
                    <p style={{ color: COLORS.HOT_PINK }}>
                        {errorMessage}
                    </p>
                )
            }
            
            <CustomCollapse
                style={{ border: "1px solid #ccc", padding: "5px", borderRadius: "10px" }}
                headerText="Preview Raw Text"
            >

                {/* <pre style={{whiteSpace: 'pre-wrap'}}>{rawText}</pre>
                <HTMLDataViewer style={projectWidgetStyle} htmlText={rawText} />*/}
                <TextRenderer rawText={rawText} showRadioButtons={false} />
            </CustomCollapse>

            {metadata && (
                <CustomCollapse style={{
                    border: "1px solid #ccc",
                    padding: "5px",
                    borderRadius: "10px"
                }}
                    headerText="Preview generated Metadata">
                    {/* <pre>{JSON.stringify(metadata, null, 2)}</pre> */}
                    <TextRenderer rawText={JSON.stringify(metadata, null, 2)} showRadioButtons={false} />
                </CustomCollapse>
            )}
        </div>
    );
};

export default MetadataExtractor;
