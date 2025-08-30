import React, { useCallback, useEffect } from "react";
import { apiRequest } from "../../common/utils/apiClient/v1";

const ConvMessageRenderer = ({ slug, convId }) => {
  const fetchItr2 = useCallback(() => {
    apiRequest({
      url: `http://localhost:3000/analyse-cgpt/api/step-3-fetch-messages-of-conversation/itr1/${slug}/${convId}`,
    })
      .then((resp) => {
        console.log(resp);
        // setStep1Data(resp.data);
      })
      .catch((err) => console.error(err));
  }, [slug, convId]);

  useEffect(() => fetchItr2(), [fetchItr2]);

  return (
    <div>
      <h1>ConvMessageRenderer</h1>

      <div>
        slug: {slug}, convId: {convId}
      </div>
    </div>
  );
};

export default ConvMessageRenderer;
