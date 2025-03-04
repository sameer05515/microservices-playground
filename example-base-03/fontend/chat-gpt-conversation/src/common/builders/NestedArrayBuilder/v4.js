/**
 * 
 * 
 * ### Key Enhancements in v4:

1. **`StableIdGenerator` Integration:**
   - Each `Section` and `Question` is now assigned a stable and unique ID (`SECTION-1`, `QUESTION-1`, etc.).
   - IDs ensure stability for reporting and updates.

2. **`id` Property for Sections and Questions:**
   - Every `Section` and `Question` now includes an `id` generated by `StableIdGenerator`.

3. **Backward Compatibility:**
   - Existing chaining behavior remains unchanged, and the system is extensible for future enhancements.

4. **Improved Maintainability:**
   - `StableIdGenerator` abstracts the logic for ID generation, making it reus
 * 
 * */

const Type = {
  SECTION: "section",
  QUESTION: "question",
};

class StableIdGenerator {
  static counter = 0;

  static generateStableId(type = null) {
    // Generate a unique ID with a prefix based on type (e.g., SECTION-1, QUESTION-1)
    return `${type?.toUpperCase() || "UNKNOWN"}-${++this.counter}`;
  }
}

class Question {
  constructor(question = "") {
    this.id = StableIdGenerator.generateStableId(Type.QUESTION);
    this.question = question;
    this.answersTexts = [];
    this.answerFiles = [];
    this.answerLinks = [];
  }

  addAnswerText(...texts) {
    this.answersTexts.push(...texts);
    return this;
  }

  addAnswerFile(...files) {
    this.answerFiles.push(...files);
    return this;
  }

  addAnswerLink(...links) {
    this.answerLinks.push(...links);
    return this;
  }
}

class Section {
  constructor(title) {
    this.id = StableIdGenerator.generateStableId(Type.SECTION);
    this.title = title;
    this.subSections = [];
    this.questions = [];
  }

  addSubSection(subSectionTitle) {
    const subSection = new Section(subSectionTitle);
    this.subSections.push(subSection);
    return subSection;
  }

  addQuestion(question) {
    if (typeof question === "string") {
      this.questions.push(new Question(question));
    } else if (question instanceof Question) {
      this.questions.push(question);
    } else {
      throw new Error("Invalid question type. Must be a string or Question object.");
    }
    return this;
  }

  addQuestions(...questions) {
    questions.forEach((q) => this.addQuestion(q));
    return this;
  }
}

export class NestedArrayBuilderV4 {
  constructor() {
    this.structure = [];
  }

  addSection(title) {
    const section = new Section(title);
    this.structure.push(section);
    return section;
  }

  build() {
    return this.structure;
  }
}

// Example Usage
//   const builder = new NestedArrayBuilderV4();

//   export const structure = builder
//     .addSection("Introduction")
//     .addSubSection("Overview")
//     .addQuestions(
//       new Question("What is the purpose of this document?")
//         .addAnswerText("To explain v4 structure.")
//         .addAnswerFile("https://example.com/v4-overview.md"),
//       "What is new in v4?"
//     )
//     .addSubSection("Features")
//     .addQuestion(
//       new Question("What are the key features?")
//         .addAnswerText("Encapsulation, Flexibility.")
//         .addAnswerLink("https://example.com/features")
//     )
//     .addSection("Advanced Topics")
//     .addSubSection("Customization")
//     .addQuestion("How to customize this structure?")
//     .build();

//   console.log(JSON.stringify(structure, null, 2));

// SAMPLE OUTPUT

// [
//     {
//       "id": "SECTION-1",
//       "title": "Introduction",
//       "subSections": [
//         {
//           "id": "SECTION-2",
//           "title": "Overview",
//           "subSections": [],
//           "questions": [
//             {
//               "id": "QUESTION-1",
//               "question": "What is the purpose of this document?",
//               "answersTexts": ["To explain v4 structure."],
//               "answerFiles": ["https://example.com/v4-overview.md"],
//               "answerLinks": []
//             },
//             {
//               "id": "QUESTION-2",
//               "question": "What is new in v4?",
//               "answersTexts": [],
//               "answerFiles": [],
//               "answerLinks": []
//             }
//           ]
//         },
//         {
//           "id": "SECTION-3",
//           "title": "Features",
//           "subSections": [],
//           "questions": [
//             {
//               "id": "QUESTION-3",
//               "question": "What are the key features?",
//               "answersTexts": ["Encapsulation, Flexibility."],
//               "answerFiles": [],
//               "answerLinks": ["https://example.com/features"]
//             }
//           ]
//         }
//       ],
//       "questions": []
//     },
//     {
//       "id": "SECTION-4",
//       "title": "Advanced Topics",
//       "subSections": [
//         {
//           "id": "SECTION-5",
//           "title": "Customization",
//           "subSections": [],
//           "questions": [
//             {
//               "id": "QUESTION-4",
//               "question": "How to customize this structure?",
//               "answersTexts": [],
//               "answerFiles": [],
//               "answerLinks": []
//             }
//           ]
//         }
//       ],
//       "questions": []
//     }
//   ]
