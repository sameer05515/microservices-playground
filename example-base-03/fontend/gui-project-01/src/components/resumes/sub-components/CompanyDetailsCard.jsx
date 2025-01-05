import React from "react";
import Card, { FieldValueType } from "../../../common/components/custom-card/Card";

const CompanyDetailsCard = ({ title, companyDetails }) => {
    const {
        companyName,
        order,
        modeOfWork,
        officeAddress,
        aboutCompany,
        companyWebsiteURL,
        domainOfCompany,
        projectNames,
        techStack
    } = companyDetails;
    return (
        <Card
            title={title}
            fields={[
                {
                    type: FieldValueType.SingleValue,
                    label: "Company Name",
                    value: companyName,
                },
                {
                    type: FieldValueType.SingleValue,
                    label: "Company Order in Resume",
                    value: order,
                },
                {
                    type: FieldValueType.SingleValue,
                    label: "Mode Of Work",
                    value: modeOfWork,
                },
                {
                    type: FieldValueType.SingleValue,
                    label: "Office Address",
                    value: officeAddress,
                },
                {
                    type: FieldValueType.ArrayValue,
                    label: "About Company",
                    value: aboutCompany,
                },
                {
                    type: FieldValueType.SingleValue,
                    label: "Company Website URL",
                    value: companyWebsiteURL,
                },
                {
                    type: FieldValueType.ArrayValue,
                    label: "Domain Of Company",
                    value: domainOfCompany,
                },
                {
                    type: FieldValueType.ArrayValue,
                    label: "Project Names",
                    value: projectNames,
                },
                {
                    type: FieldValueType.ArrayValue,
                    label: "Overall Tech-Stack",
                    value: techStack,
                },
            ]}
        />
    );
};

export default CompanyDetailsCard;
