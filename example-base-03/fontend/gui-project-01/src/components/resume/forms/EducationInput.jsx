import React, { useState } from 'react';
import CustomButton from "../../../common/components/CustomButton";
import { ICON_NAMES } from "../../../common/utilities/constants";
// import MetadataExtractor from '../../../common/components/MetadataExtractor';
import {
    companyWidgetStyle as educationInputStyle,
    companyItemStyle as educationItemStyle,
} from "../../../common/styles/ResumeComponentsStyle";
import EducationModel from '../modal/EducationModel';
import CustomCollapse from '../../../common/components/CustomCollapse';
import TextRenderer from '../../../common/components/TextRenderer';
import DynamicDataRenderer from '../../../common/components/DynamicDataRenderer';

const EducationInput = ({ educations, onEducationChange }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEducation, setSelectedEducation] = useState(null);
    const handleAddNew = () => {
        setSelectedEducation(null);
        setIsModalOpen(true);
        console.log("handleAddNew : " + isModalOpen);
    };

    const handleEdit = (education) => {
        setSelectedEducation(education);
        setIsModalOpen(true);
        console.log("handleEdit : " + isModalOpen);
        console.log("handleEdit : education " + JSON.stringify(education));
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        console.log("handleCloseModal : " + isModalOpen);
    };

    const handleSaveEducation = (formData) => {
        if (formData.uniqueId) {
            const updatedEducations = educations.map((education) =>
                education.uniqueId === formData.uniqueId
                    ? { ...education, ...formData }
                    : education
            );

            onEducationChange(updatedEducations);
            // Update existing education
            console.log("Updated companies:", updatedEducations);
        } else {
            // Add new education
            const newEducation = { ...formData };
            const updatedEducations = [...educations, newEducation];
            onEducationChange(updatedEducations);
            console.log("Added education:", newEducation);
            console.log("Updated educations:", updatedEducations);
        }
        setIsModalOpen(false);
    };
    return (
        <>
            {educations.length >= 0 && (
                <div style={educationInputStyle}>
                    <h4>
                        Existing Educations:
                        <CustomButton
                            type="button"
                            iconName={ICON_NAMES.PLUS}
                            onClick={handleAddNew}
                        ></CustomButton>
                    </h4>

                    {educations.map((company, index) => (
                        <div
                            key={company.uniqueId ? company.uniqueId : `company_${index + 1}`}
                            style={educationItemStyle}
                        >
                            <strong>{company.name}</strong>: '{company.uniqueId}'
                            {company.uniqueId && (
                                <CustomButton type="button" onClick={() => handleEdit(company)}>
                                    Edit
                                </CustomButton>
                            )}

                            {/* <HTMLDataViewer style={educationItemStyle} htmlText={company.details}/> */}
                            {/* <MetadataExtractor rawText={company.details} style={educationItemStyle} /> */}
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
                                <DynamicDataRenderer data={company.processedDetails?.metadata} />
                            </CustomCollapse>
                            {/* {company.uniqueId && (
                                <ProjectInput
                                    projects={company.projects ? company.projects : []}
                                    onProjectChange={handleProjectChange}
                                    companyId={company.uniqueId}
                                />
                            )} */}
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <EducationModel
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSaveEducation}
                    education={selectedEducation}
                />
            )}
        </>
    )
}

export default EducationInput