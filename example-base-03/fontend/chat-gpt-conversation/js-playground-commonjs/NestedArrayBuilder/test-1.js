const {NestedArrayBuilder}=require('./v1');

// Usage
const builder = new NestedArrayBuilder();

const nestedArray = builder
  .addSection("Section 1: JavaScript (ES6) & Asynchronous Programming")
  .addSubSection("JavaScript ES6 Concepts:")
  .addQuestion("What are the differences between let, const, and var in terms of scope and reassignability?")
  .addQuestion(
    "How do arrow functions differ from regular functions in terms of syntax, this binding, and usage?"
  )
  .addQuestion("Give an example of using .map() to transform an array.")
  .addQuestion("When would you use .reduce() instead of .forEach()? Provide an example.")
  .addQuestion("Explain the differences between .filter() and .map() with a practical use case.")
  .addSubSection("Single Thread vs. Multi-threading:")
  .addQuestion(
    "Why is JavaScript called a single-threaded language, and how does the event loop manage asynchronous tasks?"
  )
  .addQuestion(
    "Explain the difference between callbacks, Promises, and async/await in JavaScript. Provide examples."
  )
  .addSubSection("Asynchronous Programming:")
  .addQuestion("Describe the event loop and how it manages the call stack and web APIs.")
  .addQuestion("Write a code snippet to fetch data from an API using both fetch and Axios.")
  .addQuestion("How can you handle errors in an async function using try/catch? Provide an example.")
  .addSubSection("Peer Code Review:")
  .addQuestion("What are the key points to consider when conducting a peer code review?")
  .addQuestion("How can constructive feedback improve code quality during a code review?")
  .build();

console.log(JSON.stringify(nestedArray, null, 2));