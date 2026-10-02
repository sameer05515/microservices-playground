const SEED_TOPICS = [
  {
    "id": 1,
    "category": "Core Java",
    "title": "OOP & SOLID",
    "difficulty": "Easy",
    "description": "Abstraction, encapsulation, inheritance, polymorphism and SOLID.",
    "questions": [
      "Explain SOLID.",
      "Composition vs inheritance?",
      "Where did you apply SOLID?"
    ],
    "tags": [
      "java",
      "oop",
      "solid"
    ]
  },
  {
    "id": 2,
    "category": "Core Java",
    "title": "Object Class",
    "difficulty": "Easy",
    "description": "toString, equals, hashCode, clone and object contracts.",
    "questions": [
      "Why override hashCode with equals?",
      "equals contract?",
      "Why is clone problematic?"
    ],
    "tags": [
      "java",
      "object"
    ]
  },
  {
    "id": 3,
    "category": "Core Java",
    "title": "equals() & hashCode()",
    "difficulty": "Medium",
    "description": "Equality contract and hash-based collections.",
    "questions": [
      "What if equals is overridden but hashCode is not?",
      "Why equal objects need equal hash codes?"
    ],
    "tags": [
      "java",
      "collections"
    ]
  },
  {
    "id": 4,
    "category": "Core Java",
    "title": "String & String Pool",
    "difficulty": "Medium",
    "description": "String immutability, pool, intern and StringBuilder/StringBuffer.",
    "questions": [
      "Why is String immutable?",
      "String vs StringBuilder?",
      "What does intern do?"
    ],
    "tags": [
      "string",
      "immutable"
    ]
  },
  {
    "id": 5,
    "category": "Core Java",
    "title": "Immutable Classes",
    "difficulty": "Medium",
    "description": "Design truly immutable classes and defensive copying.",
    "questions": [
      "How do you create an immutable class?",
      "Why final fields?",
      "Why defensive copies?"
    ],
    "tags": [
      "immutable",
      "java"
    ]
  },
  {
    "id": 6,
    "category": "Core Java",
    "title": "Collections Framework",
    "difficulty": "Medium",
    "description": "List, Set, Map, Queue and common implementations.",
    "questions": [
      "ArrayList vs LinkedList?",
      "HashSet internals?",
      "TreeSet vs HashSet?"
    ],
    "tags": [
      "collections"
    ]
  },
  {
    "id": 7,
    "category": "Core Java",
    "title": "HashMap Internals",
    "difficulty": "Hard",
    "description": "Buckets, hashing, collisions, resize, load factor and treeification.",
    "questions": [
      "How does put work?",
      "What causes collisions?",
      "When does treeification happen?"
    ],
    "tags": [
      "hashmap",
      "collections"
    ]
  },
  {
    "id": 8,
    "category": "Core Java",
    "title": "Hashtable vs ConcurrentHashMap",
    "difficulty": "Hard",
    "description": "Thread-safe maps and concurrency trade-offs.",
    "questions": [
      "HashMap vs Hashtable vs ConcurrentHashMap?",
      "Why ConcurrentHashMap?"
    ],
    "tags": [
      "concurrency",
      "collections"
    ]
  },
  {
    "id": 9,
    "category": "Core Java",
    "title": "Generics",
    "difficulty": "Medium",
    "description": "Type safety, bounded types, wildcards and type erasure.",
    "questions": [
      "extends vs super?",
      "What is type erasure?",
      "Generic method vs generic class?"
    ],
    "tags": [
      "generics"
    ]
  },
  {
    "id": 10,
    "category": "Core Java",
    "title": "Comparable & Comparator",
    "difficulty": "Easy",
    "description": "Natural ordering and custom sorting.",
    "questions": [
      "Comparable vs Comparator?",
      "How do chained comparators work?"
    ],
    "tags": [
      "sorting"
    ]
  },
  {
    "id": 11,
    "category": "Core Java",
    "title": "Java 8 Functional Interfaces",
    "difficulty": "Medium",
    "description": "Predicate, Function, Consumer, Supplier and custom functional interfaces.",
    "questions": [
      "What is a functional interface?",
      "Predicate vs Function?"
    ],
    "tags": [
      "java8",
      "lambda"
    ]
  },
  {
    "id": 12,
    "category": "Core Java",
    "title": "Streams API",
    "difficulty": "Hard",
    "description": "Intermediate/terminal operations, collectors and parallel streams.",
    "questions": [
      "map vs flatMap?",
      "Intermediate vs terminal?",
      "When not to use parallelStream?"
    ],
    "tags": [
      "streams",
      "java8"
    ]
  },
  {
    "id": 13,
    "category": "Core Java",
    "title": "Optional",
    "difficulty": "Medium",
    "description": "Null-safe API design and common Optional operations.",
    "questions": [
      "orElse vs orElseGet?",
      "When should Optional not be used?"
    ],
    "tags": [
      "optional"
    ]
  },
  {
    "id": 14,
    "category": "Core Java",
    "title": "Exception Handling",
    "difficulty": "Medium",
    "description": "Checked/unchecked exceptions, custom exceptions and best practices.",
    "questions": [
      "Checked vs unchecked?",
      "finally behavior?",
      "How design global errors?"
    ],
    "tags": [
      "exceptions"
    ]
  },
  {
    "id": 15,
    "category": "Core Java",
    "title": "Multithreading Basics",
    "difficulty": "Hard",
    "description": "Thread lifecycle, synchronization, race conditions and deadlocks.",
    "questions": [
      "Race condition?",
      "Deadlock conditions?",
      "synchronized behavior?"
    ],
    "tags": [
      "threads",
      "concurrency"
    ]
  },
  {
    "id": 16,
    "category": "Core Java",
    "title": "ExecutorService",
    "difficulty": "Hard",
    "description": "Thread pools, Callable, Future, shutdown and scheduling.",
    "questions": [
      "Runnable vs Callable?",
      "How does a pool work?",
      "shutdown vs shutdownNow?"
    ],
    "tags": [
      "executor",
      "threads"
    ]
  },
  {
    "id": 17,
    "category": "Core Java",
    "title": "CompletableFuture",
    "difficulty": "Hard",
    "description": "Async composition, exception handling and combining futures.",
    "questions": [
      "thenApply vs thenCompose?",
      "allOf vs anyOf?",
      "How handle async exceptions?"
    ],
    "tags": [
      "async",
      "java8"
    ]
  },
  {
    "id": 18,
    "category": "Core Java",
    "title": "Java Memory Model",
    "difficulty": "Hard",
    "description": "Heap, stack, visibility, happens-before and volatile.",
    "questions": [
      "What is happens-before?",
      "What does volatile guarantee?"
    ],
    "tags": [
      "jmm",
      "volatile"
    ]
  },
  {
    "id": 19,
    "category": "Core Java",
    "title": "Garbage Collection",
    "difficulty": "Hard",
    "description": "Generational GC, heap regions, GC pressure and common collectors.",
    "questions": [
      "Young vs old generation?",
      "What causes memory leaks in Java?"
    ],
    "tags": [
      "gc",
      "jvm"
    ]
  },
  {
    "id": 20,
    "category": "JVM",
    "title": "JVM Architecture",
    "difficulty": "Hard",
    "description": "Class loading, runtime areas, execution engine and native interface.",
    "questions": [
      "ClassLoader hierarchy?",
      "Heap vs stack?",
      "What does JIT do?"
    ],
    "tags": [
      "jvm",
      "internals"
    ]
  },
  {
    "id": 21,
    "category": "JVM",
    "title": "ClassLoader",
    "difficulty": "Hard",
    "description": "Bootstrap, platform, application loaders and delegation.",
    "questions": [
      "Parent delegation model?",
      "Why custom ClassLoader?"
    ],
    "tags": [
      "classloader"
    ]
  },
  {
    "id": 22,
    "category": "Spring",
    "title": "IoC & Dependency Injection",
    "difficulty": "Medium",
    "description": "Spring container, dependency injection and constructor injection.",
    "questions": [
      "What is IoC?",
      "Why constructor injection?"
    ],
    "tags": [
      "spring",
      "ioc",
      "di"
    ]
  },
  {
    "id": 23,
    "category": "Spring",
    "title": "Bean Scopes",
    "difficulty": "Medium",
    "description": "Singleton, prototype, request and session scopes.",
    "questions": [
      "What are bean scopes?",
      "Singleton vs prototype?"
    ],
    "tags": [
      "spring",
      "beans"
    ]
  },
  {
    "id": 24,
    "category": "Spring",
    "title": "Bean Lifecycle",
    "difficulty": "Medium",
    "description": "Instantiation, dependency injection, post processors and destruction.",
    "questions": [
      "@PostConstruct vs @PreDestroy?",
      "BeanPostProcessor?"
    ],
    "tags": [
      "spring",
      "lifecycle"
    ]
  },
  {
    "id": 25,
    "category": "Spring",
    "title": "@Configuration & @Bean",
    "difficulty": "Medium",
    "description": "Explicit bean configuration and proxy behavior.",
    "questions": [
      "@Bean vs @Component?",
      "What does proxyBeanMethods do?"
    ],
    "tags": [
      "spring",
      "configuration"
    ]
  },
  {
    "id": 26,
    "category": "Spring",
    "title": "AOP",
    "difficulty": "Hard",
    "description": "Cross-cutting concerns, proxies, advice, pointcuts and aspects.",
    "questions": [
      "What is AOP?",
      "JDK proxy vs CGLIB?",
      "Around advice?"
    ],
    "tags": [
      "aop",
      "spring"
    ]
  },
  {
    "id": 27,
    "category": "Spring Boot",
    "title": "Auto Configuration",
    "difficulty": "Medium",
    "description": "Starters, conditions, auto-configuration and application context.",
    "questions": [
      "How does auto-configuration work?",
      "@ConditionalOnBean?"
    ],
    "tags": [
      "springboot"
    ]
  },
  {
    "id": 28,
    "category": "Spring Boot",
    "title": "REST API Design",
    "difficulty": "Medium",
    "description": "HTTP methods, status codes, validation and API versioning.",
    "questions": [
      "PUT vs PATCH?",
      "How version APIs?",
      "What makes RESTful?"
    ],
    "tags": [
      "rest",
      "api"
    ]
  },
  {
    "id": 29,
    "category": "Spring Boot",
    "title": "Validation",
    "difficulty": "Medium",
    "description": "Bean Validation, groups and custom validators.",
    "questions": [
      "@Valid vs @Validated?",
      "How create custom constraint?"
    ],
    "tags": [
      "validation"
    ]
  },
  {
    "id": 30,
    "category": "Spring Boot",
    "title": "Exception Handling",
    "difficulty": "Medium",
    "description": "Global exception handling and structured API errors.",
    "questions": [
      "@ControllerAdvice?",
      "How design error response?"
    ],
    "tags": [
      "exception",
      "rest"
    ]
  },
  {
    "id": 31,
    "category": "Spring Boot",
    "title": "Actuator",
    "difficulty": "Easy",
    "description": "Health, metrics, info and operational endpoints.",
    "questions": [
      "Which actuator endpoints are useful in production?",
      "How secure actuator?"
    ],
    "tags": [
      "actuator",
      "monitoring"
    ]
  },
  {
    "id": 32,
    "category": "Spring Data",
    "title": "JPA Entity Lifecycle",
    "difficulty": "Hard",
    "description": "Persistence context, states, dirty checking and flush.",
    "questions": [
      "Entity states?",
      "What is dirty checking?",
      "flush vs commit?"
    ],
    "tags": [
      "jpa",
      "hibernate"
    ]
  },
  {
    "id": 33,
    "category": "Spring Data",
    "title": "Lazy vs Eager Loading",
    "difficulty": "Hard",
    "description": "Association fetching and common ORM pitfalls.",
    "questions": [
      "LazyInitializationException?",
      "N+1 problem?"
    ],
    "tags": [
      "jpa",
      "hibernate"
    ]
  },
  {
    "id": 34,
    "category": "Spring Data",
    "title": "Transactions",
    "difficulty": "Hard",
    "description": "@Transactional, propagation, isolation and rollback.",
    "questions": [
      "What does @Transactional do?",
      "Propagation types?",
      "Isolation levels?"
    ],
    "tags": [
      "transaction",
      "spring"
    ]
  },
  {
    "id": 35,
    "category": "Spring Data",
    "title": "Optimistic vs Pessimistic Locking",
    "difficulty": "Hard",
    "description": "Concurrency control for database updates.",
    "questions": [
      "Version column?",
      "When use pessimistic locking?"
    ],
    "tags": [
      "locking",
      "jpa"
    ]
  },
  {
    "id": 36,
    "category": "Security",
    "title": "Spring Security Filter Chain",
    "difficulty": "Hard",
    "description": "Security filters, authentication and authorization flow.",
    "questions": [
      "How does filter chain work?",
      "Where does authentication happen?"
    ],
    "tags": [
      "security"
    ]
  },
  {
    "id": 37,
    "category": "Security",
    "title": "JWT Authentication",
    "difficulty": "Hard",
    "description": "Access tokens, claims, validation and stateless authentication.",
    "questions": [
      "Where validate JWT?",
      "Access token contents?",
      "How handle expiry?"
    ],
    "tags": [
      "jwt",
      "security"
    ]
  },
  {
    "id": 38,
    "category": "Security",
    "title": "Refresh Tokens",
    "difficulty": "Hard",
    "description": "Refresh rotation, revocation and secure persistence.",
    "questions": [
      "Where store refresh tokens?",
      "How revoke them?",
      "Token rotation?"
    ],
    "tags": [
      "jwt",
      "security"
    ]
  },
  {
    "id": 39,
    "category": "Security",
    "title": "OAuth2 & OIDC",
    "difficulty": "Hard",
    "description": "Authorization code flow, ID token, access token and identity provider.",
    "questions": [
      "OAuth2 vs OIDC?",
      "Authorization Code flow?"
    ],
    "tags": [
      "oauth2",
      "oidc"
    ]
  },
  {
    "id": 40,
    "category": "Security",
    "title": "RBAC",
    "difficulty": "Medium",
    "description": "Role and permission based authorization.",
    "questions": [
      "ROLE_USER vs permission?",
      "Method security annotations?"
    ],
    "tags": [
      "rbac",
      "security"
    ]
  },
  {
    "id": 41,
    "category": "Microservices",
    "title": "Microservices Fundamentals",
    "difficulty": "Medium",
    "description": "Bounded contexts, independent deployment and service ownership.",
    "questions": [
      "When should you not use microservices?",
      "Database per service?"
    ],
    "tags": [
      "microservices"
    ]
  },
  {
    "id": 42,
    "category": "Microservices",
    "title": "API Gateway",
    "difficulty": "Medium",
    "description": "Routing, authentication, rate limiting and cross-cutting concerns.",
    "questions": [
      "Gateway vs load balancer?",
      "What belongs at gateway?"
    ],
    "tags": [
      "gateway"
    ]
  },
  {
    "id": 43,
    "category": "Microservices",
    "title": "Service Discovery",
    "difficulty": "Medium",
    "description": "Client-side/server-side discovery and registry concepts.",
    "questions": [
      "Why service discovery?",
      "Eureka vs DNS?"
    ],
    "tags": [
      "discovery"
    ]
  },
  {
    "id": 44,
    "category": "Microservices",
    "title": "OpenFeign",
    "difficulty": "Medium",
    "description": "Declarative HTTP clients and service-to-service calls.",
    "questions": [
      "Feign vs RestClient?",
      "How handle errors/timeouts?"
    ],
    "tags": [
      "feign"
    ]
  },
  {
    "id": 45,
    "category": "Microservices",
    "title": "Resilience4j",
    "difficulty": "Hard",
    "description": "Circuit breaker, retry, timeout, rate limiter and bulkhead.",
    "questions": [
      "Circuit breaker states?",
      "Why can retry be dangerous?"
    ],
    "tags": [
      "resilience4j"
    ]
  },
  {
    "id": 46,
    "category": "Microservices",
    "title": "Saga Pattern",
    "difficulty": "Hard",
    "description": "Distributed transactions through choreography or orchestration.",
    "questions": [
      "Why Saga?",
      "Choreography vs orchestration?"
    ],
    "tags": [
      "saga",
      "distributed"
    ]
  },
  {
    "id": 47,
    "category": "Microservices",
    "title": "Outbox Pattern",
    "difficulty": "Hard",
    "description": "Reliable event publishing with transactional outbox.",
    "questions": [
      "Why dual-write is dangerous?",
      "How does outbox work?"
    ],
    "tags": [
      "outbox",
      "events"
    ]
  },
  {
    "id": 48,
    "category": "Microservices",
    "title": "Idempotency",
    "difficulty": "Hard",
    "description": "Safe retries and duplicate request handling.",
    "questions": [
      "How make payment API idempotent?",
      "Idempotency key?"
    ],
    "tags": [
      "idempotency"
    ]
  },
  {
    "id": 49,
    "category": "Messaging",
    "title": "Kafka Fundamentals",
    "difficulty": "Hard",
    "description": "Topics, partitions, brokers, offsets and replication.",
    "questions": [
      "How does Kafka scale?",
      "Partition vs topic?"
    ],
    "tags": [
      "kafka"
    ]
  },
  {
    "id": 50,
    "category": "Messaging",
    "title": "Kafka Consumer Groups",
    "difficulty": "Hard",
    "description": "Parallel consumption, partition assignment and offsets.",
    "questions": [
      "What is a consumer group?",
      "Can two consumers read same partition?"
    ],
    "tags": [
      "kafka"
    ]
  },
  {
    "id": 51,
    "category": "Messaging",
    "title": "Kafka Delivery Semantics",
    "difficulty": "Hard",
    "description": "At-most-once, at-least-once and effectively-once processing.",
    "questions": [
      "What causes duplicate messages?",
      "How handle retries?"
    ],
    "tags": [
      "kafka",
      "messaging"
    ]
  },
  {
    "id": 52,
    "category": "Messaging",
    "title": "DLQ & Retry",
    "difficulty": "Medium",
    "description": "Dead-letter queues, retry topics and poison messages.",
    "questions": [
      "When send to DLQ?",
      "Retry vs DLQ?"
    ],
    "tags": [
      "dlq",
      "messaging"
    ]
  },
  {
    "id": 53,
    "category": "Caching",
    "title": "Redis Basics",
    "difficulty": "Medium",
    "description": "Key-value model, TTL, data structures and caching.",
    "questions": [
      "Why Redis?",
      "TTL?",
      "Redis data types?"
    ],
    "tags": [
      "redis",
      "cache"
    ]
  },
  {
    "id": 54,
    "category": "Caching",
    "title": "Caching Strategies",
    "difficulty": "Hard",
    "description": "Cache-aside, write-through, write-behind and invalidation.",
    "questions": [
      "Cache-aside flow?",
      "Cache stampede?"
    ],
    "tags": [
      "cache"
    ]
  },
  {
    "id": 55,
    "category": "Caching",
    "title": "Distributed Locking",
    "difficulty": "Hard",
    "description": "Coordination using Redis and trade-offs.",
    "questions": [
      "Why distributed lock?",
      "What is lock expiry?"
    ],
    "tags": [
      "redis",
      "distributed"
    ]
  },
  {
    "id": 56,
    "category": "System Design",
    "title": "Load Balancing",
    "difficulty": "Medium",
    "description": "L4/L7 load balancing and scaling strategies.",
    "questions": [
      "L4 vs L7?",
      "Round robin vs least connections?"
    ],
    "tags": [
      "systemdesign"
    ]
  },
  {
    "id": 57,
    "category": "System Design",
    "title": "CDN",
    "difficulty": "Medium",
    "description": "Edge caching, static assets and origin servers.",
    "questions": [
      "Why CDN?",
      "Cache invalidation?"
    ],
    "tags": [
      "cdn",
      "systemdesign"
    ]
  },
  {
    "id": 58,
    "category": "System Design",
    "title": "Database Indexing",
    "difficulty": "Hard",
    "description": "B-tree indexes, composite indexes and query optimization.",
    "questions": [
      "How does an index work?",
      "Column order in composite index?"
    ],
    "tags": [
      "database",
      "index"
    ]
  },
  {
    "id": 59,
    "category": "System Design",
    "title": "Database Replication",
    "difficulty": "Hard",
    "description": "Primary/replica architecture and read scaling.",
    "questions": [
      "Replication lag?",
      "Read-after-write consistency?"
    ],
    "tags": [
      "database",
      "replication"
    ]
  },
  {
    "id": 60,
    "category": "System Design",
    "title": "Sharding",
    "difficulty": "Hard",
    "description": "Horizontal partitioning and shard key design.",
    "questions": [
      "When shard?",
      "Good shard key properties?"
    ],
    "tags": [
      "database",
      "sharding"
    ]
  },
  {
    "id": 61,
    "category": "System Design",
    "title": "CAP Theorem",
    "difficulty": "Hard",
    "description": "Consistency, availability and partition tolerance.",
    "questions": [
      "Explain CAP practically.",
      "CP vs AP?"
    ],
    "tags": [
      "cap",
      "distributed"
    ]
  },
  {
    "id": 62,
    "category": "System Design",
    "title": "Consistency Models",
    "difficulty": "Hard",
    "description": "Strong, eventual and causal consistency.",
    "questions": [
      "Eventual consistency example?",
      "How handle stale reads?"
    ],
    "tags": [
      "consistency"
    ]
  },
  {
    "id": 63,
    "category": "System Design",
    "title": "Rate Limiting",
    "difficulty": "Hard",
    "description": "Token bucket, leaky bucket and distributed rate limiting.",
    "questions": [
      "Token bucket vs leaky bucket?",
      "Where enforce rate limits?"
    ],
    "tags": [
      "ratelimit"
    ]
  },
  {
    "id": 64,
    "category": "System Design",
    "title": "Distributed Locks",
    "difficulty": "Hard",
    "description": "Coordination and mutual exclusion across instances.",
    "questions": [
      "Redis lock vs DB lock?",
      "What if lock holder crashes?"
    ],
    "tags": [
      "distributed"
    ]
  },
  {
    "id": 65,
    "category": "System Design",
    "title": "Notification System",
    "difficulty": "Hard",
    "description": "Design email/SMS/push notification pipeline.",
    "questions": [
      "How scale notifications?",
      "Why use queues?"
    ],
    "tags": [
      "systemdesign"
    ]
  },
  {
    "id": 66,
    "category": "System Design",
    "title": "URL Shortener",
    "difficulty": "Medium",
    "description": "High-scale key generation, redirects, cache and persistence.",
    "questions": [
      "How generate short IDs?",
      "How scale reads?"
    ],
    "tags": [
      "systemdesign"
    ]
  },
  {
    "id": 67,
    "category": "System Design",
    "title": "Food Delivery System",
    "difficulty": "Hard",
    "description": "Location, order, payment, driver assignment and events.",
    "questions": [
      "How design order state?",
      "How handle concurrent updates?"
    ],
    "tags": [
      "systemdesign"
    ]
  },
  {
    "id": 68,
    "category": "AWS",
    "title": "IAM",
    "difficulty": "Medium",
    "description": "Users, roles, policies and least privilege.",
    "questions": [
      "Role vs user?",
      "How apply least privilege?"
    ],
    "tags": [
      "aws",
      "iam"
    ]
  },
  {
    "id": 69,
    "category": "AWS",
    "title": "EC2",
    "difficulty": "Easy",
    "description": "Compute instances, security groups and autoscaling concepts.",
    "questions": [
      "Security group vs NACL?",
      "What is an AMI?"
    ],
    "tags": [
      "aws",
      "ec2"
    ]
  },
  {
    "id": 70,
    "category": "AWS",
    "title": "S3",
    "difficulty": "Easy",
    "description": "Object storage, buckets, lifecycle and versioning.",
    "questions": [
      "S3 consistency?",
      "Presigned URL?"
    ],
    "tags": [
      "aws",
      "s3"
    ]
  },
  {
    "id": 71,
    "category": "AWS",
    "title": "RDS",
    "difficulty": "Medium",
    "description": "Managed relational databases, backups and replicas.",
    "questions": [
      "RDS Multi-AZ vs read replica?",
      "When use RDS?"
    ],
    "tags": [
      "aws",
      "rds"
    ]
  },
  {
    "id": 72,
    "category": "AWS",
    "title": "VPC Networking",
    "difficulty": "Hard",
    "description": "Subnets, route tables, internet/NAT gateways and security.",
    "questions": [
      "Public vs private subnet?",
      "Why NAT Gateway?"
    ],
    "tags": [
      "aws",
      "vpc"
    ]
  },
  {
    "id": 73,
    "category": "AWS",
    "title": "SQS & SNS",
    "difficulty": "Medium",
    "description": "Queues, fanout, retries and asynchronous integration.",
    "questions": [
      "SQS vs SNS?",
      "Visibility timeout?"
    ],
    "tags": [
      "aws",
      "messaging"
    ]
  },
  {
    "id": 74,
    "category": "AWS",
    "title": "CloudWatch",
    "difficulty": "Easy",
    "description": "Logs, metrics, alarms and operational monitoring.",
    "questions": [
      "How monitor Spring Boot?",
      "Metric vs log?"
    ],
    "tags": [
      "aws",
      "monitoring"
    ]
  },
  {
    "id": 75,
    "category": "AWS",
    "title": "ECS / EKS",
    "difficulty": "Hard",
    "description": "Container orchestration on AWS.",
    "questions": [
      "ECS vs EKS?",
      "When choose Kubernetes?"
    ],
    "tags": [
      "aws",
      "containers"
    ]
  },
  {
    "id": 76,
    "category": "AWS",
    "title": "Lambda",
    "difficulty": "Medium",
    "description": "Serverless compute and event-driven processing.",
    "questions": [
      "Cold start?",
      "When Lambda is a poor fit?"
    ],
    "tags": [
      "aws",
      "serverless"
    ]
  },
  {
    "id": 77,
    "category": "DevOps",
    "title": "Docker",
    "difficulty": "Medium",
    "description": "Images, containers, Dockerfile, networking and volumes.",
    "questions": [
      "Image vs container?",
      "CMD vs ENTRYPOINT?"
    ],
    "tags": [
      "docker"
    ]
  },
  {
    "id": 78,
    "category": "DevOps",
    "title": "Docker Compose",
    "difficulty": "Easy",
    "description": "Multi-container local development.",
    "questions": [
      "depends_on behavior?",
      "Compose networking?"
    ],
    "tags": [
      "docker",
      "compose"
    ]
  },
  {
    "id": 79,
    "category": "DevOps",
    "title": "Kubernetes Architecture",
    "difficulty": "Hard",
    "description": "Cluster, control plane, nodes, pods and controllers.",
    "questions": [
      "Pod vs Deployment?",
      "What does kubelet do?"
    ],
    "tags": [
      "k8s"
    ]
  },
  {
    "id": 80,
    "category": "DevOps",
    "title": "Kubernetes Services",
    "difficulty": "Medium",
    "description": "ClusterIP, NodePort and LoadBalancer services.",
    "questions": [
      "ClusterIP vs NodePort?",
      "How does service discovery work?"
    ],
    "tags": [
      "k8s"
    ]
  },
  {
    "id": 81,
    "category": "DevOps",
    "title": "Kubernetes Config & Secrets",
    "difficulty": "Medium",
    "description": "External configuration and sensitive values.",
    "questions": [
      "ConfigMap vs Secret?",
      "How inject environment variables?"
    ],
    "tags": [
      "k8s"
    ]
  },
  {
    "id": 82,
    "category": "DevOps",
    "title": "Kubernetes Probes",
    "difficulty": "Medium",
    "description": "Liveness, readiness and startup probes.",
    "questions": [
      "Liveness vs readiness?",
      "When use startup probe?"
    ],
    "tags": [
      "k8s"
    ]
  },
  {
    "id": 83,
    "category": "DevOps",
    "title": "Kubernetes Scaling",
    "difficulty": "Hard",
    "description": "HPA, resource requests/limits and replicas.",
    "questions": [
      "How does HPA work?",
      "Requests vs limits?"
    ],
    "tags": [
      "k8s",
      "scaling"
    ]
  },
  {
    "id": 84,
    "category": "DevOps",
    "title": "CI/CD GitHub Actions",
    "difficulty": "Medium",
    "description": "Build, test, package and deploy automation.",
    "questions": [
      "CI vs CD?",
      "How manage secrets?"
    ],
    "tags": [
      "cicd"
    ]
  },
  {
    "id": 85,
    "category": "Testing",
    "title": "JUnit 5",
    "difficulty": "Medium",
    "description": "Unit testing, lifecycle, parameterized tests and assertions.",
    "questions": [
      "JUnit 4 vs 5?",
      "Parameterized tests?"
    ],
    "tags": [
      "junit",
      "testing"
    ]
  },
  {
    "id": 86,
    "category": "Testing",
    "title": "Mockito",
    "difficulty": "Medium",
    "description": "Mocks, stubs, spies and interaction verification.",
    "questions": [
      "Mock vs Spy?",
      "when vs doReturn?"
    ],
    "tags": [
      "mockito",
      "testing"
    ]
  },
  {
    "id": 87,
    "category": "Testing",
    "title": "Spring Boot Testing",
    "difficulty": "Hard",
    "description": "@SpringBootTest, MockMvc, slices and integration tests.",
    "questions": [
      "MockMvc vs WebTestClient?",
      "@WebMvcTest vs @SpringBootTest?"
    ],
    "tags": [
      "spring",
      "testing"
    ]
  },
  {
    "id": 88,
    "category": "Database",
    "title": "SQL Joins",
    "difficulty": "Medium",
    "description": "Inner, left, right and self joins.",
    "questions": [
      "INNER vs LEFT JOIN?",
      "Find duplicate records?"
    ],
    "tags": [
      "sql"
    ]
  },
  {
    "id": 89,
    "category": "Database",
    "title": "SQL Window Functions",
    "difficulty": "Hard",
    "description": "ROW_NUMBER, RANK, LAG, LEAD and partitioning.",
    "questions": [
      "RANK vs DENSE_RANK?",
      "Top N per group?"
    ],
    "tags": [
      "sql",
      "analytics"
    ]
  },
  {
    "id": 90,
    "category": "Database",
    "title": "Transactions & ACID",
    "difficulty": "Hard",
    "description": "Atomicity, consistency, isolation and durability.",
    "questions": [
      "Explain ACID.",
      "Isolation anomalies?"
    ],
    "tags": [
      "sql",
      "acid"
    ]
  },
  {
    "id": 91,
    "category": "Database",
    "title": "Normalization",
    "difficulty": "Medium",
    "description": "1NF, 2NF, 3NF and denormalization trade-offs.",
    "questions": [
      "Why normalize?",
      "When denormalize?"
    ],
    "tags": [
      "database"
    ]
  }
];

