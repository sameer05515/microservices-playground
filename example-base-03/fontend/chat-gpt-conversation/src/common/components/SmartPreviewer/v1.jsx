import React, { useMemo } from "react";
import MDSectionV6 from "../MDSection/v6";
import { StringifiedPreV2 } from "../StringifiedPre/v2";
import { availableOutputTypes, isValidOutputType } from "./utils";
import { isValidString } from "../../utils/basic-validations";

/** Debug flag for admin settings (to be managed post optimization). */
export const debug = false;

const SmartPreviewer = ({
  data = { content: "", textOutputType: "", textInputType: "" },
  className: extraClass = "",
}) => {
  //   const containerRef = useRef(null);

  const { textOutputType, content, className } = useMemo(
    () => ({
      textOutputType:
        data?.textOutputType && isValidOutputType(data.textOutputType)
          ? data.textOutputType
          : availableOutputTypes.TEXT,
      content: isValidString(data?.content) ? data?.content : "",
      className: isValidString(extraClass) ? extraClass : "",
    }),
    [data, extraClass]
  );
  //   const textInputType = isValidInputType(it) ? it : availableInputTypes.textArea;

  //   useEffect(() => {
  //     const container = containerRef.current;
  //     if (container) {
  //       // Remove inline color styles from all elements
  //       container.querySelectorAll("[style]").forEach((el) => {
  //         el.style.color = ""; // Reset inline color
  //         el.style.background=""
  //       });
  //     }
  //   }, [content]);

  if (!content) {
    console.warn(`Invalid data provided: '${JSON.stringify(data)}'`);
    return debug ? <div>Invalid data provided: {JSON.stringify(data)}</div> : null;
  }

  const renderContent = () => {
    switch (textOutputType) {
      case availableOutputTypes.MARKDOWN:
        return <MDSectionV6 content={content} />;
      case availableOutputTypes.HTML:
        return (
          <div
            className="prose dark:prose-invert max-w-full"
            // ref={containerRef}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        );
      case availableOutputTypes.TEXT:
      case availableOutputTypes.TABBED_INDENTED_STRING:
      case availableOutputTypes.YAML:
        return <pre className="whitespace-pre-wrap break-words max-w-full">{content}</pre>;
      default:
        return null;
    }
  };

  return (
    <div className={`${className}`}>
      {renderContent()}
      {debug && <StringifiedPreV2 obj={data} space={2} />}
    </div>
  );
};

export default SmartPreviewer;
