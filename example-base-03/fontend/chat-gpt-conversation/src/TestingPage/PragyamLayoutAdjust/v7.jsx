import React from "react";
import { isValidArray } from "../../common/utils/basic-validations";
import {
  PragyamLayoutAdjustV7ContextProvider,
  usePragyamLayoutAdjustV7Context,
} from "./PragyamLayoutAdjustV7Context";
import ConversationListV2 from "./sub-components/ConversationList/v2";
import ErrorDisplay from "./sub-components/ErrorDisplay/v1";
import { JsonFileListV2 } from "./sub-components/JsonFileList/v2";
import ConvMessageDisplay from "./sub-components/ConvMessageDisplay/v2";
import NavigationComponent from "./sub-components/NavigationComponent/v1";
import { StringifiedPre } from "./sub-components/StringifiedPre/v1";
import { AiFillForward as NextIcon, AiFillBackward as PrevIcon } from "react-icons/ai";

const ConvMessagesList = ({ messages }) => {
  if (!messages) {
    return <div>No Messages to display</div>;
  }
  return (
    <>
      <div className="w-full text-wrap">
        {messages.map((message) => (
          <ConvMessageDisplay
            key={message.id}
            markdownText={message.text}
            // showCopyToclipboardButton={!message.isUserMessage}
            showCopyToclipboardButton={true}
            isUserMessage={message.isUserMessage}
            createdOn={message.createdOn}
            updatedOn={message.updatedOn}
          />
        ))}
      </div>
    </>
  );
};

const MessagesNavigationComponent = ({ onPrevClick, onNextClick }) => {
  return (
    <div className="flex justify-between items-center mt-4 gap-10">
      <button
        title="Previous User Message"
        onClick={() => onPrevClick && onPrevClick()}
        className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 transition duration-200"
      >
        <PrevIcon />
      </button>
      <button
        title="Next User Message"
        onClick={() => onNextClick && onNextClick()}
        className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 transition duration-200"
      >
        <NextIcon />
      </button>
    </div>
  );
};

const PragyamLayoutAdjustV7 = () => {
  const {
    fileDetails,
    isErrorOccurred,
    errorMessage,
    goBack,
    handleFileSelection,
    handleConversationSelection,
    handleMessageSelection,
    fileId,
    jsonFileData,
    // intermediateData,
    conversationDetails,
    conversationId,
    state,
    debug,
    adminSettings,
    groupedMessages,
    prevUserMessageId,
    nextUserMessageId,
    currentUserMessageSequenceNo,
    totalUserMessages,
  } = usePragyamLayoutAdjustV7Context();

  if (isErrorOccurred) {
    return (
      <>
        <ErrorDisplay errorMessage={errorMessage} onGoBack={goBack} />
        <JsonFileListV2 tester="PragyamLayoutAdjustV7" onClick={handleFileSelection} />
      </>
    );
  }

  if (!fileId || !jsonFileData) {
    return <JsonFileListV2 tester="PragyamLayoutAdjustV7" onClick={handleFileSelection} />;
  }

  return (
    <div className="max-w-4xl mx-auto mt-1 flex flex-col items-center p-1 text-sm border border-gray-100 dark:border-gray-800 rounded-lg shadow-sm">
      {fileDetails && conversationDetails?.conversationSequenceNo && (
        <NavigationComponent
          onPrevClick={() => handleConversationSelection(conversationDetails.prevConversationId)}
          onNextClick={() => handleConversationSelection(conversationDetails.nextConversationId)}
          jsonFileName={fileDetails?.id}
          conversationTitle={`[${conversationDetails?.conversationSequenceNo}/${
            jsonFileData?.data?.length || 0
          }]: ${conversationDetails?.title}`}
          totalConversationMessagesCount={conversationDetails?.totalMessages}
          createdOn={conversationDetails?.createdOn}
          updatedOn={conversationDetails?.updatedOn}
        />
      )}

      {!conversationId && isValidArray(jsonFileData?.data) && (
        <ConversationListV2 data={jsonFileData.data} onClick={handleConversationSelection} />
      )}

      {adminSettings.showAllMessages && conversationId && conversationDetails?.messages && (
        <ConvMessagesList messages={conversationDetails.messages} />
      )}

      {adminSettings.showGroupedMessages && groupedMessages && prevUserMessageId && nextUserMessageId && (
        <MessagesNavigationComponent
          onPrevClick={() => handleMessageSelection(prevUserMessageId)}
          onNextClick={() => handleMessageSelection(nextUserMessageId)}
        />
      )}

      {adminSettings.showGroupedMessages &&
        currentUserMessageSequenceNo &&
        currentUserMessageSequenceNo > 0 && (
          <h2>
            User Question No: {currentUserMessageSequenceNo}/{totalUserMessages}
          </h2>
        )}

      {adminSettings.showGroupedMessages && groupedMessages && currentUserMessageSequenceNo > 0 && (
        <ConvMessagesList messages={groupedMessages} />
      )}
      {adminSettings.showGroupedMessages && groupedMessages && prevUserMessageId && nextUserMessageId && (
        <MessagesNavigationComponent
          onPrevClick={() => handleMessageSelection(prevUserMessageId)}
          onNextClick={() => handleMessageSelection(nextUserMessageId)}
        />
      )}

      {debug.showState && (
        <>
          <h1 className="text-lg font-semibold mt-4">Location States</h1>
          <StringifiedPre obj={state} space={4} />
        </>
      )}

      {debug.showMessageMap && (
        <>
          <h1 className="text-lg font-semibold mt-4">messageMap</h1>
          {conversationDetails?.messageMap && (
            <StringifiedPre
              obj={{
                firstUserMessageId: conversationDetails?.firstUserMessageId,
                messageMap: Object.fromEntries(conversationDetails?.messageMap),
              }}
              space={4}
            />
          )}
        </>
      )}

      {fileDetails && conversationDetails?.prevConversationId && (
        <NavigationComponent
          onPrevClick={() => handleConversationSelection(conversationDetails.prevConversationId)}
          onNextClick={() => handleConversationSelection(conversationDetails.nextConversationId)}
          jsonFileName={fileDetails?.id}
          conversationTitle={conversationDetails?.title}
          totalConversationMessagesCount={conversationDetails?.totalMessages}
          createdOn={conversationDetails?.createdOn}
          updatedOn={conversationDetails?.updatedOn}
        />
      )}
    </div>
  );
};

const withContext = () => {
  return (
    <PragyamLayoutAdjustV7ContextProvider>
      <PragyamLayoutAdjustV7 />
    </PragyamLayoutAdjustV7ContextProvider>
  );
};

export default withContext;
