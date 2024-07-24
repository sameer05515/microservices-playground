// CompanyInput.jsx
import React, { useState } from "react";
import CustomButton from "../../../common/components/CustomButton";
import { ICON_NAMES } from "../../../common/utilities/constants";
// import MetadataExtractor from "../../../common/components/MetadataExtractor";
import {
  companyWidgetStyle as companyInputStyle,
  companyItemStyle,
} from "../../../common/styles/ResumeComponentsStyle";
import CompanyModal from "../modal/CompanyModal";
import ProjectInput from "./ProjectInput";
import TextRenderer from "../../../common/components/TextRenderer";
import CustomCollapse from "../../../common/components/CustomCollapse";
import DynamicDataRenderer from "../../../common/components/DynamicDataRenderer";

const CompanyInput = ({ companies, onCompanyChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const handleAddNew = () => {
    setSelectedCompany(null);
    setIsModalOpen(true);
    console.log("handleAddNew : " + isModalOpen);
  };

  const handleEdit = (company) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
    console.log("handleEdit : " + isModalOpen);
    console.log("handleEdit : company " + JSON.stringify(company));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    console.log("handleCloseModal : " + isModalOpen);
  };

  const handleSaveCompany = (formData) => {
    if (formData.uniqueId) {
      const updatedCompanies = companies.map((company) =>
        company.uniqueId === formData.uniqueId
          ? { ...company, ...formData }
          : company
      );

      onCompanyChange(updatedCompanies);
      // Update existing company
      console.log("Updated companies:", updatedCompanies);
    } else {
      // Add new company
      const newCompany = { ...formData };
      const updatedCompanies = [...companies, newCompany];
      onCompanyChange(updatedCompanies);
      console.log("Added company:", newCompany);
      console.log("Updated companies:", updatedCompanies);
    }
    setIsModalOpen(false);
  };

  // Function to handle changes in companies array from CompanyInput
  const handleProjectChange = (companyId, updatedProjectList) => {
    console.log(
      "handleProjectChange : updatedProject" +
      JSON.stringify(updatedProjectList)
    );

    const updatedCompanies = companies.map((company) =>
      company.uniqueId === companyId
        ? { ...company, projects: updatedProjectList }
        : company
    );
    onCompanyChange(updatedCompanies);
    console.log("Updated companies:", updatedCompanies);
  };

  return (
    <>
      {companies.length >= 0 && (
        <div style={companyInputStyle}>
          <h4>
            Existing Companies:
            <CustomButton
              type="button"
              iconName={ICON_NAMES.PLUS}
              onClick={handleAddNew}
            ></CustomButton>
          </h4>

          {companies.map((company, index) => (
            <div
              key={company.uniqueId ? company.uniqueId : `company_${index + 1}`}
              style={companyItemStyle}
            >
              <strong>{company.name}</strong>:  '{company.uniqueId}'
              {company.uniqueId && (
                <CustomButton type="button" onClick={() => handleEdit(company)}>
                  Edit
                </CustomButton>
              )}
              {/* <HTMLDataViewer style={companyItemStyle} htmlText={company.details}/> */}
              {/* <MetadataExtractor rawText={company.details} style={companyItemStyle} /> */}

              <CustomCollapse
                style={{ border: "1px solid #ccc", padding: "5px", borderRadius: "10px" }}
                headerText="Preview Raw metadata object"
              >
                <TextRenderer rawText={JSON.stringify(company.processedDetails, null, 2)} showRadioButtons={false} />
              </CustomCollapse>
              <CustomCollapse
                    style={{ border: "1px solid #ccc", padding: "5px", borderRadius: "10px" }}
                    headerText="Preview metadata object with DynamicDataRenderer"
                >
                    <DynamicDataRenderer data={company.processedDetails?.metadata} />
                </CustomCollapse>

              {company.uniqueId && (
                <ProjectInput
                  projects={company.projects ? company.projects : []}
                  onProjectChange={handleProjectChange}
                  companyId={company.uniqueId}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <CompanyModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveCompany}
          company={selectedCompany}
        />
      )}
    </>
  );
};

export default CompanyInput;
