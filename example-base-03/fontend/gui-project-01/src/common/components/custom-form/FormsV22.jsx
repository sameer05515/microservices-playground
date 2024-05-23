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

const isFunction = (value) => typeof value === "function";

// Utility to Parse YAML Text with Error Handling
const parseYamlText = (rawText) => {
    try {
        const metadata = yaml.load(rawText);
        return { isError: false, metadata };
    } catch (e) {
        const errorMessage = e.mark
            ? `Error parsing YAML at line ${e.mark.line + 1}: ${e.message}`
            : `Error parsing YAML: ${e.message}`;
        return { isError: true, message: errorMessage };
    }
};

// Reusable Form Component Logic
const useFormHandler = ({ addlValidation, onSubmission, onSuccess, parseData }) => {
    const formRef = useRef(null);
    const [formMessages, setFormMessages] = useState([]);

    const validate = (data) => {
        const { textKey, isYaml } = parseData;
        const text = data?.[textKey]?.trim();

        if (!text) {
            setFormMessages(appendFormValidationMessage(`${isYaml ? "YAML text area" : "Input field"} should not be empty`));
            return { isValid: false };
        }

        const parsedData = isYaml ? parseYamlText(text) : { isError: false, metadata: text };
        if (parsedData.isError) {
            setFormMessages(appendFormValidationMessage(parsedData.message));
            return { isValid: false };
        }

        const metadata = isYaml ? parsedData.metadata : parsedData.metadata;
        const errors = isFunction(addlValidation) ? addlValidation(metadata) : [];
        setFormMessages(errors);
        return {
            isValid: !hasValidationOrAPIResponseErrorMessages(errors),
            validatedData: metadata || null,
        };
    };

    const submit = (validatedData) => {
        //let messages = isFunction(onSubmission) ? (onSubmission(validatedData) || []) : appendWarningMessage("'onSubmission' method not provided. Submitting with default implementation");
        let messages=[];
        if(isFunction(onSubmission)){
            messages = onSubmission(validatedData) || [];
        }else{
            messages = appendWarningMessage("'onSubmission' method not provided. Submitting with default implementation");
        }
        console.log('[useFormHandler]: ','[submit]: ', messages)
        setFormMessages((prev) => [...prev, ...messages]);
        return { submitted: !hasValidationOrAPIResponseErrorMessages(messages) };
    };

    const handleSave = (data) => {
        setFormMessages([]);
        const { isValid, validatedData } = validate(data);
        if (isValid) {
            const { submitted } = submit(validatedData);
            if (submitted) {
                isFunction(onSuccess) ? onSuccess() : setFormMessages(appendWarningMessage("'onSuccess' method not provided"));
            }
        }
    };

    const clearForm = () => {
        setFormMessages([]);
        formRef.current?.clear();
    };

    return { formRef, formMessages, handleSave, clearForm, setFormMessages };
};

// Component for Yaml Form
const YamlForm = (props) => {
    const { formRef, formMessages, handleSave, clearForm, setFormMessages } = useFormHandler({
        ...props,
        parseData: { textKey: 'yamlText', isYaml: true }
    });

    return (
        <Form ref={formRef} className={classes["post-module-form"]} onSave={handleSave}>
            <textarea
                name="yamlText"
                onChange={() => setFormMessages([])}
                placeholder="Enter YAML data"
                rows={5}
            />
            <FormMessage formMessages={formMessages} />
            <div className={classes["post-module-form-actions"]}>
                <button type="submit">Submit</button>
                <button type="button" onClick={clearForm}>Clear Form</button>
            </div>
        </Form>
    );
};

// Component for Name Form
const NameForm = (props) => {
    const { formRef, formMessages, handleSave, clearForm, setFormMessages } = useFormHandler({
        ...props,
        parseData: { textKey: 'singleLineText', isYaml: false }
    });

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
                <button type="button" onClick={clearForm}>Clear Form</button>
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

const Forms = ({ type, ...props }) => {
    switch (type) {
        case FormTypes.NameForm:
            return <NameFormWithModal {...props} />;
        case FormTypes.YamlForm:
            return <YamlFormWithModal {...props} />;
        default:
            return null;
    }
};

export { FormTypes };
export default Forms;
