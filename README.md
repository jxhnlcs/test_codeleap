# CodeLeap Network

A modern React application for the CodeLeap technical challenge. A feature-rich social network where users can create, read, update, and delete posts with advanced filtering, pagination, and interaction features.

## ✨ Features

### Core Features
- User signup (username stored locally)
- Create new posts
- View posts from all users
- Edit your own posts
- Delete your own posts with confirmation modal
- Real-time updates with React Query

### Bonus Features ⭐
- ❤️ **Likes System** - Like/unlike posts with visual feedback
- 🔍 **Advanced Filtering** - Search by title/content and filter by username
- 📊 **Sorting Options** - Sort by newest, oldest, or title (A-Z, Z-A)
- 📄 **Pagination** - 5 posts per page with intuitive navigation
- 🎨 **Smooth Animations** - Fade-in effects, hover states, and transitions
- 📱 **Fully Responsive** - Optimized for desktop, tablet, and mobile
- 🚪 **Logout Functionality** - Easy logout with confirmation

## 🎯 Tech Stack

- **React 18** with TypeScript for type safety
- **Vite** for lightning-fast development
- **React Query (TanStack Query)** for efficient server state management
- **CSS Modules** for scoped and maintainable styling
- **date-fns** for elegant date formatting
- **Custom Hooks** for reusable logic

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
│   ├── Button/         # Reusable button with variants
│   ├── Input/          # Reusable input with validation
│   ├── TextArea/       # Reusable textarea component
│   ├── Modal/          # Modal container with animations
│   ├── Signup/         # Signup screen with animations
│   ├── MainScreen/     # Main feed with header & logout
│   ├── CreatePost/     # Post creation form
│   ├── PostCard/       # Individual post with likes
│   ├── PostFilters/    # Search, filter, and sort UI
│   ├── Pagination/     # Page navigation component
│   ├── EditModal/      # Edit post modal
│   └── DeleteModal/    # Delete confirmation modal
├── contexts/           # React contexts
│   └── UserContext.tsx # User state & auth management
├── hooks/              # Custom React hooks
│   ├── usePosts.ts     # React Query hooks for posts
│   ├── useLikes.ts     # Likes state management
│   ├── usePostFilters.ts # Filtering & sorting logic
│   └── usePagination.ts  # Pagination logic
├── services/           # API services
│   └── api.ts          # REST API calls
├── types/              # TypeScript types
│   └── index.ts        # Shared interfaces
├── styles/             # Global styles
│   └── globals.css     # Global CSS & reset
├── App.tsx             # Main app component
└── main.tsx            # Entry point
```

## 🎨 Design Highlights

- **Smooth Animations** - Fade-in effects on all components
- **Hover Effects** - Interactive feedback on buttons and cards
- **Box Shadows** - Subtle elevation for better depth
- **Color Palette** - Professional blue (#7695EC) with accents
- **Typography** - Clean Roboto font family
- **Spacing** - Consistent 8px grid system

## 📱 Responsive Breakpoints

- **Desktop** - 800px+ (default)
- **Tablet** - 768px - 800px
- **Mobile** - < 768px

All components adapt gracefully to different screen sizes.

## API

The application integrates with the CodeLeap test API:

- **Base URL:** `https://dev.codeleap.co.uk/careers/`
- **GET** `/?limit=100&offset=0` - Fetch posts with pagination
- **POST** `/` - Create a new post
- **PATCH** `/{id}/` - Update a post
- **DELETE** `/{id}/` - Delete a post

### Response Examples

**GET /careers/**
```json
{
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 76786,
      "username": "John Lucas",
      "created_datetime": "2026-02-04T21:37:08.130339Z",
      "title": "My Post",
      "content": "Post content here",
      "author_ip": "177.42.201.217"
    }
  ]
}
```

**POST /careers/**
```json
Request: {
  "username": "John Lucas",
  "title": "New Post",
  "content": "Content here"
}

Response: {
  "id": 76787,
  "username": "John Lucas",
  "created_datetime": "2026-02-04T21:40:00.000000Z",
  "title": "New Post",
  "content": "Content here"
}
```

## 🚀 Performance Optimizations

- **React Query Caching** - Reduces unnecessary API calls
- **useMemo & useCallback** - Prevents unnecessary re-renders
- **CSS Modules** - Scoped styles for better performance
- **Lazy Evaluation** - Efficient filtering and sorting
- **Local Storage** - Persists likes and username

## 🎯 Best Practices Implemented

- ✅ TypeScript for type safety
- ✅ Component composition and reusability
- ✅ Custom hooks for logic separation
- ✅ CSS Modules for style encapsulation
- ✅ Semantic HTML for accessibility
- ✅ Responsive design with mobile-first approach
- ✅ Error handling and loading states
- ✅ Clean folder structure
- ✅ Consistent naming conventions
- ✅ Smooth animations and transitions