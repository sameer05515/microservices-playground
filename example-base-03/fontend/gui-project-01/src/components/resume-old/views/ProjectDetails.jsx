import React from 'react';
// import MetadataExtractor from '../../../common/components/MetadataExtractor';
import {
    projectItemStyle
} from "../../../common/styles/ResumeComponentsStyle";
import CustomCollapse from '../../../common/components/CustomCollapse';
import TextRenderer from '../../../common/components/TextRenderer';
import DynamicDataRenderer from '../../../common/components/DynamicDataRenderer';

const ProjectDetails = ({ project }) => (    
    <CustomCollapse style={projectItemStyle} key={project.uniqueId} headerText={project.name}>
        {/* <h4>{project.name}</h4> */}
        {/* <p>{project.details}</p> */}


        {/* <HTMLDataViewer style={companyItemStyle} htmlText={project.details}/> */}

        {/* <MetadataExtractor rawText={project.details} style={companyItemStyle} /> */}
        <p>
            <b>Summary </b>: {project.processedDetails?.metadata?.summarizedIntroduction||''} 
        </p>
        <CustomCollapse
            style={{ border: "1px solid #ccc", padding: "5px", borderRadius: "10px" }}
            headerText="Preview Raw metadata object"
        >
            <TextRenderer rawText={JSON.stringify(project.processedDetails, null, 2)} showRadioButtons={false} />
        </CustomCollapse>
        <CustomCollapse
            style={{ border: "1px solid #ccc", padding: "5px", borderRadius: "10px" }}
            headerText="Preview metadata object with DynamicDataRenderer"
        >
            <DynamicDataRenderer data={project.processedDetails?.metadata}/>
        </CustomCollapse>
    </CustomCollapse>
);

export default ProjectDetails;