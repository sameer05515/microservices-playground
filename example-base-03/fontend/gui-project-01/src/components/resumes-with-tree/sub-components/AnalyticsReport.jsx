import React, { useMemo, useState } from "react";
import HoverActions from "../../../common/components/hover-actions/HoverActions";
import JSONDataViewer from "../../../common/components/JSONDataViewer";

const AnalyticsReportType = {
    ALL_RESUMES: "all-resumes",
    SELECTED_RESUME: "selected-resume",
    SELECTED_COMPANY: "selected-company",
    SELECTED_PROJECT: "selected-project",
};

const AnalyticsReport = ({ analyticsReportType = "", data = null }) => {
    const renderReportForType = () => {
        switch (analyticsReportType) {
            case AnalyticsReportType.SELECTED_RESUME:
                return <ResumeReport data={data} />;
            case AnalyticsReportType.SELECTED_COMPANY:
                return <CompanyReport data={data} />;
            case AnalyticsReportType.SELECTED_PROJECT:
                return <ProjectReport data={data} />;
            default:
                return <AllResumesReport data={data} />;
        }
    };

    if (!Object.values(AnalyticsReportType).includes(analyticsReportType)) {
        return (
            <>Invalid AnalyticsReportType selected: {`'${analyticsReportType}'`}</>
        );
    } else if (data === null) {
        return <>Null data provided</>;
    }
    return (
        <div>
            <h2>
                AnalyticsReport for: <b>{analyticsReportType}</b>
            </h2>
            {renderReportForType()}
        </div>
    );
};

const Metric = ({ id, name = "", value }) => (
    <div key={id}>
        <span>
            <b>{name.toUpperCase()}: </b>
            {value}
        </span>
    </div>
);

