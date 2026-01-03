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

### 3. Swing MP3 Player
A media player application for playing MP3 audio files.

**Location:** `swing-mp3-player/`

**Features:**
- File selection dialog for MP3 files
- Play, Pause, and Stop controls
- Progress bar and time display
- Volume control slider
- Current file information display
- Clean and intuitive GUI

**Quick Start:**
```bash
cd swing-mp3-player
mvn exec:java
```

**Documentation:** See [swing-mp3-player/README.md](swing-mp3-player/README.md) for detailed information.

---

## 🛠️ Prerequisites

All projects require:
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
└── swing-mp3-player/            # MP3 audio player
    ├── pom.xml
    ├── README.md
    └── src/
        └── main/
            └── java/
                └── com/
                    └── example/
                        └── swing/
                            └── MP3PlayerApp.java
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

# Build MP3 player
cd swing-mp3-player
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

### Swing MP3 Player
- **Java Swing** - GUI framework
- **JLayer 1.0.1** - MP3 audio playback library
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

5. **Media Playback**
   - Audio file handling
   - Playback controls
   - Progress tracking
   - Volume control

## 📝 Notes

- All applications use Java 17
- All data is stored locally (JSON format for topic management)
- The topic management app includes a live Markdown preview and theme toggle
- The MP3 player uses JLayer library for audio playback
- All projects follow standard Maven directory structure

## 🔗 Related Examples

For more examples, check out other `example-base-*` directories in the parent repository.

