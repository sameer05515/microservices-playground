### **Creating and Handling a Custom Exception in Java**

Custom exceptions in Java allow developers to create meaningful and application-specific error handling. A custom exception class should extend the `Exception` class (for checked exceptions) or the `RuntimeException` class (for unchecked exceptions).

---

### **Steps to Create and Handle a Custom Exception**

#### **1. Create a Custom Exception**
- Define a new class that extends `Exception` or `RuntimeException`.
- Add constructors for flexibility (e.g., default, with message, with cause).

#### Example
```java
// Custom checked exception
public class InvalidAgeException extends Exception {
    // Default constructor
    public InvalidAgeException() {
        super("Invalid age provided");
    }

    // Constructor with custom message
    public InvalidAgeException(String message) {
        super(message);
    }

    // Constructor with custom message and cause
    public InvalidAgeException(String message, Throwable cause) {
        super(message, cause);
    }
}
```

---

#### **2. Throw the Custom Exception**
- Use the `throw` keyword to explicitly throw the exception when a condition is met.

#### Example
```java
public class AgeValidator {
    public static void validateAge(int age) throws InvalidAgeException {
        if (age < 18) {
            throw new InvalidAgeException("Age must be 18 or older");
        }
        System.out.println("Age is valid");
    }
}
```

---

#### **3. Handle the Custom Exception**
- Use a `try-catch` block to catch the exception and take appropriate action.

#### Example
```java
public class Main {
    public static void main(String[] args) {
        try {
            AgeValidator.validateAge(15);
        } catch (InvalidAgeException e) {
            System.out.println("Exception caught: " + e.getMessage());
        }
    }
}
```

#### Output
```
Exception caught: Age must be 18 or older
```

---

### **Custom Unchecked Exception**
If you want the exception to be optional for catching, extend the `RuntimeException` class instead.

#### Example
```java
public class InvalidNameException extends RuntimeException {
    public InvalidNameException(String message) {
        super(message);
    }
}

// Throwing the unchecked exception
public class NameValidator {
    public static void validateName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new InvalidNameException("Name cannot be null or empty");
        }
        System.out.println("Name is valid");
    }
}

// Usage
public class Main {
    public static void main(String[] args) {
        NameValidator.validateName(""); // No need to handle explicitly
    }
}
```

#### Output
```
Exception in thread "main" InvalidNameException: Name cannot be null or empty
```

---

### **When to Use Checked vs. Unchecked Exceptions**
- **Checked Exceptions**: For recoverable conditions (e.g., file not found, invalid input). The caller is forced to handle them.
- **Unchecked Exceptions**: For programming errors or conditions that are unlikely to be recoverable (e.g., null pointers, illegal arguments).

---

### **Best Practices**
1. **Meaningful Names**: Use descriptive names like `InvalidAgeException` or `ResourceNotFoundException`.
2. **Custom Message**: Provide a clear message to make debugging easier.
3. **Reuse Existing Exceptions**: Avoid custom exceptions if a standard one (e.g., `IllegalArgumentException`) fits.
4. **Avoid Overuse**: Use custom exceptions only when they add value and context to the error.

Custom exceptions make your code more expressive and help convey domain-specific issues effectively.