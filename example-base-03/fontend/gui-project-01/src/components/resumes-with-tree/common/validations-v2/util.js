// src\components\resumes-with-tree\common\validations-v2\util.js

import {
    ItemType,
    validateFields,
    ValidationMessageType,
    isObject,
    isArray,
    isArrayOfStrings,
    containsErrorMessages,
} from "./validation-util";

const getMetadataFieldValidationsForType = (type) => {
    let fieldValidations = []
    if (type === ItemType.RESUME) {
        fieldValidations = [
            {
                field: "summarizedIntroduction",
                type: "array",
                isRequired: true,
                customValidation: (summarizedIntroduction) => ({
                    passed: isArrayOfStrings(summarizedIntroduction),
                    customValidationMessage: "should contain array of strings.",
                }),
            },
            {
                field: "personalDetails",
                type: "object",
                isRequired: true,
                customValidation: (personalDetails) => ({
                    passed: !isArray(personalDetails),
                    customValidationMessage: "should not contain an array.",
                }),
            },
            {
                field: "expertises",
                type: "array",
                isRequired: true,
                customValidation: (expertises) => ({
                    passed: expertises.every(isObject),
                    customValidationMessage:
                        "should contain an array of objects.",
                }),
            },
            { field: "degree", type: "string", isRequired: true },
            { field: "lastDesignation", type: "string", isRequired: true },
            { field: "totalExperience", type: "string", isRequired: true },
            {
                field: "certifications",
                type: "array",
                isRequired: true,
                customValidation: (expertises) => ({
                    passed: expertises.every(isObject),
                    customValidationMessage:
                        "should contain an array of objects.",
                }),
            },
            {
                field: "languagesKnown",
                type: "array",
                isRequired: true,
                customValidation: (summarizedIntroduction) => ({
                    passed: isArrayOfStrings(summarizedIntroduction),
                    customValidationMessage: "should contain array of strings.",
                }),
            },
            {
                field: "hobbies",
                type: "array",
                isRequired: true,
                customValidation: (summarizedIntroduction) => ({
                    passed: isArrayOfStrings(summarizedIntroduction),
                    customValidationMessage: "should contain array of strings.",
                }),
            },
        ];
    }
    if (type === ItemType.COMPANY) {
        fieldValidations = [
            { field: "company", type: "string", isRequired: true },
            { field: "order", type: "number", isRequired: true },
            { field: "modeOfWork", type: "string", isRequired: true },
            { field: "officeAddress", type: "string", isRequired: true },
            { field: "employmentType", type: "string", isRequired: true },
            {
                field: "aboutCompany", type: "array", isRequired: true,
                customValidation: (aboutCompany) => ({
                    passed: isArrayOfStrings(aboutCompany),
                    customValidationMessage: "should contain array of strings.",
                }),
            },
            {
                field: "domainOfCompany", type: "array", isRequired: true,
                customValidation: (domainOfCompany) => ({
                    passed: isArrayOfStrings(domainOfCompany),
                    customValidationMessage: "should contain array of strings.",
                }),
            },
            { field: "companyWebsiteURL", type: "string", isRequired: true },
            { field: "overAllTenure", type: "string", isRequired: true },
            { field: "overAllTenureWithDate", type: "string", isRequired: true },
            { field: "lastDesignation", type: "string", isRequired: true },
            { field: "lastCTC", type: "string", isRequired: true },
            { field: "lastEmployeeCode", type: "number", isRequired: true },
            {
                field: "lastReasonForChange", type: "object", isRequired: true,
                // customValidation: (lastReasonForChange) => ({
                //     passed: isArrayOfStrings(lastReasonForChange),
                //     customValidationMessage: "should contain array of strings.",
                // }),
            },
            {
                field: "projects", type: "array", isRequired: true,
                customValidation: (projects) => ({
                    passed: isArrayOfStrings(projects),
                    customValidationMessage: "should contain array of strings.",
                }),
            },
            {
                field: "techStack", type: "array", isRequired: true,
                customValidation: (techStack) => ({
                    passed: isArrayOfStrings(techStack),
                    customValidationMessage: "should contain array of strings.",
                }),
            },
            {
                field: "highlights", type: "array", isRequired: true,
                customValidation: (highlights) => ({
                    passed: isArrayOfStrings(highlights),
                    customValidationMessage: "should contain array of strings.",
                }),
            },
            {
                field: "employmentHistories",
                type: "array",
                isRequired: true,
                customValidation: (employmentHistories) => ({
                    passed: employmentHistories.every(isObject),
                    customValidationMessage:
                        "should contain an array of objects.",
                }),
            },
            {
                field: "references", type: "array", isRequired: true,
                customValidation: (references) => ({
                    passed: isArrayOfStrings(references),
                    customValidationMessage: "should contain array of strings.",
                }),
            },

        ]
    }
    if (type === ItemType.PROJECT) {
        fieldValidations=[
            { field: "project", type: "string", isRequired: true },
            { field: "order", type: "number", isRequired: true },
            { field: "tenure", type: "string", isRequired: true },            
            {
                field: "description", type: "array", isRequired: true,
                customValidation: (references) => ({
                    passed: isArrayOfStrings(references),
                    customValidationMessage: "should contain array of strings.",
                }),
            },
            {
                field: "techStack", type: "array", isRequired: true,
                customValidation: (references) => ({
                    passed: isArrayOfStrings(references),
                    customValidationMessage: "should contain array of strings.",
                }),
            },
            {
                field: "rolesAndResponsibilities",
                type: "array",
                isRequired: true,
                customValidation: (employmentHistories) => ({
                    passed: employmentHistories.every(isObject),
                    customValidationMessage:
                        "should contain an array of objects.",
                }),
            },
        ]
    }
    return fieldValidations;
};

const validateDataForType = (data, type) => {
    const messages = [];
    if (!Object.values(ItemType).includes(type)) {
        messages.push({
            type: ValidationMessageType.ERROR,
            message: `Invalid type provided: ${type}`,
        });
    } else {
        // const bug="bug";
        validateFields(
            data,
            // bug,
            [
                { field: "uniqueId", type: "string", isRequired: true },
                { field: "name", type: "string", isRequired: true },
                {
                    field: "processedDetails",
                    type: "object",
                    isRequired: true,
                    children: [
                        { field: "rawText", type: "string", isRequired: true },
                        { field: "textType", type: "string", isRequired: true },
                        {
                            field: "metadata",
                            type: "object",
                            isRequired: true,
                            children: getMetadataFieldValidationsForType(type),
                        },
                    ],
                },
            ],
            messages
        );
    }

    return {
        validData: !containsErrorMessages(messages),
        messages: messages.length
            ? messages
            : [
                {
                    type: ValidationMessageType.OK,
                    message: "All data validated successfully",
                },
            ],
    };
};

export { validateDataForType };
