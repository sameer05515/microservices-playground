Here's an example of a Spring Boot `@RestController` with both `@GetMapping` and `@PostMapping` to demonstrate how you can handle GET and POST requests.

### Sample Code

```java
package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    private final List<String> items = new ArrayList<>();

    // GET endpoint to retrieve all items
    @GetMapping
    public List<String> getAllItems() {
        return items;
    }

    // POST endpoint to add a new item
    @PostMapping
    public String addItem(@RequestBody String item) {
        items.add(item);
        return "Item added successfully!";
    }

    // GET endpoint to retrieve a specific item by index
    @GetMapping("/{index}")
    public String getItem(@PathVariable int index) {
        if (index >= 0 && index < items.size()) {
            return items.get(index);
        } else {
            return "Item not found!";
        }
    }
}
```

---

### Explanation

1. **Annotations Used:**
   - `@RestController`: Marks the class as a controller where every method returns a JSON response.
   - `@RequestMapping`: Maps the base URL for the controller (`/api/items` in this case).
   - `@GetMapping`: Maps HTTP GET requests to specific methods.
   - `@PostMapping`: Maps HTTP POST requests to specific methods.
   - `@RequestBody`: Binds the request body to a method parameter.
   - `@PathVariable`: Extracts a value from the URL path.

2. **Endpoints:**
   - **GET `/api/items`**: Returns a list of all items.
   - **POST `/api/items`**: Adds a new item to the list. The item is provided in the request body.
   - **GET `/api/items/{index}`**: Retrieves a specific item based on its index.

---

### Testing the API

#### Using **curl** or a tool like **Postman**:

1. **Add an item** (POST request):
   ```bash
   curl -X POST -H "Content-Type: application/json" -d '"Apple"' http://localhost:8080/api/items
   ```

2. **Get all items** (GET request):
   ```bash
   curl http://localhost:8080/api/items
   ```

3. **Get a specific item by index** (GET request):
   ```bash
   curl http://localhost:8080/api/items/0
   ```

---

This simple example showcases the basic functionality of a RESTful API using Spring Boot. You can enhance it further by adding proper exception handling, validation, and other advanced features.