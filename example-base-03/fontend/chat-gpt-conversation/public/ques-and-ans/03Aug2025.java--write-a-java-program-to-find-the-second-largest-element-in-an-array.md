Here's a simple Java program to find the **second largest element** in an array:

```java
public class SecondLargestElement {
    public static int findSecondLargest(int[] arr) {
        if (arr == null || arr.length < 2) {
            throw new IllegalArgumentException("Array must contain at least two elements.");
        }

        int first = Integer.MIN_VALUE;
        int second = Integer.MIN_VALUE;

        for (int num : arr) {
            if (num > first) {
                second = first;
                first = num;
            } else if (num > second && num != first) {
                second = num;
            }
        }

        if (second == Integer.MIN_VALUE) {
            throw new RuntimeException("No second largest element found.");
        }

        return second;
    }

    public static void main(String[] args) {
        int[] numbers = {10, 30, 20, 50, 40};
        int secondLargest = findSecondLargest(numbers);
        System.out.println("Second largest element: " + secondLargest);
    }
}
```

### Sample Output:

```
Second largest element: 40
```

Let me know if you want the code to handle duplicates or sorted arrays.


---
---

# with java8+ 

Here’s a **Java 8+ version** using Streams to find the second largest element in an array:

```java
import java.util.Arrays;
import java.util.Comparator;
import java.util.OptionalInt;

public class SecondLargestStream {
    public static void main(String[] args) {
        int[] numbers = {10, 30, 20, 50, 40};

        OptionalInt secondLargest = Arrays.stream(numbers)
            .boxed()
            .distinct()
            .sorted(Comparator.reverseOrder())
            .skip(1)
            .mapToInt(Integer::intValue)
            .findFirst();

        if (secondLargest.isPresent()) {
            System.out.println("Second largest element: " + secondLargest.getAsInt());
        } else {
            System.out.println("Second largest element not found.");
        }
    }
}
```

### Key Features:

* Uses `boxed()` to convert `int` to `Integer`
* Removes duplicates via `distinct()`
* Sorts in descending order
* Skips the first (largest) element
* Takes the next one as the second largest

Let me know if you'd like a version handling `List<Integer>` instead.
