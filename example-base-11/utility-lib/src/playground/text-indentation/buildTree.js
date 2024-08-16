const { startOperation, stepOperation, endOperation } = require("../util/custom-logger");
const validate = require("./validate");
const parseLines = require("./parse-lines");

function buildTree(text) {
  startOperation({
    title: "1. Inside Method: [buildTree] Start with data: ",
    data: text,
  });

  const parsed = parseLines(text);
  stepOperation({
    title: "2. Result post parseLines: ",
    data: { parsed },
  });

  if (!parsed.isValid) {
    stepOperation({
      title: "3. Validation failed: ",
      data: {
        data: parsed.data,
        isValid: false,
        errorCode: parsed.errorCode,
        message: parsed.message,
      },
    });
    return parsed;
  }

  stepOperation({
    title: "4. Starting validation with parsed data: ",
    data: { parsedData: parsed.data },
  }, false);

  const dataAfterValidation = validate(parsed.data);
  stepOperation({
    title: "5. Result from validate method: ",
    data: { dataAfterValidation },
  }, false);

  endOperation({
    title: "6. Method End with data: ",
    data: dataAfterValidation,
  }, false);

  return dataAfterValidation;
}

// Example Usage:
const textInput = `
    Node 1
        Node 1.1
        Node 1.2
            Node 1.2.1
    Node 2
`;

// const result = buildTree(textInput);
// console.log(result);

module.exports = buildTree;
