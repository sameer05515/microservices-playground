The **Builder Pattern** offers several advantages over **telescoping constructors**, especially when dealing with classes that have multiple optional parameters.

### ✅ Advantages of Builder Pattern:

1. **Improved Readability:**

   ```java
   new User.Builder("Prem")
       .age(30)
       .email("prem@example.com")
       .phone("1234567890")
       .build();
   ```

   vs

   ```java
   new User("Prem", 30, "prem@example.com", "1234567890"); // Which param is what?
   ```

2. **Avoids Constructor Explosion:**

   * Telescoping constructors require a constructor for every combination of parameters.
   * Builder avoids this by allowing flexible setting of fields.

3. **Immutability:**

   * Builder helps in creating immutable objects more cleanly, by setting all final fields only once at construction.

4. **Better Validation:**

   * You can add validation logic before calling `build()` to ensure the object is always in a valid state.

5. **Scalability:**

   * Easier to maintain and extend — adding a new optional field doesn’t require adding more constructors.

6. **Optional Parameters Handling:**

   * Great for objects where many parameters are optional and some must be set.

### Summary:

* Use **Builder** when a class has many parameters (especially optional ones).
* Use **constructor** when a class has a few mandatory parameters.
