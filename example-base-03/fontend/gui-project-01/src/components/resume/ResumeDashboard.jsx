import { useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import CustomButton from "../../common/components/CustomButton";
import { ICON_NAMES } from "../../common/utilities/constants";
import { GET_RESUMES } from "../../common/gql/mutations";
import { handleDownloadJSON as downloadJson } from "../../common/utilities/utils";
import ResumeForm from "./forms/ResumeForm";

import ResumeDetails from "./views/ResumeDetails";
import ResumePreview from "./views/ResumePreview";

const ResumeDashboard = () => {
    // Use useQuery hook to execute the GET_RESUMES query
    const { loading, error, data, refetch } = useQuery(GET_RESUMES);

    // State to store list of resumes
    const [resumes, setResumes] = useState([]);
    const [editing, setEditing] = useState(false);
    const [preview, setPreview] = useState(false);
    const [selectedResume, setSelectedResume] = useState(null);

    // Update resumes state when data changes
    useEffect(() => {
        if (data && data.getAllResumes) {
            setResumes(data.getAllResumes);
        }
    }, [data]);

    // Function to add a new resume to the list
    const addResume = (newResume) => {
        handleCancel();
        //setResumes([...resumes, newResume]);
        handleRefresh();
    };

    // Function to handle refreshing the data
    const handleRefresh = () => {
        refetch();
    };

    // Function to handle editing a resume
    const handleEdit = (editedResume) => {
        // Populate the edited resume in the form for editing
        // You can set the state or pass the resume to the ResumeForm component for editing
        setEditing(true);
        setSelectedResume(editedResume);
        console.log(
            "ResumeDashboard : handleEdit : Editing resume: ",
            editedResume
        );
    };

    const handleCancel = () => {
        setPreview(false);
        setEditing(false);
        setSelectedResume(null);
    };

    const onAdd = () => {
        setEditing(true);
    };

    // Function to download resumes data as JSON
    const downloadResumesAsJson = () => {
        downloadJson(resumes, "resumes.json");
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error fetching resumes: {error.message}</p>;

    return (
        <div>
            {!editing && !preview && (
                <>
                    <CustomButton iconName={ICON_NAMES.PLUS} onClick={() => onAdd()}>
                        Add
                    </CustomButton>
                    <CustomButton
                        iconName={ICON_NAMES.REFRESH}
                        onClick={() => handleRefresh()}
                    >
                        Refresh
                    </CustomButton>
                    <CustomButton onClick={() => downloadResumesAsJson()}>
                        Download JSON
                    </CustomButton>
                    
                </>
            )}

            {editing && (
                <ResumeForm
                    addResume={addResume}
                    resume={selectedResume}
                    onCancel={handleCancel}
                />
            )}

            {preview && (
                <ResumePreview resume={selectedResume} onCancel={handleCancel} />
            )}

            {!editing && !preview && (
                <>
                    <h2>All Resumes</h2>
                    {resumes.map((resume) => (
                        <ResumeDetails
                            headerText={resume.introduction}
                            key={resume.uniqueId}
                            resume={resume}
                            onEdit={handleEdit}
                            onPreview={(selectedResume) => {
                                setEditing(false);
                                setPreview(true);
                                setSelectedResume(selectedResume);
                                console.log(
                                    "ResumeDashboard : handleEdit : Previewing resume: ",
                                    resume
                                );
                            }}
                        />
                    ))}
                </>
            )}
        </div>
    );
};

export default ResumeDashboard;
