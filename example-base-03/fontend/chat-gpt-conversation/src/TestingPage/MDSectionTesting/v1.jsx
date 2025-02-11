import React, { useCallback } from "react";
import MDSectionV8 from "../../common/components/MDSection/v8";

const MDSectionV8TesingV1 = () => {
  const handleRecievingSuccessResponse = useCallback((response) => response.data?.content || "", []);
  return (
    <div>
      <MDSectionV8
        mdFileUrl="http://localhost:3000/api/smart-content/v1/actionables--my-bugs-and-new-requirements-md"
        onRecievingSuccessResponse={handleRecievingSuccessResponse}
      />
    </div>
  );
};

export default MDSectionV8TesingV1;
