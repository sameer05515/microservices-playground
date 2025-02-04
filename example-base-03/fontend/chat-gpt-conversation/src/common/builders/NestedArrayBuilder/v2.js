/**
 * 
 * v2 version of NestedArrayBuilder is improvement of [v1.js](./v1.js). However, this we do not want to use.
 * 
 * This is because below resons:
 * 1. v2 version assumes question is just an string. However, later we are generating structure, 
 * where question itself is an object having 
 * - answersTexts(a string array conatining raw texts of md format), 
 * - answerFiles ( a string array containing links for md files) and 
 * - answerLinks(a string array containing links for md extention texts saved in database)
 * 
 * Due to this reasons, we will further enhance v2 version in next v3 version.
 * 
*/

// const Type={
//     SECTION:"section",
//     QUESTION:"question"
// }

// class Question{
//     constructor(question=""){
//         this.question=question;
//         this.answersTexts=[];
//         this.answerFiles=[];
//         this.answerLinks=[];

//     }
// }

// class StableIdGenerator{
//     static generateStableId(type=null){
//         return "";
//     }
// }

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
    this.questions.push(question);
    return this; // Enable chaining
  }

  addQuestions(...questions) {
    this.questions.push(...questions);
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
