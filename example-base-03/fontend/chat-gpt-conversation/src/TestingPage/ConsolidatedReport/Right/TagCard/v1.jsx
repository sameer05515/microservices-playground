import React from "react";
import SmartPreviewer from "../../../../common/components/SmartPreviewer/v1";
import { getFormattedDate } from "../../utils/common-utils";

// Main Card Component
const TagCard = ({ data: tag, title = "" }) => {
  return (
    <div className="border rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold">{title || tag.name}</h2>
        <p className="text-sm">Created on: {getFormattedDate(tag.createdDate)}</p>
      </div>
      <SmartPreviewer
        className="p-4 shadow-md"
        data={
          tag.smartContent || {
            content: tag.description,
          }
        }
      />
      {/* Footer */}
      <div className="mt-6 text-sm">
        <p>Unique ID: {tag.uniqueId}</p>
      </div>
      {/* <Footer uniqueId={tag.uniqueId} /> */}
    </div>
  );
};

export default TagCard;
