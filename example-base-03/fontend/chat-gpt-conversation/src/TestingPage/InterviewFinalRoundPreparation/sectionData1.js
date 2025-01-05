import { NestedArrayBuilder } from "../../common/builders/NestedArrayBuilder/v1";

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

const builder = new NestedArrayBuilder();

export const nestedArray = builder
  /**=========Section 1 ======================*/
  .addSection("Section 1: JavaScript (ES6) & Asynchronous Programming")
  .addSubSection("JavaScript ES6 Concepts:")
  .addQuestions(
    "What are the differences between let, const, and var in terms of scope and reassignability?",
    "How do arrow functions differ from regular functions in terms of syntax, this binding, and usage?",
    "Give an example of using .map() to transform an array.",
    "When would you use .reduce() instead of .forEach()? Provide an example.",
    "Explain the differences between .filter() and .map() with a practical use case."
  )
  .addSubSection("Single Thread vs. Multi-threading:")
  .addQuestions(
    "Why is JavaScript called a single-threaded language, and how does the event loop manage asynchronous tasks?",
    "Explain the difference between callbacks, Promises, and async/await in JavaScript. Provide examples."
  )
  .addSubSection("Asynchronous Programming:")
  .addQuestions(
    "Describe the event loop and how it manages the call stack and web APIs.",
    "Write a code snippet to fetch data from an API using both fetch and Axios.",
    "How can you handle errors in an async function using try/catch? Provide an example."
  )
  .addSubSection("Peer Code Review:")
  .addQuestions(
    "What are the key points to consider when conducting a peer code review?",
    "How can constructive feedback improve code quality during a code review?"
  )
  /**=========Section 2 ======================*/
  .addSection("Section 2: React.js")
  .addSubSection("React Basics:")
  .addQuestions(
    "What are the key differences between functional components and class components?",
    "Explain the usage of useState and useEffect hooks with examples.",
    "How can you optimize performance in React using React.memo?",
    "What are the differences between useMemo and useCallback? Provide examples."
  )
  .addSubSection("Redux and State Management:")
  .addQuestions(
    "Describe the role of reducers and actions in Redux.",
    "How would you integrate Redux with React? Write an example using useSelector and useDispatch.",
    "Compare Context API and Redux. When would you prefer one over the other?"
  )
  .addSubSection("CSS in React:")
  .addQuestions(
    "How does the CSS Box Model work? Provide an example.",
    "What are the advantages of using Styled-Components or Material UI in React applications?"
  )
  /**=========Section 3 ======================*/
  .addSection("Section 3: Java & Spring Boot")
  .addSubSection("Java Basics:")
  .addQuestions(
    "What are lambda expressions, and how do they differ from anonymous classes?",
    "Explain the Stream API and provide an example of filtering and sorting a collection.",
    "How would you create and handle a custom exception in Java?",
    "Compare ArrayList and LinkedList in terms of usage and performance."
  )
  .addSubSection("Spring Boot:")
  .addQuestions(
    "Write a sample @RestController with @GetMapping and @PostMapping.",
    "How do you implement JWT for authentication and authorization in Spring Boot?",
    "What is the purpose of @ControllerAdvice in Spring Boot applications?"
  )
  .addSubSection("Spring Security:")
  .addQuestions(
    "Explain the key differences between OAuth2 and JWT for securing APIs.",
    "How is a RestController different from a Controller in Spring Boot?"
  )
  .addSubSection("JPA/Hibernate:")
  .addQuestions(
    "Compare the Criteria API and HQL with examples.",
    "What is the difference between lazy and eager loading in Hibernate? Provide examples."
  )
  .addSubSection("Concurrency and Multithreading:")
  .addQuestions(
    "What is the difference between Callable and Runnable interfaces?",
    "How do you ensure thread safety in a multithreaded Java application?"
  )
  /**=========Section 4 ======================*/
  .addSection("Section 4: Microservices")
  .addSubSection("Microservice Design:")
  .addQuestions(
    "Compare microservices and monolithic architectures with examples.",
    "How does Spring Boot enable service registration and discovery in a microservices architecture?"
  )
  .addSubSection("Spring Boot and Microservices:")
  .addQuestions(
    "Compare RestTemplate and WebClient for consuming REST APIs.",
    "How would you implement a circuit breaker in a Spring Boot microservices application?"
  )
  .addSubSection("API Security and JWT:")
  .addQuestions("How do you secure microservices using OAuth2 and Spring Security?")
  .addSubSection("Error Handling:")
  .addQuestions("Explain how to handle instance failures in microservices using retries or circuit breakers.")
  /**=========Section 5 ======================*/
  .addSection("Section 5: Cloud & DevOps")
  .addSubSection("AWS & GCP Cloud Services:")
  .addQuestions(
    "How would you programmatically upload a file to an S3 bucket using AWS SDK?",
    "What are the key steps to manage an RDS database in AWS?"
  )
  .addSubSection("Deployment:")
  .addQuestions(
    "What are the key steps for manually deploying a Java application?",
    "How would you configure a CI/CD pipeline using Jenkins for automated deployments?"
  )
  .addSubSection("DevOps Tools:")
  .addQuestions(
    "What is Docker, and how does it ensure consistent deployments?",
    "Explain the purpose of Kubernetes configuration files in application deployment."
  )
  /**=========Section 6 ======================*/
  .addSection("Section 6: Design Patterns & Best Practices")
  .addSubSection("Design Patterns:")
  .addQuestions(
    "Provide an example of using the Singleton pattern in Java.",
    "What are the key benefits of using the Factory pattern in enterprise applications?"
  )
  .addSubSection("Enterprise Application Development:")
  .addQuestions(
    "How do you handle concurrency in large-scale applications?",
    "Why is immutability important in Java? Provide a practical example."
  )
  /**=========Section 7 ======================*/
  .addSection("Section 7: Miscellaneous")
  .addSubSection("JMX & MXBeans:")
  .addQuestions("What is the role of JMX in monitoring Java applications?")
  .addSubSection("DriverManager:")
  .addQuestions("Compare Statement, PreparedStatement, and CallableStatement with examples.")
  .addSubSection("Kafka Messaging:")
  .addQuestions("How would you troubleshoot and handle failures in a Kafka messaging system?")
  /**=========Section 8 ======================*/
  .addSection("Section 8: Programming Basics")
  .addSubSection("Variables and Data Types")
  .addQuestion("What are variables?")
  .addQuestion("What are data types in JavaScript?")
  .addSubSection("Control Structures")
  .addQuestion("What is an if-else statement?")
  .addQuestion("How do loops work in JavaScript?")
  /**=========Section 9 ======================*/
  .addSection("Section 9: Object-Oriented Programming")
  .addSubSection("Classes and Objects")
  .addQuestion("What is a class?")
  .addQuestion("How do you create an object in JavaScript?")
  .addSubSection("Inheritance")
  .addQuestion("What is inheritance?")
  .addQuestion("How do you use inheritance in JavaScript?")
  /**=========Section 10 ======================*/
  .addSection("Section 10: Asynchronous JavaScript")
  .addSubSection("Promises")
  .addQuestion("What are promises in JavaScript?")
  .addQuestion("How do you handle errors in promises?")
  .addSubSection("Async/Await")
  .addQuestion("What is async/await?")
  .addQuestion("How does async/await simplify asynchronous programming?")
  /**=========Section 11 ======================*/
  .addSection("Section 11: Questions As per Premendra Kumar's expertize")
  .addSubSection("Suggestion 1: Practice core java")
  .addSubSection("Suggestion 2: Practice design patterns")
  .addSubSection("Suggestion 3: Practice live code")
  .addSubSection("Suggestion 4: Practice scenario based questions")
  .addSubSection("Suggestion 5: Practice core patterns code-> be very correct")
  /**=========Section 12 ======================*/
  .addSection(
    "Section 12: Comprehensive breakdown of design pattern questions, scenario-based questions, and hard-core technical questions based on the resume of Premendra Kumar"
  )
  .addSubSection("15 Design Patterns Questions")
  .addQuestions(
    "How would you implement the Singleton Pattern in a thread-safe manner using Java 8 features?",
    "Can you explain the Factory Pattern and provide an example of its implementation in the ShubhWeb project?",
    "Describe the Abstract Factory Pattern and how it can be used in integrating multiple database systems.",
    "What are the advantages of the Builder Pattern when constructing complex objects like REST API responses?",
    "Provide a real-world use case of the Prototype Pattern in a microservices architecture.",
    "Explain how the Adapter Pattern helped you integrate third-party APIs in your projects.",
    "Discuss the Bridge Pattern and how it can decouple abstraction from implementation in a modular system.",
    "How would you use the Composite Pattern to represent a hierarchical menu in a ReactJS application?",
    "Explain the Decorator Pattern and its application in extending the functionality of a logging service.",
    "How does the Proxy Pattern differ from the Decorator Pattern? Provide examples from your experience.",
    "Describe the Chain of Responsibility Pattern and how it could be used in implementing middleware in a Spring Boot application.",
    "Explain how you have utilized the Observer Pattern to notify dependent microservices of state changes.",
    "Provide an example of the Command Pattern in automating build tasks using Jenkins.",
    "How would you use the State Pattern in managing a user authentication flow?",
    "Discuss the Strategy Pattern and its role in handling multiple payment gateways."
  )
  .addSubSection("15 Core Patterns Questions")
  .addQuestions(
    "What is MVC Pattern, and how have you implemented it in the ESG Lythouse application?",
    "Explain the Repository Pattern and its advantages in managing database operations.",
    "How would you implement the DAO Pattern to separate persistence logic in a Spring Boot project?",
    "Describe the Service Locator Pattern and its role in managing dependencies.",
    "How have you used the Active Record Pattern for ORM in your past projects?",
    "Explain the Lazy Loading Pattern and its benefits in optimizing application performance.",
    "What is the Intercepting Filter Pattern, and how would you use it in request pre-processing?",
    "Discuss the Template Method Pattern with an example of implementing shared workflows.",
    "How have you implemented the Dependency Injection Pattern in your microservices projects?",
    "Provide a use case for the Event Aggregator Pattern in event-driven architecture.",
    "Explain the Business Delegate Pattern and its use in managing service lookups.",
    "How would you use the Observer Pattern to implement a notification system in a ReactJS app?",
    "Describe the Façade Pattern and its role in simplifying complex system interactions.",
    "Explain the CQRS Pattern and its advantages in separating read and write operations.",
    "How have you used the Strangler Fig Pattern to migrate a monolithic application to microservices?"
  )
  .addSubSection("20 Scenario-Based Questions")
  .addQuestions(
    "How would you design a system to migrate data from legacy databases to MongoDB using Spring Batch?",
    "Can you describe your approach to implementing JWT-based authentication in a Spring Boot REST API?",
    "How would you use the Observer Pattern to notify microservices of data changes in an event-driven system?",
    "Discuss how you would design a scalable logging solution using the Decorator Pattern.",
    "What steps would you take to implement the Circuit Breaker Pattern in a microservices architecture to handle service failures?",
    "How would you optimize an AWS-hosted application using EC2, Lambda, and S3?",
    "Describe your approach to implementing GraphQL queries in the ESG Lythouse application.",
    "How would you implement a custom Factory Pattern to manage DAO objects in a Spring Boot project?",
    "Explain your approach to integrating ReactJS with Spring Boot for building scalable applications.",
    "How would you design a Jenkins pipeline for automating builds and deployments for a microservices project?",
    "Provide a detailed example of using the Builder Pattern to construct complex API responses.",
    "How would you implement a Strangler Fig Pattern to migrate ShubhWeb from monolith to microservices?",
    "Explain how you handled distributed transactions in your projects involving RDBMS and MongoDB.",
    "How would you implement the State Pattern to manage session state in a Spring Boot application?",
    "Describe your approach to implementing a real-time notification system using Kafka or RabbitMQ.",
    "How do you ensure data consistency when working with distributed systems in an event-driven architecture?",
    "What steps would you take to implement SAGA in managing distributed transactions?",
    "Explain how you would optimize a microservices architecture for handling large volumes of requests.",
    "How would you design a load-balancing solution for a Spring Boot application using AWS ELB?",
    "Describe your experience implementing security best practices in DevOps pipelines using Docker and Kubernetes."
  )
  .addSubSection("10 Factory Pattern Questions")
  .addQuestions(
    "What is the Factory Pattern, and how does it simplify object creation in Spring Boot applications?",
    "How would you implement a Factory Pattern to manage multiple payment gateways in an e-commerce application?",
    "Can you design a Factory Pattern to handle different types of notifications (email, SMS, push)?",
    "Discuss the use of Factory Pattern in creating DAO objects for various databases.",
    "How can you use the Factory Pattern to abstract third-party API integrations?",
    "Provide a real-world example of Factory Pattern implementation from your past projects.",
    "How would you ensure thread safety in a Factory Pattern implementation?",
    "Can the Factory Pattern be combined with Dependency Injection? Explain.",
    "How would you use the Factory Pattern to handle object creation based on user roles?",
    "Explain how Factory Pattern supports Open/Closed Principle with examples."
  )
  .addSubSection("10 Builder Pattern Questions")
  .addQuestions(
    "What are the advantages of the Builder Pattern over telescoping constructors in Java?",
    "How would you use the Builder Pattern to construct complex JSON responses?",
    "Provide a use case for the Builder Pattern in your microservices experience.",
    "How would you implement the Builder Pattern for constructing immutable objects?",
    "Discuss a scenario where the Builder Pattern improved code readability and maintainability.",
    "How can you use the Builder Pattern in creating dynamic SQL queries?",
    "Explain the difference between the Factory Pattern and Builder Pattern with examples.",
    "How would you implement a Builder Pattern to handle optional fields in an object?",
    "Describe the use of Builder Pattern in constructing REST API requests in Spring Boot.",
    "How can the Builder Pattern be used in chainable method calls?"
  )
  .addSubSection("25 Hard Code Technical Questions")
  .addQuestions(
    "Explain the differences between Spring Boot JPA and MyBatis. When would you use each?",
    "How would you configure and monitor a Jenkins pipeline for microservices deployment?",
    "How have you handled data consistency in systems using RDBMS and MongoDB?",
    "Explain your approach to implementing JWT-based authentication in a REST API.",
    "Describe how you optimized a Spring Boot application for performance in a high-load environment.",
    "How would you design a Circuit Breaker for inter-service communication in microservices?",
    "Explain how you used AWS Lambda for serverless data processing.",
    "What steps would you take to migrate a monolithic application to microservices?",
    "How do you manage session state in a ReactJS and Spring Boot integrated application?",
    "Discuss your approach to implementing data migration using Java concurrent API.",
    "How would you configure Docker and Kubernetes for a multi-environment deployment pipeline?",
    "What are the trade-offs between using Saga Pattern and Two-Phase Commit for distributed transactions?",
    "Explain how you would implement an Event-Driven Architecture for real-time data processing.",
    "How do you ensure scalability and fault tolerance in an AWS-hosted application?",
    "Provide a scenario where you used Builder Pattern for creating modular services.",
    "Explain how you have implemented security layers in microservices using Spring Security.",
    "How would you use Adapter Pattern to integrate legacy APIs into a new system?",
    "What strategies would you employ to optimize a ReactJS application for performance?",
    "Discuss how GraphQL differs from REST and your experience implementing it.",
    "Explain the role of ANT in automating builds and its advantages over Maven.",
    "How have you implemented Observer Pattern to notify services of state changes in real time?",
    "Describe your approach to handling distributed logging in a microservices-based application.",
    "How would you implement a stateful service in a stateless microservices architecture?",
    "Discuss how Facade Pattern simplifies interactions with complex systems.",
    "Explain how JPA Criteria API can be used for dynamic query building."
  )
  .addSubSection("Additional Questions")
  .addQuestion("Question: Write a Java program to remove duplicates from an array.")
  .addQuestion("Question: Write a Java program to find the second largest element in an array.")
  .addQuestion("Question: Write a Java program to demonstrate the use of ArrayList and LinkedList.")
  .addQuestion("Question: Write a program to demonstrate polymorphism in Java.")
  .addQuestion("Design a Spring Boot application as per description")
  .build();

const sectionData1 = nestedArray
  // .filter((_, idx) => idx < 7)
  .map((section, secIdx) => ({
    id: `section_${secIdx + 1}`,
    name: section[0],
    ...prepareSubsections(section, secIdx + 1),
  }));

const getAllQuestions = () => {
  const questArr = [];

  sectionData1.forEach((sd) => {
    if (sd.subSections) {
      sd.subSections.forEach((subsd) => {
        if (subsd.questions) {
          questArr.push(
            ...subsd.questions.map((q) => ({
              sectionId: sd.id,
              subSectionId: subsd.id,
              ...q,
              answers: [],
              answerFiles: [],
            }))
          );
        }
      });
    }
  });

  return questArr;
};

export { sectionData1, getAllQuestions };
