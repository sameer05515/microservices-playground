// const a = {
//   order: 22,
//   location: "/data/conversations-05-Jan-2025.json",
//   isLatest: true,
//   id: "CONVERSATIONS_05_JAN_2025",
//   createdOn: "2025-01-04",
//   createdBy: "PREMENDRA",
// };

// console.log(Object.keys(a));

//------------------------

// const aa=["aa","bb"
// ]

// console.log(aa.includes("aa"));

//---------------------------

// const obj=`
// i am getting below wrong output.

// differentWaysToGenerateTreeData:
//  [
//   {
//     "name": "Root",
//     "children": [
//       {
//         "name": "Child 1",
//         "children": [
//           {
//             "name": "Grandchild 1",
//             "children": [
//               {
//                 "name": "Grandchild 2",
//                 "children": [],
//                 "level": 3
//               }
//             ],
//             "level": 2
//           }
//         ],
//         "level": 1
//       },
//       {
//         "name": "Child 2",
//         "children": [
//           {
//             "name": "Grandchild 3",
//             "children": [],
//             "level": 2
//           }
//         ],
//         "level": 1
//       }
//     ],
//     "level": 0
//   },
//   {
//     "name": "Child 2",
//     "children": [
//       {
//         "name": "Grandchild 3",
//         "children": [],
//         "level": 2
//       }
//     ],
//     "level": 1
//   },
//   {
//     "name": "Grandchild 3",
//     "children": [],
//     "level": 2
//   }
// ]
// `
// const space=2;
// console.log(JSON.stringify(obj, null, space));

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

const sectionData = [
  [
    "Section 1: JavaScript (ES6) & Asynchronous Programming",
    [
      [
        "JavaScript ES6 Concepts:",
        [
          "What are the differences between let, const, and var in terms of scope and reassignability?",
          "How do arrow functions differ from regular functions in terms of syntax, this binding, and usage?",
          "Give an example of using .map() to transform an array.",
          "When would you use .reduce() instead of .forEach()? Provide an example.",
          "Explain the differences between .filter() and .map() with a practical use case.",
        ],
      ],
      [
        "Single Thread vs. Multi-threading:",
        [
          "Why is JavaScript called a single-threaded language, and how does the event loop manage asynchronous tasks?",
          "Explain the difference between callbacks, Promises, and async/await in JavaScript. Provide examples.",
        ],
      ],
      [
        "Asynchronous Programming:",
        [
          "Describe the event loop and how it manages the call stack and web APIs.",
          "Write a code snippet to fetch data from an API using both fetch and Axios.",
          "How can you handle errors in an async function using try/catch? Provide an example.",
        ],
      ],
      [
        "Peer Code Review:",
        [
          "What are the key points to consider when conducting a peer code review?",
          "How can constructive feedback improve code quality during a code review?",
        ],
      ],
    ],
  ],
  
].map((section, secIdx) => ({
  id: `section_${secIdx + 1}`,
  name: section[0],
  ...prepareSubsections(section, secIdx + 1),
}));

// console.log(JSON.stringify(sectionData, null, 2));

const getAllQuestions = () => {
  const questArr = [];

  sectionData.forEach((sd) => {
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


console.log(getAllQuestions())
