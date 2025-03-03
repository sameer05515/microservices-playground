import React from "react";
import { getConversationFileNames } from "./utils";

const ChatDataXRayV1 = () => {
  return (
    <div>
      <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(getConversationFileNames())}</pre>
    </div>
  );
};

export default ChatDataXRayV1;
