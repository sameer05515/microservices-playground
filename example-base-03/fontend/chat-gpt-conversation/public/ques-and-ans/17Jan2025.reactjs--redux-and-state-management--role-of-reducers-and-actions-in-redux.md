### **Role of Reducers and Actions in Redux**

Redux is a state management library that uses a unidirectional data flow and is based on a predictable state container. At its core, it revolves around **actions** and **reducers** to manage the state of an application.

---

### **1. Actions**
An **action** is a plain JavaScript object that describes what you want to do. Actions are the only way to interact with the Redux store and convey information about what happened in the application.

#### **Key Characteristics**
- Must have a `type` property (a string constant that describes the action).
- Can contain additional data (`payload`) to pass along information.

#### **Example**
```javascript
const incrementAction = {
  type: 'INCREMENT',
  payload: 1, // Optional additional data
};
```

#### **Role of Actions**
- **Dispatch Intent**: Actions define what needs to happen in the app (e.g., incrementing a counter, adding a new item).
- **Decouple Logic**: They separate the "what happened" from "how it affects the state."

#### **Action Creators**
A function that returns an action object for convenience.

```javascript
const increment = (value) => ({
  type: 'INCREMENT',
  payload: value,
});
```

---

### **2. Reducers**
A **reducer** is a pure function that specifies how the state of the application should change in response to an action.

#### **Key Characteristics**
- Takes two arguments: the current state and an action.
- Returns the new state based on the action's type and payload.
- Must not mutate the state; it should create a new state object.

#### **Example**
```javascript
const initialState = { count: 0 };

const counterReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + action.payload };
    case 'DECREMENT':
      return { ...state, count: state.count - action.payload };
    default:
      return state;
  }
};
```

#### **Role of Reducers**
- **State Transformation**: Define how the state is updated based on actions.
- **Pure Functions**: Ensure state transitions are predictable and testable.

---

### **Flow in Redux**

1. **Action Dispatch**: A user interaction or event triggers an action to be dispatched to the Redux store.
   ```javascript
   store.dispatch(increment(1));
   ```

2. **Reducer Handling**: The store passes the current state and the dispatched action to the reducer.
   ```javascript
   const newState = counterReducer(currentState, incrementAction);
   ```

3. **State Update**: The reducer returns the new state, which is stored in the Redux store.

---

### **Example in Action**
```javascript
import { createStore } from 'redux';

// Initial state
const initialState = { count: 0 };

// Reducer
const counterReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + action.payload };
    case 'DECREMENT':
      return { ...state, count: state.count - action.payload };
    default:
      return state;
  }
};

// Create store
const store = createStore(counterReducer);

// Subscribe to state changes
store.subscribe(() => {
  console.log('State updated:', store.getState());
});

// Dispatch actions
store.dispatch({ type: 'INCREMENT', payload: 2 });
store.dispatch({ type: 'DECREMENT', payload: 1 });
```

---

### **Summary of Roles**
| Aspect    | Actions                                | Reducers                              |
|-----------|----------------------------------------|---------------------------------------|
| **Purpose** | Describe what happened.               | Define how state changes.             |
| **Responsibility** | Convey intent to the store.           | Handle state updates based on actions. |
| **Structure** | Plain JavaScript objects with a `type`. | Pure functions that return new state. |

Together, **actions** and **reducers** form the backbone of Redux, ensuring predictable and centralized state management for your application.