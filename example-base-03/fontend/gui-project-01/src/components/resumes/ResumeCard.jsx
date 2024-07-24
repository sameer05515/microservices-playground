import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { setRefreshResumeList } from "../../common/redux/resumeSlice";
import CustomButton from "../../common/components/CustomButton";
import { isNonEmptyArray } from "../../utils/validation-utils";

const ResumeCard = ({ selectedResume: resume }) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { state } = location;
    const [selectedResume, setSelectedResume] = useState(resume);

    useEffect(() => {
        if (state) {
            setSelectedResume(state);
        }
    }, [state]);

    if (!selectedResume) {
        return <>Please provide valid selectedResume data</>;
    }

    const { introduction, processedDetails, companies, educations, } = selectedResume;
    const metadata = processedDetails?.metadata;
    const summarizedIntroduction = metadata?.summarizedIntroduction;

    return (
        <div>
            <CustomButton onClick={() => dispatch(setRefreshResumeList(true))}>
                Refresh List
            </CustomButton>
            <div>
                <b>Introduction:</b> {introduction}
            </div>
            <div style={{border: '1px solid #ddd',}}>
                {isNonEmptyArray(summarizedIntroduction) ? (
                    summarizedIntroduction.map((summ, idx) => (
                        <div key={idx}>{summ}</div>
                    ))
                ) : (
                    <span style={{ color: "red" }}>
                        No valid metadata found in this resume configuration
                    </span>
                )}
            </div>
            <div style={{border: '1px solid #ddd',}}>
                {isNonEmptyArray(companies) ? (
                    companies.map(({ uniqueId, name, projects }) => (
                        <div key={uniqueId}>
                            <p>{name}</p>
                            <div style={{border: '1px solid #ddd',}}>
                                {isNonEmptyArray(projects) ? (
                                    projects.map(({ uniqueId, name }) => (
                                        <div key={uniqueId}>{name}</div>
                                    ))
                                ) : (
                                    <span style={{ color: "red" }}>
                                        No valid projects found in this company configuration
                                    </span>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <span style={{ color: "red" }}>
                        No valid companies found in this resume configuration
                    </span>
                )}
            </div>

            <div style={{border: '1px solid #ddd',}}>
                {isNonEmptyArray(educations) ? (
                    educations.map(({ uniqueId, name }) => (
                        <div key={uniqueId}>{name}</div>
                    ))
                ) : (
                    <span style={{ color: "red" }}>
                        No valid educations found in this resume configuration
                    </span>
                )}
            </div>
        </div>
    );
};

export default ResumeCard;
