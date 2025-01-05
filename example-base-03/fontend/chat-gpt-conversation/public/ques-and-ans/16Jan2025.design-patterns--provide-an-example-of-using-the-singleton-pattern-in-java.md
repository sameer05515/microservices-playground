The **Singleton pattern** ensures that a class has only one instance and provides a global point of access to that instance. This pattern is particularly useful when exactly one object is needed to coordinate actions across the system, such as in logging, thread pools, or database connections.

### Key Characteristics of Singleton:
1. **Private constructor**: Prevents other classes from creating new instances.
2. **Static variable**: Holds the unique instance.
3. **Public method**: Provides access to the instance.

Here’s an example of implementing the Singleton pattern in Java:

### Example: Singleton Pattern (Thread-Safe)

```java
public class Singleton {

    // 1. Private static variable that holds the only instance of the class
    private static Singleton instance;

    // 2. Private constructor to prevent instantiation from other classes
    private Singleton() {
        // Private constructor ensures that an object cannot be created directly
    }

    // 3. Public static method to provide access to the unique instance
    public static Singleton getInstance() {
        // 4. Thread-safe instance creation with synchronized block
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) {
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }

    // Example method
    public void showMessage() {
        System.out.println("Hello from Singleton!");
    }
}
```

### Explanation:
1. **Private static instance**: The `instance` variable is declared as `private static` to hold the single instance of the class.
2. **Private constructor**: The constructor is private to prevent other classes from creating a new instance using the `new` keyword.
3. **Public method (`getInstance`)**: This is the method that returns the instance of the `Singleton` class. The method ensures that only one instance is created (and reused). The method uses double-check locking (`synchronized` block inside the `if` condition) to make the creation thread-safe while avoiding synchronization overhead once the instance is created.

### Example Usage:

```java
public class Main {
    public static void main(String[] args) {
        // Accessing the Singleton instance
        Singleton singleton1 = Singleton.getInstance();
        Singleton singleton2 = Singleton.getInstance();

        // Both references point to the same object
        singleton1.showMessage();
        System.out.println("Are both instances the same? " + (singleton1 == singleton2));
    }
}
```

### Output:

```
Hello from Singleton!
Are both instances the same? true
```

### Key Points:
- **Lazy Initialization**: The instance is created only when it is needed (i.e., when `getInstance()` is called for the first time).
- **Thread-Safety**: The `synchronized` block ensures that only one thread can initialize the instance at a time, which is important in a multi-threaded environment.
- **Performance**: Double-check locking minimizes the performance overhead of synchronization once the instance is initialized.