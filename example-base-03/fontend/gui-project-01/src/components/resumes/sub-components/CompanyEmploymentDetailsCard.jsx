import React from "react";
import Card, { FieldValueType } from "../../../common/components/custom-card/Card";
import { camelCaseToTitleCase } from "../../../utils/helper-utils";

const CompanyEmploymentDetailsCard = ({ title, companyEmploymentDetails }) => {
  const {
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
  } = companyEmploymentDetails;
  return (
    <Card
      title={title}
      fields={[
        {
          type: FieldValueType.SingleValue,
          label: "Employment Type",
          value: employmentType,
        },
        {
          type: FieldValueType.SingleValue,
          label: "Over All Tenure",
          value: overAllTenure,
        },
        {
          type: FieldValueType.SingleValue,
          label: "Over All Tenure With Date",
          value: overAllTenureWithDate,
        },
        {
          type: FieldValueType.SingleValue,
          label: "Last CTC",
          value: lastCTC,
        },
        {
          type: FieldValueType.SingleValue,
          label: "Last Employee Code",
          value: lastEmployeeCode,
        },
        {
          type: FieldValueType.SingleValue,
          label: "Last Designation",
          value: lastDesignation,
        },
        {
          type: FieldValueType.SingleValue,
          label: "Last Reason For Change",
          value: lastReasonForChange,
          renderItem: ({ actual, forHR }) => (
            <Card
              fields={[
                {
                  type: FieldValueType.SingleValue,
                  label: "Actual",
                  value: actual,
                },
                {
                  type: FieldValueType.SingleValue,
                  label: "For HR",
                  value: forHR,
                },
              ]}
            />
          ),
        },
        {
          type: FieldValueType.ArrayValue,
          label: "Employment Highlights",
          value: highlights,
        },
        {
          type: FieldValueType.ArrayValue,
          label: "Employment History",
          value: employmentHistories,
          renderItem: ({
            tenure,
            employeeCode,
            lastWorkingDay,
            dateOfJoining,
            designation,
            reasonForJoining,
            reasonForChange,
            joiningCTC,
            exitCTC,
          }) => (
            <Card
              fields={[
                {
                  type: FieldValueType.SingleValue,
                  label: "Tenure",
                  value: tenure,
                },
                {
                  type: FieldValueType.SingleValue,
                  label: "Employee Code",
                  value: employeeCode,
                },
                {
                  type: FieldValueType.SingleValue,
                  label: camelCaseToTitleCase("lastWorkingDay"),
                  value: lastWorkingDay,
                },

                {
                  type: FieldValueType.SingleValue,
                  label: camelCaseToTitleCase("dateOfJoining"),
                  value: dateOfJoining,
                },
                {
                  type: FieldValueType.SingleValue,
                  label: camelCaseToTitleCase("reasonForJoining"),
                  value: reasonForJoining,
                },
                {
                  type: FieldValueType.SingleValue,
                  label: camelCaseToTitleCase("designation"),
                  value: designation,
                },

                {
                  type: FieldValueType.SingleValue,
                  label: camelCaseToTitleCase("reasonForChange"),
                  value: reasonForChange,
                  renderItem: ({ actual, forHR }) => (
                    <Card
                      fields={[
                        {
                          type: FieldValueType.SingleValue,
                          label: "Actual",
                          value: actual,
                        },
                        {
                          type: FieldValueType.SingleValue,
                          label: "For HR",
                          value: forHR,
                        },
                      ]}
                    />
                  ),
                },
                {
                  type: FieldValueType.SingleValue,
                  label: camelCaseToTitleCase("joiningCTC"),
                  value: joiningCTC,
                },
                {
                  type: FieldValueType.SingleValue,
                  label: camelCaseToTitleCase("exitCTC"),
                  value: exitCTC,
                },
              ]}
            />
          ),
        },
        {
          type: FieldValueType.ArrayValue,
          label: "Employment References",
          value: references,
        },
      ]}
    />
  );
};

export default CompanyEmploymentDetailsCard;
