import React, { useMemo, useState } from "react";
import HoverActions from "../../../common/components/hover-actions/HoverActions";
import JSONDataViewer from "../../../common/components/JSONDataViewer";

// Report Types
const AnalyticsReportType = {
    ALL_RESUMES: "all-resumes",
    SELECTED_RESUME: "selected-resume",
    SELECTED_COMPANY: "selected-company",
    SELECTED_PROJECT: "selected-project",
};

// Utility to generate metrics array
const generateMetrics = (type, data) => {
    if (!data) return [];
    let incr = 0;
    switch (type) {
        case AnalyticsReportType.SELECTED_RESUME:
            return [
                {
                    id: `rr_${++incr}`,
                    name: "Total Companies",
                    // value: data.companies?.length || 0
                    value: (
                        <span style={{ color: "blueviolet" }}>
                            {data.children?.length || 0}
                        </span>
                    ),
                },
                {
                    id: `rr_${++incr}`,
                    name: "Total Projects",
                    // value: data.companies?.reduce((acc, comp) => acc + (comp.projects?.length || 0), 0) || 0,
                    value: (
                        <span style={{ color: "blueviolet" }}>
                            {data.children?.reduce(
                                (acc, comp) => acc + (comp.children?.length || 0),
                                0
                            ) || 0}
                        </span>
                    ),
                },
                {
                    id: `rr_${++incr}`,
                    name: "Company Names",
                    // value: data.companies?.reduce((acc, comp) => acc + (comp.projects?.length || 0), 0) || 0,
                    value: (
                        <div style={{ color: "blueviolet" }}>
                            {data.children?.map(
                                (comp) => <div>{comp.name}</div>
                            )||'No Companies'}
                        </div>
                    ),
                },
            ];
        case AnalyticsReportType.SELECTED_COMPANY:
            return [
                {
                    id: `cr_${++incr}`,
                    name: "Projects: Count",
                    // value: data.projects?.length || 0
                    value: (
                        <span style={{ color: "blueviolet" }}>
                            {data.children?.length || 0}
                        </span>
                    ),
                },
                {
                    id: `cr_${++incr}`,
                    name: "Projects: Name",
                    // value: data.projects?.map((proj) => proj.name).join(", ") || "No projects",
                    value: (
                        <div style={{ color: "blueviolet" }}>
                            {data.children?.map((proj) => (
                                <div key={proj.uniqueId}>{proj.name}</div>
                            )) || "No projects"}
                        </div>
                    ),
                },
                {
                    id: `cr_${++incr}`,
                    name: "Project Overview: Tech-Stack: tools and technologies used",
                    // value: data.projects?.map((proj) => proj.name).join(", ") || "No projects",
                    value: (
                        <div style={{ color: "blueviolet" }}>
                            {data.children?.map((proj) => (
                                <div key={proj.uniqueId}>
                                    <h3>{proj.name}</h3> <br />
                                    <b>Tech-Stacks: </b>{" "}
                                    {proj.processedDetails?.metadata?.techStack?.join(", ") ||
                                        "No tech stack"}
                                    <hr />
                                </div>
                            )) || "No projects"}
                        </div>
                    ),
                },
                {
                    id: `cr_${++incr}`,
                    name: "Project Overview: Main Objectives",
                    value: <span style={{ color: "red" }}>To be done</span>,
                },
                {
                    id: `cr_${++incr}`,
                    name: "Project Overview: Key deliverables of the project",
                    value: <span style={{ color: "red" }}>To be done</span>,
                },
                {
                    id: `cr_${++incr}`,
                    name: "Project Overview: Primary stakeholders involved",
                    value: <span style={{ color: "red" }}>To be done</span>,
                },
                {
                    id: `cr_${++incr}`,
                    name: "Project Overview: Timeline for the project",
                    value: <span style={{ color: "red" }}>To be done</span>,
                },
                {
                    id: `cr_${++incr}`,
                    name: "Project Overview: How did this project align with the company's overall goals",
                    value: <span style={{ color: "red" }}>To be done</span>,
                },
                {
                    id: `cr_${++incr}`,
                    name: "Project Overview: critical success factors for this project",
                    value: <span style={{ color: "red" }}>To be done</span>,
                },
            ];
        case AnalyticsReportType.SELECTED_PROJECT:
            return [
                {
                    id: `pr_${++incr}`,
                    name: "Project Name",
                    // value: data.name || "Unnamed"
                    value: (
                        <span style={{ color: "blueviolet" }}>
                            {data.name || "Unnamed"}
                        </span>
                    ),
                },
                {
                    id: `pr_${++incr}`,
                    name: "Tech Stack",
                    // value: data.processedDetails?.metadata?.techStack?.join(", ") || "No tech stack",
                    value: (
                        <div style={{ color: "blueviolet" }}>
                            {data.processedDetails?.metadata?.techStack?.map((ts, idx) => (
                                <div key={`ts_${data.uniqueId}_${idx + 1}`}>{ts}</div>
                            )) || "No tech stack"}
                        </div>
                    ),
                },
            ];
        default:
            return [
                {
                    id: `ar_${++incr}`,
                    name: "Total Resumes",
                    value: (
                        <span style={{ color: "blueviolet" }}>{data.length || 0}</span>
                    ),
                    // value: data.length || 0,
                },
                {
                    id: `ar_${++incr}`,
                    name: "Resume-Wise Company Count",
                    // value: data.map((resume) => `${resume.name || "Unnamed"}: ${resume.companies?.length || 0}`).join("; "),
                    value: (
                        <div style={{ color: "blueviolet" }}>
                            {data.map((resume) => {
                                return (
                                    <div key={resume.uniqueId}>
                                        <h2>{resume.name || "Unnamed"}</h2>
                                        Total Companies linked in resume
                                        {resume.children?.length || "No children found!"}
                                        <JSONDataViewer
                                            metadata={{ resume }}
                                            title={`Resume_${resume.uniqueId}`}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    ),
                },
            ];
    }
};

// Metric Component
const Metric = ({ name, value }) => (
    <div>
        <b>{name.toUpperCase()}: </b>
        {value}
    </div>
);

// Checkbox list for metric selection
const MetricSelection = ({
    metrics,
    selectedMetrics,
    onToggleMetric,
    onToggleAll,
}) => (
    <HoverActions
        actions={[
            <label key="all-metrics">
                <input
                    type="checkbox"
                    checked={selectedMetrics.length === metrics.length}
                    onChange={(e) => onToggleAll(e.target.checked)}
                />
                All Metrics
            </label>,
            ...metrics.map((metric) => (
                <label key={metric.id}>
                    <input
                        type="checkbox"
                        checked={selectedMetrics.includes(metric.id)}
                        onChange={() => onToggleMetric(metric.id)}
                    />
                    {metric.name}
                </label>
            )),
        ]}
    />
);

// Report Component for rendering different reports based on type
const ReportComponent = ({ analyticsReportType, data }) => {
    const [selectedMetrics, setSelectedMetrics] = useState([]);
    const metricsArr = useMemo(
        () => generateMetrics(analyticsReportType, data),
        [analyticsReportType, data]
    );

    const handleToggleMetric = (id) =>
        setSelectedMetrics((prev) =>
            prev.includes(id)
                ? prev.filter((metricId) => metricId !== id)
                : [...prev, id]
        );

    const handleToggleAllMetrics = (isChecked) =>
        setSelectedMetrics(isChecked ? metricsArr.map((metric) => metric.id) : []);

    return (
        <div>
            <h2>{analyticsReportType.replace(/-/g, " ").toUpperCase()} REPORT</h2>
            <MetricSelection
                metrics={metricsArr}
                selectedMetrics={selectedMetrics}
                onToggleMetric={handleToggleMetric}
                onToggleAll={handleToggleAllMetrics}
            />
            {metricsArr
                .filter(({ id }) => selectedMetrics.includes(id))
                .map((metric) => (
                    <Metric key={metric.id} name={metric.name} value={metric.value} />
                ))}
            <JSONDataViewer
                metadata={{ analyticsReportType, selectedMetrics, data }}
                title="Selected Metrics"
            />
        </div>
    );
};

// Main Analytics Report Component
const AnalyticsReport = ({ analyticsReportType = "", data = null }) => {
    if (!Object.values(AnalyticsReportType).includes(analyticsReportType)) {
        return (
            <div>
                Invalid AnalyticsReportType selected: {`'${analyticsReportType}'`}
            </div>
        );
    } else if (data === null) {
        return <div>Null data provided</div>;
    }

    return (
        <div>
            <h2>
                AnalyticsReport for: <b>{analyticsReportType}</b>
            </h2>
            <ReportComponent analyticsReportType={analyticsReportType} data={data} />
        </div>
    );
};

export default AnalyticsReport;
export { AnalyticsReportType };
