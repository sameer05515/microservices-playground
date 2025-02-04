### **Lambda Expressions**

Lambda expressions are a concise way to represent anonymous functions. They were introduced in **Java 8** to provide a simpler and more readable syntax for implementing functional interfaces (interfaces with a single abstract method). Lambda expressions enable functional programming features and make the code more concise and expressive.

#### **Syntax**
```java
(parameters) -> expression
// or
(parameters) -> { statements }
```

#### **Example**
Using a lambda expression to implement the `Runnable` interface:
```java
Runnable task = () -> System.out.println("Task executed using lambda!");
new Thread(task).start();
```

---

### **Anonymous Classes**

Anonymous classes are a mechanism to create a class and an instance of that class at the same time, without explicitly defining a new named class. They are used to provide specific implementations of an interface or abstract class.

#### **Syntax**
```java
new InterfaceOrAbstractClass() {
    // Implementation of abstract methods
};
```

#### **Example**
Using an anonymous class to implement the `Runnable` interface:
```java
Runnable task = new Runnable() {
    @Override
    public void run() {
        System.out.println("Task executed using anonymous class!");
    }
};
new Thread(task).start();
```

---

### **Key Differences Between Lambda Expressions and Anonymous Classes**

| **Aspect**              | **Lambda Expressions**                                                                                             | **Anonymous Classes**                                                                                           |
|--------------------------|--------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------|
| **Introduced in**        | Java 8                                                                                                            | Java 1.1                                                                                                       |
| **Purpose**              | To provide a concise way of implementing functional interfaces.                                                   | To provide inline implementation of an interface or abstract class with multiple methods.                     |
| **Syntax**               | Compact and expressive.                                                                                           | Verbose compared to lambda expressions.                                                                        |
| **Target**               | Functional interfaces (interfaces with a single abstract method).                                                 | Interfaces and abstract classes with one or more methods.                                                     |
| **`this` Keyword**       | Refers to the enclosing context where the lambda is defined.                                                      | Refers to the anonymous class instance.                                                                        |
| **Scope of Methods**     | Only single-method implementations are supported.                                                                 | Can implement multiple methods if the target is an interface or abstract class with multiple methods.          |
| **Performance**          | Better runtime performance due to reduced overhead (implemented as invokedynamic bytecode instructions).          | Slightly higher runtime overhead since an anonymous inner class generates a separate .class file.              |
| **Readability**          | Enhances readability and reduces boilerplate.                                                                     | Can make the code verbose and harder to read when implementing simple functionality.                           |

---

### **Use Cases**

1. **Lambda Expressions**:
   - Use when working with functional interfaces like `Runnable`, `Callable`, `Comparator`, or custom functional interfaces.
   - Example: Sorting a list:
     ```java
     List<String> names = Arrays.asList("Alice", "Bob", "Charlie");
     names.sort((a, b) -> a.compareTo(b)); // Lambda expression for Comparator
     ```

2. **Anonymous Classes**:
   - Use when:
     - You need to implement multiple methods of an interface.
     - You need to access `this` referring to the anonymous class instance.
     - The implementation requires more than what a single functional interface can provide.
   - Example:
     ```java
     Button button = new Button();
     button.setOnClickListener(new OnClickListener() {
         @Override
         public void onClick(View v) {
             System.out.println("Button clicked!");
         }
     });
     ```

### **Conclusion**
- **Lambda expressions** are preferred for concise implementations of functional interfaces, making the code more readable and modern.
- **Anonymous classes** are useful when a more complex implementation is needed, especially if multiple methods must be overridden.