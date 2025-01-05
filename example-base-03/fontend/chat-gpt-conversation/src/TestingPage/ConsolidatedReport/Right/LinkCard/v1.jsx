import React from "react";

const LinkCard = ({ data: link, title = "" }) => {
  const { name, description, linkUrl, linkType } = link;

  const linkTypeColors = {
    "EXTERNAL-WEB": "text-blue-600 dark:text-blue-100 bg-blue-100 dark:bg-blue-900 border-blue-500",
    INTERNAL: "text-green-600 dark:text-green-100 bg-green-100 dark:bg-green-900 border-green-500",
  };

  const getLinkTypeColor = (type) => linkTypeColors[type] || "text-gray-600 bg-gray-100 border-gray-500";

  return (
    <div className="shadow-lg rounded-lg border border-gray-200 p-6 my-4">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-xl font-bold">{title || name}</h1>
        <span className={`text-xs font-medium px-3 py-1 rounded-full border ${getLinkTypeColor(linkType)}`}>
          {linkType.replace("_", " ")}
        </span>
      </div>

      {/* Description */}
      <div className="mt-4">
        <p>{description}</p>
      </div>

      {/* Link */}
      <div className="mt-6">
        <a
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-700 underline font-medium"
        >
          Visit Link
        </a>
      </div>
    </div>
  );
};

export default LinkCard;
