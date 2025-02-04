Here’s an example of using `.map()` to transform an array of numbers into an array of their squares:

```javascript
const numbers = [1, 2, 3, 4, 5];

// Use .map() to transform each number into its square
const squares = numbers.map((num) => num * num);

console.log(squares); // Output: [1, 4, 9, 16, 25]
```

### Explanation:
- `.map()` iterates over each element of the `numbers` array.
- The callback function `(num) => num * num` is applied to each element.
- A new array `squares` is returned with the transformed elements.

---

### Another Example: Transforming an Array of Objects
If you have an array of objects and want to extract a specific property from each object, you can use `.map()`:

```javascript
const people = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 },
  { name: "Charlie", age: 35 },
];

// Extract only the names from the array of objects
const names = people.map((person) => person.name);

console.log(names); // Output: ["Alice", "Bob", "Charlie"]
```

### Key Points:
- `.map()` creates a new array without mutating the original array.
- It’s ideal for transforming or mapping elements from one form to another.