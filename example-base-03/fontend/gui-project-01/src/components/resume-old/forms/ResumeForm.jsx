import { useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import CustomButton from "../../../common/components/CustomButton";
// import EditorModal from "../../../common/components/EditorModal";
import { ICON_NAMES } from "../../../common/utilities/constants";
import MetadataExtractor from "../../../common/components/MetadataExtractor";
import { UPSERT_RESUME } from "../../../common/gql/mutations"; // Import the mutation from the mutations file;
import {
    companyItemStyle,
    resumeItemStyle as resumeFormStyle,
} from "../../../common/styles/ResumeComponentsStyle";
import CompanyInput from "./CompanyInput";
import EducationInput from "./EducationInput";
import CustomCollapse from "../../../common/components/CustomCollapse";
import DynamicDataRenderer from "../../../common/components/DynamicDataRenderer";

const labelStyle = {
    width: "25%", // Set label width to 25%
    fontWeight: "bold", // Make label text bold
};

const pairedComponentStyle = {
    width: "75%", // Set paired component width to 75%
};

const ResumeForm = ({ addResume, resume, onCancel }) => {
    // State for form inputs
    const [formData, setFormData] = useState({
        introduction: "",
        summary: "",
        companies: [],
        educations: [],
        processedDetails: {},
    });
    const [processedDetailsMetadata, setProcessedDetailsMetadata] = useState({});

    // const [isModalOpen, setIsModalOpen] = useState(false);

    // Set initial form data if a resume is provided
    useEffect(() => {
        if (resume) {
            setFormData({
                uniqueId: resume.uniqueId || "",
                introduction: resume.introduction || "",
                summary: resume.summary || "",
                processedDetails: resume.processedDetails
                    ? {
                        rawText: resume.processedDetails.rawText || "",
                        textType: "yaml",
                        metadata: resume.processedDetails.metadata || {},
                    }
                    : null,
                companies:
                    resume.companies.map((company) => ({
                        uniqueId: company.uniqueId || "",
                        name: company.name || "",
                        details: company.details || "",
                        processedDetails: company.processedDetails
                            ? {
                                rawText: company.processedDetails.rawText || "",
                                textType: "yaml",
                                metadata: company.processedDetails.metadata || {},
                            }
                            : null,
                        projects:
                            company.projects.map((project) => ({
                                uniqueId: project.uniqueId || "",
                                name: project.name || "",
                                details: project.details || "",
                                processedDetails: project.processedDetails
                                    ? {
                                        rawText: project.processedDetails.rawText || "",
                                        textType: "yaml",
                                        metadata: project.processedDetails.metadata || {},
                                    }
                                    : null,
                            })) || [],
                    })) || [], // Initialize companies with resume data
                educations:
                    resume.educations.map((education) => ({
                        uniqueId: education.uniqueId || "",
                        name: education.name || "",
                        details: education.details || "",
                        processedDetails: education.processedDetails
                            ? {
                                rawText: education.processedDetails.rawText || "",
                                textType: "yaml",
                                metadata: education.processedDetails.metadata || {},
                            }
                            : null,
                    })) || [], // Initialize educations with resume data
            });
        }
    }, [resume]);

    // Mutation hook for upserting a resume
    const [upsertResume] = useMutation(UPSERT_RESUME);

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Execute the mutation with form data
            const { data } = await upsertResume({
                variables: {
                    resume: {
                        ...formData,
                        processedDetails: {
                            rawText: formData.summary,
                            textType: "yaml",
                            metadata: processedDetailsMetadata || {},
                        },
                    },
                },
            });

            // Add the new or updated resume to the list
            addResume(data.upsertResume);

            // Reset form inputs
            setFormData({
                introduction: "",
                summary: "",
                companies: [],
                educations: [],
                processedDetails: {},
            });
        } catch (error) {
            console.error("Error creating or updating resume:", error);
        }
    };

    // Function to handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Function to handle changes in companies array from CompanyInput
    const handleCompanyChange = (updatedCompanies) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            companies: updatedCompanies,
        }));
    };

    // Function to handle changes in companies array from CompanyInput
    const handleEducationChange = (updatedEducations) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            educations: updatedEducations,
        }));
    };

    // Function to handle opening the modal
    // const handleOpenModal = () => {
    //     setIsModalOpen(true);
    // };

    // Function to handle closing the modal
    // const handleCloseModal = () => {
    //     setIsModalOpen(false);
    // };

    // Function to handle saving data from the modal
    // const handleSaveModalData = (data) => {
    //     setFormData({
    //         ...formData,
    //         summary: data,
    //     });
    //     setIsModalOpen(false);
    // };

    const handleExtractionDone = (response) => {
        console.log("error : " + response.error);
        console.log("metadata : " + JSON.stringify(response.metadata));
        // if(!response.error ){
        setProcessedDetailsMetadata((prev) => ({
            ...response.metadata,
        }));
        // }
        // console.log('processedDetailsMetadata : ' + JSON.stringify(processedDetailsMetadata));
    };

    return (
        <div style={resumeFormStyle}>
            <h3>{resume ? "Edit Resume" : "Add Resume"}</h3>
            {/* <pre>{JSON.stringify(formData, null, 2)}</pre> */}
            <div>
                <label htmlFor="introduction" style={labelStyle}>
                    Introduction:
                </label>
                <input
                    type="text"
                    id="introduction"
                    name="introduction"
                    value={formData.introduction}
                    onChange={handleInputChange}
                    style={pairedComponentStyle} // Apply paired component style
                />
            </div>
            <div>
                <label htmlFor="summary" style={labelStyle}>
                    Summary:
                </label>
                <textarea
                    id="summary"
                    name="summary"
                    value={formData.summary}
                    onChange={handleInputChange}
                    style={{ ...pairedComponentStyle, width: '100%', minHeight: '100px' }} // Apply paired component style
                ></textarea>
                {/* <div style={companyItemStyle}>{ReactHtmlParser(formData.summary)}</div> */}
                {/* <HTMLDataViewer style={companyItemStyle} htmlText={formData.summary}/> */}
                <MetadataExtractor
                    rawText={formData.summary}
                    style={companyItemStyle}
                    onExtractionDone={handleExtractionDone}
                />
                <CustomCollapse
                    style={{ border: "1px solid #ccc", padding: "5px", borderRadius: "10px" }}
                    headerText="Preview metadata object with DynamicDataRenderer"
                >
                    <DynamicDataRenderer data={formData.processedDetails?.metadata} />
                </CustomCollapse>
                {/* <CustomCollapse
                style={{ border: "1px solid #ccc", padding: "5px", borderRadius: "10px" }}
                headerText="Preview Raw metadata object"
              >
                <TextRenderer rawText={JSON.stringify(formData.processedDetails, null, 2)} showRadioButtons={false} />
              </CustomCollapse> */}
            </div>
            <CompanyInput
                companies={formData.companies}
                onCompanyChange={handleCompanyChange}
            />
            <EducationInput
                educations={formData.educations}
                onEducationChange={handleEducationChange}
            />
            <CustomButton
                type="submit"
                iconName={resume ? ICON_NAMES.EDIT : ICON_NAMES.SAVE}
                onClick={handleSubmit}
            >
                {resume ? "Update" : "Save"}
            </CustomButton>
            <CustomButton type="button" onClick={onCancel}>
                Cancel
            </CustomButton>

            {/* {isModalOpen && (
                <EditorModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSaveModalData}
                    textData={formData.summary}
                />
            )} */}
        </div>
    );
};

export default ResumeForm;
