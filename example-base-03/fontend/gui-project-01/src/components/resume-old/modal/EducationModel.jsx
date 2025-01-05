import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import CustomButton from "../../../common/components/CustomButton";
import withModal from "../../../common/components/HOC/withModal";
import { ICON_NAMES } from '../../../common/utilities/constants';
import MetadataExtractor from "../../../common/components/MetadataExtractor";
import { companyItemStyle } from "../../../common/styles/ResumeComponentsStyle";
import CustomCollapse from "../../../common/components/CustomCollapse";
import DynamicDataRenderer from "../../../common/components/DynamicDataRenderer";

const EducationModel = ({ onClose, onSave, education, modalWidth = '90%' }) => {
    const [formData, setFormData] = useState({
        uniqueId: "",
        name: "",
        details: "",
        processedDetails: {}
    });
    const [processedDetailsMetadata, setProcessedDetailsMetadata] = useState({});

    useEffect(() => {
        console.log(`education : ${JSON.stringify(education)}`)
        if (education) {
            setFormData({
                uniqueId: education.uniqueId || "",
                name: education.name || "",
                details: education.details || "",
                processedDetails: education && education.processedDetails ? education.processedDetails : {}
            });
        }
    }, [education]);

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
        console.log('EducationModel: error : ' + response.error);
        console.log('EducationModel: metadata : ' + JSON.stringify(response.metadata));
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
            <h2>{education ? "Edit Education" : "Add New Education"}</h2>
            <div style={{ width: '100%' }}>
                <label htmlFor="name" style={{ width: '25%' }}>Name:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    style={{ width: '75%' }}
                />
            </div>
            <div style={{ width: '100%' }}>
                <label htmlFor="details" style={{ width: '25%' }}>Details:</label>
                <textarea
                    id="details"
                    name="details"
                    value={formData.details}
                    onChange={handleInputChange}
                    // style={{ width: '75%' }}
                    style={{ width: '75%', minHeight: '100px' }} 
                ></textarea>
                {/* <div style={companyItemStyle}>{ReactHtmlParser(formData.details)}</div> */}
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
                iconName={education ? ICON_NAMES.EDIT : ICON_NAMES.SAVE}
                onClick={handleSubmit}
            >
                {education ? "Update Education" : "Add Education"}
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

EducationModel.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    education: PropTypes.shape({
        uniqueId: PropTypes.string,
        name: PropTypes.string,
        details: PropTypes.string,
    }),
    modalWidth: PropTypes.string,
};

export default withModal(EducationModel);
