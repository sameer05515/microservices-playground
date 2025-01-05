### Differences Between `.filter()` and `.map()`

| **Feature**               | **`.filter()`**                                                | **`.map()`**                                             |
|----------------------------|---------------------------------------------------------------|---------------------------------------------------------|
| **Purpose**               | Returns a subset of elements that meet a specific condition.  | Transforms each element of an array into a new value.   |
| **Output**                | A filtered array with fewer or the same number of elements.   | A new array of the same length as the original.         |
| **Callback Return Value** | The callback should return `true` or `false`.                 | The callback should return the transformed value.       |

---

### Practical Use Case: Filtering and Mapping Together

Imagine you have a list of students, and you need to:
1. **Filter** students who scored above 80.
2. **Map** their names into a new array.

```javascript
const students = [
  { name: "Alice", score: 85 },
  { name: "Bob", score: 70 },
  { name: "Charlie", score: 90 },
  { name: "David", score: 60 },
];

// Filter students who scored above 80
const highScorers = students.filter(student => student.score > 80);

console.log(highScorers);
// Output: [
//   { name: "Alice", score: 85 },
//   { name: "Charlie", score: 90 }
// ]

// Map their names into a new array
const highScorerNames = highScorers.map(student => student.name);

console.log(highScorerNames);
// Output: ["Alice", "Charlie"]
```

---

### Individual Examples

#### **Using `.filter()`**
If you just want to filter students who scored above 80:

```javascript
const highScorers = students.filter(student => student.score > 80);
console.log(highScorers);
// Output: [
//   { name: "Alice", score: 85 },
//   { name: "Charlie", score: 90 }
// ]
```

#### **Using `.map()`**
If you want to extract just the names of all students:

```javascript
const studentNames = students.map(student => student.name);
console.log(studentNames);
// Output: ["Alice", "Bob", "Charlie", "David"]
```

---

### Key Takeaway:
- Use `.filter()` to **select elements** based on a condition.
- Use `.map()` to **transform elements** into a new structure. 
- Often, they are used together for powerful data transformations!