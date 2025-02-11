import React, { useCallback } from "react";
import MDSectionV8 from "../../common/components/MDSection/v8";

const MDSectionTesingV1 = () => {
  const handleRecievingSuccessResponse = useCallback((response) => response.data?.content || "", []);
  return (
    <div>
      <MDSectionV8
        mdFileUrl="http://localhost:3000/smart-content/choot-ka-dhakkan"
        onRecievingSuccessResponse={handleRecievingSuccessResponse}
      />
    </div>
  );
};

export default MDSectionTesingV1;
