import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { setRefreshResumeList } from "../../common/redux/resumeSlice";
import CustomButton from "../../common/components/CustomButton";
import { isNonEmptyArray } from "../../utils/validation-utils";

const styles = {
    container: {
        border: '1px solid #ddd',
        padding: '10px',
        marginBottom: '10px',
    },
    errorText: {
        color: "red",
    },
    boldText: {
        fontWeight: "bold",
    },
};

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

    const { introduction, processedDetails, companies, educations } = selectedResume;
    const metadata = processedDetails?.metadata;
    const summarizedIntroduction = metadata?.summarizedIntroduction;

    return (
        <div>
            <CustomButton onClick={() => dispatch(setRefreshResumeList(true))}>
                Refresh List
            </CustomButton>
            <div>
                <span style={styles.boldText}>Introduction:</span> {introduction}
            </div>
            <div style={styles.container}>
                {isNonEmptyArray(summarizedIntroduction) ? (
                    summarizedIntroduction.map((summ, idx) => (
                        <div key={idx}>{summ}</div>
                    ))
                ) : (
                    <span style={styles.errorText}>
                        No valid metadata found in this resume configuration
                    </span>
                )}
            </div>
            <div style={styles.container}>
                {isNonEmptyArray(companies) ? (
                    companies.map(({ uniqueId, name, projects }) => (
                        <div key={uniqueId}>
                            <p>{name}</p>
                            <div style={styles.container}>
                                {isNonEmptyArray(projects) ? (
                                    projects.map(({ uniqueId, name }) => (
                                        <div key={uniqueId}>{name}</div>
                                    ))
                                ) : (
                                    <span style={styles.errorText}>
                                        No valid projects found in this company configuration
                                    </span>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <span style={styles.errorText}>
                        No valid companies found in this resume configuration
                    </span>
                )}
            </div>
            <div style={styles.container}>
                {isNonEmptyArray(educations) ? (
                    educations.map(({ uniqueId, name }) => (
                        <div key={uniqueId}>{name}</div>
                    ))
                ) : (
                    <span style={styles.errorText}>
                        No valid educations found in this resume configuration
                    </span>
                )}
            </div>
        </div>
    );
};

export default ResumeCard;
