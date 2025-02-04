import React from "react";

// Main Card Component
const TagCard = ({ tag }) => {
  return (
    <div className="border rounded-lg shadow-md p-6 bg-white max-w-lg mx-auto">
      <Header name={tag.name} date={tag.createdDate} />
      <Content smartContent={tag.smartContent} />
      <Footer uniqueId={tag.uniqueId} />
    </div>
  );
};

// Header Subcomponent
const Header = ({ name, date }) => {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold text-gray-800">{name}</h2>
      <p className="text-sm text-gray-600">Created on: {formattedDate}</p>
    </div>
  );
};

// Content Subcomponent
const Content = ({ smartContent }) => {
  if (!smartContent || !smartContent.content) return null;

  return (
    <div className="mb-4">
      <h4 className="font-medium text-gray-700">Details:</h4>
      <p className="mt-2 text-gray-800">{smartContent.content}</p>
    </div>
  );
};

// Footer Subcomponent
const Footer = ({ uniqueId }) => {
  return (
    <div className="mt-6 text-gray-500 text-sm">
      <p>Unique ID: {uniqueId}</p>
    </div>
  );
};

// Sample Data
const tag = {
  id: {
    timestamp: 1724737363,
    date: "2024-08-27T05:42:43.000+00:00",
  },
  name: "Future Topics : To be studied post getting a Job",
  parentId: "e85963e9-1ba8-44ef-bb91-be09891e2151",
  uniqueId: "12633821-facf-400a-af62-f9024e7ade17",
  createdDate: "2024-08-27T05:42:43.931Z",
  updatedDate: "2024-08-27T05:42:43.931Z",
  description: null,
  smartContent: {
    content: "Future Topics : To be studied post getting a Job",
    textOutputType: "markdown",
    textInputType: "TextArea",
  },
  softDelete: false,
  __v: 0,
  type: "Tag",
};

// Render the TagCard Component
const APITestingV5 = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <TagCard tag={tag} />
    </div>
  );
};

export default APITestingV5;
