// const sectionDatabkp = [
//   {
//     id: "section_1",
//     name: "Section 1: JavaScript (ES6) & Asynchronous Programming",
//     subSections: [
//       {
//         id: "sub_sec_1_1",
//         name: "JavaScript ES6 Concepts:",
//         questions: [
//           {
//             id: "ques_1_1_1",
//             name: "What are the differences between let, const, and var in terms of scope and reassignability?",
//           },
//           {
//             id: "ques_1_1_2",
//             name: "How do arrow functions differ from regular functions in terms of syntax, this binding, and usage?",
//           },
//           {
//             id: "ques_1_1_3",
//             name: "Give an example of using .map() to transform an array.",
//           },
//           {
//             id: "ques_1_1_4",
//             name: "When would you use .reduce() instead of .forEach()? Provide an example.",
//           },
//           {
//             id: "ques_1_1_5",
//             name: "Explain the differences between .filter() and .map() with a practical use case.",
//           },
//         ],
//       },
//       {
//         id: "sub_sec_1_2",
//         name: "Single Thread vs. Multi-threading:",
//         questions: [
//           {
//             id: "ques_1_2_1",
//             name: "Why is JavaScript called a single-threaded language, and how does the event loop manage asynchronous tasks?",
//           },
//           {
//             id: "ques_1_2_2",
//             name: "Explain the difference between callbacks, Promises, and async/await in JavaScript. Provide examples.",
//           },
//         ],
//       },
//       {
//         id: "sub_sec_1_3",
//         name: "Asynchronous Programming:",
//         questions: [
//           {
//             id: "ques_1_3_1",
//             name: "Describe the event loop and how it manages the call stack and web APIs.",
//           },
//           {
//             id: "ques_1_3_2",
//             name: "Write a code snippet to fetch data from an API using both fetch and Axios.",
//           },
//           {
//             id: "ques_1_3_3",
//             name: "How can you handle errors in an async function using try/catch? Provide an example.",
//           },
//         ],
//       },
//       {
//         id: "sub_sec_1_4",
//         name: "Peer Code Review:",
//         questions: [
//           {
//             id: "ques_1_4_1",
//             name: "What are the key points to consider when conducting a peer code review?",
//           },
//           {
//             id: "ques_1_4_2",
//             name: "How can constructive feedback improve code quality during a code review?",
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: "section_2",
//     name: "Section 2: React.js",
//     subSections: [
//       {
//         id: "sub_sec_2_1",
//         name: "React Basics:",
//         questions: [
//           {
//             id: "ques_2_1_1",
//             name: "What are the key differences between functional components and class components?",
//           },
//           {
//             id: "ques_2_1_2",
//             name: "Explain the usage of useState and useEffect hooks with examples.",
//           },
//           {
//             id: "ques_2_1_3",
//             name: "How can you optimize performance in React using React.memo?",
//           },
//           {
//             id: "ques_2_1_4",
//             name: "What are the differences between useMemo and useCallback? Provide examples.",
//           },
//         ],
//       },
//       {
//         id: "sub_sec_2_2",
//         name: "Redux and State Management:",
//         questions: [
//           {
//             id: "ques_2_2_1",
//             name: "Describe the role of reducers and actions in Redux.",
//           },
//           {
//             id: "ques_2_2_2",
//             name: "How would you integrate Redux with React? Write an example using useSelector and useDispatch.",
//           },
//           {
//             id: "ques_2_2_3",
//             name: "Compare Context API and Redux. When would you prefer one over the other?",
//           },
//         ],
//       },
//       {
//         id: "sub_sec_2_3",
//         name: "CSS in React:",
//         questions: [
//           {
//             id: "ques_2_3_1",
//             name: "How does the CSS Box Model work? Provide an example.",
//           },
//           {
//             id: "ques_2_3_2",
//             name: "What are the advantages of using Styled-Components or Material UI in React applications?",
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: "section_3",
//     name: "Section 3: Java & Spring Boot",
//     subSections: [
//       {
//         id: "sub_sec_3_1",
//         name: "Java Basics:",
//         questions: [
//           {
//             id: "ques_3_1_1",
//             name: "What are lambda expressions, and how do they differ from anonymous classes?",
//           },
//           {
//             id: "ques_3_1_2",
//             name: "Explain the Stream API and provide an example of filtering and sorting a collection.",
//           },
//           {
//             id: "ques_3_1_3",
//             name: "How would you create and handle a custom exception in Java?",
//           },
//           {
//             id: "ques_3_1_4",
//             name: "Compare ArrayList and LinkedList in terms of usage and performance.",
//           },
//         ],
//       },
//       {
//         id: "sub_sec_3_2",
//         name: "Spring Boot:",
//         questions: [
//           {
//             id: "ques_3_2_1",
//             name: "Write a sample @RestController with @GetMapping and @PostMapping.",
//           },
//           {
//             id: "ques_3_2_2",
//             name: "How do you implement JWT for authentication and authorization in Spring Boot?",
//           },
//           {
//             id: "ques_3_2_3",
//             name: "What is the purpose of @ControllerAdvice in Spring Boot applications?",
//           },
//         ],
//       },
//       {
//         id: "sub_sec_3_3",
//         name: "Spring Security:",
//         questions: [
//           {
//             id: "ques_3_3_1",
//             name: "Explain the key differences between OAuth2 and JWT for securing APIs.",
//           },
//           {
//             id: "ques_3_3_2",
//             name: "How is a RestController different from a Controller in Spring Boot?",
//           },
//         ],
//       },
//       {
//         id: "sub_sec_3_4",
//         name: "JPA/Hibernate:",
//         questions: [
//           {
//             id: "ques_3_4_1",
//             name: "Compare the Criteria API and HQL with examples.",
//           },
//           {
//             id: "ques_3_4_2",
//             name: "What is the difference between lazy and eager loading in Hibernate? Provide examples.",
//           },
//         ],
//       },
//       {
//         id: "sub_sec_3_5",
//         name: "Concurrency and Multithreading:",
//         questions: [
//           {
//             id: "ques_3_5_1",
//             name: "What is the difference between Callable and Runnable interfaces?",
//           },
//           {
//             id: "ques_3_5_2",
//             name: "How do you ensure thread safety in a multithreaded Java application?",
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: "section_4",
//     name: "Section 4: Microservices",
//     subSections: [
//       {
//         id: "sub_sec_4_1",
//         name: "Microservice Design:",
//         questions: [
//           {
//             id: "ques_4_1_1",
//             name: "Compare microservices and monolithic architectures with examples.",
//           },
//           {
//             id: "ques_4_1_2",
//             name: "How does Spring Boot enable service registration and discovery in a microservices architecture?",
//           },
//         ],
//       },
//       {
//         id: "sub_sec_4_2",
//         name: "Spring Boot and Microservices:",
//         questions: [
//           {
//             id: "ques_4_2_1",
//             name: "Compare RestTemplate and WebClient for consuming REST APIs.",
//           },
//           {
//             id: "ques_4_2_2",
//             name: "How would you implement a circuit breaker in a Spring Boot microservices application?",
//           },
//         ],
//       },
//       {
//         id: "sub_sec_4_3",
//         name: "API Security and JWT:",
//         questions: [
//           {
//             id: "ques_4_3_1",
//             name: "How do you secure microservices using OAuth2 and Spring Security?",
//           },
//         ],
//       },
//       {
//         id: "sub_sec_4_4",
//         name: "Error Handling:",
//         questions: [
//           {
//             id: "ques_4_4_1",
//             name: "Explain how to handle instance failures in microservices using retries or circuit breakers.",
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: "section_5",
//     name: "Section 5: Cloud & DevOps",
//     subSections: [
//       {
//         id: "sub_sec_5_1",
//         name: "AWS & GCP Cloud Services:",
//         questions: [
//           {
//             id: "ques_5_1_1",
//             name: "How would you programmatically upload a file to an S3 bucket using AWS SDK?",
//           },
//           {
//             id: "ques_5_1_2",
//             name: "What are the key steps to manage an RDS database in AWS?",
//           },
//         ],
//       },
//       {
//         id: "sub_sec_5_2",
//         name: "Deployment:",
//         questions: [
//           {
//             id: "ques_5_2_1",
//             name: "What are the key steps for manually deploying a Java application?",
//           },
//           {
//             id: "ques_5_2_2",
//             name: "How would you configure a CI/CD pipeline using Jenkins for automated deployments?",
//           },
//         ],
//       },
//       {
//         id: "sub_sec_5_3",
//         name: "DevOps Tools:",
//         questions: [
//           {
//             id: "ques_5_3_1",
//             name: "What is Docker, and how does it ensure consistent deployments?",
//           },
//           {
//             id: "ques_5_3_2",
//             name: "Explain the purpose of Kubernetes configuration files in application deployment.",
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: "section_6",
//     name: "Section 6: Design Patterns & Best Practices",
//     subSections: [
//       {
//         id: "sub_sec_6_1",
//         name: "Design Patterns:",
//         questions: [
//           {
//             id: "ques_6_1_1",
//             name: "Provide an example of using the Singleton pattern in Java.",
//           },
//           {
//             id: "ques_6_1_2",
//             name: "What are the key benefits of using the Factory pattern in enterprise applications?",
//           },
//         ],
//       },
//       {
//         id: "sub_sec_6_2",
//         name: "Enterprise Application Development:",
//         questions: [
//           {
//             id: "ques_6_2_1",
//             name: "How do you handle concurrency in large-scale applications?",
//           },
//           {
//             id: "ques_6_2_2",
//             name: "Why is immutability important in Java? Provide a practical example.",
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: "section_7",
//     name: "Section 7: Miscellaneous",
//     subSections: [
//       {
//         id: "sub_sec_7_1",
//         name: "JMX & MXBeans:",
//         questions: [
//           {
//             id: "ques_7_1_1",
//             name: "What is the role of JMX in monitoring Java applications?",
//           },
//         ],
//       },
//       {
//         id: "sub_sec_7_2",
//         name: "DriverManager:",
//         questions: [
//           {
//             id: "ques_7_2_1",
//             name: "Compare Statement, PreparedStatement, and CallableStatement with examples.",
//           },
//         ],
//       },
//       {
//         id: "sub_sec_7_3",
//         name: "Kafka Messaging:",
//         questions: [
//           {
//             id: "ques_7_3_1",
//             name: "How would you troubleshoot and handle failures in a Kafka messaging system?",
//           },
//         ],
//       },
//     ],
//   },
// ];

export const sectionData = [];
