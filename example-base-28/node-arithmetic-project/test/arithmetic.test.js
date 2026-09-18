const test = require("node:test");
const assert = require("node:assert/strict");

const {
  add,
  subtract,
  multiply,
  divide,
  modulus,
  power,
  increment,
  decrement
} = require("../src/arithmetic");

test("add", () => assert.equal(add(10, 5), 15));
test("subtract", () => assert.equal(subtract(10, 5), 5));
test("multiply", () => assert.equal(multiply(10, 5), 50));
test("divide", () => assert.equal(divide(10, 5), 2));
test("modulus", () => assert.equal(modulus(10, 3), 1));
test("power", () => assert.equal(power(2, 5), 32));
test("increment", () => assert.equal(increment(10), 11));
test("decrement", () => assert.equal(decrement(10), 9));
test("divide by zero throws", () => {
  assert.throws(() => divide(10, 0), /Division by zero/);
});
