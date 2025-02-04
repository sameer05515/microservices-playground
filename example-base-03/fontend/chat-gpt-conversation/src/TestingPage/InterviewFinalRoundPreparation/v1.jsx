import React from "react";
import Left from "./Left";
import Right from "./Right";
import { InterviewFRPV1ContextProvider } from "./InterviewFRPV1Context";

const InterviewFinalRoundPreparationV1 = () => {
  return (
    <div className="flex flex-row w-full text-wrap break-word p-5 max-h-[80vh] overflow-y-auto">
      <Left className="flex-[1_1_0%] overflow-y-auto" />
      <Right className="flex-[3_1_0%] overflow-y-auto" />
    </div>
  );
};

const withContext = () => {
  return (
    <InterviewFRPV1ContextProvider>
      <InterviewFinalRoundPreparationV1 />
    </InterviewFRPV1ContextProvider>
  );
};

export default withContext;
