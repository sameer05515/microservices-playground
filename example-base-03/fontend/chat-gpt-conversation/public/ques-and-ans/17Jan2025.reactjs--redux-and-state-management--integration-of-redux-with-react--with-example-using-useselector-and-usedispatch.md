### **Integrating Redux with React**

To integrate Redux with a React application, you'll use the `react-redux` library, which provides hooks like `useSelector` and `useDispatch` for interacting with the Redux store.

---

### **Steps to Integrate Redux with React**

1. **Install Required Libraries**
   ```bash
   npm install redux react-redux
   ```

2. **Set Up Redux Store**
   - Define actions, reducers, and the store.

3. **Provide the Store to the React Application**
   - Use the `Provider` component from `react-redux` to make the store accessible throughout the component tree.

4. **Use Hooks for State and Dispatch**
   - `useSelector` to read data from the store.
   - `useDispatch` to dispatch actions.

---

### **Example: Counter App with Redux and React**

#### **1. Define Actions**
```javascript
// actions.js
export const increment = (value) => ({
  type: 'INCREMENT',
  payload: value,
});

export const decrement = (value) => ({
  type: 'DECREMENT',
  payload: value,
});
```

#### **2. Create Reducer**
```javascript
// reducer.js
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

export default counterReducer;
```

#### **3. Configure Store**
```javascript
// store.js
import { createStore } from 'redux';
import counterReducer from './reducer';

const store = createStore(counterReducer);

export default store;
```

#### **4. Wrap the App with `Provider`**
```javascript
// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import store from './store';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
```

#### **5. Use Redux in React Components**
```javascript
// Counter.js
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement } from './actions';

const Counter = () => {
  // Access state using useSelector
  const count = useSelector((state) => state.count);

  // Get dispatch function
  const dispatch = useDispatch();

  // Handlers
  const handleIncrement = () => dispatch(increment(1));
  const handleDecrement = () => dispatch(decrement(1));

  return (
    <div className="flex flex-col items-center space-y-4">
      <h1 className="text-2xl font-bold">Counter: {count}</h1>
      <div className="space-x-4">
        <button
          onClick={handleIncrement}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Increment
        </button>
        <button
          onClick={handleDecrement}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Decrement
        </button>
      </div>
    </div>
  );
};

export default Counter;
```

#### **6. Add the Counter Component**
```javascript
// App.js
import React from 'react';
import Counter from './Counter';

const App = () => {
  return (
    <div className="p-5">
      <Counter />
    </div>
  );
};

export default App;
```

---

### **Key Points**
1. **Store Context**: The `Provider` component makes the Redux store available to any nested components.
2. **State Access**: Use `useSelector` to access specific pieces of the Redux state.
3. **Dispatch Actions**: Use `useDispatch` to dispatch actions and modify the state.

This example demonstrates a minimal yet complete implementation of Redux with React using modern hooks like `useSelector` and `useDispatch`.