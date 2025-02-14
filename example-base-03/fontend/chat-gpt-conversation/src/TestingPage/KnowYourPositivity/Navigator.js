import SastaDBService from "./SastaDBService.js";

class Navigator {
  static getNextSentenceId(currentId) {
    const allSentences = SastaDBService.getAllSentences();
    const index = allSentences.findIndex((s) => s.id === currentId);
    return index === -1 || index === allSentences.length - 1 ? allSentences[0].id : allSentences[index + 1].id;
  }

  static getPrevSentenceId(currentId) {
    const allSentences = SastaDBService.getAllSentences();
    const index = allSentences.findIndex((s) => s.id === currentId);
    return index === -1 || index === 0 ? allSentences[allSentences.length - 1].id : allSentences[index - 1].id;
  }
}

export default Navigator;
