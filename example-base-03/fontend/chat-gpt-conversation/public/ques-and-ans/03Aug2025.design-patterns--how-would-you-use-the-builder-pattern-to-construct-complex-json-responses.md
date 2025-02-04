You can use the **Builder Pattern** in Java to construct complex JSON responses cleanly, especially when building structured or nested responses dynamically. Here's how:

---

### ✅ Step-by-Step: Builder Pattern for JSON

#### 1. **Create a Response DTO with Builder**

```java
public class JsonResponse {
    private final int status;
    private final String message;
    private final Object data;
    private final Object meta;

    private JsonResponse(Builder builder) {
        this.status = builder.status;
        this.message = builder.message;
        this.data = builder.data;
        this.meta = builder.meta;
    }

    public static class Builder {
        private int status;
        private String message;
        private Object data;
        private Object meta;

        public Builder status(int status) {
            this.status = status;
            return this;
        }

        public Builder message(String message) {
            this.message = message;
            return this;
        }

        public Builder data(Object data) {
            this.data = data;
            return this;
        }

        public Builder meta(Object meta) {
            this.meta = meta;
            return this;
        }

        public JsonResponse build() {
            return new JsonResponse(this);
        }
    }

    // Getters here (or use Lombok's @Getter)
}
```

---

#### 2. **Use the Builder in a Controller**

```java
@GetMapping("/student/{id}")
public ResponseEntity<JsonResponse> getStudent(@PathVariable int id) {
    Student student = studentService.findById(id);

    Map<String, Object> metadata = new HashMap<>();
    metadata.put("timestamp", LocalDateTime.now());
    metadata.put("version", "v1");

    JsonResponse response = new JsonResponse.Builder()
        .status(200)
        .message("Student found")
        .data(student)
        .meta(metadata)
        .build();

    return ResponseEntity.ok(response);
}
```

---

### ✅ Output Example

```json
{
  "status": 200,
  "message": "Student found",
  "data": {
    "id": 1,
    "name": "Prem"
  },
  "meta": {
    "timestamp": "2025-08-01T19:15:30",
    "version": "v1"
  }
}
```

---

### ✅ Tips

* Use `@JsonInclude(Include.NON_NULL)` to avoid nulls in JSON (from Jackson).
* You can use Lombok to reduce boilerplate: `@Builder`, `@Getter`, etc.

Would you like me to provide the Lombok version?
