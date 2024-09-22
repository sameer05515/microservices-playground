import React from 'react';
import CustomButton from '../../../common/components/CustomButton';
import withCollapse from '../../../common/components/HOC/withCollapse';
import {
    companyWidgetStyle,
    educationWidgetStyle,
    resumeItemStyle
} from "../../../common/styles/ResumeComponentsStyle";

import CustomCollapse from '../../../common/components/CustomCollapse';
// import MetadataExtractor from '../../../common/components/MetadataExtractor';
import CompanyDetails from './CompanyDetails';
import EducationDetails from './EducationDetails';
import TextRenderer from '../../../common/components/TextRenderer';
import DynamicDataRenderer from '../../../common/components/DynamicDataRenderer';
import JSONDataViewer from '../../../common/components/JSONDataViewer';
import ToggleablePanel from '../../../common/components/ToggleablePanel';

// Wrapped with collapsed feature,  Component to render individual resume details
const ResumeDetails = withCollapse(({ resume, onEdit, onPreview }) => (
    <div key={resume.uniqueId} style={resumeItemStyle}>
        <h3>
            {resume.introduction}
            <CustomButton onClick={() => onEdit(resume)}> Edit </CustomButton>
            <CustomButton onClick={() => { alert('Copy functionality will be added soon') }}> Copy </CustomButton>
            <CustomButton onClick={() => onPreview(resume)}> Preview </CustomButton>
        </h3>
        {/* <p style={{ whiteSpace: 'pre-wrap' }}>
            <b>Summary </b>: {resume.processedDetails?.metadata?.summarizedIntroduction || ''}
            {resume.summary}
        </p> */}

        <ToggleablePanel title="Summarized Introduction" showContent={true}>
            <p style={{ whiteSpace: 'pre-wrap' }}>
                <b>Summary </b>: {resume.processedDetails?.metadata?.summarizedIntroduction || ''}
                {/* {resume.summary} */}
            </p>
        </ToggleablePanel>

        <JSONDataViewer metadata={{ processedDetails: resume.processedDetails, resume }} title={"resume"} />

        {/* <p>{resume.summary}</p> */}
        {/* <HTMLDataViewer style={companyItemStyle} htmlText={resume.summary} /> */}

        {/* <MetadataExtractor rawText={resume.summary} style={companyItemStyle} /> */}
        <CustomCollapse
            style={{ border: "1px solid #ccc", padding: "5px", borderRadius: "10px" }}
            headerText="Preview Raw metadata object"
        >
            <TextRenderer rawText={JSON.stringify(resume.processedDetails, null, 2)} showRadioButtons={false} />
        </CustomCollapse>

        <CustomCollapse
            style={{ border: "1px solid #ccc", padding: "5px", borderRadius: "10px" }}
            headerText="Preview metadata object with DynamicDataRenderer"
        >
            <DynamicDataRenderer data={resume.processedDetails?.metadata} />
        </CustomCollapse>


        {/* <div style={companyWidgetStyle}>
            <h4>Companies</h4>
            {
                resume.companies && resume.companies.length > 0
                    ? resume.companies.map((company) => (
                        <CompanyDetails htmlText={company.name} key={company.uniqueId} company={company} />
                    ))
                    : <span>No Companies configured yet!</span>
            }
        </div> */}

        <CustomCollapse style={companyWidgetStyle} headerText="Companies">

            {
                resume.companies && resume.companies.length > 0
                    ? resume.companies.map((company) => (
                        <CompanyDetails htmlText={company.name} key={company.uniqueId} company={company} />
                    ))
                    : <span>No Companies configured yet!</span>
            }

        </CustomCollapse>


        <CustomCollapse headerText="Educations" style={educationWidgetStyle}>
            {/* <h4>Educations</h4> */}
            {
                resume.educations && resume.educations.length > 0
                    ? resume.educations.map((education) => (
                        <EducationDetails htmlText={education.name} key={education.uniqueId} education={education} />
                    ))
                    : <span>No Educations configured yet!</span>
            }
        </CustomCollapse>

    </div>
));

export default ResumeDetails;