import React, {
    forwardRef,
    useImperativeHandle,
    useRef,
    useState,
  } from "react";
  import Form from "./CustomFormV4_2";
  import FormMessage, {
    appendFormValidationMessage,
    hasValidationOrAPIResponseErrorMessages,
  } from "./FormMessage";
  import { withModal } from "../custom-modal/ModalV3_1";
  import yaml from "js-yaml";
  import classes from "./FormsV21.css";
  
  const isFunction = (value) => value && typeof value === "function";
  
  // Reusable Form Template Component
  const FormTemplate = forwardRef(({ children, onSave, onValidation }, ref) => {
    const formRef = useRef(null);
    const [formMessages, setFormMessages] = useState([]);
  
    // Setup imperative handle for parent components
    useImperativeHandle(ref, () => ({
      clearValidationMessages: () => setFormMessages([]),
    }));
  
    const validate = (data) => {
      const errors = isFunction(onValidation) ? onValidation(data) : [];
      setFormMessages(errors);
      return !hasValidationOrAPIResponseErrorMessages(errors);
    };
  
    const handleSubmit = (data) => {
      setFormMessages([]);
      if (validate(data)) {
        onSave?.(data);
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
          <button type="button" onClick={clearForm}>
            Clear Form
          </button>
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
  
  // YamlForm Implementation
  const YamlForm = ({ addlValidation, onSubmission, onSuccess }) => {
    const formTemplateRef = useRef(null);
    const clearPreviousValidationMessages =
      useClearValidationMessages(formTemplateRef);
  
    const handleValidation = (data) => {
      console.log("[YamlForm]:[onValidation]: ", JSON.stringify(data));
  
      if (!data?.yamlText?.trim()) {
        return appendFormValidationMessage("Yaml text area should not be empty");
      }
  
      const { isError, message, metadata } = parseYamlText(data.yamlText);
      if (isError) {
        return appendFormValidationMessage(message);
      }
  
      const errors = isFunction(addlValidation) ? addlValidation(metadata) : [];
      return errors;
    };
  
    const handleSave = (data) => {
      console.log("Yaml Form Data:", data);
  
      // Parse YAML before submission
      const { metadata } = parseYamlText(data.yamlText);
  
      // Execute onSubmission if defined
      const submissionMessages = isFunction(onSubmission)
        ? onSubmission(metadata)
        : [];
  
      if (!hasValidationOrAPIResponseErrorMessages(submissionMessages)) {
        // If submission succeeds, call onSuccess if defined
        if (isFunction(onSuccess)) {
          onSuccess();
        } else {
          console.log("Default Success Action: YAML Form Submitted Successfully");
        }
      }
    };
  
    return (
      <FormTemplate
        ref={formTemplateRef}
        onValidation={handleValidation}
        onSave={handleSave}
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
  
  // NameForm Implementation
  const NameForm = ({ addlValidation, onSubmission, onSuccess }) => {
    const formTemplateRef = useRef(null);
    const clearPreviousValidationMessages =
      useClearValidationMessages(formTemplateRef);
  
    const handleValidation = (data) => {
      console.log("[NameForm]:[onValidation]: ", JSON.stringify(data));
  
      if (!data?.singleLineText?.trim()) {
        return appendFormValidationMessage("Input field should not be empty");
      }
  
      const errors = isFunction(addlValidation)
        ? addlValidation(data.singleLineText.trim())
        : [];
      return errors;
    };
  
    const handleSave = (data) => {
      console.log("Name Form Data:", data);
  
      // Execute onSubmission if defined
      const submissionMessages = isFunction(onSubmission)
        ? onSubmission(data.singleLineText.trim())
        : [];
  
      if (!hasValidationOrAPIResponseErrorMessages(submissionMessages)) {
        // If submission succeeds, call onSuccess if defined
        if (isFunction(onSuccess)) {
          onSuccess();
        } else {
          console.log("Default Success Action: Name Form Submitted Successfully");
        }
      }
    };
  
    return (
      <FormTemplate
        ref={formTemplateRef}
        onValidation={handleValidation}
        onSave={handleSave}
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
  
    return formsMap[type] || null;
  };
  
  export { FormTypes };
  export default Forms;
  