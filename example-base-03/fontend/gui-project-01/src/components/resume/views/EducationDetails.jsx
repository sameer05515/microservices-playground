import React from 'react';
// import MetadataExtractor from '../../../common/components/MetadataExtractor';
import {
    educationItemStyle
} from "../../../common/styles/ResumeComponentsStyle";
import CustomCollapse from '../../../common/components/CustomCollapse';
import TextRenderer from '../../../common/components/TextRenderer';
import DynamicDataRenderer from '../../../common/components/DynamicDataRenderer';



// Functional component to render individual education details
const EducationDetails = ({ education }) => (
    <CustomCollapse style={educationItemStyle} key={education.uniqueId} headerText={education.name}>
        {/* <h4>{education.name}</h4> */}
        {/* <p>{education.details}</p> */}

        {/* <HTMLDataViewer style={companyItemStyle} htmlText={education.details}/> */}
        {/* <MetadataExtractor rawText={education.details} style={companyItemStyle} /> */}
        <p>
            <b>Summary </b>: {education.processedDetails?.metadata?.summarizedIntroduction||''} 
        </p>
        <CustomCollapse
            style={{ border: "1px solid #ccc", padding: "5px", borderRadius: "10px" }}
            headerText="Preview Raw metadata object"
        >
            <TextRenderer rawText={JSON.stringify(education.processedDetails, null, 2)} showRadioButtons={false} />
        </CustomCollapse>
        <CustomCollapse
            style={{ border: "1px solid #ccc", padding: "5px", borderRadius: "10px" }}
            headerText="Preview metadata object with DynamicDataRenderer"
        >
            <DynamicDataRenderer data={education.processedDetails?.metadata}/>
        </CustomCollapse>
    </CustomCollapse>
);

export default EducationDetails;