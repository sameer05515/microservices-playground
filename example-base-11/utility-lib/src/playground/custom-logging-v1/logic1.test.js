const {
    onStartOperationCallback,
    onEndOperationCallback,
    postStepCallback,
} = require("./custom-logger");

const logicWithCB = (num1, num2) => {
    onStartOperationCallback({
        title: "Method Start with data: ",
        data: { num1, num2 },
    });
    if (!num1 || !num2) {
        postStepCallback({
            title: "Validation Error",
            data: `"Validation Error": Either number1:'${num1}' or number2:'${num2}' is null or undefined`,
        });
        return 0;
    }

    if (isNaN(num1) || isNaN(num1)) {
        postStepCallback({
            title: "Validation Error",
            data: `"Validation Error": Either number1:'${num1}' or number2:'${num2}' is null or undefined`,
        });
        return 0;
    }
    const result = num1 + num2;
    onEndOperationCallback({ title: "Method End with data: ", data: result });
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

const arr = [
    { num1: 2, num2: 4 },
    { num1: 0, num2: 0 },
];

arr.forEach(({ num1, num2 }) => logic(num1, num2));
arr.forEach(({ num1, num2 }) => logicWithCB(num1, num2));
