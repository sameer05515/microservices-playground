import { useCallback } from "react";
import useSPPNavigation from "../../common/hooks/useSPPNavigation";
import Step1DataRenderer from "./Step1DataRenderer";
import Step2DataRenderer from "./Step2DataRenderer";

const ChatDataXRayV1 = () => {
  const { searchParams, goToTestingRoute } = useSPPNavigation();
  const widget = searchParams.get("widget");
  const slug = searchParams.get("s");
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
  return (
    <div>
      {!widget && <Step1DataRenderer onSlugClick={showConversations} />}
      {widget === "conv" && <Step2DataRenderer slug={slug}/>}
    </div>
  );
};

export default ChatDataXRayV1;
