# REST API reference

Base URL depends on how you run the stack:

| Context | Base URL for API routes |
|---------|-------------------------|
| Local backend only | **`http://localhost:3401`** |
| Local full stack (Vite on 3402) | Use **`http://localhost:3402`** with paths below (Vite proxies **`/api`** to the backend). |
| Kubernetes | Use the **frontend** URL (nginx proxies **`/api`** to the backend Service). |

All documented paths below are relative to that base (for example **`/api/todos`**).

## Content type

Request bodies that carry JSON must use:

```http
Content-Type: application/json
```

Responses use JSON unless otherwise noted.

---

## Health

### `GET /health`

Liveness/readiness-style check. Does not touch the todo store.

**Response** `200`

```json
{ "ok": true }
```

**Example**

```bash
curl -s http://localhost:3401/health
```

---

## List todos

### `GET /api/todos`

Returns all todos as a **JSON array** (not the full `{ "todos": [...] }` wrapper).

**Response** `200`

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Example",
    "done": false
  }
]
```

**Example**

```bash
curl -s http://localhost:3401/api/todos
```

Through Vite (port 3402):

```bash
curl -s http://localhost:3402/api/todos
```

---

## Create todo

### `POST /api/todos`

Creates a new todo.

**Request body**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| **`title`** | string | yes | Trimmed; must not be empty |
| **`done`** | boolean | no | Defaults to **`false`** if omitted |

**Example body**

```json
{ "title": "Read documentation" }
```

**Response** `201` — the created todo object

```json
{
  "id": "new-uuid",
  "title": "Read documentation",
  "done": false
}
```

**Error** `400` — invalid or empty title

```json
{ "error": "title is required" }
```

**Example**

```bash
curl -s -X POST http://localhost:3401/api/todos \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Ship feature\"}"
```

---

## Update todo

### `PATCH /api/todos/:id`

Partially updates an existing todo. **`id`** is the UUID path segment.

**Request body** (at least one field)

| Field | Type | Description |
|-------|------|-------------|
| **`title`** | string | New title; trimmed; must not be empty |
| **`done`** | boolean | Completion flag |

**Response** `200` — the updated todo

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Updated title",
  "done": true
}
```

**Error** `404`

```json
{ "error": "not found" }
```

**Error** `400` — empty title when **`title`** is sent

```json
{ "error": "title cannot be empty" }
```

**Examples**

Toggle done:

```bash
curl -s -X PATCH http://localhost:3401/api/todos/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d "{\"done\":true}"
```

Rename:

```bash
curl -s -X PATCH http://localhost:3401/api/todos/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"New name\"}"
```

---

## Delete todo

### `DELETE /api/todos/:id`

Removes the todo with the given **`id`**.

**Response** `204` — empty body

**Error** `404`

```json
{ "error": "not found" }
```

**Example**

```bash
curl -s -o /dev/null -w "%{http_code}\n" \
  -X DELETE http://localhost:3401/api/todos/550e8400-e29b-41d4-a716-446655440000
```

Expect **`204`** on success.

---

## Errors (generic)

If the server fails while reading or writing the store, it responds with **`500`**:

```json
{ "error": "internal server error" }
```

The backend also logs the underlying error to the process **stderr**.

## CORS

The Express app enables **`cors()`** for all routes. Direct browser calls to **`http://localhost:3401`** from another origin are allowed during development; the Vite proxy is still the usual way to avoid cross-origin complexity when using the UI on port 3402.
