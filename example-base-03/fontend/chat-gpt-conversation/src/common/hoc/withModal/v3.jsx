import React from "react";

/**Please use v2.jsx for production. V3 is in experimental phase currently*/
const ModalV3 = ({ isOpen, onClose, closeOnEscKey, showCloseButton = false, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
      onClick={() => closeOnEscKey && onClose()}
    >
      <div
        className="bg-white dark:bg-black p-6 rounded-lg w-[90%] max-w-[60vw] max-h-[60vh] overflow-auto relative shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {showCloseButton && (
          <button
            className="absolute top-2 right-2 text-xl hover:text-red-500 focus:outline-none"
            onClick={onClose}
          >
            &times;
          </button>
        )}

        {children}
      </div>
    </div>
  );
};

export default ModalV3;
