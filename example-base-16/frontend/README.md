# Frontend - React + Vite + Tailwind CSS

A modern frontend application built with React, Vite, and Tailwind CSS.

## Prerequisites

- Node.js 18+ and npm

## Installation

```bash
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Build

Build for production:

```bash
npm run build
```

## Preview

Preview the production build:

```bash
npm run preview
```

## Features

- ⚡ **Vite** - Fast build tool and development server
- ⚛️ **React 18** - Modern React with hooks
- 🎨 **Tailwind CSS v4** - Utility-first CSS framework
- 🔄 **Hot Module Replacement** - Instant updates during development
- 📦 **Optimized Production Build** - Ready for deployment

## Project Structure

```
frontend/
├── src/
│   ├── App.jsx          # Main App component
│   ├── main.jsx         # Entry point
│   └── index.css        # Tailwind CSS imports
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
└── package.json         # Dependencies
```

## API Proxy

The Vite dev server is configured to proxy API requests to `http://localhost:8080/api` (backend server).

