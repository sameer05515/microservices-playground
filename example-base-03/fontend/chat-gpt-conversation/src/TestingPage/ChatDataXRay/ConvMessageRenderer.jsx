import React, { useCallback, useEffect, useState } from "react";
import { apiRequest } from "../../common/utils/apiClient/v1";

const ConvMessageRenderer = ({ slug, convId }) => {
  const [convo, setConvo] = useState(null);
  const fetchItr2 = useCallback(() => {
    apiRequest({
      url: `http://localhost:3000/analyse-cgpt/api/step-3-fetch-messages-of-conversation/itr1/${slug}/${convId}`,
    })
      .then((resp) => {
        console.log(resp);
        setConvo(resp.data);
      })
      .catch((err) => console.error(err));
  }, [slug, convId]);

  useEffect(() => fetchItr2(), [fetchItr2]);

  if (!convo) {
    return null;
  }

  return (
    <div className="max-w-full mx-auto">
      <h1 className="text-2xl font-bold mb-4">ConvMessageRenderer</h1>

      <div className="mb-4 text-gray-700 dark:text-gray-200">
        slug: {slug}, convId: {convId}
      </div>

      <div className="shadow-md rounded-lg overflow-hidden">
        <div className="bg-gray-200 dark:bg-gray-900 px-4 py-2">
          <h5 className="text-lg font-semibold">{convo.title}</h5>
        </div>
        <div className="p-4">
          <p>
            <span className="font-semibold">ID:</span> {convo.id}
          </p>
          <p>
            <span className="font-semibold">Created On:</span> {convo.createdOn}
          </p>
          <p>
            <span className="font-semibold">Updated On:</span> {convo.updatedOn}
          </p>
          <p>
            <span className="font-semibold">Message Count:</span> {convo.msgCount}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConvMessageRenderer;
