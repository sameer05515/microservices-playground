import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_RESUMES } from "../../../../common/gql/mutations";
import { ItemType } from "../validations-v2/validation-util";
import { validateDataForType } from "../validations-v2/util";
import AnalyticsReport, {
    AnalyticsReportType,
} from "../../sub-components/AnalyticsReportV2";

const useResumeService = () => {
    const {
        loading,
        error,
        data: getAllResumesResponse,
        refetch,
    } = useQuery(GET_RESUMES);

    const [selectedNode, setSelectedNode] = useState(null);

    const { selectedNodeValidationResult } = useMemo(() => {
        // let validData = false;
        if (selectedNode) {
            const { validData, messages } = validateDataForType(
                selectedNode,
                selectedNode.itemType
            );
            return {
                selectedNodeValidationResult: {
                    validData: validData,
                    messages: messages,
                },
            };
        }

        return { selectedNodeValidationResult: { validData: false, messages: [] } };
    }, [selectedNode]);

    const { processedData, allResumesData } = useMemo(() => {
        let processedData = [];
        let allResumesData = [];
        if (
            getAllResumesResponse?.getAllResumes &&
            Array.isArray(getAllResumesResponse?.getAllResumes)
        ) {
            allResumesData = getAllResumesResponse.getAllResumes;
            processedData = getAllResumesResponse.getAllResumes.map((r) => {
                const res = {
                    uniqueId: r.uniqueId,
                    name: r.introduction,
                    itemType: ItemType.RESUME,
                    processedDetails: r.processedDetails,
                    children:
                        r.companies?.map((c) => {
                            const comp = {
                                uniqueId: c.uniqueId,
                                name: c.name,
                                itemType: ItemType.COMPANY,
                                processedDetails: c.processedDetails,
                                children:
                                    c.projects?.map((p) => ({
                                        uniqueId: p.uniqueId,
                                        name: p.name,
                                        itemType: ItemType.PROJECT,
                                        children: [],
                                        processedDetails: p.processedDetails,
                                    })) || [],
                            };
                            return comp;
                        }) || [],
                };
                return res;
            });
        }
        return { processedData, allResumesData };
    }, [getAllResumesResponse]);

    const renderDetailsSection = () => {
        if (!selectedNode) {
            return (
                <>
                    All resumes analytics <br />
                    like, total resume, what is missing. any error, any warning <br />
                    <AnalyticsReport
                        analyticsReportType={AnalyticsReportType.ALL_RESUMES}
                        data={processedData}
                    />
                </>
            );
        } else if (selectedNode.itemType === ItemType.RESUME) {
            return (
                <>
                    Fetch and show selected resume analytics <br />
                    like,resume details, total company, what is missing. any error, any
                    warning <br />
                    <AnalyticsReport
                        analyticsReportType={AnalyticsReportType.SELECTED_RESUME}
                        data={selectedNode}
                    />
                </>
            );
        } else if (selectedNode.itemType === ItemType.COMPANY) {
            return (
                <>
                    Fetch and show selected company analytics <br />
                    like,company details, total projects, what is missing. any error, any
                    warning <br />
                    <AnalyticsReport
                        analyticsReportType={AnalyticsReportType.SELECTED_COMPANY}
                        data={selectedNode}
                    />
                </>
            );
        } else if (selectedNode.itemType === ItemType.PROJECT) {
            return (
                <>
                    Fetch and show selected project analytics <br />
                    like,project details, what is missing. any error, any warning <br />
                    <AnalyticsReport
                        analyticsReportType={AnalyticsReportType.SELECTED_PROJECT}
                        data={selectedNode}
                    />
                </>
            );
        }
    };

    return {
        nodeSelectionInfo: {
            selectedNode,
            setSelectedNode,
            selectedNodeValidationResult,
            renderDetailsSection,
        },
        getResumesGQLResponse: {
            refetch,
            loading,
            error,
            processedData,
            allResumesData,
        },
    };
};

export default useResumeService;
