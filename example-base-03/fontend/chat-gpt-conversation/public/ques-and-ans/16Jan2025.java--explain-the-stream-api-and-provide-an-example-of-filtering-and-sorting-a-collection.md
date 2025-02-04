### **Stream API in Java**

The **Stream API**, introduced in **Java 8**, is used to process collections of data in a declarative and functional style. It allows you to perform operations such as **filtering**, **mapping**, **sorting**, and **collecting** data in a concise and efficient manner.

### **Key Features of Stream API**
1. **Declarative**: Focus on "what to do" rather than "how to do."
2. **Functional Programming**: Works with lambda expressions and functional interfaces.
3. **Lazy Evaluation**: Operations are evaluated only when a terminal operation (e.g., `collect`) is invoked.
4. **Parallel Processing**: Supports parallel execution using `parallelStream`.

---

### **Basic Stream Workflow**
A Stream workflow involves three steps:
1. **Source**: A data source (e.g., collection, array, I/O channels).
2. **Intermediate Operations**: Operations like `filter`, `map`, or `sorted` to process the data.
3. **Terminal Operations**: Operations like `collect`, `forEach`, or `reduce` that produce the final result.

---

### **Example: Filtering and Sorting a Collection**

#### Problem
Filter a list of strings to include only those starting with the letter 'A' and sort them alphabetically.

#### Code Implementation
```java
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class StreamExample {
    public static void main(String[] args) {
        // Data source: List of names
        List<String> names = Arrays.asList("Alice", "Bob", "Andrew", "Charlie", "Amanda");

        // Filtering and sorting using Stream API
        List<String> filteredAndSortedNames = names.stream()
            .filter(name -> name.startsWith("A")) // Filter names starting with 'A'
            .sorted() // Sort alphabetically
            .collect(Collectors.toList()); // Collect the results into a list

        // Print the result
        System.out.println(filteredAndSortedNames);
    }
}
```

#### Output
```
[Alice, Amanda, Andrew]
```

---

### **Explanation**
1. **Source**: `names.stream()` creates a Stream from the list of names.
2. **Intermediate Operations**:
   - `filter(name -> name.startsWith("A"))`: Keeps only names starting with 'A'.
   - `sorted()`: Sorts the filtered names in natural (lexicographical) order.
3. **Terminal Operation**:
   - `collect(Collectors.toList())`: Collects the final result into a new list.

---

### **Another Example: Filtering, Mapping, and Sorting Integers**
#### Problem
Filter numbers greater than 10, double their values, and sort them in descending order.

#### Code Implementation
```java
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class StreamExample {
    public static void main(String[] args) {
        // Data source: List of integers
        List<Integer> numbers = Arrays.asList(5, 20, 15, 8, 25, 10);

        // Stream processing
        List<Integer> processedNumbers = numbers.stream()
            .filter(num -> num > 10) // Filter numbers greater than 10
            .map(num -> num * 2) // Double the values
            .sorted((a, b) -> b - a) // Sort in descending order
            .collect(Collectors.toList()); // Collect the results into a list

        // Print the result
        System.out.println(processedNumbers);
    }
}
```

#### Output
```
[50, 40, 30]
```

---

### **Benefits of Stream API**
- Reduces boilerplate code.
- Encourages functional programming practices.
- Makes code more readable and expressive.
- Optimized for performance using lazy evaluation and parallelism.

The Stream API is an essential tool in modern Java development for processing large datasets effectively and elegantly.