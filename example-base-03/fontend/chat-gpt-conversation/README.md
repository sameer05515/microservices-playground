# CGPTDataRenderer

A React-based application for viewing, searching, and managing ChatGPT conversation exports. This tool provides an intuitive interface to browse through saved ChatGPT conversations stored as JSON files, with advanced search capabilities and markdown rendering.

## About

CGPTDataRenderer fetches conversation data from JSON files and renders them in a user-friendly dashboard format. The application allows users to:
- Browse through multiple conversation files
- Search across all conversations and messages
- View formatted conversations with markdown support
- Navigate between conversations with ease
- Maintain session state using localStorage

## Features

### Core Features
- **Conversation Viewer**: Display ChatGPT conversations in an organized card-based layout
- **Search Functionality**: Full-text search across conversations and messages
- **File Management**: Switch between different conversation file versions
- **Markdown Rendering**: Support for markdown content with syntax highlighting
- **Session Persistence**: Remember selected conversations and preferences using localStorage
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode Support**: Class-based dark mode with theme management

### Additional Features
- **Playground Dashboard**: Testing and experimentation area
- **Resume Component**: Resume management functionality
- **Testing Dashboard**: Comprehensive testing interface for various components
- **About Page**: Project documentation and information
- **Multiple Versions**: v1 and v2 implementations of the dashboard

## Tech Stack

- **React** (^18.2.0) - UI library
- **Redux** (^5.0.1) - State management
- **React Router** (^7.0.1) - Routing
- **Tailwind CSS** (^3.4.17) - Styling
- **Framer Motion** (^12.23.24) - Animations
- **React Markdown** (^9.0.1) - Markdown rendering
- **Axios** (^1.7.9) - HTTP client
- **Highlight.js** (^11.9.0) - Syntax highlighting

## Prerequisites

- Node.js (v14 or higher recommended)
- npm or yarn package manager

## Installation

1. Clone the repository or navigate to the project directory:
   ```bash
   cd example-base-03/fontend/chat-gpt-conversation
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Available Scripts

In the project directory, you can run:

### `npm start`
Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload when you make changes. You may also see any lint errors in the console.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run eject`
**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time.

## Project Structure

```
chat-gpt-conversation/
├── public/
│   ├── data/                    # JSON conversation files
│   ├── analysis/                # Analysis documents
│   ├── ques-and-ans/            # Q&A markdown files
│   └── meta-learning/           # Learning resources
├── src/
│   ├── components/
│   │   ├── CGPTDataRendererDashboard/  # Main dashboard components
│   │   └── resume/                     # Resume components
│   ├── routes/                  # Route definitions and layouts
│   ├── store/                   # Redux store configuration
│   ├── common/                  # Shared utilities and components
│   ├── TestingPage/             # Testing interface
│   └── AboutThisProject/        # About page components
├── tailwind.config.js          # Tailwind CSS configuration
├── .prettierrc                 # Prettier configuration
└── package.json                # Project dependencies
```

## Usage

### Main Dashboard Routes

- **`/`** - About/Home page
- **`/cgpt/v1`** - ChatGPT Conversation Viewer (Version 1)
- **`/cgpt/v2`** - Pragyam Dashboard (Version 2 - Recommended)
- **`/apna-playground`** - Playground dashboard
- **`/resume`** - Resume management
- **`/testing`** - Testing dashboard
- **`/settings`** - Application settings

### Working with Conversations

1. **Select a File**: Use the file selector to choose a conversation JSON file
2. **Browse Conversations**: Click on any conversation from the sidebar to view its messages
3. **Search**: Use the search feature to find specific text across all conversations
4. **Navigate**: Use next/previous buttons to move between conversations
5. **View Details**: Conversations are displayed with proper formatting, markdown rendering, and syntax highlighting

## Documentation Index

- `docs/SNAPSHOT_SOURCES.md` - detailed guide for snapshot source modeling (file vs folder shards), expected contracts, and verification steps.
- `docs/REVIEW_NOTES.md` - focused technical review findings, risk summary, and regression checklist.

### Data Format

The application expects JSON files in the `public/data/` directory with the following structure:
```json
[
  {
    "id": "conversation-id",
    "title": "Conversation Title",
    "messages": [
      {
        "text": "Message content",
        "role": "user" | "assistant"
      }
    ]
  }
]
```

## Development

### Code Style

The project uses Prettier for code formatting with the following configuration:
- Print width: 110 characters
- Single quotes for JavaScript
- Semicolons enabled

### State Management

The application uses Redux for global state management with the following modules:
- Application states
- Backdrop/Modal management
- Colors/Theme
- Counter
- Pragyam (conversation) state
- Consolidated reports

### Styling

- **Tailwind CSS** for utility-first styling
- **CSS Modules** for component-specific styles
- **Dark Mode** support via class-based theme switching

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow the existing code style and conventions
2. Ensure all tests pass
3. Update documentation as needed
4. Use meaningful commit messages

## License

This project is private and intended for personal/educational use.

## Notes

- The application stores conversation data locally in the `public/data/` directory
- Session preferences are saved in browser localStorage
- Multiple dashboard versions (v1 and v2) are available for comparison
- The project includes extensive testing components in the TestingPage directory

## Troubleshooting

### Common Issues

1. **Conversations not loading**: Ensure JSON files are in the correct format and located in `public/data/`
2. **Search not working**: Check that the selected file contains valid conversation data
3. **Styling issues**: Verify Tailwind CSS is properly configured and classes are being applied
4. **Build errors**: Clear node_modules and reinstall dependencies: `rm -rf node_modules && npm install`

