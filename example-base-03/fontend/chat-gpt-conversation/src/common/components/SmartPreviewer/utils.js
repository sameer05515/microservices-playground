import { APPLICATION_OBJECT_THEME_KEY, getItemForKey, KEYS } from "../../utils/LocalSessionManager";

export const availableOutputTypes = {
  TEXT: "text",
  HTML: "html",
  YAML: "yaml",
  MARKDOWN: "markdown",
  TABBED_INDENTED_STRING: "skeleton",
};

export const availableInputTypes = {
  textArea: "TextArea",
  ckEditor: "CKEditor",
};

export const isValidOutputType = (textOutputType) =>
  Object.values(availableOutputTypes).includes(textOutputType);
export const isValidInputType = (textInputType) => Object.values(availableInputTypes).includes(textInputType);

/**
 * @deprecated
 *
 */
export const preprocessRawHtmlContent = (htmlContent) => {
  const viewMode = getItemForKey(KEYS.viewMode, APPLICATION_OBJECT_THEME_KEY);
  // console.log("viewMode: " + viewMode);
  // Replace conflicting classes with theme-compliant ones
  const isDarkMode = viewMode === "dark";
  return isDarkMode ? htmlContent.replace(/class="([^"]*)"/g, 'class="$1 dark:prose-invert"') : htmlContent;
};
