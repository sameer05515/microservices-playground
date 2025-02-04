import {
  APPLICATION_OBJECT_CHAT_RENDERER_KEY,
  getItemForKey,
  KEYS,
  setItemForKey,
} from "../../../common/utils/LocalSessionManager";

export const getLastSideBarState = () => {
  const isClosedSidebar = getItemForKey(
    KEYS.ConsolidatedReportV1_SidebarClosed,
    APPLICATION_OBJECT_CHAT_RENDERER_KEY
  );
  return isClosedSidebar === "close";
};

export const setSideBarState = (newValue) => {
  setItemForKey(KEYS.ConsolidatedReportV1_SidebarClosed, newValue, APPLICATION_OBJECT_CHAT_RENDERER_KEY);
};

export const getFormattedDate = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
