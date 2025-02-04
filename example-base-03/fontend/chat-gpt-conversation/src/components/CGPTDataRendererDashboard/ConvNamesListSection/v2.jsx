import React, { useEffect, useRef } from "react";
import { usePragyamContext } from "../PragyamContext";

const ConvNamesListSectionV2 = () => {
  const { conversationNames, selectedConversationId, handleLinkSelection, uiState } = usePragyamContext();
  const myRef = useRef(null);

  useEffect(() => {
    if (myRef.current) {
      myRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }, []);

  if (!uiState.showSideBar) {
    return null;
  }

  return (
    <div className="w-[15vw] border-r border-gray-300">
      {/* <h2 className="text-lg font-bold">Conversation Names</h2> */}
      <ul className="mt-2 space-y-1 max-w-[10vw] max-h-[87vh] overflow-y-auto">
        {conversationNames &&
          conversationNames.map((conv) => (
            <li key={conv.id}>
              <span
                ref={selectedConversationId && selectedConversationId === conv.id ? myRef : null}
                className={`cursor-pointer px-2 py-1 block rounded ${
                  selectedConversationId && selectedConversationId === conv.id
                    ? "font-bold text-lg text-green-500"
                    : "hover:bg-gray-200 dark:hover:bg-neutral-100 hover:text-black"
                }`}
                onClick={() => handleLinkSelection(conv)}
              >
                {conv.title}
              </span>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default ConvNamesListSectionV2;
