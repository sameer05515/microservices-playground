import { useState } from "react";
import MDSectionV7 from "../../common/components/MDSection/v7";

const MetaLearningCycleV1 = () => {
  const [title, setTitle] = useState("Meta-Learning Cycle");
  const [description, setDescription] = useState("Click a stage to learn more.");

  const handleStageClick = (stage /**: string*/, desc /**: string*/) => {
    setTitle(stage);
    setDescription(desc);
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen">
        <div className="relative w-96 h-96">
          {/* Background Circle */}
          <div className="absolute w-full h-full rounded-full shadow-lg"></div>

          {/* Center Title & Description */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-center font-bold text-xl mb-4">{title}</div>
            <div className="text-center text-gray-600">{description}</div>
          </div>

          {/* Stages with Click Events */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full text-center">
            <div
              className="rounded-full bg-blue-500 text-white p-4 shadow-md cursor-pointer hover:bg-blue-700 transition duration-300"
              onClick={() =>
                handleStageClick(
                  "Discomfort",
                  "This is where you push yourself beyond your current abilities."
                )
              }
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
              onClick={() =>
                handleStageClick("Plateau", "You reach a point where progress seems to slow down.")
              }
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
      <div className="p-6 min-h-screen leading-relaxed">
        <div className="w-full">
          <b>Summary: </b> Meta Learning to Learn 10x Fast
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Left Section */}
          <div>
            <div className="mb-4">
              <b>Neuroscience Behind Learning</b>
              <p className="mt-2 space-y-1">
                <span>
                  • <b>Neuroplasticity:</b> Brain forms stronger connections with practice.
                </span>
                <br />
                <span>
                  • <b>Dopamine:</b> Motivation and reward system that keeps you engaged.
                </span>
              </p>
            </div>

            <div>
              <b>4 Stages of Learning</b>
              <ol className="mt-2 space-y-2 list-decimal list-inside">
                <li>
                  <b>Discomfort:</b> Initial struggle when learning something new.
                </li>
                <li>
                  <b>Improvement:</b> Confidence grows with progress.
                </li>
                <li>
                  <b>Plateau:</b> Frustrating phase where results slow down.
                </li>
                <li>
                  <b>Success:</b> Mastery achieved with persistence.
                </li>
              </ol>
            </div>
          </div>

          {/* Right Section */}
          <div>
            <b>5 Ways to Learn Faster</b>
            <ul className="mt-2 space-y-2 list-disc list-inside">
              <li>
                <b>80/20 Rule:</b> Focus on the 20% that gives 80% of the results.
              </li>
              <li>
                <b>Clear Intentions:</b> Ask yourself why you are learning to stay motivated.
              </li>
              <li>
                <b>Teach Others:</b> Explaining what you learn helps retention.
              </li>
              <li>
                <b>Get Feedback:</b> Learn faster by correcting mistakes in real-time.
              </li>
              <li>
                <b>Shift your Identity:</b> Embrace mistakes and grow from them.
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="p-10 font-sans leading-relaxed min-h-screen">
        <MDSectionV7 mdFileUrl="/meta-learning/v1.md" />
      </div>
    </>
  );
};

export default MetaLearningCycleV1;
