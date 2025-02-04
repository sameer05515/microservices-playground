import React from "react";
import SmartPreviewer from "../../../../common/components/SmartPreviewer/v1";

const TaskCard = ({ data: task, title = "" }) => {
  const { name, taskStatus, descriptions, activities } = task;

  const statusColors = {
    in_progress: "bg-yellow-100 text-yellow-800 border-yellow-500",
    completed: "bg-green-100 text-green-800 border-green-500",
    pending: "bg-gray-100 text-gray-800 border-gray-500",
    bug: "bg-red-100 text-red-800 border-red-500",
  };

  const getStatusColor = (status) =>
    statusColors[status.toLowerCase()] || "bg-gray-100 text-gray-800 border-gray-500";

  return (
    <div className="shadow-lg rounded-lg border border-gray-200 p-6 my-4">
      {/* Task Header */}
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-xl font-bold">{title || name}</h1>
        <span className={`text-sm font-medium px-3 py-1 rounded-full border ${getStatusColor(taskStatus)}`}>
          {taskStatus.replace("_", " ").toUpperCase()}
        </span>
      </div>

      {/* Description */}
      <div className="mt-4">
        <h2 className="text-lg font-semibold">Description</h2>
        {descriptions &&
          descriptions.length > 0 &&
          descriptions.map((desc, idx) => (
            <SmartPreviewer key={`desc_${idx + 1}`} className="p-4 shadow-md" data={desc} />
          ))}
      </div>

      {/* Activities */}
      {activities?.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold">Activities</h2>
          <ul className="mt-2 space-y-4">
            {activities.map((activity) => (
              <li key={activity.uniqueId} className="p-4 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm">{activity.userDetails.name || "Unknown User"}</span>
                  <span className="text-xs">{new Date(activity.createdDate).toLocaleString()}</span>
                </div>
                {/* <div className="mt-2 prose prose-sm">
                  <p>{activity.description.content}</p>
                </div> */}
                <SmartPreviewer data={activity.description} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
