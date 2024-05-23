import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import Form from "./CustomFormV4_2";
import FormMessage, {
  appendFormValidationMessage,
  appendWarningMessage,
  hasValidationOrAPIResponseErrorMessages,
} from "./FormMessage";
import { withModal } from "../custom-modal/ModalV3_1";
import yaml from "js-yaml";
import classes from "./FormsV21.module.css";

const isFunction = (value) => typeof value === "function";

// Constants
const EMPTY_FIELD_MESSAGE = "Input field should not be empty";
const DEFAULT_SUBMISSION_WARNING = "'onSubmission' method not provided. Submitting with default implementation";
const DEFAULT_SUCCESS_WARNING = "'onSuccess' method not provided. Executing default implementation";

// Reusable Form Template Component
const FormTemplate = forwardRef(({ children, onSave, onValidation, onSubmission, onSuccess }, ref) => {
  const formRef = useRef(null);
  const [formMessages, setFormMessages] = useState([]);

  useImperativeHandle(ref, () => ({
    clearValidationMessages: () => setFormMessages([]),
  }));

  const validate = (data) => {
    const { messages = [], validatedData = data } = isFunction(onValidation)
      ? onValidation(data)
      : {};
    setFormMessages(messages);
    return {
      isValid: !hasValidationOrAPIResponseErrorMessages(messages),
      validatedData,
    };
  };

  const submit = (validatedData) => {
    const messages = isFunction(onSubmission)
      ? onSubmission(validatedData) ?? []
      : appendWarningMessage(DEFAULT_SUBMISSION_WARNING);

    setFormMessages((prevMessages) => [...prevMessages, ...messages]);
    return !hasValidationOrAPIResponseErrorMessages(messages);
  };

  const handleSubmit = (data) => {
    setFormMessages([]);
    const { isValid, validatedData } = validate(data);
    if (isValid && submit(validatedData) && isFunction(onSuccess)) {
      onSuccess();
    } else if (!isFunction(onSuccess)) {
      setFormMessages((prevMessages) => [
        ...prevMessages,
        appendWarningMessage(DEFAULT_SUCCESS_WARNING),
      ]);
    }
  };

  const clearForm = () => {
    setFormMessages([]);
    formRef.current?.clear();
  };

  return (
    <Form ref={formRef} className={classes["post-module-form"]} onSave={handleSubmit}>
      {children}
      <FormMessage formMessages={formMessages} />
      <div className={classes["post-module-form-actions"]}>
        <button type="submit">Submit</button>
        <button type="button" onClick={clearForm}>Clear Form</button>
      </div>
    </Form>
  );
});

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

// Common Clear Validation Function
const useClearValidationMessages = (formTemplateRef) => () =>
  formTemplateRef.current?.clearValidationMessages();

// Hook for Validating Forms
const useFormValidation = (validateFn) => {
  return (data) => {
    const result = validateFn(data);
    return {
      messages: result.messages ?? [],
      validatedData: result.validatedData ?? null,
    };
  };
};

// Specific Forms
const YamlForm = ({ addlValidation, onSubmission, onSuccess }) => {
  const formTemplateRef = useRef(null);
  const clearPreviousValidationMessages = useClearValidationMessages(formTemplateRef);

  const handleValidation = useFormValidation((data) => {
    if (!data?.yamlText?.trim()) {
      return { messages: appendFormValidationMessage("YAML text area should not be empty") };
    }

    const { isError, message, metadata } = parseYamlText(data.yamlText);
    if (isError) {
      return { messages: appendFormValidationMessage(message) };
    }

    const errors = isFunction(addlValidation) ? addlValidation(metadata) : [];
    return { messages: errors, validatedData: metadata };
  });

  return (
    <FormTemplate
      ref={formTemplateRef}
      onValidation={handleValidation}
      onSubmission={onSubmission}
      onSuccess={onSuccess}
    >
      <textarea
        name="yamlText"
        onChange={clearPreviousValidationMessages}
        placeholder="Enter YAML data"
        rows={5}
      />
    </FormTemplate>
  );
};

const NameForm = ({ addlValidation, onSubmission, onSuccess }) => {
  const formTemplateRef = useRef(null);
  const clearPreviousValidationMessages = useClearValidationMessages(formTemplateRef);

  const handleValidation = useFormValidation((data) => {
    if (!data?.singleLineText?.trim()) {
      return { messages: appendFormValidationMessage(EMPTY_FIELD_MESSAGE) };
    }

    const errors = isFunction(addlValidation)
      ? addlValidation(data.singleLineText.trim())
      : [];
    return { messages: errors, validatedData: data.singleLineText.trim() };
  });

  return (
    <FormTemplate
      ref={formTemplateRef}
      onValidation={handleValidation}
      onSubmission={onSubmission}
      onSuccess={onSuccess}
    >
      <input
        name="singleLineText"
        onChange={clearPreviousValidationMessages}
        type="text"
        placeholder="Enter your name"
      />
    </FormTemplate>
  );
};

// HOC Modal Forms
const YamlFormWithModal = withModal(YamlForm);
const NameFormWithModal = withModal(NameForm);

// Form Types Enum
const FormTypes = {
  YamlForm: "yaml-form",
  NameForm: "name-form",
};

// Centralized Form Rendering
const Forms = ({ type, onClose, addlValidation, onSubmission, onSuccess }) => {
  const formsMap = {
    [FormTypes.NameForm]: (
      <NameFormWithModal
        onClose={onClose}
        addlValidation={addlValidation}
        onSubmission={onSubmission}
        onSuccess={onSuccess}
      />
    ),
    [FormTypes.YamlForm]: (
      <YamlFormWithModal
        onClose={onClose}
        addlValidation={addlValidation}
        onSubmission={onSubmission}
        onSuccess={onSuccess}
      />
    ),
  };

  return formsMap[type] ?? null;
};

export { FormTypes };
export default Forms;
