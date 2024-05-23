import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_RESUMES, GET_RESUMES_FOR_LIST } from "../../common/gql/mutations";
import ContainerComponent from "../../common/components/ContainerComponent";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    selectRefreshResumeList,
    selectSelectedResumeId
} from "../../common/redux/resumeSlice";

const styles = {
    list: {
        listStyle: "none",
        margin: 0,
        paddingLeft: "20px",
    },
    listItem: {
        marginBottom: "5px",
        marginTop: "10px",
    },
    selectedResume: {
        color: "blue",
        fontSize: "20px",
        fontWeight: "bold",
    },
    rightSection: {
        paddingLeft: "20px",
    }
};

const ResumeList = () => {
    const navigate = useNavigate();
    const refreshResumeList = useSelector(selectRefreshResumeList);
    const selectedResumeId = useSelector(selectSelectedResumeId);

    const { loading, error, data } = useQuery(GET_RESUMES);
    const [resumes, setResumes] = useState([]);
    const [selectedResume, setSelectedResume] = useState(null);

    useEffect(() => {
        if (data?.getAllResumes) {
            setResumes(data.getAllResumes);
            if (selectedResumeId) {
                const selRes = data.getAllResumes.find(r => r.uniqueId === selectedResumeId) || null;
                if (selRes) {
                    setSelectedResume(selRes);
                }
            }
        }
    }, [data, selectedResumeId]);

    const showResumeDetails = (res) => {
        if (res) {
            setSelectedResume(res);
            navigate(`/resumes/${res.uniqueId}`, { state: res });
        }
    };

    return (
        <div>
            {loading && <p>Loading Resumes...</p>}
            {error && <p>Error fetching resumes: {error.message}</p>}

            {`refreshResumeList : ${refreshResumeList}`}

            <ContainerComponent
                header={()=> <div style={{wordBreak:'break-all'}}><b>Upsert and Validation: Development in Progress</b></div>}
                leftSection={() => (
                    <ul style={styles.list}>
                        {resumes.map(({ uniqueId, introduction, summary, processedDetails, companies, educations }) => (
                            <li key={uniqueId} style={styles.listItem}>
                                <span
                                    style={selectedResume?.uniqueId === uniqueId ? styles.selectedResume : {}}
                                    onClick={() => showResumeDetails({ uniqueId, introduction, summary, processedDetails, companies, educations })}
                                >
                                    {introduction}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
                rightSection={() => (
                    <div style={styles.rightSection}>
                        <p>Outlet wala section</p>
                        <div>
                            <Outlet />
                        </div>
                    </div>
                )}
            />
        </div>
    );
};

export default ResumeList;
