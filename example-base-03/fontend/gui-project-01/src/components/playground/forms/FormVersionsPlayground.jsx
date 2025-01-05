import React, { useState, useMemo } from "react";
import FormsV11, { FormTypes as FormsV11Types } from "../../../common/components/custom-form/FormsV11";
import FormsV21, { FormTypes as FormsV21Types } from "../../../common/components/custom-form/FormsV21";
import FormsV22, { FormTypes as FormsV22Types } from "../../../common/components/custom-form/FormsV22";
import HoverActions from "../../../common/components/hover-actions/HoverActions";

import { appendAPIResponseErrorMessage, appendFormValidationMessage, appendSuccessMessage } from "../../../common/components/custom-form/FormMessage";
import JSONDataViewer from "../../../common/components/JSONDataViewer";
import AboutThisComponent from "../common/AboutThisComponent";

const FormComponents = {
    V11: { component: FormsV11, types: FormsV11Types },
    V21: { component: FormsV21, types: FormsV21Types },
    V22: { component: FormsV22, types: FormsV22Types },
};

const validators = {
    nameValidator: (name) => (name?.startsWith("Ram") ? [] : appendFormValidationMessage("Only names starting with 'Ram' are allowed")),
    yamlValidator: (data) => (typeof data === "object" && !Array.isArray(data) ? [] : appendFormValidationMessage("Only objects allowed")),
};

const FormsPlayground = () => {
    const [showModal, setShowModal] = useState({});
    const [selectedForm, setSelectedForm] = useState({});
    const [processedData, setProcessedData] = useState(null);

    const openModal = (version, type, validator) => {
        setSelectedForm({ version, type, validator });
        setShowModal((prev) => ({ ...prev, [version]: true }));
    };

    const closeModal = (version) => {
        setShowModal((prev) => ({ ...prev, [version]: false }));
    };

    const handleSubmission = (data) => {
        const apiSuccess = Math.random() < 0.5;
        setProcessedData(apiSuccess ? data : null);
        return apiSuccess ? appendSuccessMessage("Data submitted successfully") : appendAPIResponseErrorMessage("Data submission failed");
    };

    const getLabel = (version, type) => (version && type ? <> Edit with <b>Forms{version}</b> - {type}</> : null);

    const actions = useMemo(() => {
        return Object.keys(FormComponents).flatMap((version) => [
            { type: "YamlForm", label: getLabel(version, "YamlForm"), validator: "yamlValidator", version },
            { type: "NameForm", label: getLabel(version, "NameForm"), validator: "nameValidator", version },
        ]).map(({ type, label, validator, version }, idx) => ({
            id: `FA_${idx + 1}`,
            label: <span key={idx}>{label}</span>,
            onClick: () => openModal(version, FormComponents[version].types[type], validator),
        }));
    }, []);

    const renderForm = (version) => {
        const FormComponent = FormComponents[version]?.component;
        if (!showModal[version] || !FormComponent) return null;
        return (
            <FormComponent
                type={selectedForm.type}
                addlValidation={validators[selectedForm.validator]}
                onClose={() => closeModal(version)}
                onSubmission={handleSubmission}
            />
        );
    };

    return (
        <div>
            <h1>Forms Playground</h1>

            {Object.keys(FormComponents).map(renderForm)}

            <HoverActions
                actions={actions.map(({ id, label, onClick }) => (
                    <span key={id} onClick={onClick}>
                        {label}
                    </span>
                ))}
                title="Select Action"
            />

            <JSONDataViewer initialValueToShowMetadata={true} metadata={{ processedData }} title="X-Ray" />

            <AboutThisComponent />
        </div>
    );
};
export default FormsPlayground;
