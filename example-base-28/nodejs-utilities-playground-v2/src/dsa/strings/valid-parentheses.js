function isValidParentheses(value) {
  const stack = [];
  const pairs = new Map([[")", "("], ["]", "["], ["}", "{"]]);
  for (const char of value) {
    if (["(", "[", "{"].includes(char)) stack.push(char);
    else if (pairs.has(char) && stack.pop() !== pairs.get(char)) return false;
  }
  return stack.length === 0;
}
module.exports = { isValidParentheses };
