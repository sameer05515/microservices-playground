const {
  add,
  subtract,
  multiply,
  divide,
  modulus,
  power,
  increment,
  decrement
} = require("./arithmetic");

const a = 20;
const b = 6;

console.log("Arithmetic Operations");
console.log("=====================");
console.log(`${a} + ${b} = ${add(a, b)}`);
console.log(`${a} - ${b} = ${subtract(a, b)}`);
console.log(`${a} * ${b} = ${multiply(a, b)}`);
console.log(`${a} / ${b} = ${divide(a, b)}`);
console.log(`${a} % ${b} = ${modulus(a, b)}`);
console.log(`${a} ^ ${b} = ${power(a, b)}`);
console.log(`${a} + 1 = ${increment(a)}`);
console.log(`${a} - 1 = ${decrement(a)}`);
