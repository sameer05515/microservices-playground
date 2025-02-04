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
  [
    "Section 2: React.js",
    [
      [
        "React Basics:",
        [
          "What are the key differences between functional components and class components?",
          "Explain the usage of useState and useEffect hooks with examples.",
          "How can you optimize performance in React using React.memo?",
          "What are the differences between useMemo and useCallback? Provide examples.",
        ],
      ],
      [
        "Redux and State Management:",
        [
          "Describe the role of reducers and actions in Redux.",
          "How would you integrate Redux with React? Write an example using useSelector and useDispatch.",
          "Compare Context API and Redux. When would you prefer one over the other?",
        ],
      ],
      [
        "CSS in React:",
        [
          "How does the CSS Box Model work? Provide an example.",
          "What are the advantages of using Styled-Components or Material UI in React applications?",
        ],
      ],
    ],
  ],
  [
    "Section 3: Java & Spring Boot",
    [
      [
        "Java Basics:",
        [
          "What are lambda expressions, and how do they differ from anonymous classes?",
          "Explain the Stream API and provide an example of filtering and sorting a collection.",
          "How would you create and handle a custom exception in Java?",
          "Compare ArrayList and LinkedList in terms of usage and performance.",
        ],
      ],
      [
        "Spring Boot:",
        [
          "Write a sample @RestController with @GetMapping and @PostMapping.",
          "How do you implement JWT for authentication and authorization in Spring Boot?",
          "What is the purpose of @ControllerAdvice in Spring Boot applications?",
        ],
      ],
      [
        "Spring Security:",
        [
          "Explain the key differences between OAuth2 and JWT for securing APIs.",
          "How is a RestController different from a Controller in Spring Boot?",
        ],
      ],
      [
        "JPA/Hibernate:",
        [
          "Compare the Criteria API and HQL with examples.",
          "What is the difference between lazy and eager loading in Hibernate? Provide examples.",
        ],
      ],
      [
        "Concurrency and Multithreading:",
        [
          "What is the difference between Callable and Runnable interfaces?",
          "How do you ensure thread safety in a multithreaded Java application?",
        ],
      ],
    ],
  ],
  [
    "Section 4: Microservices",
    [
      [
        "Microservice Design:",
        [
          "Compare microservices and monolithic architectures with examples.",
          "How does Spring Boot enable service registration and discovery in a microservices architecture?",
        ],
      ],
      [
        "Spring Boot and Microservices:",
        [
          "Compare RestTemplate and WebClient for consuming REST APIs.",
          "How would you implement a circuit breaker in a Spring Boot microservices application?",
        ],
      ],
      ["API Security and JWT:", ["How do you secure microservices using OAuth2 and Spring Security?"]],
      [
        "Error Handling:",
        ["Explain how to handle instance failures in microservices using retries or circuit breakers."],
      ],
    ],
  ],
  [
    "Section 5: Cloud & DevOps",
    [
      [
        "AWS & GCP Cloud Services:",
        [
          "How would you programmatically upload a file to an S3 bucket using AWS SDK?",
          "What are the key steps to manage an RDS database in AWS?",
        ],
      ],
      [
        "Deployment:",
        [
          "What are the key steps for manually deploying a Java application?",
          "How would you configure a CI/CD pipeline using Jenkins for automated deployments?",
        ],
      ],
      [
        "DevOps Tools:",
        [
          "What is Docker, and how does it ensure consistent deployments?",
          "Explain the purpose of Kubernetes configuration files in application deployment.",
        ],
      ],
    ],
  ],
  [
    "Section 6: Design Patterns & Best Practices",
    [
      [
        "Design Patterns:",
        [
          "Provide an example of using the Singleton pattern in Java.",
          "What are the key benefits of using the Factory pattern in enterprise applications?",
        ],
      ],
      [
        "Enterprise Application Development:",
        [
          "How do you handle concurrency in large-scale applications?",
          "Why is immutability important in Java? Provide a practical example.",
        ],
      ],
    ],
  ],
  [
    "Section 7: Miscellaneous",
    [
      ["JMX & MXBeans:", ["What is the role of JMX in monitoring Java applications?"]],
      ["DriverManager:", ["Compare Statement, PreparedStatement, and CallableStatement with examples."]],
      ["Kafka Messaging:", ["How would you troubleshoot and handle failures in a Kafka messaging system?"]],
    ],
  ],
].map((section, secIdx) => ({
  id: `section_${secIdx + 1}`,
  name: section[0],
  ...prepareSubsections(section, secIdx + 1),
}));

const getAllQuestions = () => {
  const questArr = [];

  sectionData.forEach((sd) => {
    if (sd.subSections) {
      sd.subSections.forEach((subsd) => {
        if (subsd.questions) {
          questArr.push(
            ...subsd.questions.map((q) => ({
              sectionId: sd.id,
              subSectionId: subsd.id,
              ...q,
            }))
          );
        }
      });
    }
  });

  return questArr;
};

export { sectionData, getAllQuestions };
