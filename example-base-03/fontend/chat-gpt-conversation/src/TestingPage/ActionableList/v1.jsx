import { useState, useEffect } from "react";
import { FiCheckCircle, FiCircle, FiEdit3, FiPlus, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const defaultTasks = [
  {
    category: "Node.js / Express",
    tasks: [
      "Fix PayloadTooLargeError by increasing body-parser limit",
      "Add Swagger documentation for all routes",
      "Implement MongoDB query to get all word fields",
    ],
  },
  {
    category: "React / Frontend",
    tasks: [
      "Create copy button with floating popup",
      "Replace inline styles with Tailwind classes",
      "Add Framer Motion animations to popup",
    ],
  },
  {
    category: "Learning & Communication",
    tasks: [
      "Watch French YouTube series daily",
      "Practice English speaking 15 min/day",
      "Read 2 English books/month",
    ],
  },
];

export default function ActionableListV1() {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem("actionableTasks");
    return saved ? JSON.parse(saved) : defaultTasks;
  });
  const [completed, setCompleted] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [selectedCat, setSelectedCat] = useState(0);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem("actionableTasks", JSON.stringify(data));
  }, [data]);

  const toggleTask = (catIdx, taskIdx) => {
    const key = `${catIdx}-${taskIdx}`;
    setCompleted((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const openAddModal = (catIdx) => {
    setSelectedCat(catIdx);
    setEditIndex(null);
    setNewTask("");
    setShowModal(true);
  };

  const openEditModal = (catIdx, taskIdx, oldText) => {
    setSelectedCat(catIdx);
    setEditIndex(taskIdx);
    setNewTask(oldText);
    setShowModal(true);
  };

  const saveTask = () => {
    if (!newTask.trim()) return;
    const updated = [...data];
    if (editIndex !== null) {
      updated[selectedCat].tasks[editIndex] = newTask.trim();
    } else {
      updated[selectedCat].tasks.push(newTask.trim());
    }
    setData(updated);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          📋 Actionable Task List
        </h1>

        {data.map((cat, catIdx) => (
          <div key={catIdx}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-indigo-600 mb-2 flex items-center gap-2">
                <FiEdit3 size={18} /> {cat.category}
              </h2>
              <button
                onClick={() => openAddModal(catIdx)}
                className="text-sm bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-1 rounded-lg flex items-center gap-1"
              >
                <FiPlus size={16} /> Add Task
              </button>
            </div>

            <ul className="space-y-2">
              {cat.tasks.map((task, taskIdx) => {
                const key = `${catIdx}-${taskIdx}`;
                const done = completed[key];
                return (
                  <motion.li
                    key={taskIdx}
                    className={`flex items-center justify-between border rounded-xl p-3 ${
                      done
                        ? "bg-green-50 border-green-300 text-green-700"
                        : "bg-gray-50 border-gray-200 text-gray-800"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.1 }}
                  >
                    <span
                      className={`flex-1 cursor-pointer ${
                        done ? "line-through" : ""
                      }`}
                      onClick={() => toggleTask(catIdx, taskIdx)}
                    >
                      {task}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          openEditModal(catIdx, taskIdx, task)
                        }
                        className="text-indigo-500 hover:text-indigo-700"
                      >
                        <FiEdit3 size={18} />
                      </button>
                      <button onClick={() => toggleTask(catIdx, taskIdx)}>
                        {done ? (
                          <FiCheckCircle className="text-green-600" size={22} />
                        ) : (
                          <FiCircle className="text-gray-400" size={22} />
                        )}
                      </button>
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-xl w-96 p-6"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h3 className="text-lg font-semibold mb-4 text-gray-700">
                {editIndex !== null ? "Edit Task" : "Add New Task"}
              </h3>
              <input
                type="text"
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 outline-none mb-4"
                placeholder="Enter task..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center gap-1"
                >
                  <FiX size={16} /> Cancel
                </button>
                <button
                  onClick={saveTask}
                  className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
