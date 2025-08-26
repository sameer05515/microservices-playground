To implement the **Builder Pattern for constructing immutable objects in Java**, follow these steps:

---

### ✅ Key Characteristics:

* The target class must be `final` (or all fields `private final`)
* No setters.
* Object fields set only via `Builder`.

---

### 📌 Example: Immutable `User` class using Builder

```java
public final class User {
    private final String name;
    private final int age;
    private final String email;

    private User(Builder builder) {
        this.name = builder.name;
        this.age = builder.age;
        this.email = builder.email;
    }

    public String getName() { return name; }
    public int getAge() { return age; }
    public String getEmail() { return email; }

    public static class Builder {
        private String name;
        private int age;
        private String email;

        public Builder name(String name) {
            this.name = name;
            return this;
        }

        public Builder age(int age) {
            this.age = age;
            return this;
        }

        public Builder email(String email) {
            this.email = email;
            return this;
        }

        public User build() {
            return new User(this);
        }
    }

    @Override
    public String toString() {
        return "User{name='" + name + "', age=" + age + ", email='" + email + "'}";
    }
}
```

---

### 🧪 Usage:

```java
public class Main {
    public static void main(String[] args) {
        User user = new User.Builder()
                        .name("Alice")
                        .age(28)
                        .email("alice@example.com")
                        .build();

        System.out.println(user);
    }
}
```

---

### ✅ Advantages:

* **Immutable**: Once constructed, the object can't be modified.
* **Thread-safe**: No setters or mutation — safe for concurrent use.
* **Readable construction**: Easy to create instances with fluent API.

Let me know if you want a Lombok version or nested builders for complex objects.
