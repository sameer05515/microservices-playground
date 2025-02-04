/**
 *
 * v3 version of NestedArrayBuilder improves upon v2.js by introducing a `Question` class.
 *
 * Major Enhancements in v3:
 * 1. `Question` is now an object with attributes:
 *    - `answersTexts`: An array of raw text answers (Markdown format).
 *    - `answerFiles`: An array of links to Markdown files.
 *    - `answerLinks`: An array of links to external text resources stored in the database.
 * 2. `Section` handles nested sub-sections and questions while ensuring flexibility for chaining.
 * 3. `NestedArrayBuilderV3` manages the top-level structure and delegates responsibility to `Section` and `Question` classes.
 *
 */

// const Type = {
//   SECTION: "section",
//   QUESTION: "question",
// };

// class StableIdGenerator{
//     static generateStableId(type=null){
//         return "";
//     }
// }

class Question {
  constructor(question = "") {
    this.question = question;
    this.answersTexts = [];
    this.answerFiles = [];
    this.answerLinks = [];
  }

  // Add raw text answers
  addAnswerText(...texts) {
    this.answersTexts.push(...texts);
    return this; // Enable chaining
  }

  // Add file links
  addAnswerFile(...files) {
    this.answerFiles.push(...files);
    return this; // Enable chaining
  }

  // Add external links
  addAnswerLink(...links) {
    this.answerLinks.push(...links);
    return this; // Enable chaining
  }
}

class Section {
  constructor(title) {
    this.title = title;
    this.subSections = [];
    this.questions = [];
  }

  addSubSection(subSectionTitle) {
    const subSection = new Section(subSectionTitle);
    this.subSections.push(subSection);
    return subSection; // Enable chaining for nested sub-sections
  }

  addQuestion(question) {
    // Support both plain strings and Question objects
    if (typeof question === "string") {
      this.questions.push(new Question(question));
    } else if (question instanceof Question) {
      this.questions.push(question);
    } else {
      throw new Error("Invalid question type. Must be a string or Question object.");
    }
    return this; // Enable chaining
  }

  addQuestions(...questions) {
    questions.forEach((q) => this.addQuestion(q)); // Leverage addQuestion for validation
    return this; // Enable chaining
  }
}

export class NestedArrayBuilderV3 {
  constructor() {
    this.structure = [];
  }

  addSection(title) {
    const section = new Section(title);
    this.structure.push(section);
    return section; // Return the section for chaining sub-sections and questions
  }

  build() {
    return this.structure;
  }
}

// Example Usage
const builder = new NestedArrayBuilderV3();

const structure = builder
  .addSection("Introduction")
  .addSubSection("Overview")
  .addQuestions(
    new Question("What is the purpose of this document?")
      .addAnswerText("To explain v3 structure.")
      .addAnswerFile("https://example.com/v3-overview.md"),
    "What is new in v3?"
  )
  .addSubSection("Features")
  .addQuestion(
    new Question("What are the key features?")
      .addAnswerText("Encapsulation, Flexibility.")
      .addAnswerLink("https://example.com/features")
  )
  .addSection("Advanced Topics")
  .addSubSection("Customization")
  .addQuestion("How to customize this structure?")
  .build();

console.log(JSON.stringify(structure, null, 2));
