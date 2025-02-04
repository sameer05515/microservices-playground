Here’s a **Java 8+ program** to remove duplicates from an array using `Stream` API:

```java
import java.util.Arrays;

public class RemoveDuplicates {
    public static void main(String[] args) {
        int[] array = {1, 3, 5, 3, 1, 7, 9, 5};

        int[] uniqueArray = Arrays.stream(array)
                                  .distinct()
                                  .toArray();

        System.out.println("Array without duplicates: " + Arrays.toString(uniqueArray));
    }
}
```

### Output:

```
Array without duplicates: [1, 3, 5, 7, 9]
```

Let me know if you want the result as a `List<Integer>` or to preserve insertion order.


---
---

# preserve insertion order

To **remove duplicates while preserving insertion order**, you can collect elements into a `LinkedHashSet`. Here's a **Java 8+** version:

```java
import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.stream.Collectors;

public class RemoveDuplicatesPreserveOrder {
    public static void main(String[] args) {
        int[] array = {1, 3, 5, 3, 1, 7, 9, 5};

        Set<Integer> result = Arrays.stream(array)
                                    .boxed()
                                    .collect(Collectors.toCollection(LinkedHashSet::new));

        System.out.println("Array without duplicates (in order): " + result);
    }
}
```

### Output:

```
Array without duplicates (in order): [1, 3, 5, 7, 9]
```
