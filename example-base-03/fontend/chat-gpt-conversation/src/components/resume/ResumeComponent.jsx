import React, { useEffect, useState } from 'react';
// import { fetchGraphQL } from '../../../js/utils/graphqlHelperUtility';
import { idUtility } from './globalHelperUtility';

// GraphQL Fetch Function
const fetchGraphQL = async (query, variables = {}) => {
    try {
        const response = await fetch("http://localhost:4000/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query, variables }),
        });

        const responseBody = await response.json();

        if (!response.ok || responseBody.errors) {
            const errorMessage = responseBody.errors
                ? responseBody.errors.map((error) => error.message).join(", ")
                : response.statusText;
            throw new Error(`GraphQL error: ${errorMessage}`);
        }

        return responseBody.data;
    } catch (error) {
        console.error("GraphQL error:", error);
        throw error;
    }
};

const variables = { uniqueId: '0f20819b-c89e-4bdc-8613-5a9a99445533' };

const ResumeComponent = () => {
    const [resumeData, setResumeData] = useState(null);
    
    
    useEffect(() => {
        const query = `
            query GetResume($uniqueId: String!) {
                getResume(uniqueId: $uniqueId) {
                    uniqueId
                    introduction
                    processedDetails {
                        metadata
                        textType
                    }
                    companies {
                        name
                        processedDetails {
                            metadata
                            textType
                        }
                        projects {
                            name
                            processedDetails {
                                metadata
                                textType
                            }
                            uniqueId
                        }
                        uniqueId
                    }
                    educations {
                        uniqueId
                        name
                        processedDetails {
                            metadata
                            textType
                        }
                    }
                }
            }
        `;
        
        fetchGraphQL(query, variables)
            .then(data => setResumeData(data))
            .catch(error => console.error(error));
    }, []);
    
    const wrapInStrong = (text) => <strong>{text}</strong>;
    const wrapInItalic = (text) => <i>{text}</i>;

    const getNewId = () => idUtility.generateId({ length: 20, prefix: "" });

    const createStyledAnchor = (href, text) => (
        <a href={href} style={{ textDecoration: 'none', color: 'black', cursor: 'pointer' }}>
            {text}
        </a>
    );

    const createBulletedDiv = (title, items) => (
        <div id={getNewId()} style={{ marginTop: '10px' }}>
            <strong>{title}</strong>
            <div style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                {items.map((item, index) => <div key={index}>{item}</div>)}
            </div>
        </div>
    );

    const getGeneralInfoDiv = (metadata) => {
        const { name, contactNumbers, emails, lastDesignation, totalExperience } = metadata;

        return (
            <div id={getNewId()} style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", borderRadius: "8px", gap: "250px" }}>
                <div id={getNewId()} style={{ flex: "1", padding: "10px", borderRadius: "8px" }}>
                    <h2>{name}</h2>
                    <p>{lastDesignation.toUpperCase()}</p>
                </div>
                <div id={getNewId()} style={{ flex: "1", padding: "10px", borderRadius: "8px" }}>
                    <p>{wrapInStrong("Phone:")} {wrapInItalic(contactNumbers?.[0])}</p>
                    <p>{wrapInStrong("Email:")} {wrapInItalic(emails?.[0])}</p>
                    <p>{wrapInStrong("Total Experience:")} {wrapInItalic(totalExperience)}</p>
                    <p>{wrapInStrong("Location:")} Faridabad, INDIA</p>
                </div>
            </div>
        );
    };

    const getKeySkillsDiv = (keySkills) => (
        createBulletedDiv('Key skills', keySkills.map(({ stream, duration }) => `${wrapInStrong(stream)} for ${duration}`))
    );

    const getCertificationsDiv = (certifications) => (
        createBulletedDiv('Certifications:', certifications.map(({ name, provider, url }) => createStyledAnchor(url, `${wrapInStrong(name)} by ${wrapInItalic(provider)}`)))
    );

    const getLanguagesDiv = (languages) => (
        createBulletedDiv('Languages:', languages.map((language) => language))
    );

    const getHobbiesDiv = (hobbies) => (
        createBulletedDiv('Hobbies:', hobbies.map((hobby) => hobby))
    );

    const getProfileSummaryDiv = (profileSummary) => (
        createBulletedDiv('Profile Summary:', profileSummary.map((summaryPoint) => summaryPoint))
    );

    const getWorkExperienceDiv = (workExperiences) => (
        createBulletedDiv('Work Experience:', workExperiences
            .filter(({ processedDetails: { metadata } }) => !metadata?.shouldHide)
            .sort((a, b) => b.processedDetails?.metadata?.order - a.processedDetails?.metadata?.order)
            .map(({ name, processedDetails: { metadata } }) => (
                <div key={getNewId()} style={{ marginBottom: '5px', marginTop: '10px' }}>
                    <div>{wrapInItalic(wrapInStrong(metadata.lastDesignation.toUpperCase()))} - {metadata.overAllTenure}</div>
                    <div>{wrapInItalic(name)}</div>
                    <div>{wrapInStrong('Projects:')} {metadata.projects?.join(', ')}</div>
                    <div>{wrapInStrong('Tech Stack used:')} 
                        <ul style={{ margin: 0, paddingLeft: '20px' }}>
                            {metadata.techStack?.map((tech, index) => <li key={index}>{tech}</li>)}
                        </ul>
                    </div>
                    <div>{wrapInStrong('Roles and Responsibilities:')} 
                        <ul style={{ margin: 0, paddingLeft: '20px' }}>
                            {metadata.highlights?.map((highlight, index) => <li key={index}>{highlight}</li>)}
                        </ul>
                    </div>
                </div>
            )))
    );

    const getEducationDiv = (educations) => (
        createBulletedDiv('Education:', educations.map(({ name, processedDetails: { metadata } }) => (
            <div key={getNewId()} style={{ marginBottom: '5px', marginTop: '10px' }}>
                <div>{wrapInStrong(name)}</div>
                <div>{wrapInStrong('Institution:')} - {metadata.institution}</div>
                <div>{wrapInStrong('Session:')} - {metadata.session}</div>
                <div>{wrapInStrong('University:')} - {metadata.university}</div>
                <div>{wrapInStrong('Grade:')} - {metadata.grade}</div>
            </div>
        )))
    );

    const getMainInfoDiv = () => {
        if (!resumeData) return null;

        const { processedDetails: { metadata }, companies, educations } = resumeData.getResume;

        return (
            <div id={getNewId()} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {getGeneralInfoDiv(metadata)}
                {getKeySkillsDiv(metadata.expertises)}
                {getCertificationsDiv(metadata.certifications)}
                {getLanguagesDiv(metadata.languagesKnown)}
                {getHobbiesDiv(metadata.hobbies)}
                {getProfileSummaryDiv(metadata.summarizedIntroduction)}
                {getWorkExperienceDiv(companies)}
                {getEducationDiv(educations)}
            </div>
        );
    };

    return (
        <div id="resume-container">
            {getMainInfoDiv()}
        </div>
    );
};

export default ResumeComponent;
