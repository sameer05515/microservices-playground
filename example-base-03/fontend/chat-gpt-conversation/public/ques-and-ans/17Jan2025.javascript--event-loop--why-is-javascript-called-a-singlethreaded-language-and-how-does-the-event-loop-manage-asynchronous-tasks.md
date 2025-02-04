### Why is JavaScript called a single-threaded language?
JavaScript is called a **single-threaded** language because it executes code on a single main thread. This means JavaScript can handle only one task at a time within the thread, making it synchronous by nature. The thread handles the **call stack**, where the currently executing code resides.

---

### How does the Event Loop manage asynchronous tasks?
The **event loop** is a mechanism in JavaScript that enables it to manage asynchronous operations despite being single-threaded. It allows the language to:
- Perform non-blocking operations (e.g., I/O, network requests, timers).
- Respond to events (e.g., user interactions).
- Keep the application responsive.

#### Key Components:
1. **Call Stack**:
   - Holds the currently executing function.
   - Functions are added and removed in a **Last In, First Out (LIFO)** manner.

2. **Web APIs** (in browsers) / **Libuv** (in Node.js):
   - Handles time-consuming tasks like network requests, file system operations, or timers outside the call stack.
   - Sends the results of these tasks to the event loop when complete.

3. **Task Queue (Callback Queue)**:
   - Holds callbacks from asynchronous operations (e.g., `setTimeout`, `fetch`).
   - The event loop moves tasks from the queue to the call stack when the stack is empty.

4. **Microtask Queue**:
   - Contains high-priority tasks (e.g., `Promise.then`, `MutationObserver`).
   - Microtasks are executed before tasks in the task queue.

---

### Steps of the Event Loop:
1. **Check the Call Stack**:
   - If it’s empty, move to the next step.
   - If it’s not empty, execute the topmost function.

2. **Process Microtasks**:
   - Execute all microtasks in the microtask queue.

3. **Process Task Queue**:
   - Move the first task from the task queue to the call stack and execute it.

4. **Repeat**:
   - The event loop continues this process indefinitely.

---

### Example: Understanding the Event Loop

```javascript
console.log("Start");

setTimeout(() => {
  console.log("Timeout Task");
}, 0);

Promise.resolve().then(() => {
  console.log("Microtask");
});

console.log("End");
```

**Execution Steps**:
1. `"Start"` is logged (synchronous code in the call stack).
2. `setTimeout` sets up a timer in the Web API and registers the callback in the task queue.
3. `Promise.resolve()` adds the `.then` callback to the microtask queue.
4. `"End"` is logged (synchronous code in the call stack finishes).
5. The microtask (`Promise.then`) is executed: `"Microtask"` is logged.
6. The task queue is processed, executing the `setTimeout` callback: `"Timeout Task"` is logged.

**Output**:
```
Start
End
Microtask
Timeout Task
```

---

### Summary:
- JavaScript is single-threaded because it uses one thread to execute code.
- The **event loop** ensures that asynchronous tasks are handled efficiently without blocking the main thread.
- Microtasks have higher priority than tasks in the task queue, ensuring quick resolution of promises and other critical operations.