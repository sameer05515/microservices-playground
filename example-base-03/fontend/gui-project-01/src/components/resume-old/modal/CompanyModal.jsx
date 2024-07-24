import PropTypes from "prop-types";
import React, { useState } from "react";
import CustomButton from "../../../common/components/CustomButton";
import withModal from "../../../common/components/HOC/withModal";
import { ICON_NAMES } from '../../../common/utilities/constants';
import MetadataExtractor from "../../../common/components/MetadataExtractor";
import { projectWidgetStyle } from "../../../common/styles/ResumeComponentsStyle";
import CustomCollapse from "../../../common/components/CustomCollapse";
import DynamicDataRenderer from "../../../common/components/DynamicDataRenderer";

const CompanyModal = ({ onClose, onSave, company, modalWidth = '800px' }) => {
    const [formData, setFormData] = useState({
        uniqueId: company ? company.uniqueId : "",
        name: company ? company.name : "",
        details: company ? company.details : "",
        processedDetails: company && company.processedDetails ? company.processedDetails : {}
    });
    const [processedDetailsMetadata, setProcessedDetailsMetadata] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...formData, processedDetails: {
                rawText: formData.details,
                textType: 'yaml',
                metadata: processedDetailsMetadata || {}
            }
        });
        onClose();
    };
    const handleExtractionDone = (response) => {
        console.log('CompanyModal: error : ' + response.error);
        console.log('CompanyModal: metadata : ' + JSON.stringify(response.metadata));
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
            <h2>{company ? "Edit Company" : "Add New Company"}</h2>
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
                {/* <div style={companyItemStyle}>{ReactHtmlParser(formData.details)}</div> */}
                {/* <HTMLDataViewer style={projectWidgetStyle} htmlText={formData.details}/> */}
                <MetadataExtractor rawText={formData.details} style={projectWidgetStyle} onExtractionDone={handleExtractionDone} />
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
                iconName={company ? ICON_NAMES.EDIT : ICON_NAMES.SAVE}
                onClick={handleSubmit}
            >
                {company ? "Update Company" : "Add Company"}
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

CompanyModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    company: PropTypes.object, // Add company prop
    modalWidth: PropTypes.string, // Pass the modal width as a prop
};

export default withModal(CompanyModal);
