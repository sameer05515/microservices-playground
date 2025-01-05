import React, { useEffect, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import {
    setRefreshResumeList,
    setSelectedResumeId,
} from "../../common/redux/resumeSlice";
import CustomButton from "../../common/components/CustomButton";
import HoverActions from "../../common/components/hover-actions/HoverActions";
import PersonalDetailsCard from "./sub-components/PersonalDetailsCard";
import ListSection, { renderListSection } from "../../common/components/list-section/ListSection";
import FlexContainer, { FlexItem } from "../../common/components/FlexContainer";

const styles = {
    boldText: { fontWeight: "bold" },
};

const ResumeCard = ({ selectedResume: initialResume }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const dispatch = useDispatch();
    const { state } = useLocation();
    const [selectedResume, setSelectedResume] = useState(initialResume);

    // Update selectedResume from state
    useEffect(() => {
        if (state) setSelectedResume(state);
    }, [state]);

    // Set selected resume ID
    useEffect(() => {
        if (id) dispatch(setSelectedResumeId(id));
    }, [id, dispatch]);

    if (!selectedResume) return <>Please provide valid selectedResume data</>;

    // Navigate to a given path with optional state
    const navigateToPath = (path, state) => navigate(path, { state });

    // Destructure resume data
    const {
        introduction,
        processedDetails: { metadata = {} } = {},
        companies = [],
        educations = [],
    } = selectedResume;
    const {
        summarizedIntroduction = [],
        languagesKnown = [],
        expertises = [],
        hobbies = [],
        certifications = [],
        personalDetails = [],
        degree = "NA",
        lastDesignation = "NA",
        totalExperience = "NA",
    } = metadata;

    const ProjectItem = ({ project, companyUID }) => (
        <div>
            <span
                title="View Project details"
                onClick={() => navigateToPath(`/resumes/${selectedResume.uniqueId}/${companyUID}/${project.uniqueId}`, { project })}
                style={{ cursor: "pointer" }}
            >
                {project.name}
            </span>
        </div>
    );

    const CompanyItem = ({ company }) => (
        <FlexContainer
            customStyle={{ border: "1px solid #ddd", alignItems: "center", textAlign: "center" }}
            isHorizontal
        >
            <FlexItem flex={1}>
                <span
                    title="View company details"
                    onClick={() => navigateToPath(`/resumes/${selectedResume.uniqueId}/${company.uniqueId}`, { company })}
                    style={{ cursor: "pointer" }}
                >
                    {company.name}
                </span>
            </FlexItem>
            <FlexItem flex={1}>
                <ListSection
                    items={company.projects}
                    renderItem={(project) => (
                        <ProjectItem key={project.uniqueId} companyUID={company.uniqueId} project={project} />
                    )}
                    errorMessage="No valid projects found in this company configuration"
                />
            </FlexItem>
        </FlexContainer>
    );

    // const renderListSection = (title, items, renderItem, errorMessage) => (
    //     <ListSection
    //         title={title}
    //         items={items}
    //         renderItem={renderItem}
    //         errorMessage={errorMessage}
    //     />
    // );

    return (
        <div>
            <CustomButton onClick={() => dispatch(setRefreshResumeList(true))}>
                Refresh List
            </CustomButton>
            <div>
                <span style={styles.boldText}>Introduction:</span> {introduction} <br />
                <HoverActions />
            </div>

            <PersonalDetailsCard
                title="Personal Details"
                personalDetails={{ ...personalDetails, degree, lastDesignation, totalExperience }}
            />

            {renderListSection("Summarized Introduction:", summarizedIntroduction,
                (summ, idx) => <div key={idx}>- {summ}</div>,
                "No valid metadata found in this resume configuration"
            )}

            {renderListSection("Known Languages:", languagesKnown,
                (lang, idx) => <span key={idx}>{lang}{idx < languagesKnown.length - 1 ? "," : ""} </span>,
                "No valid metadata found in this resume configuration"
            )}

            {renderListSection("Expertize In:", expertises,
                ({ stream, duration }, idx) => <div key={idx}>- <b>{stream}</b> - {duration}</div>,
                "No valid metadata found in this resume configuration"
            )}

            {renderListSection("Hobbies:", hobbies,
                (hobby, idx) => <div key={idx}>- {hobby}</div>,
                "No valid metadata found in this resume configuration"
            )}

            {renderListSection("Certifications:", certifications,
                ({ name, provider, url }, idx) => (
                    <div key={idx}>
                        - <a href={url} target="_blank" rel="noopener noreferrer">{name}</a>, by {provider}
                    </div>
                ),
                "No valid metadata found in this resume configuration"
            )}

            {renderListSection("Companies And Projects:", companies,
                (company) => <CompanyItem key={company.uniqueId} company={company} />,
                "No valid companies found in this resume configuration"
            )}

            {renderListSection("Educations:", educations,
                ({ uniqueId, name }) => <div key={uniqueId}>{name}</div>,
                "No valid educations found in this resume configuration"
            )}
        </div>
    );
};

export default ResumeCard;
