class SastaDBService {
    static #sastaDB = new Map();
  
    static #generateKey(id, type) {
      return `${id}:${type}`;
    }
  
    // ✅ Section Store
    static storeSection(section) {
      if (!section || !section.id) throw new Error("Invalid Section");
      const sectionData = { ...section, type: "section" };
      this.#sastaDB.set(this.#generateKey(section.id, "section"), sectionData);
    }
  
    // ✅ Sentence Store
    static storeSentence(sentence, parentSectionId) {
      if (!sentence || !sentence.id) throw new Error("Invalid Sentence");
      const sentenceData = { ...sentence, type: "sentence", parentSectionId };
      this.#sastaDB.set(this.#generateKey(sentence.id, "sentence"), sentenceData);
    }
  
    // ✅ Getters
    static getSectionById(sectionId) {
      return this.#sastaDB.get(this.#generateKey(sectionId, "section"));
    }
  
    static getSentenceById(sentenceId) {
      return this.#sastaDB.get(this.#generateKey(sentenceId, "sentence"));
    }
  
    static getSentencesForSectionId(sectionId) {
      return Array.from(this.#sastaDB.values()).filter(
        (entry) => entry.type === "sentence" && entry.parentSectionId === sectionId
      );
    }
  
    static getChildrenForSectionId(sectionId) {
      return Array.from(this.#sastaDB.values()).filter(
        (entry) => entry.type === "section" && entry.parentId === sectionId
      );
    }
  
    static getAllSentences() {
      return Array.from(this.#sastaDB.values()).filter((entry) => entry.type === "sentence");
    }
  
    // ✅ Debugging
    static printDB() {
      console.log(this.#sastaDB);
    }
  }
  
  export default SastaDBService;
  