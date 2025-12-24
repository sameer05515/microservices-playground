# Frontend - Example Base 18 (Next.js)

This is the Next.js frontend for **Directory/Sub-Directory/Topic Hierarchy Management** — a modern React application that provides a user-friendly interface for managing hierarchical directory structures with nested sub-directories and topics.

---

## 🚀 Prerequisites

- **Node.js 18+**
- **npm** or **yarn**
- **Backend API** running on `http://localhost:8080` (see `../backend-spring-boot/README.md`)

---

## ⚙️ Configuration

The frontend is configured to connect to the backend API. The default API URL is `http://localhost:8080`.

To change the API URL, you can:

1. Set environment variable:
   ```bash
   export NEXT_PUBLIC_API_URL=http://localhost:8080
   ```

2. Or create a `.env.local` file:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8080
   ```

---

## 📦 Installation

```bash
npm install
```

---

## ▶️ Running the Frontend

### Development Mode
```bash
npm run dev
```

The application will start on `http://localhost:3000`.

### Production Build
```bash
npm run build
npm start
```

---

## 🎯 Features

### Directory Management
- ✅ Create root directories
- ✅ Create unlimited nested sub-directories
- ✅ View hierarchical tree structure with expand/collapse
- ✅ Edit directory name and description
- ✅ Delete directories (with cascading soft delete)
- ✅ Unique name validation at same level

### Topic Management
- ✅ Create topics under any directory/sub-directory
- ✅ Edit topic title and content
- ✅ Delete topics (soft delete)
- ✅ View all topics in a selected directory

### Search & Navigation
- ✅ Search directories and topics by name/title
- ✅ Display full path for search results
- ✅ Click to navigate to directories from search results
- ✅ Visual hierarchy tree with indentation

### UI Features
- ✅ Modern, responsive design with Tailwind CSS
- ✅ Dark mode support
- ✅ Modal dialogs for forms
- ✅ Confirmation dialogs for delete operations
- ✅ Success/error message notifications
- ✅ Loading states
- ✅ Auto-expand first 2 levels of hierarchy
- ✅ Markdown rendering with syntax highlighting (Prism)
- ✅ Code block support with copy functionality

---

## 📁 Project Structure

```
frontend-nextjs/
├── app/
│   ├── directories/
│   │   └── page.tsx          # Main directory management page
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page (redirects)
│   └── globals.css           # Global styles
├── components/
│   ├── DirectoryTree.tsx    # Recursive directory tree component
│   ├── TopicList.tsx         # Topic list display component
│   ├── DirectoryForm.tsx     # Create/edit directory form
│   ├── TopicForm.tsx         # Create/edit topic form
│   ├── SearchBar.tsx         # Search input component
│   ├── Modal.tsx             # Reusable modal component
│   └── MarkdownRenderer.tsx  # Markdown renderer with Prism syntax highlighting
├── lib/
│   └── api.ts                # API service layer
├── types/
│   └── index.ts              # TypeScript type definitions
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

---

## 🛣️ Routes

| Route | Description |
|-------|-------------|
| `/` | Redirects to `/directories` |
| `/directories` | Main directory and topic management page |

---

## 🔌 API Integration

The frontend integrates with the backend API through the `lib/api.ts` service layer:

### Directory API
- `directoryApi.create(data)` - Create directory
- `directoryApi.getById(id)` - Get directory by ID
- `directoryApi.getRoots()` - Get root directories
- `directoryApi.getChildren(parentId)` - Get sub-directories
- `directoryApi.getHierarchy(id)` - Get directory with hierarchy
- `directoryApi.getFullHierarchy()` - Get full hierarchy
- `directoryApi.update(id, data)` - Update directory
- `directoryApi.delete(id)` - Delete directory

### Topic API
- `topicApi.create(data)` - Create topic
- `topicApi.getById(id)` - Get topic by ID
- `topicApi.getByDirectory(directoryId)` - Get topics by directory
- `topicApi.update(id, data)` - Update topic
- `topicApi.delete(id)` - Delete topic

### Search API
- `searchApi.search(query)` - Search directories and topics

---

## 🎨 UI Components

### DirectoryTree
Recursive component that displays the directory hierarchy with:
- Expand/collapse functionality
- Visual indentation for nesting levels
- Action buttons (Add Sub-Dir, Add Topic, Edit, Delete)
- Selection highlighting
- Directory metadata (sub-dir count, topic count)

### TopicList
Displays topics in a selected directory with:
- Topic title and content
- Full path display
- Edit and delete actions
- Empty state message

### Forms
- **DirectoryForm**: Create/edit directories with name and description
- **TopicForm**: Create/edit topics with title and content

### SearchBar
Search input that queries both directories and topics, displaying results with full paths.

---

## 🧪 Usage Examples

### Create Root Directory
1. Click "+ New Root Directory" button
2. Enter directory name (required)
3. Optionally add description
4. Click "Create"

### Create Sub-Directory
1. Click "+Dir" button on any directory
2. Enter sub-directory name
3. Click "Create"

### Create Topic
1. Select a directory
2. Click "+ Add Topic" or "+Topic" button
3. Enter topic title (required)
4. Optionally add content (Markdown supported with code blocks)
5. Click "Create"

**Markdown Support:**
- Write content in Markdown format
- Code blocks with syntax highlighting (JavaScript, TypeScript, Python, Java, SQL, etc.)
- Headers, lists, links, blockquotes, and more
- Copy code button in code blocks

### Search
1. Enter search query in search bar
2. View results grouped by directories and topics
3. Click on a result to navigate to it

### Edit
1. Click edit button (✏️) on directory or topic
2. Modify name/title and description/content
3. Click "Update"

### Delete
1. Click delete button (🗑️) on directory or topic
2. Confirm deletion in modal
3. Directory deletion cascades to children

---

## 🎨 Styling

The application uses **Tailwind CSS** for styling with:
- Responsive design (mobile-friendly)
- Dark mode support (follows system preference)
- Modern UI components
- Smooth transitions and hover effects

---

## 🔧 Development

### TypeScript
The project is fully typed with TypeScript for better development experience and type safety.

### Code Structure
- **Components**: Reusable UI components
- **Pages**: Next.js app router pages
- **Lib**: API service layer and utilities
- **Types**: TypeScript type definitions

---

## 🐛 Troubleshooting

### Backend Connection Issues
- Ensure backend is running on `http://localhost:8080`
- Check CORS configuration in backend
- Verify API URL in `.env.local` or environment variables

### Build Issues
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

### Port Already in Use
- Change port: `npm run dev -- -p 3001`

---

## 📄 License

This project is part of the microservices-playground examples.

