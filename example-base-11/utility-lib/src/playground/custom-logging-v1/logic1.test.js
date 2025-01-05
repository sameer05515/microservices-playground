const {logicWithCB} = require('./logic')

const arr = [
    { num1: 2, num2: 4 },
    { num1: 0, num2: 0 },
];

// arr.forEach(({ num1, num2 }) => logic(num1, num2));
arr.forEach(({ num1, num2 }) => logicWithCB(num1, num2));
