import React from "react";
import { renderCard } from "../../common/components/custom-card/Card";
import CustomButton from "../../common/components/CustomButton";
import CustomCollapse from "../../common/components/CustomCollapse";
import { WithCCDynamicDataRenderer } from "../../common/components/DynamicDataRenderer";
import FlexContainer, { FlexItem } from "../../common/components/FlexContainer";
import JSONDataViewer from "../../common/components/JSONDataViewer";
import TextRenderer from "../../common/components/TextRenderer";
import Tree from "../../common/components/TreeViewer";
import { ICON_NAMES } from "../../common/utilities/constants";
import { camelCaseToTitleCase } from "../../utils/helper-utils";
import useResumeService from "./common/hooks/useResumeService";
import { WithCCValidationReport } from "./sub-components/ValidationReport";

const ResumeBase = () => {
    const {
        nodeSelectionInfo: {
            selectedNode,
            setSelectedNode,
            selectedNodeValidationResult: { validData, messages },
            renderDetailsSection,
        },
        getResumesGQLResponse: {
            refetch,
            loading,
            error,
            processedData: processedDataForTree,
            allResumesData,
        },
    } = useResumeService();

    // Function to handle refreshing the data
    const handleRefresh = () => {
        refetch();
    };

    if (loading) return <p>Loading Resumes...</p>;
    if (error) return <p>Error fetching resumes: {error.message}</p>;
    if (!processedDataForTree || processedDataForTree.length === 0) {
        return <p>No Resumes Found</p>;
    }

    return (
        <FlexContainer>
            <FlexContainer isHorizontal>
                <div>
                    <b>View and Analysis: Development in Progress</b>
                </div>
                <CustomButton
                    iconName={ICON_NAMES.REFRESH}
                    onClick={() => handleRefresh()}
                    title="Refresh"
                ></CustomButton>
            </FlexContainer>

            <FlexContainer isHorizontal>
                <FlexItem
                    flex={1}
                    customStyle={{ border: "1px solid #ddd", overflow: "auto" }}
                >
                    {processedDataForTree && (
                        <Tree
                            data={processedDataForTree}
                            renderNode={(node) => (
                                <span
                                    title={node.itemType}
                                    onClick={() => setSelectedNode(node)}
                                    style={
                                        selectedNode?.uniqueId === node.uniqueId
                                            ? { backgroundColor: "greenyellow", color: "purple" }
                                            : {}
                                    }
                                >
                                    {node.name}
                                </span>
                            )}
                        />
                    )}
                </FlexItem>
                <FlexItem flex={3} customStyle={{ border: "1px solid #ddd" }}>
                    {/* <p>Outlet wala section</p>
                    <div>
                        <Outlet />
                    </div> */}

                    <h2>Item Type: {selectedNode?.itemType || "No item selected!"}</h2>

                    <JSONDataViewer
                        initialValueToShowMetadata={false}
                        title={"Selected item: X-Ray"}
                        metadata={{ validData, messages, selectedNode }}
                    />

                    <CustomCollapse
                        style={{
                            border: "1px solid #ccc",
                            padding: "5px",
                            borderRadius: "10px",
                        }}
                        headerText="Preview Raw selectedNode object with TextRenderer"
                        showBoldTitle
                    >
                        <TextRenderer
                            rawText={JSON.stringify(selectedNode, null, 2)}
                            showRadioButtons={false}
                        />
                    </CustomCollapse>

                    <WithCCDynamicDataRenderer
                        data={selectedNode}
                        headerText="Preview selectedNode data object with DynamicDataRenderer"
                    />

                    <WithCCValidationReport
                        data={{ validData, messages }}
                        headerText="Validation Report for selectedNode"
                    />
                    <div style={{ border: "1px solid #ccc" }}>
                        {renderDetailsSection()}
                    </div>

                    {selectedNode
                        ? renderCard({
                            title: `Selected ${camelCaseToTitleCase(
                                (selectedNode.itemType || "").toLowerCase()
                            )} Details`,
                            objectToBeRendered: selectedNode,
                        })
                        : renderCard({
                            title: "All resumes snapshot",
                            objectToBeRendered: allResumesData
                            // objectToBeRendered: allResumesData.map(
                            //     ({ uniqueId, introduction, companies }) => ({
                            //         uniqueId,
                            //         introduction,
                            //         companies: companies?.map(({ uniqueId, name }) => ({
                            //             uniqueId,
                            //             name,
                            //         })),
                            //     })
                            // ),
                        })}
                </FlexItem>
            </FlexContainer>

            <FlexContainer isHorizontal>
                <JSONDataViewer
                    metadata={{ processedDataForTree, allResumesData }}
                    title="JSONDataViewer: Data"
                />
            </FlexContainer>
        </FlexContainer>
    );
};

export default ResumeBase;
