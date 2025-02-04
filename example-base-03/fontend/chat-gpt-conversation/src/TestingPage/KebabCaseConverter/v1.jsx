import React, { useMemo, useRef, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { FiCheck, FiCopy } from "react-icons/fi";
import useSPPNavigation from "../../common/hooks/useSPPNavigation";
import { isValidString } from "../../common/utils/basic-validations";

// Function to convert text to kebab-case
function toKebabCase(text = "") {
  return text
    .toLowerCase() // Convert to lowercase
    .replace(/[^a-z0-9\s]/g, "") // Remove non-alphanumeric characters
    .trim() // Remove leading and trailing spaces
    .replace(/ /g, "-"); // Replace each space with '-'
}

// Function to get the current date in 'ddMMMyyyy' format
function getFormattedDate() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = months[today.getMonth()];
  const year = today.getFullYear();
  return `${day}${month}${year}`;
}

const showCopyToclipboardButton = true;
const KebabCaseConverterV1 = () => {
  const { searchParams, goToTestingRoute } = useSPPNavigation();
  const inputText = searchParams.get("inputText");
  // const [inputText, setInputText] = useState("");
  // const [convertedText, setConvertedText] = useState("");
  const ref = useRef(null);

  const convertedText = useMemo(() => {
    if (!isValidString(inputText)) return "";
    const datePart = getFormattedDate();
    const kebabCasePart = toKebabCase(inputText);
    return `${datePart}.${kebabCasePart}`;
  }, [inputText]);

  const handleConvert = () => {
    // const datePart = getFormattedDate();
    // const kebabCasePart = toKebabCase(ref.current?.value||"");
    // setConvertedText(`${datePart}.${kebabCasePart}`);

    goToTestingRoute({
      search: {
        tester: "KebabCaseConverterV1",
        inputText: ref.current?.value || "",
      },
    });
  };

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 5000);
  };

  return (
    <div className="p-4 border rounded shadow-lg ml-32">
      <h2 className="text-lg font-semibold">Kebab Case Converter</h2>
      <input
        type="text"
        defaultValue={inputText}
        ref={ref}
        // onChange={(e) => setInputText(e.target.value)}
        placeholder="Enter text"
        className="w-full bg-white text-black p-2 border rounded mb-2"
      />

      <div className="flex justify-between items-center mb-0.5 text-xs">
        <button
          onClick={() => handleConvert()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Convert
        </button>

        {showCopyToclipboardButton && !copied && (
          <CopyToClipboard text={convertedText} onCopy={handleCopy}>
            <button
              className="gap-2 px-2 py-1 bg-blue-600 dark:bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
              title="Copy to Clipboard"
            >
              <FiCopy className="text-sm" size={8} />
              {/* Copy to Clipboard */}
            </button>
          </CopyToClipboard>
        )}
        {copied && (
          <span className="gap-2 text-green-600 text-sm font-medium" title="Copied!">
            <FiCheck className="text-sm" size={8} />
            Copied!
          </span>
        )}
      </div>
      {convertedText && (
        <div className="text-green-500 text-xl mb-2">
          <strong>Converted Text:</strong> <br /> <span>{convertedText}</span>
        </div>
      )}
    </div>
  );
};

export default KebabCaseConverterV1;
