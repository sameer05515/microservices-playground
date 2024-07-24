import React, { useEffect, useState } from 'react';
import {
    resumeItemStyle
} from "../../../common/styles/ResumeComponentsStyle";
import CustomButton from '../../../common/components/CustomButton';
import CustomCollapse from '../../../common/components/CustomCollapse';
import DynamicDataRenderer from '../../../common/components/DynamicDataRenderer';
import TextRenderer from '../../../common/components/TextRenderer';
import { COLORS } from '../../../common/utilities/constants';
import { useQuery } from '@apollo/client';
import { GET_RESUME } from '../../../common/gql/mutations';
// import DynamicComponentRenderer from '../../../common/components/DynamicComponentRenderer';

const ResumePreview = ({ resume: providedResume, onCancel }) => {

    // State for form inputs
    const [resume, setResume] = useState({
        ...providedResume
    });

    // Set initial form data if a resume is provided
    // useEffect(() => {
    //     if (providedResume) {
    //         setResume({
    //             uniqueId: providedResume.uniqueId || "",
    //             introduction: providedResume.introduction || "",
    //             summary: providedResume.summary || "",
    //             processedDetails: providedResume.processedDetails
    //                 ? {
    //                     rawText: providedResume.processedDetails.rawText || "",
    //                     textType: "yaml",
    //                     metadata: providedResume.processedDetails.metadata || {},
    //                 }
    //                 : null,
    //             companies:
    //             providedResume.companies.map((company) => ({
    //                     uniqueId: company.uniqueId || "",
    //                     name: company.name || "",
    //                     details: company.details || "",
    //                     processedDetails: company.processedDetails
    //                         ? {
    //                             rawText: company.processedDetails.rawText || "",
    //                             textType: "yaml",
    //                             metadata: company.processedDetails.metadata || {},
    //                         }
    //                         : null,
    //                     projects:
    //                         company.projects.map((project) => ({
    //                             uniqueId: project.uniqueId || "",
    //                             name: project.name || "",
    //                             details: project.details || "",
    //                             processedDetails: project.processedDetails
    //                                 ? {
    //                                     rawText: project.processedDetails.rawText || "",
    //                                     textType: "yaml",
    //                                     metadata: project.processedDetails.metadata || {},
    //                                 }
    //                                 : null,
    //                         })) || [],
    //                 })) || [], // Initialize companies with resume data
    //             educations:
    //             providedResume.educations.map((education) => ({
    //                     uniqueId: education.uniqueId || "",
    //                     name: education.name || "",
    //                     details: education.details || "",
    //                     processedDetails: education.processedDetails
    //                         ? {
    //                             rawText: education.processedDetails.rawText || "",
    //                             textType: "yaml",
    //                             metadata: education.processedDetails.metadata || {},
    //                         }
    //                         : null,
    //                 })) || [], // Initialize educations with resume data
    //         });
    //     }
    // }, [providedResume]);

    // Inside your component
    const { loading, error, data, refetch } = useQuery(GET_RESUME, {
        variables: { uniqueId: resume?.uniqueId || '' } // Assuming resume is the object containing the uniqueId
    });

    const [selectedOption, setSelectedOption] = useState('');
    const [processedData, setProcessedData] = useState(null);
    const [filterLogic, setFilterLogic] = useState('');
    const [errorMessage, setErrorMessage] = useState("");
    const [applyFilter, setApplyFilter] = useState(false);
    const [lastExecutedfilterLogic, setLastExecutedFilterLogic] = useState('');
    const [isDataRefreshed, setIsDataRefreshed] = useState(false);





    // Update resumes state when data changes
    useEffect(() => {
        if (data && data.getResume) {
            setResume(data.getResume);
        }
    }, [data]);

    const handleOptionChange = (event) => {
        setSelectedOption((prev) => event.target.value);
        //handleOptionSelect();
    };

    const handleFilterLogicChange = (event) => {
        setFilterLogic(event.target.value);
    };

    useEffect(() => {
        if (applyFilter && filterLogic) {
            // Execute custom filtering logic
            try {
                const filteredData = eval(filterLogic);
                setProcessedData(filteredData);
                setApplyFilter(false);
                setLastExecutedFilterLogic(filterLogic);
                setErrorMessage("");
                setIsDataRefreshed(false);
            } catch (error) {
                setApplyFilter(false);
                console.error("Error executing filter logic:", error);
                setErrorMessage(`Error executing filter logic: ${error}`);
            }
        }
    }, [applyFilter, filterLogic]);

    const handleApplyFilter = () => {
        // if (filterLogic) {
        //     // Execute custom filtering logic
        //     try {
        //         const filteredData = eval(filterLogic);
        //         setProcessedData(filteredData);
        //     } catch (error) {
        //         console.error("Error executing filter logic:", error);
        //         setErrorMessage(`Error executing filter logic: ${error}`)
        //     }
        // }
        setApplyFilter(true);
    };


    const optionsMap = {
        SHOW_ALL_PROJECTS: 'Show all projects',
        SHOW_ALL_COMPANIES: 'Show all companies',
        SHOW_ALL_COMPANIES_WITH_RAW_PROCESSED_DETAILS: 'Show all companies with raw processed details',
        SHOW_ALL_COMPANIES_REFERENCES: 'Show all companies references',
        SHOW_PROJECTS_TECH_STACKS: 'Show Projects tech stacks',
        SHOW_RAW_RESUME: 'Show Raw Resume'
    };

    const renderOptions = () => {
        return Object.entries(optionsMap).map(([key, value]) => (
            <option key={key} value={key}>{value}</option>
        ));
    };

    const handleOptionSelect = () => {
        const optionValue = optionsMap[selectedOption];

        setIsDataRefreshed(false);
        switch (optionValue) {
            case optionsMap.SHOW_ALL_PROJECTS:
                setLastExecutedFilterLogic(`resume.companies.map(company => company.projects).flat()`)
                setProcessedData(resume.companies.map(company => company.projects).flat());
                break;
            case optionsMap.SHOW_ALL_COMPANIES:
                setLastExecutedFilterLogic(`resume.companies.map(company=>company)`)
                setProcessedData(resume.companies.map(company => company));
                break;
            case optionsMap.SHOW_ALL_COMPANIES_WITH_RAW_PROCESSED_DETAILS:
                setLastExecutedFilterLogic(`resume.companies.map((company) => ({
                    name: company.name,
                    metadata: company.processedDetails?.metadata || null
                }))`);
                setProcessedData(resume.companies.map((company) => ({
                    name: company.name,
                    metadata: company.processedDetails?.metadata || null
                })));
                break;
            case optionsMap.SHOW_ALL_COMPANIES_REFERENCES:
                setLastExecutedFilterLogic(`resume.companies.map((company) => ({
                    name: company.name,
                    overAllTenureWithDate: company.processedDetails?.metadata?.overAllTenureWithDate || null,
                    overAllTenure: company.processedDetails?.metadata?.overAllTenure || null,
                    lastDesignation: company.processedDetails?.metadata?.lastDesignation || null,
                    companyWebsiteURL: company.processedDetails?.metadata?.companyWebsiteURL || null,
                    employeeCode: company.processedDetails?.metadata?.lastEmployeeCode || null,
                    reasonForChangeActual: company.processedDetails?.metadata?.lastReasonForChange?.actual || null,
                    reasonForChangeForHR: company.processedDetails?.metadata?.lastReasonForChange?.forHR || null,
                    lastCTC: company.processedDetails?.metadata?.lastCTC || null,
                    projects: company.processedDetails?.metadata?.projects || null,
                    techStack: company.processedDetails?.metadata?.techStack || null,
                    highlights: company.processedDetails?.metadata?.highlights || null,
                    references: company.processedDetails?.metadata?.references || null
                }))`);
                setProcessedData(resume.companies.map((company) => ({
                    name: company.name,
                    overAllTenureWithDate: company.processedDetails?.metadata?.overAllTenureWithDate || null,
                    overAllTenure: company.processedDetails?.metadata?.overAllTenure || null,
                    lastDesignation: company.processedDetails?.metadata?.lastDesignation || null,
                    companyWebsiteURL: company.processedDetails?.metadata?.companyWebsiteURL || null,
                    employeeCode: company.processedDetails?.metadata?.lastEmployeeCode || null,
                    reasonForChangeActual: company.processedDetails?.metadata?.lastReasonForChange?.actual || null,
                    reasonForChangeForHR: company.processedDetails?.metadata?.lastReasonForChange?.forHR || null,
                    lastCTC: company.processedDetails?.metadata?.lastCTC || null,
                    projects: company.processedDetails?.metadata?.projects || null,
                    techStack: company.processedDetails?.metadata?.techStack || null,
                    highlights: company.processedDetails?.metadata?.highlights || null,
                    references: company.processedDetails?.metadata?.references || null
                })));
                break;
            case optionsMap.SHOW_PROJECTS_TECH_STACKS:
                //setProcessedData(resume.companies.map(company => company.projects.map(project => project.techStack)).flat());
                setLastExecutedFilterLogic(`resume.companies.map(company => company.projects.map(project => ({                    
                    projectName: project.name,
                    companyName: company.name,
                    companyTenure: company.processedDetails?.metadata?.overAllTenureWithDate || null,
                    projectTenure: project.processedDetails?.metadata?.tenure || null,
                    techStack: project.processedDetails?.metadata?.techStack || null
                }))).flat()`);
                setProcessedData(resume.companies.map(company => company.projects.map(project => ({
                    projectName: project.name,
                    companyName: company.name,
                    companyTenure: company.processedDetails?.metadata?.overAllTenureWithDate || null,
                    projectTenure: project.processedDetails?.metadata?.tenure || null,
                    techStack: project.processedDetails?.metadata?.techStack || null
                }))).flat());
                break;
            case optionsMap.SHOW_RAW_RESUME:
                setProcessedData(resume);
                break;
            default:
                setLastExecutedFilterLogic(`{
                    introduction: resume.introduction,
                    summarizedIntroduction: resume.processedDetails?.metadata?.summarizedIntroduction || null,
                    expertises: resume.processedDetails?.metadata?.expertises || null,
                    companies: resume.companies.map((company) => ({
                        name: \`\${company.name} - \${company.processedDetails?.metadata?.overAllTenureWithDate || null} - \${company.processedDetails?.metadata?.lastCTC || null}\`,
                        projects: company.processedDetails?.metadata?.projects || null,
                        techStack: company.processedDetails?.metadata?.techStack || null,
                        highlights: company.processedDetails?.metadata?.highlights || null,
                    }))
                }`);
                setProcessedData({
                    introduction: resume.introduction,
                    summarizedIntroduction: resume.processedDetails?.metadata?.summarizedIntroduction || null,
                    expertises: resume.processedDetails?.metadata?.expertises || null,
                    companies: resume.companies.map((company) => ({
                        name: `${company.name} - ${company.processedDetails?.metadata?.overAllTenureWithDate || null} - ${company.processedDetails?.metadata?.lastCTC || null}`,
                        projects: company.processedDetails?.metadata?.projects || null,
                        techStack: company.processedDetails?.metadata?.techStack || null,

                        highlights: company.processedDetails?.metadata?.highlights || null,
                    }))
                });
                console.log("No option selected");
                break;
        }
    };

    useEffect(() => {
        console.log("Processed data:", processedData);
    }, [processedData]);

    const handleRefresh = async () => {
        try {
            await refetch(); // Call the refetch function to refresh the resume data
            console.log("Resume data refreshed successfully.");
            setIsDataRefreshed(true);
        } catch (error) {
            console.error("Error refreshing resume data:", error);
            alert("Error refreshing resume data: Please see logs for details.");
            // Handle the error, e.g., display an error message to the user
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error fetching resumes: {error.message}</p>;


    return (
        <div style={resumeItemStyle}>

            <h3>ResumePreview for : {resume?.introduction}</h3>
            {/* {JSON.stringify(resume, null, 2)} */}

            <CustomButton type="button" onClick={handleRefresh}>
                Refresh
            </CustomButton>
            {
                isDataRefreshed && (
                    <span style={{ color: COLORS.DARK_ORANGE }}>
                        Data fetched successfully. Please re-apply criteria to see effect.
                    </span>
                )
            }

            <br />

            <select value={selectedOption} onChange={handleOptionChange}>
                <option value="">Select an option</option>
                {renderOptions()}
            </select>
            <CustomButton type="button" onClick={handleOptionSelect}>
                Apply
            </CustomButton>

            <CustomButton type="button" onClick={onCancel}>
                Back
            </CustomButton>

            <textarea
                value={filterLogic}
                onChange={handleFilterLogicChange}
                placeholder="Enter filter logic"
                style={{ width: '100%', minHeight: '100px' }}
            />
            <CustomButton type="button" onClick={handleApplyFilter}>
                Apply Filter
            </CustomButton>


            {
                lastExecutedfilterLogic &&
                //  <p>`Last executed Logic : ` <br /> {lastExecutedfilterLogic}</p>
                <CustomCollapse
                    style={{ border: "1px solid #ccc", padding: "5px", borderRadius: "10px" }}
                    headerText="Last executed Logic"
                >
                    <TextRenderer rawText={lastExecutedfilterLogic} showRadioButtons={false} />
                </CustomCollapse>
            }


            {
                errorMessage && (
                    <p style={{ color: COLORS.HOT_PINK }}>
                        {errorMessage}
                    </p>
                )
            }

            <CustomCollapse
                style={{ border: "1px solid #ccc", padding: "5px", borderRadius: "10px" }}
                headerText="Preview Raw metadata object"
            >
                <TextRenderer rawText={JSON.stringify(processedData, null, 2)} showRadioButtons={false} />
            </CustomCollapse>

            {
                processedData != null && <CustomCollapse
                    style={{ border: "1px solid #ccc", padding: "5px", borderRadius: "10px" }}
                    headerText="Preview metadata object with DynamicDataRenderer"
                >
                    <DynamicDataRenderer data={processedData} />
                </CustomCollapse>
            }


            {/* below code written for testing purpose. hence commenting till this is not fully prepared. */}
            {/* <CustomCollapse
                style={{ border: "1px solid #ccc", padding: "5px", borderRadius: "10px" }}
                headerText="Preview metadata object with DynamicComponentRenderer"
                initiallyCollapsed={false}
            >
                <DynamicComponentRenderer content={'<ul><li>One</li><li>Two</li></ul>'} />
                <DynamicComponentRenderer content={<MyFirstDataVisualization resume={resume}/>} />
            </CustomCollapse> */}




        </div>
    )
}

// const MyFirstDataVisualization=({resume})=>{
//     return(
//         <>
//         <label><b>Introduction: </b> {resume.introduction}</label>
//         </>
//     )
// }

export default ResumePreview;