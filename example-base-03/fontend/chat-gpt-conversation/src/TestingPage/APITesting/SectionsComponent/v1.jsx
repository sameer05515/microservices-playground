import React from "react";
import { useSelector } from "react-redux";

const SectionsComponentV1 = () => {
  // const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.crReport.nodeList);

  // const handleFetch = useCallback(() => {
  //   dispatch(fetchSections());
  // }, [dispatch]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold text-blue-600 animate-pulse">Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold text-red-600">Error: {error}</p>
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-center mb-6">
        <button
          // onClick={handleFetch}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Fetch Data
        </button>
      </div>

      {data.length === 0 ? (
        <div className="flex justify-center text-gray-600">
          <p>No data available. Click "Fetch Data" to load sections.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((section) => (
            <div key={section.uniqueId} className="p-4 border rounded-lg shadow-sm bg-white hover:shadow-md">
              <p className="font-semibold text-gray-800">{section.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SectionsComponentV1;
