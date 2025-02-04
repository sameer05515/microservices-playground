### **Differences Between `useMemo` and `useCallback`**

Both `useMemo` and `useCallback` are React hooks used for optimization by memoizing values or functions, but they have distinct purposes.

---

### **1. Purpose**
- **`useMemo`**: Memoizes the **result of a computation**.
- **`useCallback`**: Memoizes the **function itself**.

---

### **2. Syntax**
- **`useMemo`**: 
  ```javascript
  const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
  ```
  - Recomputes the value only if `a` or `b` changes.

- **`useCallback`**:
  ```javascript
  const memoizedCallback = useCallback(() => doSomething(a, b), [a, b]);
  ```
  - Returns a memoized function that changes only when `a` or `b` changes.

---

### **3. Key Differences**
| Feature          | `useMemo`                                   | `useCallback`                              |
|-------------------|---------------------------------------------|--------------------------------------------|
| **Primary Use**   | Memoize the result of a computation.         | Memoize a callback function.               |
| **Return Type**   | Returns a value.                            | Returns a memoized function.               |
| **Common Use**    | Avoid expensive recalculations.             | Prevent unnecessary re-creation of functions passed as props. |
| **When to Use**   | Computationally heavy operations.           | When passing callbacks to child components. |

---

### **Examples**

#### **Example 1: `useMemo` to Optimize Computation**
```javascript
import React, { useState, useMemo } from "react";

const ExpensiveComponent = ({ count }) => {
  const computeExpensiveValue = (num) => {
    console.log("Computing...");
    return num * 2;
  };

  const memoizedValue = useMemo(() => computeExpensiveValue(count), [count]);

  return (
    <div>
      <h1>Count: {count}</h1>
      <h2>Computed Value: {memoizedValue}</h2>
    </div>
  );
};

export default function App() {
  const [count, setCount] = useState(0);
  const [other, setOther] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Increment Count</button>
      <button onClick={() => setOther(other + 1)}>Increment Other</button>
      <ExpensiveComponent count={count} />
    </div>
  );
}
```
**Behavior**: The computation runs only when `count` changes, not when `other` changes.

---

#### **Example 2: `useCallback` to Optimize Callback Passing**
```javascript
import React, { useState, useCallback } from "react";

const ChildComponent = React.memo(({ onClick }) => {
  console.log("Child rendered");
  return <button onClick={onClick}>Click Me</button>;
});

export default function App() {
  const [count, setCount] = useState(0);

  const memoizedCallback = useCallback(() => {
    console.log("Button clicked");
  }, []);

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>Increment Count</button>
      <ChildComponent onClick={memoizedCallback} />
    </div>
  );
}
```
**Behavior**: The `ChildComponent` does not re-render unnecessarily because the `onClick` function remains stable across renders.

---

### **When to Use Each Hook**
- **`useMemo`**: Use for **computationally heavy calculations** or **derived data** that should not recompute unnecessarily.
- **`useCallback`**: Use when **passing callbacks to child components**, especially if the child is wrapped in `React.memo`.

---

### **Combined Usage**
Both hooks can be used together for optimal performance.

```javascript
import React, { useState, useMemo, useCallback } from "react";

const List = React.memo(({ items, onItemClick }) => {
  console.log("List rendered");
  return (
    <ul>
      {items.map((item, idx) => (
        <li key={idx} onClick={() => onItemClick(item)}>
          {item}
        </li>
      ))}
    </ul>
  );
});

export default function App() {
  const [count, setCount] = useState(0);

  const items = useMemo(() => ["Apple", "Banana", "Cherry"], []);
  const handleItemClick = useCallback((item) => {
    console.log(`Clicked: ${item}`);
  }, []);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Increment Count</button>
      <List items={items} onItemClick={handleItemClick} />
    </div>
  );
}
```
**Behavior**: Both `List` and `handleItemClick` are optimized and do not cause unnecessary renders.

---

### **Summary**
- Use `useMemo` for **values** that require optimization.
- Use `useCallback` for **functions** passed to child components to avoid unnecessary renders.