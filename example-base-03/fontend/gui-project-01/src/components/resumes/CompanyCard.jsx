import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { renderCard } from "../../common/components/custom-card/Card";
// import CustomButton from "../../common/components/CustomButton";
import HoverActions from "../../common/components/hover-actions/HoverActions";
import JSONDataViewer from "../../common/components/JSONDataViewer";
import CompanyDetailsCard from "./sub-components/CompanyDetailsCard";
import CompanyEmploymentDetailsCard from "./sub-components/CompanyEmploymentDetailsCard";
// import Forms, { FormTypes } from "../../common/components/custom-form/FormsV11";

const styles = {
  boldText: { fontWeight: "bold" },
};

const CompanyCard = () => {
  const location = useLocation();
  const { state } = location;
  const { company } = state;
  // const [showModal, setShowModal] = useState(false);
  // const [selectedFormType, setSelectedFormType] = useState(null);
  // const toggleModalVisibility = () => {
  //   setShowModal((prev) => !prev);
  // };
  // Destructure company data
  const {
    // uniqueId,
    name,
    processedDetails: { metadata = {} } = {},
    // projects = [],
  } = company;

  const {
    company: companyName = "No company name found",
    order = 0,
    modeOfWork = "Mode of work not set",
    officeAddress = "NA",
    aboutCompany = [],
    companyWebsiteURL = "NA",
    domainOfCompany = [],
    projects: projectNames = [],
    techStack = [],

    employmentType = "NA",
    overAllTenure = "Missing",
    overAllTenureWithDate = "Missing",
    lastCTC = "Missing",
    lastEmployeeCode = "Missing",
    lastDesignation = "Missing",
    lastReasonForChange = { actual: "Missing", forHR: "Missing" },

    highlights = [],
    employmentHistories = [],
    references = [],
  } = metadata;

  return (
    <div>
      {/* {showModal && <MyComponentWithModal onClose={toggleModalVisibility} />} */}
      {/* {showModal &&
        withModal(() => <div>Simple On-the-Fly Form</div>)({
          onClose: toggleModalVisibility,
        })} */}

      {/* {showModal && (
        <Forms type={selectedFormType} onClose={toggleModalVisibility} />
      )} */}
      <div>
        <span style={styles.boldText}>Name:</span> {name} <br />
        <HoverActions
          // actions={[
          //   <span
          //     onClick={() => {
          //       setSelectedFormType(FormTypes.YamlForm);
          //       toggleModalVisibility();
          //     }}
          //   >
          //     Edit Whole data with Yaml form{" "}
          //   </span>,
          //   <span
          //     onClick={() => {
          //       setSelectedFormType(FormTypes.NameForm);
          //       toggleModalVisibility();
          //     }}
          //   >
          //     Edit Name
          //   </span>,
          // ]}
        />
        {/* <CustomButton onClick={toggleModalVisibility}>Show Modal</CustomButton> */}
      </div>
      <CompanyDetailsCard
        title={"Company Static Details"}
        companyDetails={{
          companyName,
          order,
          modeOfWork,
          officeAddress,
          aboutCompany,
          companyWebsiteURL,
          domainOfCompany,
          projectNames,
          techStack,
        }}
      />
      <CompanyEmploymentDetailsCard
        title={"Company Employment Details using Card component"}
        companyEmploymentDetails={{
          employmentType,
          overAllTenure,
          overAllTenureWithDate,
          lastCTC,
          lastEmployeeCode,
          lastDesignation,
          lastReasonForChange,
          highlights,
          employmentHistories,
          references,
        }}
      />

      {renderCard({
        title: "Company Employment Details Using 'renderCard' method",
        objectToBeRendered: {
          employmentType,
          overAllTenure,
          overAllTenureWithDate,
          lastCTC,
          lastEmployeeCode,
          lastDesignation,
          lastReasonForChange,
          highlights,
          employmentHistories,
          references,
        },
      })}

      <JSONDataViewer metadata={{ company, state }} title="X-Ray" />
    </div>
  );
};

export default CompanyCard;
