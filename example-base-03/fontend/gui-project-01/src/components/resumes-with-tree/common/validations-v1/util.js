import {
    ItemType,
    validateFields,
    ValidationMessageType,
    isUndefined,
    isObject,
    isString,
    isArray,
    isArrayOfStrings,
    conatinsErrorMessages,
} from "./validation-util";

const validateMetadata = (metadata, messages, parentField) =>
    validateFields(
        metadata,
        [
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
                    customValidationMessage: "should contain an array of objects.",
                }),
            },
        ],
        messages,
        parentField
    );

const validateProcessedDetails = (details, messages, parentField) =>
    validateFields(
        details,
        [
            { field: "rawText", type: "string", isRequired: true },
            { field: "textType", type: "string", isRequired: true },
            {
                field: "metadata",
                type: "object",
                isRequired: true,
                nestedValidation: validateMetadata,
            },
        ],
        messages,
        parentField
    );

const validateDataForType = (data, type) => {
    const messages = [];
    if (!Object.values(ItemType).includes(type)) {
        messages.push({
            type: ValidationMessageType.ERROR,
            message: `Invalid type provided: ${type}`,
        });
    } else {
        validateFields(
            data,
            [
                { field: "uniqueId", type: "string", isRequired: true },
                { field: "name", type: "string", isRequired: true },
                {
                    field: "processedDetails",
                    type: "object",
                    isRequired: true,
                    nestedValidation: validateProcessedDetails,
                },
            ],
            messages
        );
    }

    return {
        validData: !conatinsErrorMessages(messages),
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
