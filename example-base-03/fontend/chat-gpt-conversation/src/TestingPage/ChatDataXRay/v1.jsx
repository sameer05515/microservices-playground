import { useCallback } from "react";
import useSPPNavigation from "../../common/hooks/useSPPNavigation";
import Step1DataRenderer from "./Step1DataRenderer";
import Step2DataRenderer from "./Step2DataRenderer";
import ConvMessageRenderer from "./ConvMessageRenderer";

const ChatDataXRayV1 = () => {
  const { searchParams, goToTestingRoute } = useSPPNavigation();
  const widget = searchParams.get("widget");
  const slug = searchParams.get("s");
  const convId = searchParams.get("c");
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
  return (
    <div>
      {!widget && <Step1DataRenderer onSlugClick={showConversations} />}
      {widget === "conv" && <Step2DataRenderer onConvClick={showConversationMessages} slug={slug} />}
      {widget === "conv-messages" && <ConvMessageRenderer slug={slug} convId={convId} />}
    </div>
  );
};

export default ChatDataXRayV1;
