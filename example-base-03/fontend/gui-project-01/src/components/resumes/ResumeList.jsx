import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_RESUMES_FOR_LIST } from '../../common/gql/mutations';

const ResumeList = () => {
    // Use useQuery hook to execute the GET_RESUMES query
    const { loading, error, data, refetch } = useQuery(GET_RESUMES_FOR_LIST);
    // State to store list of resumes
    const [resumes, setResumes] = useState([]);

    // Update resumes state when data changes
    useEffect(() => {
        if (data && data.getAllResumes) {
            setResumes(data.getAllResumes);
        }
    }, [data]);

    const showResumeDetails= (res)=>{
        
    }

    return (
        <div>
            {loading && <p>Loading Resumes...</p>}
            {error && <p>Error fetching resumes: {error.message}</p>}

            <ul style={{ listStyle: 'none', margin: 0, paddingLeft: '20px' }}>
                {resumes && resumes.length > 0 &&
                    resumes.map(({ uniqueId, introduction, summary }) => (
                        <li key={uniqueId} style={{ marginBottom: '5px', marginTop: '10px' }}>
                            <span onClick={() => showResumeDetails({ uniqueId, introduction, summary })}>
                                <b>Introduction: </b>{introduction}
                            </span>
                        </li>
                    ))}
            </ul>
        </div>
    )
}

export default ResumeList