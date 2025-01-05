const { NestedArrayBuilder } = require("./v1");

const builder = new NestedArrayBuilder();

const nestedArray = builder
  .addSection("Section 1: Programming Basics")
  .addSubSection("Variables and Data Types")
  .addQuestion("What are variables?")
  .addQuestion("What are data types in JavaScript?")
  .addSubSection("Control Structures")
  .addQuestion("What is an if-else statement?")
  .addQuestion("How do loops work in JavaScript?")
  .addSection("Section 2: Object-Oriented Programming")
  .addSubSection("Classes and Objects")
  .addQuestion("What is a class?")
  .addQuestion("How do you create an object in JavaScript?")
  .addSubSection("Inheritance")
  .addQuestion("What is inheritance?")
  .addQuestion("How do you use inheritance in JavaScript?")
  .addSection("Section 3: Asynchronous JavaScript")
  .addSubSection("Promises")
  .addQuestion("What are promises in JavaScript?")
  .addQuestion("How do you handle errors in promises?")
  .addSubSection("Async/Await")
  .addQuestion("What is async/await?")
  .addQuestion("How does async/await simplify asynchronous programming?")
  .build();

console.log(JSON.stringify(nestedArray, null, 2));
