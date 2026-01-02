# Example Base 19 - Swing Applications

This directory contains Maven-based Java Swing applications demonstrating various GUI development patterns and features.

## 📁 Projects

### 1. Swing Sum Calculator
A simple calculator application that adds two integers.

**Location:** `swing-sum-calculator/`

**Features:**
- Clean and intuitive GUI
- Two input fields for integers
- Calculate button to compute the sum
- Result display field
- Input validation with error messages
- System look and feel

**Quick Start:**
```bash
cd swing-sum-calculator
mvn exec:java
```

**Documentation:** See [swing-sum-calculator/README.md](swing-sum-calculator/README.md) for detailed information.

---

### 2. Swing Topic Management (CRUD)
A full-featured CRUD application for managing topics with Markdown support.

**Location:** `swing-topic-mgmt/`

**Features:**
- ✅ **Create** - Add new topics with title and content
- ✅ **Read** - View all topics in a table with details
- ✅ **Update** - Modify existing topics
- ✅ **Delete** - Remove topics with confirmation
- ✅ **JSON Storage** - All data is saved in `src/main/resources/topics.json`
- ✅ **Markdown Support** - Write content in Markdown with live preview
- ✅ **Clean GUI** - User-friendly interface with table and form
- ✅ **Input Validation** - Validates required fields
- ✅ **Auto-generated IDs** - UUID-based unique identifiers
- ✅ **Timestamps** - Automatic creation and update timestamps

**Quick Start:**
```bash
cd swing-topic-mgmt
mvn exec:java
```

**Documentation:** See [swing-topic-mgmt/README.md](swing-topic-mgmt/README.md) for detailed information.

---

## 🛠️ Prerequisites

Both projects require:
- **Java 17** or higher
- **Maven 3.6+** (or use Maven wrapper)

## 📋 Project Structure

```
example-base-19/
├── README.md                    # This file
├── swing-sum-calculator/        # Simple sum calculator
│   ├── pom.xml
│   ├── README.md
│   └── src/
│       └── main/
│           └── java/
│               └── com/
│                   └── example/
│                       └── swing/
│                           └── SumCalculator.java
└── swing-topic-mgmt/            # Topic CRUD with Markdown
    ├── pom.xml
    ├── README.md
    └── src/
        └── main/
            ├── java/
            │   └── com/
            │       └── example/
            │           └── swing/
            │               ├── TopicManagementApp.java
            │               ├── model/
            │               │   └── Topic.java
            │               ├── service/
            │               │   └── TopicService.java
            │               └── util/
            │                   └── MarkdownRenderer.java
            └── resources/
                └── topics.json
```

## 🚀 Building All Projects

To build all projects:

```bash
# Build sum calculator
cd swing-sum-calculator
mvn clean compile
cd ..

# Build topic management
cd swing-topic-mgmt
mvn clean compile
cd ..
```

## 📚 Technologies Used

### Swing Sum Calculator
- **Java Swing** - GUI framework
- **Maven** - Build tool

### Swing Topic Management
- **Java Swing** - GUI framework
- **Gson 2.10.1** - JSON serialization/deserialization
- **Flexmark 0.64.8** - Markdown to HTML rendering
- **Maven** - Build tool

## 🎯 Learning Objectives

These projects demonstrate:

1. **Basic Swing GUI Development**
   - Window creation and layout management
   - Event handling
   - Input validation
   - User feedback (dialogs, messages)

2. **Advanced Swing Features**
   - Table components for data display
   - Tabbed panes for multiple views
   - HTML rendering in Swing components
   - Real-time updates

3. **Data Persistence**
   - JSON file storage
   - CRUD operations
   - Data serialization/deserialization

4. **Markdown Processing**
   - Markdown parsing
   - HTML rendering
   - Live preview functionality

## 📝 Notes

- Both applications use Java 17
- All data is stored locally in JSON format
- The topic management app includes a live Markdown preview
- Both projects follow standard Maven directory structure

## 🔗 Related Examples

For more examples, check out other `example-base-*` directories in the parent repository.

