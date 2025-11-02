import React, { useCallback, useEffect, useState } from "react";
import { apiRequest } from "../../common/utils/apiClient/v1";
import QAViewer from "./QAViewer";
import { useDispatch } from "react-redux";
import { hideBackdropV3, showBackdropV3 } from "../../store/v2/backdrop/actions";

const ConvMessageRenderer = ({ slug, convId, onConvClick }) => {
  const dispatch = useDispatch();
  const [convo, setConvo] = useState(null);
  const fetchItr2 = useCallback(() => {
    dispatch(showBackdropV3({ title: "Starting search for selected conversation data" }));
    apiRequest({
      url: `http://localhost:3000/analyse-cgpt/api/step-3-fetch-messages-of-conversation/itr1/${slug}/${convId}`,
    })
      .then((resp) => {
        console.log(resp);
        setConvo(resp.data);
      })
      .catch((err) => console.error(err))
      .finally(()=>{
        dispatch(hideBackdropV3());
      })
  }, [dispatch, slug, convId]);

  useEffect(() => fetchItr2(), [fetchItr2]);

  if (!convo) {
    return null;
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-800 flex flex-col h-screen p-6">
      <div className="container mx-auto shadow-lg rounded-lg flex flex-col h-full">
        <div className="flex justify-between items-center p-4 h-[10vh] border-b">
          {/* <a className="font-bold text-2xl text-white hover:opacity-80" href="/">
            🏠
          </a> */}

          {/* <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-100">Chat Messages</h4> */}
          <div className="p-4 text-xs text-gray-600 dark:text-gray-100">
            <p>
              {/* <span className="font-semibold">ID:</span>  */}
              {convo.title} ({convo.selectedIndex+1}/{convo.totalConv})
            </p>
            <p>
              <span className="font-semibold">Created On:</span> {convo.createdOn}
            </p>
            <p>
              <span className="font-semibold">Updated On:</span> {convo.updatedOn}
            </p>
            <p>
              <span className="font-semibold">Message Count:</span> {convo.msgCount}
            </p>
          </div>
          <div>
            <button
              id="prevConversationBtn"
              title="Prev Conversation"
              className="px-4 py-2 bg-gray-300 text-gray-100 dark:text-gray-700 rounded-lg disabled:opacity-50"
              onClick={() => onConvClick(slug, convo.prev)}
            >
              ⏪
            </button>
            <button
              id="nextConversationBtn"
              title="Next Conversation"
              className="px-4 py-2 bg-gray-300 text-gray-100 dark:text-gray-700 rounded-lg disabled:opacity-50"
              onClick={() => onConvClick(slug, convo.next)}
            >
              ⏩
            </button>
          </div>
        </div>

        <div id="root" className="flex-1 p-4 overflow-auto h-[50vh] space-y-4">
          {convo.messages.map((msg) => (
            <QAViewer key={msg.q.id} data={msg} />
          ))}
        </div>

        {/* <div className="flex justify-between items-center p-4 h-[10vh] border-t">
          <div id="pageNavigationBtnContainer">
            <button
              id="prevPageBtn"
              title="Prev Page"
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50"
            >
              ⬅️
            </button>

            <button
              id="nextPageBtn"
              title="Next Page"
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50"
            >
              ➡️
            </button>
          </div>
          <span id="conversationIndex" className="text-xs text-gray-600 dark:text-gray-100"></span>
          <button
            id="toggle-theme"
            className="bg-gray-300 px-3 py-1 rounded-md text-black hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500 focus:outline-none"
            aria-label="Toggle Dark Mode"
          >
            🌙 Dark Mode
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default ConvMessageRenderer;
