import React from "react";
import classes from "./form-message.module.css";

// Enum-like Object for Error Types
const FormMessageTypes = {
  Success: "success",
  Warning: "warning",
  FormValidation: "form-validation",
  APIResponseError: "API-Response-Error",
};

// Utility Function to Add Error Messages
const addFormMessage = (messageType, message = "", arr = []) => [
  ...arr,
  { messageType, message },
];

// Helper Functions to Append Different Error Types
const appendMessageByType = (type) => (message = "", arr = []) =>
  addFormMessage(type, message, arr);

const appendSuccessMessage = appendMessageByType(FormMessageTypes.Success);
const appendWarningMessage = appendMessageByType(FormMessageTypes.Warning);
const appendFormValidationMessage = appendMessageByType(FormMessageTypes.FormValidation);
const appendAPIResponseErrorMessage = appendMessageByType(FormMessageTypes.APIResponseError);

// Check if there are Validation or API Response Error Messages
const hasValidationOrAPIResponseErrorMessages = (arr = []) =>
  arr.some(({ messageType }) =>
    [FormMessageTypes.FormValidation, FormMessageTypes.APIResponseError].includes(messageType)
  );

// Get CSS Class based on Message Type
const getClassName = (messageType) => {
  const baseClass = classes["form-message-item"];
  const typeClassMap = {
    [FormMessageTypes.Success]: classes["form-message-success"],
    [FormMessageTypes.Warning]: classes["form-message-warning"],
    [FormMessageTypes.FormValidation]: classes["form-message-validation"],
    [FormMessageTypes.APIResponseError]: classes["form-message-api-error"],
  };

  return `${baseClass} ${typeClassMap[messageType] || ""}`.trim();
};

// Get Icon based on Message Type
const getMessageIcon = (messageType) => {
  const messageIconMap = {
    [FormMessageTypes.Success]: "✅",
    [FormMessageTypes.Warning]: "⚠️",
    [FormMessageTypes.FormValidation]: "❌",
    [FormMessageTypes.APIResponseError]: "🚫",
  };

  return messageIconMap[messageType] || "";
};

// Functional Component to Display Form Messages
const FormMessage = React.memo(({ formMessages = [] }) => (
  formMessages.length > 0 && (
    <div className={classes["form-message-container"]}>
      {formMessages.map(({ messageType, message }, index) => (
        <div key={index} className={getClassName(messageType)}>
          <span className={classes["form-message-icon"]}>{getMessageIcon(messageType)}</span>
          <span className={classes["form-message-text"]}>{messageType}: {message}</span>
        </div>
      ))}
    </div>
  )
));

export default FormMessage;
export {
  appendSuccessMessage,
  appendWarningMessage,
  appendFormValidationMessage,
  appendAPIResponseErrorMessage,
  hasValidationOrAPIResponseErrorMessages,
};
