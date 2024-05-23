import React, { useEffect, useCallback } from "react";
import { FaTimes } from "react-icons/fa"; 
import './Modal.css';

// Modal Component
const ModalV3 = ({ children, onClose }) => {
  // Handle 'Escape' key press to close the modal
  const handleEscKeyPress = useCallback((event) => {
    if (event.key === "Escape") {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    document.addEventListener("keydown", handleEscKeyPress);
    return () => {
      document.removeEventListener("keydown", handleEscKeyPress);
    };
  }, [handleEscKeyPress]);

  return (
    <>
      <div className={"backdrop"}></div>
      <dialog open className={"modal"}>
        <button
          className={"modalCloseButton"}
          onClick={onClose}
          aria-label="Close modal"
        >
          <FaTimes />
        </button>
        {children}
      </dialog>
    </>
  );
};

// Higher-Order Component (HOC) for wrapping components with a modal
export const withModal = (WrappedComponent) => {
  // Return a new component that wraps the provided component inside a modal
  return (props) => {
    const { onClose, ...restProps } = props;

    return (
      <ModalV3 onClose={onClose}>
        <WrappedComponent {...restProps} />
      </ModalV3>
    );
  };
};

export default ModalV3;
