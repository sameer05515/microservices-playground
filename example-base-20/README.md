# Design Patterns Demonstration

This directory contains Spring Boot projects demonstrating important design patterns with practical implementations.

## Projects

### 1. Singleton Pattern (`singleton-demonstrate/`)

Demonstrates thread-safe Singleton pattern implementations using Java 8 features.

**Key Features:**
- Enum Singleton (Recommended)
- Double-Check Locking Singleton
- Bill Pugh Singleton (Initialization-on-Demand Holder)
- Java 8 Supplier Singleton
- Synchronized Singleton
- Comprehensive thread-safety tests
- REST API for demonstration

**See**: [singleton-demonstrate/README.md](singleton-demonstrate/README.md)

### 2. Abstract Factory Pattern (`abstract-factory-demonstrate/`)

Demonstrates the Abstract Factory Pattern for integrating multiple database systems.

**Key Features:**
- Abstract Factory interface for database operations
- Concrete factories for MySQL, PostgreSQL, and MongoDB
- Abstract products: Connection, Repository, Transaction
- Concrete implementations for each database type
- Easy database switching via configuration
- REST API for database operations

**See**: [abstract-factory-demonstrate/README.md](abstract-factory-demonstrate/README.md)

## Quick Start

### Singleton Pattern Demo

```bash
cd singleton-demonstrate
mvn spring-boot:run
# Visit http://localhost:8080/swagger-ui.html
```

### Abstract Factory Pattern Demo

```bash
cd abstract-factory-demonstrate
# Configure database in application.properties
mvn spring-boot:run
# Visit http://localhost:8080/swagger-ui.html
```

## Learning Objectives

These projects help you understand:

1. **Design Patterns**: How to implement and use common design patterns
2. **Thread Safety**: Ensuring thread-safe implementations in multi-threaded environments
3. **Database Integration**: Managing multiple database systems in a clean, maintainable way
4. **Spring Boot**: Best practices for Spring Boot application architecture
5. **Code Organization**: Structuring code for maintainability and extensibility

## Pattern Comparison

| Pattern | Use Case | Complexity | When to Use |
|---------|----------|------------|-------------|
| **Singleton** | Single instance requirement | Low | Logging, Configuration, Database connections |
| **Abstract Factory** | Multiple related product families | Medium | Database integration, UI frameworks, Cross-platform support |

## Prerequisites

- Java 21+
- Maven 3.6+
- Spring Boot 3.3.1
- (For Abstract Factory) MySQL, PostgreSQL, or MongoDB (optional)

## Contributing

Feel free to explore, modify, and extend these examples to deepen your understanding of design patterns!

