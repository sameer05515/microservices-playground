import React, { useEffect } from 'react';

const withModal = (ModalComponent) => {
  return ({ isOpen, onClose, onSave, size='500px', ...props }) => {
    const handleSubmit = (formData) => {
      onSave(formData);
      onClose();
    };

    useEffect(() => {
      const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
          onClose();
        }
      };

      if (isOpen) {
        document.addEventListener('keydown', handleKeyDown);
      }

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, [isOpen, onClose]);

    return (
      <div style={modalBackdropStyle}>
        {isOpen && (
          <div style={{ ...modalContainerStyle, width: size }}>
            <div style={{ ...modalContentStyle, width: '100%', height: '500px', overflowY: 'auto' }}>
              <ModalComponent onClose={onClose} onSave={handleSubmit} {...props} /> {/* Pass additional props */}
              <button
                style={closeButtonStyle}
                onClick={onClose}
                aria-label="Close"
              >
                &#10005;
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };
};

const modalBackdropStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(0, 0, 0, 0.5)',
  zIndex: 1000,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const modalContainerStyle = {
  background: 'green',
  borderRadius: '10px',
  overflowY: 'auto',
};

const modalContentStyle = {
  position: 'relative',
  padding: '20px',
  zIndex: 1001,
};

const closeButtonStyle = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  fontSize: '1.5rem',
  color: '#fff',
};

export default withModal;
