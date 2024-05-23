import React, { useCallback, useMemo } from "react";
import { createSearchParams, useNavigate, useSearchParams } from "react-router-dom";
import HoverActions from "../../common/components/hover-actions/HoverActions";
import {
    addSuffix,
    convertToCamelCase,
    hoverActions,
    // PlaygroundArea,
    getComponentForKey
} from "./common/playground-utils";

const Playground = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const areaParam = searchParams.get("area");

    // Navigate to a specific area
    const navigateToArea = useCallback(
        (area = "") => {
            navigate({
                pathname: "/playground",
                search: area ? createSearchParams({ area }).toString() : "",
            });
        },
        [navigate]
    );

    // Determine Component and Action Title
    const { component, actionTitle } = useMemo(() => {
        if (!areaParam)
            return { component: <h1>Please Select Area</h1>, actionTitle: "" };

        const actionTitle = convertToCamelCase(areaParam);
        const componentKey = addSuffix(actionTitle);
        const selectedComponent = getComponentForKey(componentKey);

        return {
            component: selectedComponent ?? (
                <h1>
                    Invalid area: <b style={{ color: "red" }}>{areaParam}</b>
                </h1>
            ),
            actionTitle: selectedComponent ? actionTitle : "",
        };
    }, [areaParam]);

    return (
        <div>
            <HoverActions
                actions={hoverActions.map(({ id, label, area }) => (
                    <span key={id} onClick={() => navigateToArea(area)}>
                        {label}
                    </span>
                ))}
                title={actionTitle || "Select Area"}
            />
            {component}
        </div>
    );
};

export default Playground;
