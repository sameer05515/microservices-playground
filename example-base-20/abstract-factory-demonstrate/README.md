# Abstract Factory Pattern for Multiple Database Integration

This Spring Boot project demonstrates the **Abstract Factory Pattern** and how it can be used to integrate multiple database systems (MySQL, PostgreSQL, MongoDB) in a clean, maintainable, and extensible way.

## Table of Contents

- [What is the Abstract Factory Pattern?](#what-is-the-abstract-factory-pattern)
- [How It Works for Database Integration](#how-it-works-for-database-integration)
- [Project Structure](#project-structure)
- [Key Components](#key-components)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Switching Between Databases](#switching-between-databases)
- [Benefits of This Approach](#benefits-of-this-approach)
- [Pattern Comparison](#pattern-comparison)
- [Best Practices](#best-practices)

## What is the Abstract Factory Pattern?

The **Abstract Factory Pattern** is a creational design pattern that provides an interface for creating families of related or dependent objects without specifying their concrete classes.

### Key Concepts:

1. **Abstract Factory**: Defines methods to create abstract products
2. **Concrete Factory**: Implements the abstract factory to create concrete products
3. **Abstract Products**: Interfaces for products that will be created
4. **Concrete Products**: Actual implementations of the abstract products

### Pattern Structure:

```
AbstractFactory (DatabaseFactory)
    ├── createConnection()
    ├── createRepository()
    └── createTransaction()

ConcreteFactories
    ├── MySQLFactory
    ├── PostgreSQLFactory
    └── MongoDBFactory

AbstractProducts
    ├── Connection
    ├── Repository
    └── Transaction

ConcreteProducts
    ├── MySQLConnection, MySQLRepository, MySQLTransaction
    ├── PostgreSQLConnection, PostgreSQLRepository, PostgreSQLTransaction
    └── MongoDBConnection, MongoDBRepository, MongoDBTransaction
```

## How It Works for Database Integration

### Problem Statement

When building applications that need to support multiple database systems, you face several challenges:

1. **Different APIs**: Each database has different connection methods, query syntax, and transaction handling
2. **Code Duplication**: Without a pattern, you'd have conditional logic scattered throughout your code
3. **Tight Coupling**: Business logic becomes tightly coupled to specific database implementations
4. **Difficult to Extend**: Adding a new database type requires modifying existing code

### Solution: Abstract Factory Pattern

The Abstract Factory Pattern solves these problems by:

1. **Creating a Common Interface**: All databases implement the same abstract interfaces
2. **Factory-Based Creation**: A factory creates compatible products for each database type
3. **Isolation**: Business logic works with abstractions, not concrete implementations
4. **Easy Extension**: Adding a new database just requires creating a new factory and products

### Example Flow:

```java
// 1. Select database type (via configuration)
app.database.type=mysql

// 2. Factory is selected automatically
DatabaseFactory factory = new MySQLFactory(...);

// 3. Business service uses abstract interfaces
DatabaseService service = new DatabaseService(factory);

// 4. All operations work the same way, regardless of database
User user = service.saveUser(new User("John", "john@example.com"));
```

## Project Structure

```
abstract-factory-demonstrate/
├── src/
│   ├── main/
│   │   ├── java/com/p/abstractfactory/
│   │   │   ├── AbstractFactoryDatabaseApplication.java
│   │   │   ├── factory/                          # Abstract Factory
│   │   │   │   ├── DatabaseFactory.java         # Abstract Factory Interface
│   │   │   │   └── impl/
│   │   │   │       ├── MySQLFactory.java         # Concrete Factory
│   │   │   │       ├── PostgreSQLFactory.java    # Concrete Factory
│   │   │   │       └── MongoDBFactory.java       # Concrete Factory
│   │   │   ├── product/                          # Abstract Products
│   │   │   │   ├── Connection.java              # Abstract Product
│   │   │   │   ├── Repository.java              # Abstract Product
│   │   │   │   ├── Transaction.java             # Abstract Product
│   │   │   │   └── impl/
│   │   │   │       ├── MySQLConnection.java      # Concrete Product
│   │   │   │       ├── MySQLRepository.java      # Concrete Product
│   │   │   │       ├── MySQLTransaction.java     # Concrete Product
│   │   │   │       ├── PostgreSQLConnection.java
│   │   │   │       ├── PostgreSQLRepository.java
│   │   │   │       ├── PostgreSQLTransaction.java
│   │   │   │       ├── MongoDBConnection.java
│   │   │   │       ├── MongoDBRepository.java
│   │   │   │       └── MongoDBTransaction.java
│   │   │   ├── model/
│   │   │   │   └── User.java                    # Domain Model
│   │   │   ├── service/
│   │   │   │   └── DatabaseService.java         # Business Logic
│   │   │   ├── controller/
│   │   │   │   └── DatabaseController.java      # REST API
│   │   │   └── config/
│   │   │       ├── DatabaseFactoryConfig.java   # Factory Selection
│   │   │       └── OpenApiConfig.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│       └── java/com/p/abstractfactory/
│           ├── factory/
│           │   └── DatabaseFactoryTest.java
│           └── service/
│               └── DatabaseServiceTest.java
├── pom.xml
└── README.md
```

## Key Components

### 1. Abstract Factory Interface

```java
public interface DatabaseFactory {
    Connection createConnection();
    Repository createRepository();
    Transaction createTransaction();
    String getDatabaseType();
}
```

### 2. Concrete Factories

Each factory creates a family of compatible products:

- **MySQLFactory**: Creates MySQLConnection, MySQLRepository, MySQLTransaction
- **PostgreSQLFactory**: Creates PostgreSQLConnection, PostgreSQLRepository, PostgreSQLTransaction
- **MongoDBFactory**: Creates MongoDBConnection, MongoDBRepository, MongoDBTransaction

### 3. Abstract Products

- **Connection**: Interface for database connections
- **Repository**: Interface for data access operations
- **Transaction**: Interface for transaction management

### 4. Business Service

The `DatabaseService` class uses the abstract factory without knowing which concrete implementation is being used:

```java
@Service
public class DatabaseService {
    private final DatabaseFactory databaseFactory;
    
    public User saveUser(User user) {
        Repository<User, Long> repository = databaseFactory.createRepository();
        return repository.save(user);
    }
}
```

## Getting Started

### Prerequisites

- Java 21+
- Maven 3.6+
- One or more of the following databases:
  - MySQL 8.0+
  - PostgreSQL 12+
  - MongoDB 4.0+ (optional, has in-memory fallback)

### Installation

1. **Clone/Navigate to the project**:
   ```bash
   cd example-base-20/abstract-factory-demonstrate
   ```

2. **Configure Database**:
   Edit `src/main/resources/application.properties`:
   ```properties
   # Select database type
   app.database.type=mysql
   
   # Configure connection details
   mysql.datasource.url=jdbc:mysql://localhost:3306/abstract_factory_db
   mysql.datasource.username=root
   mysql.datasource.password=your_password
   ```

3. **Build the project**:
   ```bash
   mvn clean install
   ```

4. **Run the application**:
   ```bash
   mvn spring-boot:run
   ```

The application will start on `http://localhost:8080`

## API Endpoints

### Base URL
`http://localhost:8080/api/database`

### Available Endpoints

#### 1. Get Database Information
```http
GET /api/database/info
```

**Response**:
```json
{
  "databaseType": "MySQL",
  "connectionStatus": "Connected"
}
```

#### 2. Test Database Connection
```http
GET /api/database/test-connection
```

#### 3. Create User
```http
POST /api/database/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}
```

#### 4. Get User by ID
```http
GET /api/database/users/{id}
```

#### 5. Get All Users
```http
GET /api/database/users
```

#### 6. Delete User
```http
DELETE /api/database/users/{id}
```

#### 7. Get User Count
```http
GET /api/database/users/count
```

#### 8. Execute Transaction
```http
POST /api/database/transaction
Content-Type: application/json

[
  {"name": "User 1", "email": "user1@example.com"},
  {"name": "User 2", "email": "user2@example.com"}
]
```

### API Documentation

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/v3/api-docs

## Switching Between Databases

One of the key benefits of the Abstract Factory Pattern is the ability to switch between database implementations with minimal code changes.

### Method 1: Configuration File

Edit `application.properties`:
```properties
# Switch to PostgreSQL
app.database.type=postgresql

# Or switch to MongoDB
app.database.type=mongodb
```

### Method 2: Environment Variable

```bash
export APP_DATABASE_TYPE=postgresql
mvn spring-boot:run
```

### Method 3: Programmatic Selection

Modify `DatabaseFactoryConfig.java` to use different selection logic (e.g., based on feature flags, load balancing, etc.)

## Benefits of This Approach

### 1. **Separation of Concerns**
- Business logic is separated from database-specific code
- Each database implementation is isolated

### 2. **Easy Database Switching**
- Change one configuration property to switch databases
- No code changes required in business logic

### 3. **Consistency**
- All products from the same factory are guaranteed to be compatible
- No mixing of MySQL connections with PostgreSQL repositories

### 4. **Extensibility**
- Adding a new database type requires:
  1. Create a new factory (e.g., `OracleFactory`)
  2. Create concrete products (OracleConnection, OracleRepository, OracleTransaction)
  3. Update configuration
- No changes to existing code

### 5. **Testability**
- Easy to mock factories and products for testing
- Can use in-memory implementations (like MongoDB in this demo)

### 6. **Type Safety**
- Compile-time checking ensures correct product usage
- Factory ensures compatible products are used together

## Pattern Comparison

| Aspect | Without Pattern | With Abstract Factory |
|--------|----------------|----------------------|
| **Code Organization** | Scattered conditionals | Clean separation |
| **Adding New DB** | Modify existing code | Add new factory + products |
| **Testing** | Difficult to mock | Easy to mock |
| **Type Safety** | Runtime errors possible | Compile-time safety |
| **Maintainability** | Low | High |
| **Code Reusability** | Low | High |

## Best Practices

### 1. **Use Abstract Factory When:**
- ✅ You need to support multiple families of related products
- ✅ You want to ensure products from the same family are used together
- ✅ You need to switch between implementations at runtime
- ✅ You want to isolate concrete classes from clients

### 2. **Don't Use Abstract Factory When:**
- ❌ You only have one product family
- ❌ Products are not related or don't need to be used together
- ❌ The pattern adds unnecessary complexity

### 3. **Implementation Tips:**
- Keep abstract products focused and cohesive
- Ensure all products in a family are truly related
- Use dependency injection (as shown with Spring)
- Consider using a factory registry for dynamic factory selection
- Document which products are compatible with which factories

### 4. **Real-World Enhancements:**
- Use connection pooling for production
- Implement proper error handling and retry logic
- Add monitoring and metrics
- Use Spring's `@ConditionalOnProperty` for factory selection
- Consider using Spring Data abstractions (JPA, MongoDB repositories)

## Real-World Use Cases

1. **Multi-Tenant Applications**: Different tenants use different databases
2. **Database Migration**: Gradual migration from one DB to another
3. **Environment-Specific**: Dev uses H2, Prod uses PostgreSQL
4. **Feature Flags**: A/B testing with different database backends
5. **Hybrid Systems**: Some data in SQL, some in NoSQL

## Testing

### Run All Tests
```bash
mvn test
```

### Run Specific Test
```bash
mvn test -Dtest=DatabaseFactoryTest
```

## Extending the Pattern

### Adding a New Database (e.g., Oracle)

1. **Create Concrete Products**:
   ```java
   public class OracleConnection implements Connection { ... }
   public class OracleRepository implements Repository { ... }
   public class OracleTransaction implements Transaction { ... }
   ```

2. **Create Concrete Factory**:
   ```java
   @Component
   public class OracleFactory implements DatabaseFactory {
       // Implement factory methods
   }
   ```

3. **Update Configuration**:
   ```java
   // In DatabaseFactoryConfig.java
   case "oracle" -> oracleFactory;
   ```

4. **Add Configuration Properties**:
   ```properties
   oracle.datasource.url=jdbc:oracle:thin:@localhost:1521:xe
   oracle.datasource.username=system
   oracle.datasource.password=password
   ```

That's it! No changes needed to business logic or service classes.

## References

- [Abstract Factory Pattern - Refactoring Guru](https://refactoring.guru/design-patterns/abstract-factory)
- [Design Patterns: Elements of Reusable Object-Oriented Software (Gang of Four)](https://en.wikipedia.org/wiki/Design_Patterns)
- [Spring Framework Documentation](https://spring.io/projects/spring-framework)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- [Spring Data MongoDB](https://spring.io/projects/spring-data-mongodb)

## License

This project is for educational purposes.

## Contributing

Feel free to submit issues and enhancement requests!

