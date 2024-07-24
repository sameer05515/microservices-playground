import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_RESUMES_FOR_LIST } from "../../common/gql/mutations";
import ContainerComponent from "../../common/components/ContainerComponent";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    selectRefreshResumeList,
    selectSelectedResumeId
} from "../../common/redux/resumeSlice";

const ResumeList = () => {
    const navigate = useNavigate();
    // const dispatch = useDispatch();
    const refreshResumeList = useSelector(selectRefreshResumeList);
    const selectedResumeId = useSelector(selectSelectedResumeId);

    // Use useQuery hook to execute the GET_RESUMES query
    const { loading, error, data, refetch } = useQuery(GET_RESUMES_FOR_LIST);
    // State to store list of resumes
    const [resumes, setResumes] = useState([]);
    const [selectedResume, setSelectedResume] = useState(null);

    // Update resumes state when data changes
    useEffect(() => {
        if (data && data.getAllResumes) {
            setResumes(data.getAllResumes);
            if (selectedResumeId) {
                const selRes = data.getAllResumes.find(r => r.uniqueId === selectedResumeId) || null;
                if (selRes) {
                    setSelectedResume(() => ({ ...selRes }));
                }
            }
        }
    }, [data, selectedResumeId]);

    const showResumeDetails = (res) => {
        res && setSelectedResume(() => ({ ...res }));
        // dispatch(setRefreshResumeList(true));
        navigate(`${res.uniqueId}`, { state: res });
    };

    return (
        <div>
            {loading && <p>Loading Resumes...</p>}
            {error && <p>Error fetching resumes: {error.message}</p>}

            {`refreshResumeList : ${refreshResumeList}`}

            <ContainerComponent
                leftSection={() => (
                    <ul style={{ listStyle: "none", margin: 0, paddingLeft: "20px" }}>
                        {resumes &&
                            resumes.length > 0 &&
                            resumes.map(
                                ({
                                    uniqueId,
                                    introduction,
                                    summary,
                                    processedDetails,
                                    companies,
                                    educations,
                                }) => (
                                    <li
                                        key={uniqueId}
                                        style={{ marginBottom: "5px", marginTop: "10px" }}
                                    >
                                        <span
                                            style={
                                                selectedResume?.uniqueId === uniqueId
                                                    ? {
                                                        color: "blue",
                                                        fontSize: "20px",
                                                        fontWeight: "bold",
                                                    }
                                                    : {}
                                            }
                                            onClick={() =>
                                                showResumeDetails({
                                                    uniqueId,
                                                    introduction,
                                                    summary,
                                                    processedDetails,
                                                    companies,
                                                    educations,
                                                })
                                            }
                                        >
                                            {introduction}
                                        </span>
                                    </li>
                                )
                            )}
                    </ul>
                )}
                rightSection={() => (
                    <div style={{ paddingLeft: "20px" }}>
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
