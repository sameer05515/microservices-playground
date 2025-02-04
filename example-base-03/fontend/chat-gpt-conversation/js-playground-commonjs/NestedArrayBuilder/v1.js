class NestedArrayBuilder {
  constructor() {
    this.structure = [];
  }

  addSection(title) {
    const section = [title, []];
    this.structure.push(section);
    this.currentSection = section;
    return this; // Enable chaining
  }

  addSubSection(subSectionTitle) {
    if (!this.currentSection) {
      throw new Error("You must add a section before adding a sub-section.");
    }
    const subSection = [subSectionTitle, []];
    this.currentSection[1].push(subSection);
    this.currentSubSection = subSection;
    return this; // Enable chaining
  }

  addQuestion(question) {
    if (!this.currentSubSection) {
      throw new Error("You must add a sub-section before adding a question.");
    }
    this.currentSubSection[1].push(question);
    return this; // Enable chaining
  }

  build() {
    return this.structure;
  }
}

module.exports = { NestedArrayBuilder };
