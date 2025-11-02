import { useCallback } from "react";
import useSPPNavigation from "../../common/hooks/useSPPNavigation";
import Step1DataRenderer from "./Step1DataRenderer";
import Step2DataRenderer from "./Step2DataRenderer";
import ConvMessageRenderer from "./ConvMessageRenderer";
import DatewiseMessageTable from "./DatewiseMessageTable";
import DatewiseMessageRenderer from "./DatewiseMessageRenderer";

const ChatDataXRayV1 = () => {
  const { searchParams, goToTestingRoute } = useSPPNavigation();
  const widget = searchParams.get("widget");
  const slug = searchParams.get("s");
  const convId = searchParams.get("c");
  const selectedDate = searchParams.get("d");
  const showConversations = useCallback(
    (slug) => {
      if (!slug) return;
      goToTestingRoute({
        search: {
          tester: "ChatDataXRayV1",
          widget: "conv",
          s: slug,
        },
      });
    },
    [goToTestingRoute]
  );

  const showDatewiseSlugTable = useCallback(
    (slug) => {
      if (!slug) return;
      goToTestingRoute({
        search: {
          tester: "ChatDataXRayV1",
          widget: "datewise",
          s: slug,
        },
      });
    },
    [goToTestingRoute]
  );

  const showConversationMessages = useCallback(
    (slug, convId) => {
      if (!slug) return;
      goToTestingRoute({
        search: {
          tester: "ChatDataXRayV1",
          widget: "conv-messages",
          s: slug,
          c: convId,
        },
      });
    },
    [goToTestingRoute]
  );


  const showDateMessages = useCallback(
    (slug, date) => {
      if (!slug) return;
      goToTestingRoute({
        search: {
          tester: "ChatDataXRayV1",
          widget: "date-messages",
          s: slug,
          d: date,
        },
      });
    },
    [goToTestingRoute]
  );
  return (
    <div>
      {!widget && (
        <Step1DataRenderer onSlugClick={showConversations} onDateWiseSlugClick={showDatewiseSlugTable} />
      )}
      {widget === "conv" && <Step2DataRenderer onConvClick={showConversationMessages} slug={slug} />}
      {widget === "conv-messages" && (
        <ConvMessageRenderer slug={slug} convId={convId} onConvClick={showConversationMessages} />
      )}
      {widget === "datewise" && <DatewiseMessageTable slug={slug} onDateClick={showDateMessages} />}
      {widget==="date-messages" && <DatewiseMessageRenderer slug={slug} selectedDate={selectedDate} onSelectedDateClick={showDateMessages}   />}
    </div>
  );
};

export default ChatDataXRayV1;
