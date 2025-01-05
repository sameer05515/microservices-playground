import React from "react";

const withModal = (WrappedComponent) => {
  const Modal = ({ isOpen, onClose, closeOnEscKey, showCloseButton = false, ...props }) => {
    if (!isOpen) return null;

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
        onClick={() => closeOnEscKey && onClose()}
      >
        <div
          className="bg-white p-6 rounded-lg w-[90%] max-w-[60vw] max-h-[60vh] overflow-auto relative shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {showCloseButton && (
            <button
              className="absolute top-2 right-2 text-xl text-gray-800 hover:text-red-500 focus:outline-none"
              onClick={onClose}
            >
              &times;
            </button>
          )}
          <WrappedComponent {...props} />
        </div>
      </div>
    );
  };

  return Modal;
};

export default withModal;
