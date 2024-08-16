const { startOperation, stepOperation, endOperation } = require("../util/custom-logger");

const logicWithCB = (num1, num2) => {
    let result=0;
    startOperation({
        title: "Method Start with data: ",
        data: { num1, num2 },
    });
    if (!num1 || !num2) {
        stepOperation({
            title: "Validation Failed: ",
            data: `Error: Either number1:'${num1}' or number2:'${num2}' is null or undefined`,
        });        
    }

    stepOperation({
        title: "Validation Passed: ",
        data: `Success: Neither number1:'${num1}' nor number2:'${num2}' is null or undefined`,
    });

    if (isNaN(num1) || isNaN(num1)) {
        stepOperation({
            title: "Validation Failed: ",
            data: `Error: Either number1:'${num1}' or number2:'${num2}' is Nan`,
        });
        
    }
    stepOperation({
        title: "Validation Passed: ",
        data: `Success: Neither number1:'${num1}' nor number2:'${num2}' is Nan`,
    });

    result = num1 + num2;
    stepOperation({
        title: "Calculation Done: ",
        data: {
            status: "Success",
            message: `Success: successfully calculated sum for number1:'${num1}' and number2:'${num2}'`,
            result
        },
    });
    endOperation({ title: "Method End with data: ", data: result });
    return result;
};

const logic = (num1, num2) => {
    if (!num1 || !num2) {
        console.log(
            `"Validation Error": Either number1:'${num1}' or number2:'${num2}' is null or undefined`
        );
        return 0;
    }

    if (isNaN(num1) || isNaN(num1)) {
        console.log(
            `"Validation Error": Either number1:'${num1}' or number2:'${num2}' is null or undefined`
        );
        return 0;
    }

    const result = num1 + num2;

    console.log(`"Success": calculation done, output: ${result}`);
    return result;
};

module.exports = {logic, logicWithCB};