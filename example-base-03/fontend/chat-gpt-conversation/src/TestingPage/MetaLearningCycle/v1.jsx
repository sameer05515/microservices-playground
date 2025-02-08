import { useState } from "react";

const MetaLearningCycleV1 = () => {
  const [title, setTitle] = useState("Meta-Learning Cycle");
  const [description, setDescription] = useState("Click a stage to learn more.");

  const handleStageClick = (stage/**: string*/, desc/**: string*/) => {
    setTitle(stage);
    setDescription(desc);
  };

  return (
    <div className="bg-gray-100 flex justify-center items-center h-screen">
      <div className="relative w-96 h-96">
        {/* Background Circle */}
        <div className="absolute w-full h-full rounded-full bg-white shadow-lg"></div>

        {/* Center Title & Description */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-center font-bold text-xl mb-4">{title}</div>
          <div className="text-center text-gray-600">{description}</div>
        </div>

        {/* Stages with Click Events */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full text-center">
          <div
            className="rounded-full bg-blue-500 text-white p-4 shadow-md cursor-pointer hover:bg-blue-700 transition duration-300"
            onClick={() => handleStageClick("Discomfort", "This is where you push yourself beyond your current abilities.")}
          >
            Discomfort
          </div>
        </div>

        <div className="absolute right-0 top-1/2 transform translate-y-1/2 translate-x-full text-center">
          <div
            className="rounded-full bg-green-500 text-white p-4 shadow-md cursor-pointer hover:bg-green-700 transition duration-300"
            onClick={() => handleStageClick("Improvement", "You start to see progress and gain skills.")}
          >
            Improvement
          </div>
        </div>

        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full text-center">
          <div
            className="rounded-full bg-yellow-500 text-white p-4 shadow-md cursor-pointer hover:bg-yellow-700 transition duration-300"
            onClick={() => handleStageClick("Plateau", "You reach a point where progress seems to slow down.")}
          >
            Plateau
          </div>
        </div>

        <div className="absolute left-0 top-1/2 transform translate-y-1/2 -translate-x-full text-center">
          <div
            className="rounded-full bg-red-500 text-white p-4 shadow-md cursor-pointer hover:bg-red-700 transition duration-300"
            onClick={() => handleStageClick("Success", "You achieve your goals and experience mastery.")}
          >
            Success
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetaLearningCycleV1;
