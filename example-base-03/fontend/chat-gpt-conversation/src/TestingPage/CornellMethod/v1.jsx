


import { useSearchParams } from "react-router-dom";

// interface CornellNote {
//   uniqueId: string;
//   title: string;
//   description: string;
//   tags: string[];
//   createdOn: string;
//   updatedOn: string;
//   rating: number;
//   summary: string;
// }

const sampleNote/**: CornellNote*/ = {
  uniqueId: "123456",
  title: "Understanding the Cornell Method",
  description: "The Cornell Method is a systematic way of taking and organizing notes...",
  tags: ["Note-taking", "Productivity", "Study Skills"],
  createdOn: "2024-01-29",
  updatedOn: "2024-01-30",
  rating: 8,
  summary: "A structured approach to note-taking that improves recall and organization.",
};

function CornellMethodVisualizationV1() {
  const [searchParams] = useSearchParams();
  const uniqueId = searchParams.get("uniqueId") || sampleNote.uniqueId;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
      <h1 className="text-2xl font-bold text-center mb-4">{sampleNote.title}-{uniqueId}</h1>

      {/* Cornell Layout */}
      <div className="grid md:grid-cols-4 gap-4">
        {/* Left Column (Cues - Tags) */}
        <div className="md:col-span-1 bg-gray-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Cues (Tags)</h2>
          <ul className="space-y-2">
            {sampleNote.tags.map((tag, index) => (
              <li key={index} className="bg-blue-200 text-blue-800 px-3 py-1 rounded-lg inline-block">
                {tag}
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column (Notes) */}
        <div className="md:col-span-3 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Notes</h2>
          <p className="text-gray-700">{sampleNote.description}</p>

          <div className="mt-4">
            <p className="text-sm text-gray-500">Created On: {sampleNote.createdOn}</p>
            <p className="text-sm text-gray-500">Updated On: {sampleNote.updatedOn}</p>
            <p className="text-sm font-semibold">Rating: ⭐ {sampleNote.rating} / 10</p>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="mt-6 p-4 bg-yellow-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Summary</h2>
        <p className="text-gray-700">{sampleNote.summary}</p>
      </div>
    </div>
  );
}


export default CornellMethodVisualizationV1;
