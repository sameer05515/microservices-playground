import React from "react";

const ExternalLinks = ({ links = [] }) => {
  if (!links.length) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {links.map((item, index) => (
        <a
          key={index}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-4 bg-white shadow-md rounded-md border border-gray-300 hover:bg-gray-100 transition-all"
        >
          <span className="text-blue-600 hover:underline font-medium">
            {item.title}
          </span>
        </a>
      ))}
    </div>
  );
};

// export default ExternalLinks;


const linksData = [
  {
    title: "JavaScript Visualized - Event Loop, Web APIs, (Micro)task Queue",
    link: "https://www.youtube.com/watch?v=eiC58R16hb8",
  },
  {
    title: "Understanding Closures in JavaScript",
    link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures",
  },
  {
    title: "React Hooks - The Complete Guide",
    link: "https://reactjs.org/docs/hooks-intro.html",
  },
];

const ExternalLinksV1 = () => {
  return (
    <div className="container mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">Useful Links</h2>
      <ExternalLinks links={linksData} />
    </div>
  );
};

export default ExternalLinksV1;
