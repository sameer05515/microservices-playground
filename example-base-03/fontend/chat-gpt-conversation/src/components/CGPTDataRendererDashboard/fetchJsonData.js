import { formatUnixTimestamp, getConversationMessages } from "./UtilityMethods";

 // Utility function for fetching data
export const fetchJsonData = async (selectedFile, setJsonData) => {
  if (!selectedFile) return;
  try {
    const response = await fetch(selectedFile);
    if (!response.ok) throw new Error("Failed to fetch data");
    const data = await response.json();

    // Transform the data
    const formattedData = data.map((conv, index) => ({
      id: `conv_${index + 1}`,
      title: conv.title,
      messages: getConversationMessages(conv) || [],
      createdOn: conv.create_time ? formatUnixTimestamp(conv.create_time) : null,
      updatedOn: conv.update_time ? formatUnixTimestamp(conv.update_time) : null,
    }));

    setJsonData(formattedData);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};