function revisionApp(){
return {
dark:localStorage.getItem("revision-theme")==="dark",
topics:JSON.parse(localStorage.getItem("revision-topics-v2")||"null")||SEED_TOPICS.map(t=>({...t,done:false,important:false,notes:""})),
search:"",category:"All",status:"All",difficulty:"All",sortBy:"default",showOnlyImportant:false,notesOpen:false,selectedTopic:null,

get categories(){return [...new Set(this.topics.map(t=>t.category))]},
get completedCount(){return this.topics.filter(t=>t.done).length},
get importantCount(){return this.topics.filter(t=>t.important).length},
get hardCount(){return this.topics.filter(t=>t.difficulty==="Hard").length},
get progress(){return this.topics.length?Math.round(this.completedCount*100/this.topics.length):0},
get stats(){return[
{label:"Total Topics",value:this.topics.length,cls:""},
{label:"Completed",value:this.completedCount,cls:"text-emerald-600"},
{label:"Remaining",value:this.topics.length-this.completedCount,cls:"text-amber-600"},
{label:"Important",value:this.importantCount,cls:"text-amber-600"},
{label:"Progress",value:this.progress+"%",cls:"text-indigo-600"}]},
get filteredTopics(){
const q=this.search.toLowerCase().trim();
let a=this.topics.filter(t=>{
const text=`${t.title} ${t.description} ${t.category} ${t.tags.join(" ")}`.toLowerCase();
return(!q||text.includes(q))&&(this.category==="All"||t.category===this.category)&&
(this.status==="All"||(this.status==="Completed"&&t.done)||(this.status==="Pending"&&!t.done))&&
(this.difficulty==="All"||t.difficulty===this.difficulty)&&(!this.showOnlyImportant||t.important);
});
if(this.sortBy==="title")a.sort((x,y)=>x.title.localeCompare(y.title));
if(this.sortBy==="category")a.sort((x,y)=>x.category.localeCompare(y.category));
if(this.sortBy==="difficulty"){const d={Easy:1,Medium:2,Hard:3};a.sort((x,y)=>d[y.difficulty]-d[x.difficulty])}
return a;
},
init(){document.documentElement.classList.toggle("dark",this.dark);},
persist(){localStorage.setItem("revision-topics-v2",JSON.stringify(this.topics))},
saveTheme(){localStorage.setItem("revision-theme",this.dark?"dark":"light");document.documentElement.classList.toggle("dark",this.dark)},
toggleDone(t){t.done=!t.done;this.persist()},
toggleImportant(t){t.important=!t.important;this.persist()},
openNotes(t){this.selectedTopic=t;this.notesOpen=true},
saveNotes(){this.persist();this.notesOpen=false},
difficultyClass(x){return{Easy:"bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",Medium:"bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",Hard:"bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"}[x]},
resetProgress(){if(!confirm("Reset all progress, stars and notes?"))return;this.topics.forEach(t=>{t.done=false;t.important=false;t.notes=""});this.persist()}
}}
