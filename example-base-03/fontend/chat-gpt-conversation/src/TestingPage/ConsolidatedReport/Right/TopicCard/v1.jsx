import SmartPreviewer from "../../../../common/components/SmartPreviewer/v1";
import { getFormattedDate } from "../../utils/common-utils";
// Main TopicCard Component
const TopicCard = ({ data: topic, title = "" }) => {
  return (
    <div className="border rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold">{title || topic.name}</h2>
        <p className="text-sm">Date: {getFormattedDate(topic.occurenceDate)}</p>
      </div>
      {/* <Header name={topic.name} date={topic.occurenceDate} /> */}
      <Tags tags={topic.tags} />
      <SmartPreviewer className="p-4 shadow-md " data={topic.smartContent} />
      {/* Footer */}
      <div className="mt-6 text-gray-500 text-sm">
        <p>Unique ID: {topic.uniqueId}</p>
      </div>
      {/* <Footer uniqueId={topic.uniqueId} /> */}
    </div>
  );
};

// Tags Subcomponent
const Tags = ({ tags }) => {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="mb-4">
      <h4 className="font-medium">Tags:</h4>
      <ul className="flex flex-wrap gap-2 mt-2">
        {tags.map((tag) => (
          <li key={tag} className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full">
            {tag}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopicCard;
