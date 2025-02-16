import React, { useCallback, useRef, useMemo } from "react";
import MDSectionV8 from "../../common/components/MDSection/v8";
import useSPPNavigation from "../../common/hooks/useSPPNavigation";
import { isValidString } from "../../common/utils/basic-validations";

const MDSectionV8TestingV2 = () => {
  //"http://localhost:3000/v2/api/smart-content/itr1/actionables--my-bugs-and-new-requirements-md"
  // const [mdFileUrl, setMdFileUrl] = useState("http://localhost:3000/v2/api/smart-content/itr1/actionables--my-bugs-and-new-requirements-md");
  // const [submittedUrl, setSubmittedUrl] = useState("");

  const { searchParams, goToTestingRoute } = useSPPNavigation();
  const inputText =
    searchParams.get("mdFileUrl") ||
    "http://localhost:3000/v2/api/smart-content/itr1/actionables--my-bugs-and-new-requirements-md";

  const ref = useRef(null);
  const submittedUrl = useMemo(() => {
    if (!isValidString(inputText)) return "";
    // const datePart = getFormattedDate();
    // const kebabCasePart = toKebabCase(inputText);
    return inputText;
  }, [inputText]);

  const handleRecievingSuccessResponse = useCallback((response) => response.data?.content || "", []);

  const handleSubmit = () => {
    // e.preventDefault();
    // setSubmittedUrl(mdFileUrl.trim() ? mdFileUrl : ""); // Trim to remove accidental spaces

    goToTestingRoute({
      search: {
        tester: "MDSectionV8TesingV2",
        mdFileUrl: ref.current?.value || "",
      },
    });
  };

  return (
    <div className="p-4">
      <div>
        <h3>For quick reference: Other valid slugs:</h3>
        <p>
          16Feb2025.know-your-positivity--todays-target---live-the-initial-website-on-github-pages-by-eod-today
        </p>
        <p>actionables--my-bugs-and-new-requirements-md</p>
      </div>
      
      {/** TBDL: div me onSubmit?? isko remove karna hai. with proper testing. */}
      <div onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <input
          type="text"
          className="border px-3 py-2 w-full bg-white text-black rounded"
          placeholder="Enter markdown file URL"
          defaultValue={inputText}
          ref={ref}
          // onChange={(e) => setMdFileUrl(e.target.value)}
        />
        <button
          title="Currently reload not working. Workaround is copy other slug and then recopy"
          type="button"
          onClick={() => handleSubmit()}
          className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
        >
          Load
        </button>
      </div>

      {/* Conditional Rendering */}
      {submittedUrl && (
        <MDSectionV8 mdFileUrl={submittedUrl} onRecievingSuccessResponse={handleRecievingSuccessResponse} />
      )}
    </div>
  );
};

export default MDSectionV8TestingV2;
