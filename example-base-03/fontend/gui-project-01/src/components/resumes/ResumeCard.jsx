import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { setRefreshResumeList } from "../../common/redux/resumeSlice";
import CustomButton from "../../common/components/CustomButton";
import { isNonEmptyArray } from "../../utils/validation-utils";

const ResumeCard = ({ selectedResume: resume }) => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const location = useLocation();
    const state = location.state;
    const [selectedResume, setSelectedResume] = useState({ ...resume });
    // const {
    //     uniqueId,
    //     introduction,
    //     summary,
    //     processedDetails:{metadata},
    //     companies,
    //     educations,
    // }= selectedResume;
    useEffect(() => {
        state && setSelectedResume(() => ({ ...state }));
    }, [state]);
    return (
        <>
            {/* <pre style={{ textWrap: 'wrap' }}>Received State: {JSON.stringify(state)}</pre> */}
            {selectedResume ? (
                <div>
                    {/* <pre style={{ textWrap: 'wrap' }}>{JSON.stringify(selectedResume, null, 2)}</pre> */}
                    {selectedResume && (
                        <>
                            <CustomButton
                                onClick={() => dispatch(setRefreshResumeList(true))}
                            >
                                Refresh List
                            </CustomButton>
                            <div>
                                <b>Introduction</b>
                                {selectedResume.introduction}
                            </div>
                            <div>
                                {/* <pre style={{ textWrap: 'wrap' }}>{JSON.stringify(metadata, null, 2)}</pre> */}
                                {selectedResume.processedDetails?.metadata &&
                                    isNonEmptyArray(
                                        selectedResume.processedDetails.metadata
                                            .summarizedIntroduction
                                    ) &&
                                    selectedResume.processedDetails.metadata.summarizedIntroduction.map(
                                        (summ, idx) => <div key={idx}>{summ}</div>
                                    ) || <span style={{color:'red'}}>No valid metadata found in this resume configuration</span>}
                            </div>
                        </>
                    )}
                </div>
            ) : (
                <>Please provide valid selectedResume data</>
            )}
        </>
    );
};

export default ResumeCard;
