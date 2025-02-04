Certainly. Here's a **realistic microservices use case** where I used the **Builder Pattern** to solve a practical problem.

---

### ✅ **Use Case: Consistent API Response Builder**

#### 🔹 **Context**:

In a microservices-based architecture, we had multiple REST services (auth, user, payment, order, etc.) and wanted a **standardized JSON response format** across all services.

---

#### 🔹 **Challenge**:

Each service was returning responses with different keys or structure. This made integration harder and broke front-end contracts often.

---

#### 🔹 **Solution**:

We implemented a **`ResponseBuilder` utility using the Builder Pattern**, used by all controllers in all microservices.

---

### 🧱 Example Structure

#### ✅ Common Response DTO:

```java
public class ApiResponse<T> {
    private int status;
    private String message;
    private T data;
    private Map<String, Object> meta;

    // private constructor
    private ApiResponse(Builder<T> builder) {
        this.status = builder.status;
        this.message = builder.message;
        this.data = builder.data;
        this.meta = builder.meta;
    }

    public static class Builder<T> {
        private int status;
        private String message;
        private T data;
        private Map<String, Object> meta = new HashMap<>();

        public Builder<T> status(int status) {
            this.status = status;
            return this;
        }

        public Builder<T> message(String message) {
            this.message = message;
            return this;
        }

        public Builder<T> data(T data) {
            this.data = data;
            return this;
        }

        public Builder<T> addMeta(String key, Object value) {
            this.meta.put(key, value);
            return this;
        }

        public ApiResponse<T> build() {
            return new ApiResponse<>(this);
        }
    }

    // Getters (or use Lombok)
}
```

---

### 🔍 Example Usage in Controller

```java
@GetMapping("/orders/{id}")
public ResponseEntity<ApiResponse<Order>> getOrder(@PathVariable Long id) {
    Order order = orderService.getOrderById(id);

    ApiResponse<Order> response = new ApiResponse.Builder<Order>()
        .status(200)
        .message("Order fetched successfully")
        .data(order)
        .addMeta("timestamp", LocalDateTime.now())
        .addMeta("service", "order-service")
        .build();

    return ResponseEntity.ok(response);
}
```

---

### ✅ **Benefits Observed**

* Unified response format across microservices.
* Easy to extend (e.g., add traceId, debugInfo).
* Helped frontend parse responses predictably.
* Reduced duplicated response-building logic.

---

Let me know if you want me to generate a complete working example or OpenAPI/Swagger integration with this response structure.
