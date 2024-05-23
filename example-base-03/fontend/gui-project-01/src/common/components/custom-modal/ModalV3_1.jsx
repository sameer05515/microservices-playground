import React, { useEffect, useCallback, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import './ModalV3_1.css';

const ModalV3 = ({ children, onClose, title = "Modal Title" }) => {
  const modalRef = useRef(null);
  const offset = useRef({ x: 0, y: 0 });

  // Handle 'Escape' key press to close the modal
  const handleEscKeyPress = useCallback(
    (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  // Attach and detach 'keydown' event listener
  useEffect(() => {
    document.addEventListener("keydown", handleEscKeyPress);
    return () => {
      document.removeEventListener("keydown", handleEscKeyPress);
    };
  }, [handleEscKeyPress]);

  // Function to start dragging the modal
  const handleMouseDown = (e) => {
    const modal = modalRef.current;
    offset.current = {
      x: e.clientX - modal.getBoundingClientRect().left,
      y: e.clientY - modal.getBoundingClientRect().top,
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Function to move the modal
  const handleMouseMove = (e) => {
    const modal = modalRef.current;
    if (modal) {
      modal.style.left = `${e.clientX - offset.current.x}px`;
      modal.style.top = `${e.clientY - offset.current.y}px`;
    }
  };

  // Function to stop dragging
  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <>
      <div className="modal-backdrop" onClick={onClose}></div>
      <dialog open className="modal" ref={modalRef}>
        <div
          className="modal-header"
          onMouseDown={handleMouseDown}
          title="Drag me around"
        >
          <h3 className="modal-title">{title}</h3>
          <button
            className="modal-close-button"
            onClick={onClose}
            aria-label="Close modal"
          >
            <FaTimes />
          </button>
        </div>
        <div className="modal-content">{children}</div>
      </dialog>
    </>
  );
};

// Higher-Order Component (HOC) for wrapping components with a modal
export const withModal = (WrappedComponent) => (props) => {
  const { onClose, title, ...restProps } = props;

  return (
    <ModalV3 onClose={onClose} title={title}>
      <WrappedComponent {...restProps} />
    </ModalV3>
  );
};

const ExampleComponent = () => {
  return <div>Hello, this is a modal content!</div>;
};

// Wrap ExampleComponent with the modal
export const ExampleComponentWithModal = withModal(ExampleComponent);

export default ModalV3;
