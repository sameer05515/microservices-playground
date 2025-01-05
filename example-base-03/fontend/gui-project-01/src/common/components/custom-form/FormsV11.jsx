import React, { useRef, useState } from "react";
import { withModal } from "../custom-modal/ModalV3_1";
import Form from "./CustomFormV4_2";
import FormMessage, {
    appendFormValidationMessage,
    appendWarningMessage,
    hasValidationOrAPIResponseErrorMessages,
} from "./FormMessage";
import yaml from "js-yaml";
import classes from "./FormsV11.module.css";

const isFunction = (value) => value && typeof value === "function";

// Utility to Parse YAML Text with Error Handling
const parseYamlText = (rawText) => {
    try {
        const metadata = yaml.load(rawText);
        return { isError: false, metadata, message: "" };
    } catch (e) {
        const errorMessage = e.mark
            ? `Error parsing YAML at line ${e.mark.line + 1}: ${e.message}`
            : `Error parsing YAML: ${e.message}`;
        return { isError: true, message: errorMessage, metadata: null };
    }
};

const YamlForm = ({ addlValidation, onSubmission, onSuccess }) => {
    const formRef = useRef(null);
    const [formMessages, setFormMessages] = useState([]);

    const validate = (data) => {
        if (!data?.yamlText?.trim()) {
            setFormMessages(
                appendFormValidationMessage("Yaml text area should not be empty")
            );
            return { isValid: false, validatedData: null };
        }
        const { isError, message, metadata } = parseYamlText(data.yamlText);
        if (isError) {
            setFormMessages(appendFormValidationMessage(message));
            return { isValid: false, validatedData: null };
        }
        const errors = isFunction(addlValidation) ? addlValidation(metadata) : [];
        setFormMessages(errors);
        return {
            isValid: !hasValidationOrAPIResponseErrorMessages(errors),
            validatedData: metadata || null,
        };
    };

    const submit = (validatedData) => {
        let messages = [];
        if (isFunction(onSubmission)) {
            messages = onSubmission(validatedData) || [];
        } else {
            console.log(`Form Data: -----'${JSON.stringify(validatedData)}'-----`);
            messages = appendWarningMessage(
                "'onSubmission' method not provided. Submitting with default implementation"
            );
        }
        setFormMessages((prevMessages) => [...prevMessages, ...messages]);
        return {
            submitted: !hasValidationOrAPIResponseErrorMessages(messages),
        };
    };

    const handleSave = (data) => {
        setFormMessages([]);
        const { isValid, validatedData } = validate(data);
        if (isValid) {
            const { submitted } = submit(validatedData);
            if (submitted) {
                if (isFunction(onSuccess)) {
                    onSuccess();
                } else {
                    setFormMessages((prevMessages) => [
                        ...prevMessages,
                        ...appendWarningMessage(
                            "'onSuccess' method not provided. Submitting with default implementation"
                        ),
                    ]);
                }
            }
        }
    };

    const clearForm = () => {
        setFormMessages([]);
        formRef.current?.clear();
    };

    return (
        <Form ref={formRef} className={classes["post-module-form"]} onSave={handleSave}>
            <textarea
                name="yamlText"
                onChange={() => setFormMessages([])}
                placeholder="Enter data"
                rows={5}
            />
            <FormMessage formMessages={formMessages} />
            <div className={classes["post-module-form-actions"]}>
                <button type="submit">Submit</button>
                <button type="button" onClick={clearForm}>
                    Clear Form
                </button>
            </div>
        </Form>
    );
};

const NameForm = ({ addlValidation, onSubmission, onSuccess }) => {
    const formRef = useRef(null);
    const [formMessages, setFormMessages] = useState([]);

    const validate = (data) => {
        if (!data?.singleLineText?.trim()) {
            setFormMessages(
                appendFormValidationMessage("Input field should not be empty")
            );
            return { isValid: false, validatedData: null };
        }

        const errors = isFunction(addlValidation)
            ? addlValidation(data.singleLineText.trim())
            : [];
        setFormMessages(errors);
        return {
            isValid: !hasValidationOrAPIResponseErrorMessages(errors),
            validatedData: data.singleLineText.trim() || null,
        };
    };

    const submit = (validatedData) => {
        let messages = [];
        if (isFunction(onSubmission)) {
            messages = onSubmission(validatedData) || [];
        } else {
            console.log(`Form Data: -----'${validatedData}'-----`);
            messages = appendWarningMessage(
                "'onSubmission' method not provided. Submitting with default implementation"
            );
        }
        setFormMessages((prevMessages) => [...prevMessages, ...messages]);
        return {
            submitted: !hasValidationOrAPIResponseErrorMessages(messages),
        };
    };

    const handleSave = (data) => {
        setFormMessages([]);
        const { isValid, validatedData } = validate(data);
        if (isValid) {
            const { submitted } = submit(validatedData);
            if (submitted) {
                if (isFunction(onSuccess)) {
                    onSuccess();
                } else {
                    setFormMessages((prevMessages) => [
                        ...prevMessages,
                        ...appendWarningMessage(
                            "'onSuccess' method not provided. Submitting with default implementation"
                        ),
                    ]);
                }
            }
        }
    };

    const clearForm = () => {
        setFormMessages([]);
        formRef.current?.clear();
    };

    return (
        <Form ref={formRef} className={classes["post-module-form"]} onSave={handleSave}>
            <input
                name="singleLineText"
                type="text"
                onChange={() => setFormMessages([])}
                placeholder="Enter your name"
            />
            <FormMessage formMessages={formMessages} />
            <div className={classes["post-module-form-actions"]}>
                <button type="submit">Submit</button>
                <button type="button" onClick={clearForm}>
                    Clear Form
                </button>
            </div>
        </Form>
    );
};

const YamlFormWithModal = withModal(YamlForm);
const NameFormWithModal = withModal(NameForm);

const FormTypes = {
    YamlForm: "yaml-form",
    NameForm: "name-form",
};

const Forms = ({ type, onClose, addlValidation, onSubmission, onSuccess }) => {
    if (type === FormTypes.NameForm) {
        return (
            <NameFormWithModal
                onClose={onClose}
                addlValidation={addlValidation}
                onSubmission={onSubmission}
                onSuccess={onSuccess}
            />
        );
    }
    if (type === FormTypes.YamlForm) {
        return (
            <YamlFormWithModal
                onClose={onClose}
                addlValidation={addlValidation}
                onSubmission={onSubmission}
                onSuccess={onSuccess}
            />
        );
    }
    return null;
};

export { FormTypes };

export default Forms;
