# what is `Cornell Method` to organize information efficiently.

The **Cornell Method** is a note-taking system designed to **organize, summarize, and retain information efficiently**. It helps improve learning by structuring notes in a way that makes **review and recall easier**.  

---

### **📌 Structure of the Cornell Method**
A **Cornell Notes page** is divided into **three sections**:  

1️⃣ **Cue Column (Left - Keywords & Questions)**  
   - Write down **keywords, main topics, or questions** that summarize the key points from the right-hand column.  
   - These cues act as triggers to recall the information.  

2️⃣ **Notes Column (Right - Detailed Notes)**  
   - This is the main section where you write down **detailed information, key points, facts, and explanations**.  
   - Use bullet points, abbreviations, or diagrams to make it concise.  

3️⃣ **Summary Section (Bottom - Key Takeaways)**  
   - After reviewing, write a **short summary** of the page in your own words.  
   - Helps reinforce learning and provides a quick reference.  

---

### **📌 How to Use the Cornell Method Effectively**
✔️ **During Learning:**  
- Take notes in the **right column** (main ideas, explanations, examples).  
- Keep it brief; use symbols, indentation, and bullet points.  

✔️ **After Learning:**  
- Fill in the **left column** with cues (headings, questions, key terms).  
- Write a **summary** in the bottom section after reviewing the page.  

✔️ **For Revision:**  
- Cover the **right column** and try to recall details using cues from the **left column**.  
- Regularly **review** and test yourself for better retention.  

---

### **📌 Why the Cornell Method Works?**
✅ **Enhances Active Recall** → Forces you to recall info instead of just rereading.  
✅ **Organized for Quick Review** → Summaries and cues make revision fast.  
✅ **Encourages Deeper Understanding** → Writing summaries reinforces learning.  

---

### **💡 Example: Using Cornell Notes for Learning JavaScript**
| **Cues (Left Column)** | **Notes (Right Column)** |
|----------------|----------------|
| `const vs let vs var` | `const` is immutable, `let` is block-scoped, `var` is function-scoped. |
| `Arrow functions` | `() => {}` concise syntax, no `this` binding. |
| `Promises vs async/await` | Promises handle async tasks; `async/await` makes it more readable. |

**Summary (Bottom Section):**  
JavaScript variables differ in scope (`let` vs `var`). Arrow functions simplify syntax, and `async/await` improves async code readability.  

---

### **🔹 Final Thoughts**
- The **Cornell Method** is useful for **self-learning, job interviews, technical concepts, and personal development.**  
- **Would you like a digital template** to organize your studies using this method? 😊


# Please create a react component for below specifications
> please create a react page to display information related to an object having below fields, to visualize Cornell Method
> 
> - uniqueId (string, being passed from query parameter, note we are using react router v6 in TweetApp, my learning application :) ) 
> - title string
> - description , string (multi-line)
> - tags ( string arrays, I guess this should go in left section. please suggest)
> - createdOn, updatedOn, rating (integer between 1-10), 
> - summary.
> 
> Please use tailwind responsive styles


Here’s a **React component** to visualize the **Cornell Method** using your object structure. It retrieves the `uniqueId` from the query parameters (React Router v6) and displays the information in a **structured layout using Tailwind CSS**.

---

### **📌 Features**
✔ Fetches `uniqueId` from **query parameters**  
✔ Uses **Tailwind CSS** for a **responsive Cornell Notes layout**  
✔ **Tags (string array)** are placed in the **left "Cues" section**  
✔ **Title, description, dates, rating** are in the **right "Notes" section**  
✔ **Summary** is displayed in the **bottom section**  

---

### **📌 Code Implementation**

```tsx
import { useSearchParams } from "react-router-dom";

interface CornellNote {
  uniqueId: string;
  title: string;
  description: string;
  tags: string[];
  createdOn: string;
  updatedOn: string;
  rating: number;
  summary: string;
}

const sampleNote: CornellNote = {
  uniqueId: "123456",
  title: "Understanding the Cornell Method",
  description: "The Cornell Method is a systematic way of taking and organizing notes...",
  tags: ["Note-taking", "Productivity", "Study Skills"],
  createdOn: "2024-01-29",
  updatedOn: "2024-01-30",
  rating: 8,
  summary: "A structured approach to note-taking that improves recall and organization.",
};

export default function CornellNotePage() {
  const [searchParams] = useSearchParams();
  const uniqueId = searchParams.get("uniqueId") || sampleNote.uniqueId;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
      <h1 className="text-2xl font-bold text-center mb-4">{sampleNote.title}</h1>

      {/* Cornell Layout */}
      <div className="grid md:grid-cols-4 gap-4">
        {/* Left Column (Cues - Tags) */}
        <div className="md:col-span-1 bg-gray-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Cues (Tags)</h2>
          <ul className="space-y-2">
            {sampleNote.tags.map((tag, index) => (
              <li key={index} className="bg-blue-200 text-blue-800 px-3 py-1 rounded-lg inline-block">
                {tag}
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column (Notes) */}
        <div className="md:col-span-3 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Notes</h2>
          <p className="text-gray-700">{sampleNote.description}</p>

          <div className="mt-4">
            <p className="text-sm text-gray-500">Created On: {sampleNote.createdOn}</p>
            <p className="text-sm text-gray-500">Updated On: {sampleNote.updatedOn}</p>
            <p className="text-sm font-semibold">Rating: ⭐ {sampleNote.rating} / 10</p>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="mt-6 p-4 bg-yellow-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Summary</h2>
        <p className="text-gray-700">{sampleNote.summary}</p>
      </div>
    </div>
  );
}
```

---

### **📌 Key Takeaways**
✔ **Query Parameter Handling:** Retrieves `uniqueId` from the URL using `useSearchParams()`.  
✔ **Cornell Method Layout:**
   - **Left Column** → Cues (`tags[]`)  
   - **Right Column** → Notes (title, description, timestamps, rating)  
   - **Bottom Section** → Summary  
✔ **Responsive Design:** Uses Tailwind's `grid` and `md:grid-cols-4` to adjust layout for different screens.  

Would you like me to modify anything further? 🚀