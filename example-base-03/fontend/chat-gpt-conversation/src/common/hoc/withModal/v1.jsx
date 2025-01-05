import React from "react";
import styles from "./styles.module.css";

// interface ModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   closeOnEscKey?: boolean;
// }

const withModal = /**<P extends object>*/ (
  WrappedComponent /**: React.ComponentType<P>*/
) => {
  const Modal /**: React.FC<P & ModalProps>*/ = ({
    isOpen,
    onClose,
    closeOnEscKey,
    showCloseButton=false,
    ...props
  }) => {
    if (!isOpen) return null;

    return (
      <div
        className={styles.modalBackdrop}
        onClick={() => closeOnEscKey && onClose()}
      >
        <div
          className={styles.modalContent}
          onClick={(e) => e.stopPropagation()}
        >
          {showCloseButton && <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>}
          <WrappedComponent {...props /**as P*/} />
        </div>
      </div>
    );
  };

  return Modal;
};

export default withModal;