const AllResumesReport = ({ data: allResumes = [] }) => {
    const [selectedMetrics, setSelectedMetrics] = useState([]);
    const metricsArr = useMemo(() => {
        if (!allResumes) return [];
        let incr = 0;
        return [
            {
                id: `arr_${++incr}`,
                name: "Total Resumes",
                value: <span style={{ color: "blueviolet" }}>{allResumes.length}</span>,
            },
            {
                id: `arr_${++incr}`,
                name: "Resume-Wise Company Count",
                value: (
                    <div style={{ color: "blueviolet" }}>
                        {allResumes.map((resume) => {
                            return (
                                <div key={resume.uniqueId}>
                                    <h2>{resume.name}</h2>
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
    }, [allResumes]);

    const isAllSelected = selectedMetrics.length === metricsArr.length;

    const handleCheckboxChange = (id) => {
        setSelectedMetrics((prev) =>
            prev.includes(id)
                ? prev.filter((metricId) => metricId !== id)
                : [...prev, id]
        );
    };

    const handleAllMetricsChange = (isChecked) => {
        setSelectedMetrics(isChecked ? metricsArr.map((metric) => metric.id) : []);
    };

    const hoverActionOptions = [
        <label>
            <input
                type="checkbox"
                checked={isAllSelected}
                onChange={(e) => handleAllMetricsChange(e.target.checked)}
            />
            All Metrics
        </label>,
        ...metricsArr.map((metric) => (
            <label key={metric.id}>
                <input
                    type="checkbox"
                    checked={selectedMetrics.includes(metric.id)}
                    onChange={() => handleCheckboxChange(metric.id)}
                />
                {metric.name}
            </label>
        )),
    ];

    if (!Array.isArray(allResumes)) return <>Invalid value provided</>;
    return (
        <>
            <h2>AllResumesReport</h2>
            <HoverActions actions={hoverActionOptions} />
            {metricsArr
                .filter(({ id }) => selectedMetrics.includes(id))
                .map((metric) => (
                    <Metric key={metric.id} {...metric} />
                ))}
            <JSONDataViewer metadata={{ selectedMetrics }} title="Selected Metrics" />
        </>
    );
};

const ResumeReport = ({ data: resume }) => {
    const [selectedMetrics, setSelectedMetrics] = useState([]);

    const metricsArr = useMemo(() => {
        if (!resume) return [];
        let incr = 0;
        return [
            {
                id: `rr_${++incr}`,
                name: "Total Companies",
                value: (
                    <span style={{ color: "blueviolet" }}>{resume.children?.length}</span>
                ),
            },
            {
                id: `rr_${++incr}`,
                name: "Total Projects",
                value: (
                    <span style={{ color: "blueviolet" }}>
                        {resume.children?.reduce(
                            (acc, comp) => acc + (comp.children?.length || 0),
                            0
                        )}
                    </span>
                ),
            },
        ];
    }, [resume]);

    const isAllSelected = selectedMetrics.length === metricsArr.length;

    const handleCheckboxChange = (id) => {
        setSelectedMetrics((prev) =>
            prev.includes(id)
                ? prev.filter((metricId) => metricId !== id)
                : [...prev, id]
        );
    };

    const handleAllMetricsChange = (isChecked) => {
        setSelectedMetrics(isChecked ? metricsArr.map((metric) => metric.id) : []);
    };

    const hoverActionOptions = [
        <label>
            <input
                type="checkbox"
                checked={isAllSelected}
                onChange={(e) => handleAllMetricsChange(e.target.checked)}
            />
            All Metrics
        </label>,
        ...metricsArr.map((metric) => (
            <label key={metric.id}>
                <input
                    type="checkbox"
                    checked={selectedMetrics.includes(metric.id)}
                    onChange={() => handleCheckboxChange(metric.id)}
                />
                {metric.name}
            </label>
        )),
    ];

    if (!resume || typeof resume !== "object") return <>Invalid value provided</>;
    return (
        <>
            <h2>ResumeReport</h2>
            <HoverActions actions={hoverActionOptions} />
            {metricsArr
                .filter(({ id }) => selectedMetrics.includes(id))
                .map((metric) => (
                    <Metric key={metric.id} {...metric} />
                ))}
            <JSONDataViewer metadata={{ selectedMetrics }} title="Selected Metrics" />
        </>
    );
};

const CompanyReport = ({ data: company }) => {
    const [selectedMetrics, setSelectedMetrics] = useState([]);

    const metricsArr = useMemo(() => {
        if (!company) return [];
        let incr = 0;
        return [
            {
                id: `cr_${++incr}`,
                name: "Total Projects",
                value: (
                    <span style={{ color: "blueviolet" }}>
                        {company.children?.length}
                    </span>
                ),
            },
            {
                id: `rr_${++incr}`,
                name: "Project Names",
                value: (
                    <div style={{ color: "blueviolet" }}>
                        {company.children?.map((proj) => (
                            <div key={proj.uniqueId}>{proj.name}</div>
                        ))}
                    </div>
                ),
            },
        ];
    }, [company]);

    const isAllSelected = selectedMetrics.length === metricsArr.length;

    const handleCheckboxChange = (id) => {
        setSelectedMetrics((prev) =>
            prev.includes(id)
                ? prev.filter((metricId) => metricId !== id)
                : [...prev, id]
        );
    };

    const handleAllMetricsChange = (isChecked) => {
        setSelectedMetrics(isChecked ? metricsArr.map((metric) => metric.id) : []);
    };

    const hoverActionOptions = [
        <label>
            <input
                type="checkbox"
                checked={isAllSelected}
                onChange={(e) => handleAllMetricsChange(e.target.checked)}
            />
            All Metrics
        </label>,
        ...metricsArr.map((metric) => (
            <label key={metric.id}>
                <input
                    type="checkbox"
                    checked={selectedMetrics.includes(metric.id)}
                    onChange={() => handleCheckboxChange(metric.id)}
                />
                {metric.name}
            </label>
        )),
    ];
    if (!company || typeof company !== "object")
        return <>Invalid value provided</>;
    return (
        <>
            <h2>CompanyReport</h2>
            <HoverActions actions={hoverActionOptions} />
            {metricsArr
                .filter(({ id }) => selectedMetrics.includes(id))
                .map((metric) => (
                    <Metric key={metric.id} {...metric} />
                ))}
            <JSONDataViewer metadata={{ selectedMetrics }} title="Selected Metrics" />
        </>
    );
};
const ProjectReport = ({ data: project }) => {
    const [selectedMetrics, setSelectedMetrics] = useState([]);
    const metricsArr = useMemo(() => {
        if (!project) return [];
        let incr = 0;
        return [
            {
                id: `cr_${++incr}`,
                name: "Project Name",
                value: <span style={{ color: "blueviolet" }}>{project.name}</span>,
            },
            {
                id: `rr_${++incr}`,
                name: "Project Tech-Stacks",
                value: (
                    <div style={{ color: "blueviolet" }}>
                        {project.processedDetails?.metadata?.techStack?.map((ts, idx) => (
                            <div key={`ts_${project.uniqueId}_${idx + 1}`}>{ts}</div>
                        ))}
                    </div>
                ),
            },
        ];
    }, [project]);

    const isAllSelected = selectedMetrics.length === metricsArr.length;

    const handleCheckboxChange = (id) => {
        setSelectedMetrics((prev) =>
            prev.includes(id)
                ? prev.filter((metricId) => metricId !== id)
                : [...prev, id]
        );
    };

    const handleAllMetricsChange = (isChecked) => {
        setSelectedMetrics(isChecked ? metricsArr.map((metric) => metric.id) : []);
    };

    const hoverActionOptions = [
        <label>
            <input
                type="checkbox"
                checked={isAllSelected}
                onChange={(e) => handleAllMetricsChange(e.target.checked)}
            />
            All Metrics
        </label>,
        ...metricsArr.map((metric) => (
            <label key={metric.id}>
                <input
                    type="checkbox"
                    checked={selectedMetrics.includes(metric.id)}
                    onChange={() => handleCheckboxChange(metric.id)}
                />
                {metric.name}
            </label>
        )),
    ];
    if (!project || typeof project !== "object") {
        return <>Invalid value provided</>;
    }

    return (
        <>
            <h2>ProjectReport</h2>
            <HoverActions actions={hoverActionOptions} />
            {metricsArr
                .filter(({ id }) => selectedMetrics.includes(id))
                .map((metric) => (
                    <Metric key={metric.id} {...metric} />
                ))}
            <JSONDataViewer metadata={{ selectedMetrics }} title="Selected Metrics" />
        </>
    );
};

export default AnalyticsReport;
export { AnalyticsReportType };
