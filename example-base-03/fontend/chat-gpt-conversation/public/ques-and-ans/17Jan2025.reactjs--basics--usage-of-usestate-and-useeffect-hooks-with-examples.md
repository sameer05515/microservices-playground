### `useState` and `useEffect` Hooks in React

The `useState` and `useEffect` hooks are two fundamental building blocks in modern React functional components.

---

### **`useState` Hook**
- **Purpose**: Adds state to a functional component.
- **Syntax**:
  ```javascript
  const [state, setState] = useState(initialValue);
  ```
- **Parameters**:
  1. `initialValue`: The initial value of the state (e.g., number, string, array, object, etc.).
  2. `state`: The current state value.
  3. `setState`: A function to update the state.

#### **Example: Counter**
```javascript
import React, { useState } from "react";

const Counter = () => {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
};

export default Counter;
```

---

### **`useEffect` Hook**
- **Purpose**: Handles side effects (e.g., fetching data, subscribing to events, timers) in functional components.
- **Syntax**:
  ```javascript
  useEffect(effectFunction, [dependencies]);
  ```
- **Parameters**:
  1. `effectFunction`: A function containing the side-effect logic. It can return a cleanup function (optional).
  2. `[dependencies]` (optional): An array of dependencies that determine when the effect should re-run.
     - **No dependencies**: Runs on every render.
     - **Empty array `[]`**: Runs only on the initial render.
     - **Specific dependencies**: Runs when any dependency changes.

#### **Example: Fetching Data**
```javascript
import React, { useState, useEffect } from "react";

const FetchData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts");
      const result = await response.json();
      setData(result);
      setLoading(false);
    };

    fetchData();
  }, []); // Empty array means this effect runs once, after the initial render.

  if (loading) return <p>Loading...</p>;

  return (
    <ul>
      {data.map((item) => (
        <li key={item.id}>{item.title}</li>
      ))}
    </ul>
  );
};

export default FetchData;
```

---

### **Combined Example: Counter with Side Effects**
A counter component that logs the count to the console every time it changes.

```javascript
import React, { useState, useEffect } from "react";

const CounterWithEffect = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log(`Count updated: ${count}`);
    return () => {
      console.log("Cleanup on count change or unmount.");
    };
  }, [count]); // Effect runs only when `count` changes.

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};

export default CounterWithEffect;
```

---

### **Key Points to Remember**
1. **`useState`**:
   - Used for managing local state in functional components.
   - The state updates trigger a re-render.

2. **`useEffect`**:
   - Manages side effects in functional components.
   - Cleanup functions ensure resources like timers or subscriptions are properly released.

3. **Best Practices**:
   - Use multiple `useEffect` hooks for unrelated side effects.
   - Keep dependency arrays accurate to avoid unnecessary effect executions or stale closures.