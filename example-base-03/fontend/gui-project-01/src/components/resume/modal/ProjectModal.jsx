import PropTypes from 'prop-types';
import React, { useState } from 'react';
import CustomButton from '../../../common/components/CustomButton';
import withModal from '../../../common/components/HOC/withModal';
import { ICON_NAMES } from '../../../common/utilities/constants';
import MetadataExtractor from '../../../common/components/MetadataExtractor';
import { companyItemStyle } from '../../../common/styles/ResumeComponentsStyle';
import CustomCollapse from '../../../common/components/CustomCollapse';
import DynamicDataRenderer from '../../../common/components/DynamicDataRenderer';

const ProjectModal = ({ onClose, onSave, project, modalWidth = '90%' }) => {
    const [formData, setFormData] = useState({
        uniqueId: project ? project.uniqueId : "",
        name: project ? project.name : '',
        details: project ? project.details : '',
        processedDetails: project && project.processedDetails ? project.processedDetails : {}
    });
    const [processedDetailsMetadata, setProcessedDetailsMetadata] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({...formData, processedDetails: {
            rawText: formData.details,
            textType: 'yaml',
            metadata: processedDetailsMetadata || {}
        }});
        onClose();
    };

    const handleExtractionDone = (response) => {
        console.log('ProjectModal: error : ' + response.error);
        console.log('ProjectModal: metadata : ' + JSON.stringify(response.metadata));
        // if(!response.error ){
        setProcessedDetailsMetadata((prev) => ({
            ...response.metadata
        }));
        setFormData((prev)=>(
            {
                ...prev, 
                processedDetails: response
            }
        ));
        // }
        // console.log('processedDetailsMetadata : ' + JSON.stringify(processedDetailsMetadata));
    }

    return (
        <div className="box" style={{ width: modalWidth }}>
            <h2>{project ? "Edit Project" : "Add New Project"}</h2>
            <div style={{ width: '100%' }}>
                <label htmlFor="name" style={{ width: '25%' }}>Name:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    style={{ width: '75%' }} // Adjust the width as needed
                />
            </div>
            <div style={{ width: '100%' }}>
                <label htmlFor="details" style={{ width: '25%' }}>Details:</label>
                <textarea
                    id="details"
                    name="details"
                    value={formData.details}
                    onChange={handleInputChange}
                    // style={{ width: '75%' }} // Adjust the width as needed
                    style={{ width: '75%', minHeight: '100px' }} 
                ></textarea>
                {/* <HTMLDataViewer style={companyItemStyle} htmlText={formData.details}/> */}
                <MetadataExtractor rawText={formData.details} style={companyItemStyle}  onExtractionDone={handleExtractionDone}/>
                <CustomCollapse
                    style={{ border: "1px solid #ccc", padding: "5px", borderRadius: "10px" }}
                    headerText="Preview metadata object with DynamicDataRenderer"
                >
                    <DynamicDataRenderer data={formData.processedDetails?.metadata} />
                </CustomCollapse>
            </div>
            <CustomButton
                type="button"
                className="button is-primary"
                iconName={project ? ICON_NAMES.EDIT : ICON_NAMES.SAVE}
                onClick={handleSubmit}
            >
                {project ? "Update" : "Add"}
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

ProjectModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    project: PropTypes.object, // Add company prop
    modalWidth: PropTypes.string.isRequired, // Pass the modal width as a prop
};

export default withModal(ProjectModal);
