Here are the key differences between `let`, `const`, and `var` in terms of **scope** and **reassignability**:

### 1. **Scope**:
   - **`var`:**
     - Function-scoped: Variables declared with `var` are scoped to the nearest function. If declared outside a function, they are globally scoped.
     - `var` does not respect block scope (e.g., within `if`, `for`, or `while` blocks). The variable is accessible outside the block.
   - **`let`:**
     - Block-scoped: Variables declared with `let` are confined to the block in which they are declared, including `{}` inside `if`, `for`, etc.
   - **`const`:**
     - Also block-scoped, like `let`. It is confined to the block where it is declared.

   **Example:**
   ```javascript
   if (true) {
       var a = 10;
       let b = 20;
       const c = 30;
   }
   console.log(a); // 10 (accessible because var is function-scoped)
   console.log(b); // ReferenceError (block-scoped)
   console.log(c); // ReferenceError (block-scoped)
   ```

---

### 2. **Reassignability**:
   - **`var`:**
     - Can be reassigned and redeclared within the same scope.
     - Example:
       ```javascript
       var x = 1;
       var x = 2; // Redeclaration allowed
       x = 3; // Reassignment allowed
       console.log(x); // 3
       ```
   - **`let`:**
     - Can be reassigned but **cannot** be redeclared in the same scope.
     - Example:
       ```javascript
       let y = 1;
       // let y = 2; // SyntaxError: Identifier 'y' has already been declared
       y = 3; // Reassignment allowed
       console.log(y); // 3
       ```
   - **`const`:**
     - **Cannot be reassigned or redeclared** after the initial assignment. The variable becomes read-only. 
     - However, if the variable refers to an object or array, the contents of that object or array **can** be modified (but not the reference itself).
     - Example:
       ```javascript
       const z = 1;
       // z = 2; // TypeError: Assignment to constant variable
       
       const arr = [1, 2];
       arr.push(3); // Allowed (modifying array content)
       console.log(arr); // [1, 2, 3]
       ```

---

### 3. **Hoisting**:
   - **`var`:**
     - Variables declared with `var` are hoisted to the top of their scope and initialized with `undefined`.
     - Example:
       ```javascript
       console.log(a); // undefined (hoisted, but not yet assigned a value)
       var a = 10;
       ```
   - **`let` and `const`:**
     - Variables are hoisted but remain in the "Temporal Dead Zone" (TDZ) until the declaration is encountered. Accessing them before declaration results in a `ReferenceError`.
     - Example:
       ```javascript
       console.log(b); // ReferenceError (in TDZ)
       let b = 20;

       console.log(c); // ReferenceError (in TDZ)
       const c = 30;
       ```

---

### Summary Table:

| Feature         | `var`                  | `let`                  | `const`                |
|------------------|------------------------|------------------------|------------------------|
| Scope           | Function-scoped        | Block-scoped           | Block-scoped           |
| Reassignment    | Allowed               | Allowed               | Not allowed            |
| Redeclaration   | Allowed               | Not allowed           | Not allowed            |
| Hoisting        | Yes (initialized to `undefined`) | Yes (TDZ* applies) | Yes (TDZ* applies)      | 

* TDZ = "Temporal Dead Zone" (TDZ)


`let` and `const` are generally preferred over `var` due to better scoping rules and safer usage in modern JavaScript.