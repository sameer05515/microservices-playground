function revisionApp() {
  const seed = [
    {
      id: 1, category: "Core Java", title: "OOP & SOLID", difficulty: "Easy",
      description: "Revise abstraction, encapsulation, inheritance, polymorphism and SOLID principles.",
      questions: ["Composition vs inheritance?", "Explain Liskov Substitution Principle.", "Where have you applied SOLID?"],
      tags: ["java", "oop", "solid"]
    },
    {
      id: 2, category: "Core Java", title: "equals() & hashCode()", difficulty: "Medium",
      description: "Understand equality contract and why hashCode is critical for hash-based collections.",
      questions: ["What happens if equals is overridden but hashCode is not?", "Why must equal objects have equal hash codes?"],
      tags: ["java", "object", "collections"]
    },
    {
      id: 3, category: "Core Java", title: "HashMap Internals", difficulty: "Hard",
      description: "Buckets, hashing, collisions, resize, load factor and treeification in Java 8+.",
      questions: ["How does put() work?", "What causes collisions?", "When does a bucket become a tree?"],
      tags: ["hashmap", "collections", "java8"]
    },
    {
      id: 4, category: "Core Java", title: "ConcurrentHashMap", difficulty: "Hard",
      description: "Concurrent access, locking strategy and differences from HashMap and Hashtable.",
      questions: ["HashMap vs Hashtable vs ConcurrentHashMap?", "Why is ConcurrentHashMap preferred for concurrency?"],
      tags: ["concurrency", "collections"]
    },
    {
      id: 5, category: "Core Java", title: "Multithreading & Executors", difficulty: "Hard",
      description: "Threads, synchronization, locks, ExecutorService, Future and thread pools.",
      questions: ["Runnable vs Callable?", "How does a thread pool work?", "synchronized vs Lock?"],
      tags: ["threads", "executor", "concurrency"]
    },
    {
      id: 6, category: "Core Java", title: "Java Memory Model", difficulty: "Hard",
      description: "Heap, stack, visibility, happens-before, volatile and synchronization.",
      questions: ["What is happens-before?", "What does volatile guarantee?", "Why do race conditions happen?"],
      tags: ["jmm", "volatile", "concurrency"]
    },
    {
      id: 7, category: "Spring", title: "IoC & Dependency Injection", difficulty: "Medium",
      description: "Understand Spring IoC container, dependency injection and constructor injection.",
      questions: ["What is IoC?", "Why prefer constructor injection?", "How does Spring resolve dependencies?"],
      tags: ["spring", "ioc", "di"]
    },
    {
      id: 8, category: "Spring", title: "Bean Scopes & Lifecycle", difficulty: "Medium",
      description: "Singleton, prototype, request/session scopes and bean lifecycle callbacks.",
      questions: ["What are Spring bean scopes?", "What happens during bean creation?", "@PostConstruct vs @PreDestroy?"],
      tags: ["spring", "beans"]
    },
    {
      id: 9, category: "Spring Boot", title: "REST API Design", difficulty: "Medium",
      description: "Controllers, HTTP semantics, validation, status codes and API versioning.",
      questions: ["PUT vs PATCH?", "How do you version APIs?", "What makes an API RESTful?"],
      tags: ["rest", "api", "springboot"]
    },
    {
      id: 10, category: "Spring Boot", title: "Exception Handling", difficulty: "Medium",
      description: "Centralized error handling with @ControllerAdvice and structured error responses.",
      questions: ["How does @ControllerAdvice work?", "How would you design an error response?"],
      tags: ["exception", "rest"]
    },
    {
      id: 11, category: "Spring Boot", title: "Transactions & JPA", difficulty: "Hard",
      description: "Persistence context, transaction boundaries, propagation and isolation.",
      questions: ["What does @Transactional do?", "Lazy vs eager loading?", "What causes LazyInitializationException?"],
      tags: ["jpa", "hibernate", "transaction"]
    },
    {
      id: 12, category: "Security", title: "JWT & Spring Security", difficulty: "Hard",
      description: "Authentication, authorization, JWT access tokens, refresh tokens and filters.",
      questions: ["Authentication vs authorization?", "Where should JWT validation happen?", "How should refresh tokens be stored?"],
      tags: ["security", "jwt", "oauth2"]
    },
    {
      id: 13, category: "Microservices", title: "API Gateway", difficulty: "Medium",
      description: "Routing, authentication, rate limiting, aggregation and cross-cutting concerns.",
      questions: ["What belongs in an API Gateway?", "Gateway vs load balancer?"],
      tags: ["microservices", "gateway"]
    },
    {
      id: 14, category: "Microservices", title: "Circuit Breaker & Resilience", difficulty: "Hard",
      description: "Timeout, retry, circuit breaker, fallback and bulkhead patterns.",
      questions: ["Why can retries make outages worse?", "Explain circuit breaker states."],
      tags: ["resilience4j", "microservices"]
    },
    {
      id: 15, category: "Microservices", title: "Saga Pattern", difficulty: "Hard",
      description: "Distributed transaction management using choreography or orchestration.",
      questions: ["Why not use one distributed transaction?", "Choreography vs orchestration?"],
      tags: ["saga", "distributed"]
    },
    {
      id: 16, category: "Messaging", title: "Kafka & DLQ", difficulty: "Hard",
      description: "Topics, partitions, consumer groups, offsets, retries and dead-letter queues.",
      questions: ["How does Kafka scale?", "What is a consumer group?", "When should messages go to DLQ?"],
      tags: ["kafka", "dlq", "events"]
    },
    {
      id: 17, category: "Caching", title: "Redis", difficulty: "Medium",
      description: "Caching strategies, TTL, eviction, distributed locking and cache consistency.",
      questions: ["Cache-aside pattern?", "How do you prevent cache stampede?", "Redis distributed lock?"],
      tags: ["redis", "cache"]
    },
    {
      id: 18, category: "System Design", title: "Load Balancing", difficulty: "Medium",
      description: "Horizontal scaling, L4/L7 load balancing and common balancing algorithms.",
      questions: ["L4 vs L7 load balancer?", "Round robin vs least connections?"],
      tags: ["systemdesign", "scaling"]
    },
    {
      id: 19, category: "System Design", title: "Database Scaling", difficulty: "Hard",
      description: "Read replicas, partitioning, sharding, indexing and consistency trade-offs.",
      questions: ["Replication vs sharding?", "When would you shard?", "How do read replicas affect consistency?"],
      tags: ["database", "scaling"]
    },
    {
      id: 20, category: "System Design", title: "Rate Limiting & Idempotency", difficulty: "Hard",
      description: "Protect APIs and safely handle retries in distributed systems.",
      questions: ["Token bucket vs leaky bucket?", "How would you make payment APIs idempotent?"],
      tags: ["ratelimit", "idempotency"]
    },
    {
      id: 21, category: "AWS", title: "EC2, S3 & RDS", difficulty: "Medium",
      description: "Core AWS compute, object storage and relational database services.",
      questions: ["When would you use S3?", "RDS vs self-managed database?", "How do security groups work?"],
      tags: ["aws", "ec2", "s3", "rds"]
    },
    {
      id: 22, category: "DevOps", title: "Docker", difficulty: "Medium",
      description: "Images, containers, Dockerfile, networking, volumes and Compose.",
      questions: ["Image vs container?", "CMD vs ENTRYPOINT?", "How does container networking work?"],
      tags: ["docker", "containers"]
    },
    {
      id: 23, category: "DevOps", title: "Kubernetes", difficulty: "Hard",
      description: "Pods, Deployments, Services, ConfigMaps, Secrets, probes and scaling.",
      questions: ["Pod vs Deployment?", "ClusterIP vs NodePort?", "Liveness vs readiness probe?"],
      tags: ["k8s", "kubernetes"]
    },
    {
      id: 24, category: "DevOps", title: "CI/CD with GitHub Actions", difficulty: "Medium",
      description: "Build, test, package and deploy Java applications through automated pipelines.",
      questions: ["What stages belong in CI/CD?", "How should secrets be handled?"],
      tags: ["githubactions", "cicd"]
    }
  ];

  return {
    dark: localStorage.getItem("revision-theme") === "dark",
    topics: JSON.parse(localStorage.getItem("revision-topics") || "null") || seed.map(t => ({...t, done:false, important:false, notes:""})),
    search: "",
    category: "All",
    status: "All",
    difficulty: "All",
    notesOpen: false,
    selectedTopic: null,

    get categories() {
      return [...new Set(this.topics.map(t => t.category))];
    },

    get completedCount() {
      return this.topics.filter(t => t.done).length;
    },

    get progress() {
      return this.topics.length ? Math.round(this.completedCount * 100 / this.topics.length) : 0;
    },

    get filteredTopics() {
      const q = this.search.toLowerCase().trim();
      return this.topics.filter(t => {
        const text = `${t.title} ${t.description} ${t.category} ${t.tags.join(" ")}`.toLowerCase();
        const matchesSearch = !q || text.includes(q);
        const matchesCategory = this.category === "All" || t.category === this.category;
        const matchesStatus = this.status === "All" ||
          (this.status === "Completed" && t.done) ||
          (this.status === "Pending" && !t.done);
        const matchesDifficulty = this.difficulty === "All" || t.difficulty === this.difficulty;
        return matchesSearch && matchesCategory && matchesStatus && matchesDifficulty;
      });
    },

    init() {
      document.documentElement.classList.toggle("dark", this.dark);
      this.$watch("topics", () => this.persist());
    },

    persist() {
      localStorage.setItem("revision-topics", JSON.stringify(this.topics));
    },

    saveTheme() {
      localStorage.setItem("revision-theme", this.dark ? "dark" : "light");
      document.documentElement.classList.toggle("dark", this.dark);
    },

    toggleDone(topic) {
      topic.done = !topic.done;
      this.persist();
    },

    toggleImportant(topic) {
      topic.important = !topic.important;
      this.persist();
    },

    openNotes(topic) {
      this.selectedTopic = topic;
      this.notesOpen = true;
    },

    saveNotes() {
      this.persist();
      this.notesOpen = false;
    },

    difficultyClass(level) {
      return {
        Easy: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
        Medium: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
        Hard: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
      }[level];
    },

    resetProgress() {
      if (!confirm("Reset all completed flags, stars and notes?")) return;
      this.topics.forEach(t => {
        t.done = false;
        t.important = false;
        t.notes = "";
      });
      this.persist();
    }
  };
}
