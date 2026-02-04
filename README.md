# CodeLeap Network

A React application for the CodeLeap technical challenge. This is a simple social network where users can create, read, update, and delete posts.

## Features

- User signup (username stored locally)
- Create new posts
- View posts from all users (sorted by most recent)
- Edit your own posts
- Delete your own posts with confirmation modal
- Real-time updates with React Query

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **React Query (TanStack Query)** for server state management
- **CSS Modules** for scoped styling
- **date-fns** for date formatting

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # React components
│   ├── Button/         # Reusable button component
│   ├── Input/          # Reusable input component
│   ├── TextArea/       # Reusable textarea component
│   ├── Modal/          # Reusable modal component
│   ├── Signup/         # Signup screen
│   ├── MainScreen/     # Main feed screen
│   ├── CreatePost/     # Post creation form
│   ├── PostCard/       # Individual post display
│   ├── EditModal/      # Edit post modal
│   └── DeleteModal/    # Delete confirmation modal
├── contexts/           # React contexts
│   └── UserContext.tsx # User state management
├── hooks/              # Custom hooks
│   └── usePosts.ts     # React Query hooks for posts
├── services/           # API services
│   └── api.ts          # API calls
├── types/              # TypeScript types
│   └── index.ts        # Shared types
├── styles/             # Global styles
│   └── globals.css     # Global CSS
├── App.tsx             # Main app component
└── main.tsx            # Entry point
```

## API

The application integrates with the CodeLeap test API:

- **Base URL:** `https://dev.codeleap.co.uk/careers/`
- **GET** - Fetch all posts
- **POST** - Create a new post
- **PATCH** - Update a post
- **DELETE** - Delete a post