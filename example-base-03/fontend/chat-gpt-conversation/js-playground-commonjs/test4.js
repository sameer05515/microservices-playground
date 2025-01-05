const prepareQuestions = (subSection = [], subSecIdx) => {
  if (subSection.length < 2 || !Array.isArray(subSection[1])) {
    return { questions: [] };
  }

  return {
    questions: subSection[1].map((question, quesIdx) => ({
      id: `ques_${subSecIdx}_${quesIdx + 1}`,
      name: question,
    })),
  };
};

const prepareSubsections = (section = [], secIdx) => {
  if (section.length < 2 || !Array.isArray(section[1])) {
    return { subSections: [] };
  }

  return {
    subSections: section[1].map((subSec, subSecIdx) => ({
      id: `sub_sec_${secIdx}_${subSecIdx + 1}`,
      name: Array.isArray(subSec) ? subSec[0] : subSec,
      ...(Array.isArray(subSec) ? prepareQuestions(subSec, `${secIdx}_${subSecIdx + 1}`) : { questions: [] }),
    })),
  };
};

const sectionData1 = [
  [
    "Questions As per Premendra Kumar's expertize", 
    [
        ["Suggestions", 
        [
            "core java", "design patterns", "code"
        ]
    ]
    ]
    ],
].map((section, secIdx) => ({
  id: `section_${secIdx + 1}`,
  name: section[0],
  ...prepareSubsections(section, secIdx + 1),
}));

// console.log(JSON.stringify(sectionData, null, 2));

const getAllQuestions = () => {
  const questArr = [];

  sectionData1.forEach((sd) => {
    if (sd.subSections) {
      sd.subSections.forEach((subsd) => {
        if (subsd.questions) {
          questArr.push(
            ...subsd.questions.map((q) => ({
              ...q,
              sectionId: sd.id,
              subSectionId: subsd.id,
            }))
          );
        }
      });
    }
  });

  return questArr;
};

console.log(sectionData1);

console.log(getAllQuestions());
