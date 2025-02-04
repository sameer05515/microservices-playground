import { LATEST_CONVERSATION_FILE } from "../../../components/CGPTDataRendererDashboard/constants";

const initialState = {
  jsonData: [],
  filteredData: [],
  selectedFile:LATEST_CONVERSATION_FILE,
  selectedConv: null,
  uiState:{
    showSearchSection: false,
    showSideBar: true,
    collapseAll: true,
  }
};

export default initialState;
