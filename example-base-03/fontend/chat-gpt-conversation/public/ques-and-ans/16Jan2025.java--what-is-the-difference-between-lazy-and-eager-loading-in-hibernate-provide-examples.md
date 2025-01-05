In Hibernate, **lazy loading** and **eager loading** refer to how related entities (e.g., associations between entities) are loaded from the database. The main difference lies in **when** the related entities are fetched.

### 1. **Lazy Loading**

- **Definition**: In lazy loading, related entities are not loaded immediately when the parent entity is loaded. Instead, they are fetched only when they are explicitly accessed. This behavior is usually implemented using **proxy objects**.
- **Usage**: Lazy loading is the default fetching strategy in Hibernate for most associations (like `@OneToMany` or `@ManyToOne`).
- **Advantage**: It can improve performance by reducing the number of database queries, especially when not all associations are required for the current operation.
- **Disadvantage**: If the lazy-loaded association is accessed outside of a valid session (e.g., after the session has been closed), it can lead to **LazyInitializationException**.

#### Example of Lazy Loading:
```java
@Entity
public class Author {
    @Id
    private Long id;
    
    private String name;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "author")
    private Set<Book> books;
    
    // Getters and setters
}

@Entity
public class Book {
    @Id
    private Long id;
    
    private String title;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id")
    private Author author;

    // Getters and setters
}

// Fetching an Author and its associated books lazily
Author author = session.get(Author.class, 1L);
System.out.println(author.getBooks());  // books are fetched here, not when author is initially loaded.
```

- In the example above, when you fetch the `Author` object, the `books` collection is not fetched immediately. It is fetched only when you access the `books` collection.

### 2. **Eager Loading**

- **Definition**: In eager loading, related entities are fetched immediately when the parent entity is loaded. This happens at the time of the initial query, and all associated entities are loaded along with the parent entity in a single query (or multiple queries depending on the relationship).
- **Usage**: Eager loading is used when you know that you will need the associated entities and do not want to perform additional database queries later. It's commonly used with `@OneToMany` or `@ManyToOne` relationships where you need all related data upfront.
- **Advantage**: It avoids **LazyInitializationException** because the associated entities are fetched upfront.
- **Disadvantage**: It can negatively impact performance by fetching unnecessary data, leading to larger queries and possibly fetching more data than required.

#### Example of Eager Loading:
```java
@Entity
public class Author {
    @Id
    private Long id;
    
    private String name;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "author")
    private Set<Book> books;
    
    // Getters and setters
}

@Entity
public class Book {
    @Id
    private Long id;
    
    private String title;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "author_id")
    private Author author;

    // Getters and setters
}

// Fetching an Author and its associated books eagerly
Author author = session.get(Author.class, 1L);
System.out.println(author.getBooks());  // books are fetched immediately with author
```

- In the example above, when you fetch the `Author` object, its associated `books` collection is fetched immediately in the same query.

### **Key Differences between Lazy Loading and Eager Loading**:

| **Aspect**               | **Lazy Loading**                                                 | **Eager Loading**                                                |
|--------------------------|------------------------------------------------------------------|------------------------------------------------------------------|
| **Fetch Timing**          | Related entities are fetched only when they are accessed.        | Related entities are fetched immediately with the parent entity. |
| **Default Fetch Type**    | Default for most associations (`@ManyToOne`, `@OneToMany`).     | Can be explicitly specified (`fetch = FetchType.EAGER`).         |
| **Performance Impact**    | Reduces the number of queries if associations are not accessed. | May result in more queries and fetching more data than needed.   |
| **Potential Issues**      | `LazyInitializationException` if accessed outside of session.   | Fetching unnecessary data can impact performance (e.g., N+1 problem). |
| **Session Management**    | Session must remain open until the lazy-loaded data is accessed. | No session issues as data is fetched at the time of entity loading. |

### **When to Use Lazy Loading vs. Eager Loading**:

- **Use Lazy Loading when**:
  - You do not need the associated entities immediately or always.
  - You want to optimize performance by reducing the number of queries when associations are not needed.
  - You are sure that the associated entities will only be accessed during the session's lifecycle.

- **Use Eager Loading when**:
  - You need the associated entities immediately when you load the parent entity.
  - You want to avoid lazy loading issues (e.g., `LazyInitializationException`) or reduce the number of queries.
  - The associated entities are always needed and fetching them later would incur unnecessary overhead.

### **Example of N+1 Problem**:
The N+1 problem occurs when using lazy loading in a loop, leading to multiple queries being sent to the database. For instance:

```java
// Lazy Loading Example
List<Author> authors = session.createQuery("FROM Author", Author.class).list();
for (Author author : authors) {
    // Each access to 'author.getBooks()' triggers a new SQL query
    System.out.println(author.getBooks());  // N queries for N authors
}
```

In the above example, if there are 10 authors, it would result in 11 queries: 1 for the authors and 10 additional ones for the books. This is an example of the **N+1 problem**.

To fix this, **eager loading** or using **JOIN FETCH** can be used to load everything in one query:
```java
List<Author> authors = session.createQuery("SELECT a FROM Author a JOIN FETCH a.books", Author.class).list();
```

This will load all authors and their books in one query.