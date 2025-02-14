import { generateSlug } from "./utils.js";

class RajMistiry {
  static #validateString(input, fieldName) {
    if (typeof input !== "string" || !input.trim()) {
      throw new Error(`${fieldName} must be a non-empty string!`);
    }
  }

  static #validateArray(arr, fieldName) {
    if (!Array.isArray(arr)) {
      throw new Error(`${fieldName} must be an array!`);
    }
  }

  static #getSection = (name) => {
    this.#validateString(name, "Section name");
    return {
      id: generateSlug(name),
      name: name,
      type: "section",
      parentId: "",
    };
  };

  static #getSentences = (texts = []) => {
    this.#validateArray(texts, "Sentences");
    return texts.map((text,idx) => {
      this.#validateString(text, "Sentence");
      return {
        id: generateSlug(`${idx+1}_${text}`),
        text: text,
        type: "sentence",
        parentSectionId: "",
      };
    });
  };

  static prepareStructure = ({ sectionName = "", sentencesTexts = [], subsectionsArr = [] }) => {
    this.#validateString(sectionName, "Section name");
    this.#validateArray(sentencesTexts, "Sentences list");
    this.#validateArray(subsectionsArr, "Subsections list");

    return {
      section: RajMistiry.#getSection(sectionName),
      sentences: RajMistiry.#getSentences(sentencesTexts),
      subsections: subsectionsArr,
    };
  };
}

// === TEST CASES === //
try {
  const RawData1 = [
    RajMistiry.prepareStructure({
      sectionName: "sec11",
      sentencesTexts: ["sentence111", "sentence112"],
      subsectionsArr: [
        RajMistiry.prepareStructure({
          sectionName: "sec1122",
          sentencesTexts: ["1. sentence111", "2. sentence111"],
        }),
      ],
    }),
  ];

  console.log("✅ Valid Data:", RawData1);
} catch (error) {
  console.error("❌ Error:", error.message);
}

// Uncomment below lines to test validation errors
// RajMistiry.prepareStructure({ sectionName: "", sentencesTexts: ["sentence"], subsectionsArr: [] }); // ❌ Error
// RajMistiry.prepareStructure({ sectionName: "Valid", sentencesTexts: "", subsectionsArr: [] }); // ❌ Error
// RajMistiry.prepareStructure({ sectionName: "Valid", sentencesTexts: ["sentence"], subsectionsArr: "Not an array" }); // ❌ Error

export default RajMistiry;
