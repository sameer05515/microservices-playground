### Optimizing Performance in React with `React.memo`

`React.memo` is a higher-order component (HOC) that optimizes functional components by memoizing their rendered output. It prevents unnecessary re-renders when the component's props have not changed.

---

### **How `React.memo` Works**
- It shallowly compares the current props with the previous props.
- If the props are the same, React skips rendering the component and reuses the last rendered result.
- If the props change, the component re-renders.

---

### **Syntax**
```javascript
const MemoizedComponent = React.memo(Component);
```

---

### **Example: Without `React.memo`**
In this example, the `ChildComponent` re-renders even when its props do not change.

```javascript
import React, { useState } from "react";

const ChildComponent = ({ value }) => {
  console.log("ChildComponent rendered");
  return <div>Value: {value}</div>;
};

const ParentComponent = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Increment Count</button>
      <ChildComponent value="Static Value" />
    </div>
  );
};

export default ParentComponent;
```

**Output**:  
Even though `ChildComponent` receives the same `value` prop, it re-renders every time `ParentComponent` re-renders.

---

### **Example: With `React.memo`**
Using `React.memo`, the `ChildComponent` skips re-rendering when its props do not change.

```javascript
import React, { useState } from "react";

const ChildComponent = React.memo(({ value }) => {
  console.log("ChildComponent rendered");
  return <div>Value: {value}</div>;
});

const ParentComponent = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Increment Count</button>
      <ChildComponent value="Static Value" />
    </div>
  );
};

export default ParentComponent;
```

**Output**:  
`ChildComponent rendered` is logged only once because `value` remains unchanged.

---

### **Custom Comparison Function**
By default, `React.memo` uses shallow comparison. For complex props, you can provide a custom comparison function.

#### **Syntax**
```javascript
React.memo(Component, areEqual);
```

#### **Example: Using a Custom Comparison Function**
```javascript
const ChildComponent = React.memo(
  ({ value }) => {
    console.log("ChildComponent rendered");
    return <div>Value: {value.text}</div>;
  },
  (prevProps, nextProps) => prevProps.value.text === nextProps.value.text
);

const ParentComponent = () => {
  const [count, setCount] = useState(0);
  const value = { text: "Static Text" };

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Increment Count</button>
      <ChildComponent value={value} />
    </div>
  );
};
```

**Output**:  
The `ChildComponent` does not re-render because the custom comparison function ensures `value.text` is unchanged.

---

### **When to Use `React.memo`**
1. **Props rarely change**: If a component frequently receives the same props.
2. **Expensive renders**: When the component involves costly rendering logic.
3. **Static data**: When passing static or memoized props.

---

### **Caveats**
1. **Avoid premature optimization**: Use `React.memo` only when performance issues are observed.
2. **Shallow comparison**: By default, it works well only with primitive or shallowly comparable props.
3. **Nested props**: Use `React.memo` with caution if props contain deeply nested structures. You might need custom comparison.

---

### **Best Practices**
- Combine `React.memo` with `useMemo` or `useCallback` for passing stable props and functions.
- Ensure the component renders for minimal prop changes.
- Profile your application to identify performance bottlenecks before applying optimizations.