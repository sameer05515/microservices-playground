# Swing Topic Management - CRUD Application

A Maven-based Java Swing application for performing CRUD (Create, Read, Update, Delete) operations on Topic objects. Data is persisted as JSON in the resources folder.

## Features

- ✅ **Create** - Add new topics with title and content
- ✅ **Read** - View all topics in a table with details
- ✅ **Update** - Modify existing topics
- ✅ **Delete** - Remove topics with confirmation
- ✅ **JSON Storage** - All data is saved in `src/main/resources/topics.json`
- ✅ **Markdown Support** - Write content in Markdown with live preview
- ✅ **Theme Toggle** - Switch between light and dark themes
- ✅ **Clean GUI** - User-friendly interface with table and form
- ✅ **Input Validation** - Validates required fields
- ✅ **Auto-generated IDs** - UUID-based unique identifiers
- ✅ **Timestamps** - Automatic creation and update timestamps

## Prerequisites

- Java 17 or higher
- Maven 3.6+ (or use Maven wrapper)

## Project Structure

```
swing-topic-mgmt/
├── pom.xml
├── README.md
└── src/
    └── main/
        ├── java/
        │   └── com/
        │       └── example/
        │           └── swing/
        │               ├── TopicManagementApp.java    # Main GUI application
        │               ├── model/
        │               │   └── Topic.java             # Topic model class
        │               └── service/
        │                   └── TopicService.java      # CRUD service with JSON storage
        └── resources/
            └── topics.json                            # JSON data file (auto-created)
```

## Building the Project

```bash
cd example-base-19/swing-topic-mgmt
mvn clean compile
```

## Running the Application

### Option 1: Using Maven Exec Plugin

```bash
cd example-base-19/swing-topic-mgmt
mvn exec:java
```

### Option 2: Build JAR and Run

```bash
# Build the JAR
mvn clean package

# Run the JAR
java -jar target/swing-topic-mgmt-1.0.0.jar
```

### Option 3: Run from IDE

Run the `TopicManagementApp` class directly from your IDE (main method is in `src/main/java/com/example/swing/TopicManagementApp.java`).

## Usage

### Theme Toggle

The application supports both **Light** and **Dark** themes. Use the theme toggle button (🌙/☀️) in the toolbar to switch between themes. The theme applies to:
- All panels and backgrounds
- Text fields and text areas
- Tables and table selections
- Markdown preview pane
- Buttons and borders
- Scrollbars

The theme preference is maintained during your session.

### Creating a Topic

1. Enter a **Title** (required)
2. Enter **Content** in Markdown format (optional)
   - Use the **Edit** tab to write Markdown
   - Switch to the **Preview** tab to see rendered HTML
   - Preview updates automatically as you type
3. Click the **Create** button
4. The new topic will appear in the topics list

### Reading Topics

- All topics are displayed in the table on the left
- The table shows: ID, Title, Content Preview, Created Date, Updated Date
- Click **Refresh List** to reload topics from the JSON file

### Updating a Topic

1. Select a topic from the table
2. The topic details will populate in the form on the right
3. Modify the title and/or content
4. Click the **Update** button
5. The updated topic will be saved and the list refreshed

### Deleting a Topic

1. Select a topic from the table
2. Click the **Delete** button
3. Confirm the deletion in the dialog
4. The topic will be removed from the list and JSON file

### Clearing the Form

- Click the **Clear** button to reset the form and deselect any selected topic

## Data Storage

- All topics are stored in `src/main/resources/topics.json`
- The JSON file is automatically created on first run
- Data persists between application sessions
- The file uses pretty-printed JSON format for readability

### Example JSON Structure

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Sample Topic",
    "content": "This is a sample topic content",
    "createdAt": "2024-01-02T10:30:00",
    "updatedAt": "2024-01-02T10:30:00"
  }
]
```

## Topic Model

The `Topic` class contains:
- **id** (String) - Unique identifier (UUID)
- **title** (String) - Topic title
- **content** (String) - Topic content/description
- **createdAt** (LocalDateTime) - Creation timestamp
- **updatedAt** (LocalDateTime) - Last update timestamp

## Dependencies

- **Gson 2.10.1** - JSON serialization/deserialization
- **Flexmark 0.64.8** - Markdown to HTML rendering
- **Java Swing** - GUI framework (built-in)

## Markdown Support

The application supports full Markdown syntax for topic content:

- **Headers**: `# H1`, `## H2`, `### H3`, etc.
- **Bold**: `**bold text**` or `__bold text__`
- **Italic**: `*italic text*` or `_italic text_`
- **Code**: `` `inline code` `` or code blocks with triple backticks
- **Links**: `[text](url)`
- **Lists**: Ordered and unordered lists
- **Tables**: Markdown table syntax
- **Blockquotes**: `> quoted text`
- And more standard Markdown features

The **Preview** tab shows a live, styled HTML rendering of your Markdown content. The preview updates automatically as you type in the **Edit** tab.

## Troubleshooting

### ClassNotFoundException

If you encounter `ClassNotFoundException`, make sure:
1. You're in the correct directory: `example-base-19/swing-topic-mgmt`
2. The project has been compiled: `mvn clean compile`
3. You're using the correct command: `mvn exec:java`

### JSON File Not Found

The JSON file is automatically created in `src/main/resources/topics.json` on first run. If you encounter issues:
- Ensure the `src/main/resources` directory exists
- Check file permissions
- Verify the application has write access to the resources folder

### Data Not Persisting

- Check that the `topics.json` file exists in `src/main/resources/`
- Verify file permissions allow write access
- Check console for any error messages during save operations

## Development Notes

- The application uses a custom `LocalDateTimeAdapter` for proper JSON serialization of timestamps
- Topic IDs are generated using `UUID.randomUUID()`
- The table automatically updates after create, update, or delete operations
- Form validation ensures title is not empty before creating/updating

