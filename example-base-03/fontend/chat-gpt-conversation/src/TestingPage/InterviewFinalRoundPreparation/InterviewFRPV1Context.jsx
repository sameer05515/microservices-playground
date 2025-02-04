import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import useSPPNavigation from "../../common/hooks/useSPPNavigation";
import { getQuestionDetailsById } from "./questionData";
import ModalV3 from "../../common/hoc/withModal/v3";
import TextInputWithRef from "./TextInputWithRef";
import { isValidString } from "../../common/utils/basic-validations";
import { prepareErrorMessage } from "../../common/utils/message-preparation-utils-v2";

const InterviewFRPV1Context = createContext();

const modalInitialState = {
  isOpen: false,
  purpose: "",
  existingValue: { id: "", text: "" },
  title: "",
};

export const ModalOpenPurposes = {
  AddSection: "add-section",
  EditSection: "edit-section",
  AddChildSection: "add-child-section",
  AddQuestion: "add-question",
  EditQuestion: "edit-question",
  AddAnswer: "add-answer",
  EditAnswer: "edit-answer",
};

const validPurposes = Object.values(ModalOpenPurposes);

export const InterviewFRPV1ContextProvider = ({ children }) => {
  const [modalState, setModalState] = useState(modalInitialState);
  const textInputRef = useRef();
  const { searchParams, location, goToTestingRoute } = useSPPNavigation();
  const state = useMemo(() => location.state || {}, [location.state]);
  const selectedQuestionId = searchParams.get("questionId");
  const selectedQuestionData = useMemo(
    () => getQuestionDetailsById(selectedQuestionId),
    [selectedQuestionId]
  );

  const selectedQuestionListItemRef = useRef(null);
  useEffect(() => {
    if (selectedQuestionListItemRef.current) {
      selectedQuestionListItemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedQuestionId]);

  const handleQuestionSelection = useCallback(
    (questionId) => {
      goToTestingRoute({
        search: {
          tester: "InterviewFinalRoundPreparationV1",
          questionId: questionId,
        },
        state: { ...state },
      });
    },
    [goToTestingRoute, state]
  );

  const openTextInputModal = useCallback((title, purpose, existingValue = { id: "", text: "" }) => {
    if (!isValidString(title)) {
      console.warn(`Invalid purpose: '${title}'`, "Please select ");
      return;
    }
    if (!isValidString(purpose) || !validPurposes.includes(purpose)) {
      console.warn(`Invalid purpose: '${purpose}'`, "Please select from validPurposes: ", validPurposes);
      return;
    }
    setModalState((prev) => ({
      ...prev,
      title,
      purpose,
      isOpen: true,
      existingValue,
    }));
  }, []);

  const closeTextInputModal = useCallback(() => {
    setModalState(modalInitialState);
  }, []);

  const validateAndSubmitAccordingToPurpose = useCallback((value) => {
    const errorMessages = [];
    try {
      if (!isValidString(value)) {
        throw new Error("value should not be empty");
      }
      return { isValid: true, errorMessages };
    } catch (error) {
      const errorMessage = prepareErrorMessage(error, "An unexpected error occurred during data fetching");

      return { isValid: true, errorMessages: [errorMessage] };
    }
  }, []);

  const handleSubmit = useCallback(
    (value) => {
      const { errorMessages, isValid } = validateAndSubmitAccordingToPurpose(value);
      if (!isValid) {
        textInputRef.current?.addAPIErrorMessages(["Something went wrong!", ...errorMessages]);
      }
    },
    [validateAndSubmitAccordingToPurpose]
  );
  return (
    <InterviewFRPV1Context.Provider
      value={{
        selectedQuestionId,
        selectedQuestionData,
        handleQuestionSelection,
        selectedQuestionListItemRef,
        openTextInputModal,
      }}
    >
      {children}
      <ModalV3 isOpen={modalState.isOpen} onClose={closeTextInputModal} showCloseButton>
        <TextInputWithRef
          title={modalState.title}
          initialText={modalState.existingValue?.text || ""}
          onSubmit={handleSubmit}
          ref={textInputRef}
        />
      </ModalV3>
    </InterviewFRPV1Context.Provider>
  );
};

// Hook to use the context
export const useInterviewFRPV1Context = () => {
  const context = useContext(InterviewFRPV1Context);
  if (!context) {
    throw new Error("useInterviewFRPV1Context must be used within a InterviewFRPV1ContextProvider");
  }
  return context;
};
