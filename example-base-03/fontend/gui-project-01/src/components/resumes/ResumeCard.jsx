import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import {
    setRefreshResumeList,
    setSelectedResumeId,
} from "../../common/redux/resumeSlice";
import CustomButton from "../../common/components/CustomButton";
import { isNonEmptyArray } from "../../utils/validation-utils";
import HoverActions from "../../common/components/HoverActions";

const styles = {
    container: {
        border: "1px solid #ddd",
        padding: "10px",
        marginBottom: "10px",
    },
    errorText: {
        color: "red",
    },
    boldText: {
        fontWeight: "bold",
    },
};

const ListSection = ({ title, items, renderItem, errorMessage }) => (
    <div style={styles.container}>
        <span style={styles.boldText}>{title}</span>
        {isNonEmptyArray(items) ? (
            items.map(renderItem)
        ) : (
            <span style={styles.errorText}>{errorMessage}</span>
        )}
    </div>
);

const ResumeCard = ({ selectedResume: resume }) => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const location = useLocation();
    const { state } = location;
    const [selectedResume, setSelectedResume] = useState(resume);

    useEffect(() => {
        if (state) {
            setSelectedResume(state);
        }
    }, [state]);

    useEffect(() => {
        if (id) {
            dispatch(setSelectedResumeId(id));
        }
    }, [id, dispatch]);

    if (!selectedResume) {
        return <>Please provide valid selectedResume data</>;
    }

    const { introduction, processedDetails, companies, educations } =
        selectedResume;
    const metadata = processedDetails?.metadata;
    const summarizedIntroduction = metadata?.summarizedIntroduction;

    const ProjectItem = ({ project }) => (
        <div key={project.uniqueId}>{project.name}</div>
    );

    return (
        <div>
            <CustomButton onClick={() => dispatch(setRefreshResumeList(true))}>
                Refresh List
            </CustomButton>
            <div>
                <span style={styles.boldText}>Introduction:</span> {introduction} <br />
                <HoverActions />
            </div>
            <ListSection
                title="Summarized Introduction:"
                items={summarizedIntroduction}
                renderItem={(summ, idx) => <div key={idx}>{summ}</div>}
                errorMessage="No valid metadata found in this resume configuration"
            />
            <ListSection
                title="Companies:"
                items={companies}
                renderItem={({ uniqueId, name, projects }) => (
                    <div key={uniqueId}>
                        <p>{name}</p>
                        <ListSection
                            title="Projects:"
                            items={projects}
                            renderItem={(project) => (
                                <ProjectItem key={project.uniqueId} project={project} />
                            )}
                            errorMessage="No valid projects found in this company configuration"
                        />
                    </div>
                )}
                errorMessage="No valid companies found in this resume configuration"
            />
            <ListSection
                title="Educations:"
                items={educations}
                renderItem={({ uniqueId, name }) => <div key={uniqueId}>{name}</div>}
                errorMessage="No valid educations found in this resume configuration"
            />
        </div>
    );
};

export default ResumeCard;
