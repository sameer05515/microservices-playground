import { useDispatch } from "react-redux";
// import { prev, next } from "../redux/slice";
import { navigateToNext as next, navigateToPrev as prev } from "../../store/v2/know-your-positivity/actions";
import { useState } from "react";
import AboutModal from "./AboutModal";
import ModalV3 from "../../common/hoc/withModal/v3";

const Footer = () => {
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  //   const [darkMode, setDarkMode] = useState(false);

  //   const toggleTheme = () => {
  //     setDarkMode(!darkMode);
  //     document.body.classList.toggle("dark-mode");
  //   };

  return (
    <>
      <footer className="bg-white shadow-md fixed bottom-0 left-0 w-full p-4 flex items-center justify-between">
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          About
        </button>

        <div className="flex justify-center w-full">
          <button
            onClick={() => dispatch(prev())}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 mr-4"
          >
            Previous
          </button>
          <button
            onClick={() => dispatch(next())}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Next
          </button>
        </div>

        {/* <button onClick={toggleTheme} className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700">
          {darkMode ? "☀️" : "🌙"}
        </button> */}
      </footer>

      {modalOpen && (
        <ModalV3 isOpen={modalOpen} onClose={() => setModalOpen(false)} showCloseButton>
          <AboutModal />
        </ModalV3>
      )}
    </>
  );
};

export default Footer;
