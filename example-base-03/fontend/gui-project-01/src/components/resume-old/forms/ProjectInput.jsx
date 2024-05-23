import React, { useState } from "react";
import CustomButton from "../../../common/components/CustomButton";
import { ICON_NAMES } from "../../../common/utilities/constants";
import {
    projectWidgetStyle as projectInputStyle,
    projectItemStyle
} from "../../../common/styles/ResumeComponentsStyle";
import ProjectModal from "../modal/ProjectModal";
import CustomCollapse from "../../../common/components/CustomCollapse";
import TextRenderer from "../../../common/components/TextRenderer";
import DynamicDataRenderer from "../../../common/components/DynamicDataRenderer";

const ProjectInput = ({ companyId, projects, onProjectChange }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    const handleAddNew = () => {
        setSelectedProject(null);
        setIsModalOpen(true);
        console.log("handleAddNew : " + isModalOpen);
    };

    const handleEdit = (project) => {
        setSelectedProject(project);
        setIsModalOpen(true);
        console.log("handleEdit : " + isModalOpen);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        console.log("handleCloseModal : " + isModalOpen);
    };

    const handleSaveProject = (formData) => {
        if (formData.uniqueId) {
            const updatedProjects = projects.map((company) =>
                company.uniqueId === formData.uniqueId ? formData : company
            );

            onProjectChange(companyId, updatedProjects);
            // Update existing Project
            console.log("Updated Projects:", updatedProjects);
        } else {
            // Add new Project
            const newProject = { ...formData };
            const updatedProjects = [...projects, newProject];
            onProjectChange(companyId, updatedProjects);
            console.log("Added Project:", newProject);
            console.log("Updated Projects:", updatedProjects);
        }
        setIsModalOpen(false);
    };
    return (
        <>
            {projects && projects.length >= 0 && (
                <div style={projectInputStyle}>
                    <h4>
                        Existing Projects:
                        <CustomButton
                            type="button"
                            iconName={ICON_NAMES.PLUS}
                            onClick={handleAddNew}
                        ></CustomButton>
                    </h4>

                    {projects.map((project, index) => (
                        <div
                            key={project.uniqueId ? project.uniqueId : `project_${index + 1}`}
                            style={projectItemStyle}
                        >
                            <strong>{project.name}</strong>: '{project.uniqueId}'
                            {project.uniqueId && (
                                <CustomButton type="button" onClick={() => handleEdit(project)}>
                                    Edit
                                </CustomButton>
                            )}


                            {/* <HTMLDataViewer style={companyItemStyle} htmlText={project.details}/> */}

                            {/* <MetadataExtractor rawText={project.details} style={companyItemStyle} /> */}
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
                                <DynamicDataRenderer data={project.processedDetails?.metadata} />
                            </CustomCollapse>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <ProjectModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSaveProject}
                    project={selectedProject}
                />
            )}
        </>
    );
};

export default ProjectInput;
