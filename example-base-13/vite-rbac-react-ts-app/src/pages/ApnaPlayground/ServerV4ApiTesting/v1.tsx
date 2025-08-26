import { apiRequest } from "../../../common/service/apiClient/v1";
import { APIBaseURL } from "../../../common/constants/APIConstants";

const ServerV4ApiTestingV1 = () => {
  const handleClick = (uri: string = "items") =>
    apiRequest({ method: "get", url: uri, baseURL: `${APIBaseURL}/api/v4` })
      .then((response) => console.log(response))
      .catch((error) => console.error("Unexpected error: ", error));

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">API Testing V4</h1>
        <button
          onClick={() => handleClick("items")}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 shadow-md"
        >
          Fetch All Items
        </button>
        <button
          onClick={() => handleClick("generate-items")}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 shadow-md"
        >
          Generate Items
        </button>
      </div>
    </div>
  );
};

export default ServerV4ApiTestingV1;
