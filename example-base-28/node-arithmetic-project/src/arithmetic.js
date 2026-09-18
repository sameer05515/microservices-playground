function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    throw new Error("Division by zero is not allowed");
  }
  return a / b;
}

function modulus(a, b) {
  if (b === 0) {
    throw new Error("Modulus by zero is not allowed");
  }
  return a % b;
}

function power(a, b) {
  return a ** b;
}

function increment(a) {
  return a + 1;
}

function decrement(a) {
  return a - 1;
}

module.exports = {
  add,
  subtract,
  multiply,
  divide,
  modulus,
  power,
  increment,
  decrement
};
