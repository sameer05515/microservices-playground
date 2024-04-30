import React from 'react';
import {
    companyItemStyle,
    projectWidgetStyle
} from "../../../common/styles/ResumeComponentsStyle";

import CustomCollapse from '../../../common/components/CustomCollapse';
// import MetadataExtractor from '../../../common/components/MetadataExtractor';
import ProjectDetails from './ProjectDetails';
import TextRenderer from '../../../common/components/TextRenderer';
import DynamicDataRenderer from '../../../common/components/DynamicDataRenderer';

// Functional component to render individual company details
// const CompanyDetails = withCollapse(({ company }) => (
//     <div style={companyItemStyle} key={company.uniqueId}>
//         <h4>{company.name}</h4>
//         {/* <p>{company.details}</p> */}


//         <HTMLDataViewer style={companyItemStyle} htmlText={company.details}/>

//         <CustomCollapse style={projectWidgetStyle} headerText='Projects'>
//             {/* <h5>Projects</h5> */}
//             {
//                 company.projects && company.projects.length > 0
//                     ? company.projects.map((project) => (
//                         <ProjectDetails htmlText={project.name} key={project.uniqueId} project={project} />
//                     ))
//                     : <span>No projects configured yet!</span>
//             }
//         </CustomCollapse>
//     </div>
// ));

const CompanyDetails = ({ company }) => (
    <CustomCollapse style={companyItemStyle} key={company.uniqueId} 
    headerText={`${company.name} (${company.processedDetails?.metadata?.overAllTenure||''})`}>
        {/* <h4>{company.name}</h4> */}
        {/* <p>{company.details}</p> */}


        {/* <HTMLDataViewer style={companyItemStyle} htmlText={company.details}/> */}
        {/* <MetadataExtractor rawText={company.details} style={companyItemStyle} /> */}
        <p>
            <b>Summary </b>: {company.processedDetails?.metadata?.summarizedIntroduction||''} 
        </p>
        <CustomCollapse
            style={{ border: "1px solid #ccc", padding: "5px", borderRadius: "10px" }}
            headerText="Preview Raw metadata object"
        >
            <TextRenderer rawText={JSON.stringify(company.processedDetails, null, 2)} showRadioButtons={false} />
        </CustomCollapse>

        <CustomCollapse
            style={{ border: "1px solid #ccc", padding: "5px", borderRadius: "10px" }}
            headerText="Preview metadata object with DynamicDataRenderer"
        >
            <DynamicDataRenderer data={company.processedDetails?.metadata}/>
        </CustomCollapse>

        <CustomCollapse style={projectWidgetStyle} headerText='Projects'>
            {/* <h5>Projects</h5> */}
            {
                company.projects && company.projects.length > 0
                    ? company.projects.map((project) => (
                        <ProjectDetails htmlText={project.name} key={project.uniqueId} project={project} />
                    ))
                    : <span>No projects configured yet!</span>
            }
        </CustomCollapse>
    </CustomCollapse>
);

export default CompanyDetails;