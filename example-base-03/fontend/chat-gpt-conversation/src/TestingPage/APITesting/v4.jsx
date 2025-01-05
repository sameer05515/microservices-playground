import React from "react";

// Main TopicCard Component
const TopicCard = ({ topic }) => {
  return (
    <div className="border rounded-lg shadow-md p-6 bg-white">
      <Header name={topic.name} date={topic.occurenceDate} />
      <Tags tags={topic.tags} />
      <Content smartContent={topic.smartContent} />
      <Footer uniqueId={topic.uniqueId} />
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
      <p className="text-sm text-gray-600">Date: {formattedDate}</p>
    </div>
  );
};

// Tags Subcomponent
const Tags = ({ tags }) => {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="mb-4">
      <h4 className="font-medium text-gray-700">Tags:</h4>
      <ul className="flex flex-wrap gap-2 mt-2">
        {tags.map((tag) => (
          <li
            key={tag}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full"
          >
            {tag}
          </li>
        ))}
      </ul>
    </div>
  );
};

// Content Subcomponent
const Content = ({ smartContent }) => {
  if (!smartContent || !smartContent.content) return null;

  return (
    <div className="mb-4">
      <h4 className="font-medium text-gray-700">Content:</h4>
      <div
        className="mt-2 text-gray-800 prose"
        dangerouslySetInnerHTML={{ __html: smartContent.content }}
      ></div>
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
const topic = {
  id: {
    timestamp: 1713247467,
    date: "2024-04-16T06:04:27.000+00:00",
  },
  name: "How to Create React component Library",
  parentId: "9be98392-2be9-49b8-85aa-2fe01ba70854",
  uniqueId: "2fab8c96-7759-44b5-8a66-5e9683a3628b",
  createdDate: "2024-04-16T06:04:27.777Z",
  updatedDate: "2024-06-10T14:03:08.481Z",
  occurenceDate: "2024-04-16T00:00:00Z",
  tags: ["23255fbe-9465-48b8-9ee4-10d10afbd316"],
  smartContent: {
    content:
      "<p>Below are links related to Creating the React component Library</p><ol><li><a href='https://www.youtube.com/watch?v=XHQi5a0TmMc'>How to Create and Publish a React Component Library</a> by Alex Eagleson</li><li><a href='https://www.youtube.com/watch?v=L8SxJ_cN1qc'>Build a UI Library with React, Typescript, TailwindCSS and Storybook</a>. By Code With Gionatha</li><li><a href='https://www.youtube.com/watch?v=KxnvvkNsSvs'>How To Publish React Hooks And Components As NPM Package? A Beginner's Guide.</a> by tapaScript by Tapas Adhik</li></ol>",
    textOutputType: "html",
    textInputType: "CKEditor",
  },
  softDelete: false,
  __v: 0,
  type: "Topic",
};

// Render the TopicCard Component
const APITestingV4 = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <TopicCard topic={topic} />
    </div>
  );
};

export default APITestingV4;
