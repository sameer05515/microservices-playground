import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Form from "./CustomFormV4_2";
import FormMessage, {
  appendFormValidationMessage,
  appendWarningMessage,
  hasValidationOrAPIResponseErrorMessages,
} from "./FormMessage";
import { withModal } from "../custom-modal/ModalV3_1";
import yaml from "js-yaml";
// import "./FormsV21.css";
import classes from "./FormsV21.module.css";

const isFunction = (value) => value && typeof value === "function";

// Reusable Form Template Component
const FormTemplate = forwardRef(
  ({ children, onSave, onValidation, onSubmission, onSuccess }, ref) => {
    const formRef = useRef(null);
    const [formMessages, setFormMessages] = useState([]);

    // Setup imperative handle for parent components
    useImperativeHandle(ref, () => ({
      clearValidationMessages: () => setFormMessages([]),
    }));

    const validate = (data) => {
      const { messages: errors, validatedData } = isFunction(onValidation)
        ? onValidation(data)
        : { messages: [], validatedData: data };
      setFormMessages(errors);
      // return !hasValidationOrAPIResponseErrorMessages(errors);
      return {
        isValid: !hasValidationOrAPIResponseErrorMessages(errors),
        validatedData: validatedData,
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

    const handleSubmit = (data) => {
      setFormMessages([]);
      const { isValid, validatedData } = validate(data);
      if (isValid) {
        // onSave?.(data);
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
  }
);

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

// Specific Forms
const YamlForm = ({ addlValidation, onSubmission, onSuccess }) => {
  const formTemplateRef = useRef(null);
  const clearPreviousValidationMessages =
    useClearValidationMessages(formTemplateRef);

  const handleValidation = (data) => {
    console.log("[YamlForm]:[onValidation]: ", JSON.stringify(data));

    if (!data?.yamlText?.trim()) {
      return {
        messages: appendFormValidationMessage(
          "Yaml text area should not be empty"
        ),
        validatedData: null,
      };
    }

    const { isError, message, metadata } = parseYamlText(data.yamlText);
    if (isError) {
      return {
        messages: appendFormValidationMessage(message),
        validatedData: null,
      };
    }

    const errors = isFunction(addlValidation) ? addlValidation(metadata) : [];
    return { messages: errors, validatedData: metadata };
  };

  return (
    <FormTemplate
      ref={formTemplateRef}
      onValidation={handleValidation}
      onSave={(data) => console.log("Yaml Form Data:", data)}
      onSubmission={onSubmission}
      onSuccess={onSuccess}
    >
      <textarea
        name="yamlText"
        onChange={clearPreviousValidationMessages}
        placeholder="Enter data"
        rows={5}
      />
    </FormTemplate>
  );
};

const NameForm = ({ addlValidation, onSubmission, onSuccess }) => {
  const formTemplateRef = useRef(null);
  const clearPreviousValidationMessages =
    useClearValidationMessages(formTemplateRef);

  const handleValidation = (data) => {
    console.log("[NameForm]:[onValidation]: ", JSON.stringify(data));

    if (!data?.singleLineText?.trim()) {
      return {
        messages: appendFormValidationMessage(
          "Input field should not be empty"
        ),
        validatedData: null,
      };
    }

    const errors = isFunction(addlValidation)
      ? addlValidation(data.singleLineText.trim())
      : [];
    return { messages: errors, validatedData: data.singleLineText.trim() };
  };

  return (
    <FormTemplate
      ref={formTemplateRef}
      onValidation={handleValidation}
      onSave={(data) => console.log("Name Form Data:", data)}
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

  return formsMap[type] || null;
};

export { FormTypes };
export default Forms;
