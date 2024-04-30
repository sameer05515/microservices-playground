// EditorModal.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CustomButton from './CustomButton';
import { ICON_NAMES } from './IconNames';
import withModal from './HOC/withModal';

const EditorModal = ({ onClose, onSave, textData = '' }) => {
  const [editorData, setEditorData] = useState(textData || '');

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setEditorData(data);
  };

  const handleSubmit = () => {
    onSave(editorData);
    onClose();
  };

  return (
    <div className="box">
      <h2>Edit Content</h2>
      <CKEditor
        editor={ClassicEditor}
        data={editorData}
        onChange={handleEditorChange}
      />
      <CustomButton
        type="button"
        className="button is-primary"
        iconName={ICON_NAMES.SAVE}
        onClick={handleSubmit}
      >
        Save
      </CustomButton>
      <CustomButton
        type="button"
        className="button is-primary"
        aria-label="close"
        onClick={onClose}
      >
        Close
      </CustomButton>
    </div>
  );
};

EditorModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  textData: PropTypes.string.isRequired,
};

export default withModal(EditorModal);
