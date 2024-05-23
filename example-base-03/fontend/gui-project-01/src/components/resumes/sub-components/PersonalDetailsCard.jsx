import React from "react";
import Card, { FieldValueType } from "../../../common/components/custom-card/Card";

const PersonalDetailsCard = ({ title, personalDetails }) => {
  const {
    name,
    dateOfBirth,
    emails,
    contactNumbers,
    degree,
    lastDesignation,
    totalExperience,
  } = personalDetails || {};

  return (
    <Card
      title={title}
      fields={[
        {
          type: FieldValueType.SingleValue,
          label: "Name",
          value: name,
        },
        {
          type: FieldValueType.SingleValue,
          label: "Date of Birth",
          value: dateOfBirth,
        },
        {
          type: FieldValueType.SingleValue,
          label: "Highest Degree",
          value: degree,
        },
        {
          type: FieldValueType.SingleValue,
          label: "Last Designation",
          value: lastDesignation,
        },
        {
          type: FieldValueType.SingleValue,
          label: "Total Experience",
          value: totalExperience,
        },
        {
          type: FieldValueType.ArrayValue,
          label: "Emails",
          value: emails,
        },
        {
          type: FieldValueType.ArrayValue,
          label: "Contact Numbers",
          value: contactNumbers,
        },
      ]}
    />
  );
};

export default PersonalDetailsCard;
