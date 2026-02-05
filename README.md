# CodeLeap Network

A modern React application for the CodeLeap technical challenge. A feature-rich social network where users can create, read, update, and delete posts with advanced filtering, pagination, and interaction features.

## 👨‍💻 Author

**John Lucas**

## ✨ Features

### Core Features (Challenge Requirements)
- ✅ User signup (username stored locally)
- ✅ Create new posts
- ✅ View posts from all users
- ✅ Edit your own posts
- ✅ Delete your own posts with confirmation modal
- ✅ Real-time updates with React Query

### Bonus Features (Challenge Suggestions) ⭐
- ❤️ **Likes System** - Like/unlike posts with visual feedback
- 🔍 **Advanced Filtering** - Search by title/content and filter by username
- 📊 **Sorting Options** - Sort by newest, oldest, or title (A-Z, Z-A)
- 📄 **Pagination** - 5 posts per page with intuitive navigation
- 🎨 **Smooth Animations** - Fade-in effects, hover states, and transitions
- 📱 **Fully Responsive** - Optimized for desktop, tablet, and mobile
- 🚪 **Logout Functionality** - Easy logout with confirmation
- 💬 **Comments System** - Add and delete comments on posts
- 📢 **Mentions System** - @username mentions with autocomplete
- 🔐 **Google Authentication** - Sign in with Google via Firebase
- 🖼️ **Media Attachments** - Upload images to posts with compression

### Extra Features (Beyond Challenge) 🚀

Features I implemented to enhance the user experience beyond the challenge requirements:

| Feature | Description |
|---------|-------------|
| 🔔 **Notifications System** | Real-time notifications when someone mentions you with badge counter |
| 👤 **User Profile Modal** | View any user's profile, stats, and all their posts |
| 🖼️ **Image Lightbox** | Fullscreen image viewer with navigation arrows and keyboard controls |
| 💾 **Storage Monitor** | Alert when localStorage is almost full with options to clear data |
| 🚪 **Beautiful Logout Modal** | Custom styled confirmation modal instead of browser alert |
| 🔗 **Clickable Mentions** | Click on @username to view that user's profile |
| 💬 **Auto-mention in Comments** | Automatically mentions post owner when commenting |
| ⌨️ **Keyboard Shortcuts** | Ctrl+Enter to submit comments, Arrow keys in lightbox |
| 🎯 **Post Highlight** | Smooth scroll and highlight animation when clicking notifications |
| 🔄 **Auto-refresh** | Posts auto-refresh every 15 seconds to catch new mentions |

## 🎯 Tech Stack

- **React 18** with TypeScript for type safety
- **Vite** for lightning-fast development
- **React Query (TanStack Query)** for efficient server state management
- **Firebase** for Google Authentication
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

### Environment Setup (Optional - for Google Auth)

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Add your Firebase credentials (optional - app works without it):

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

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
├── components/              # React components (26 total)
│   ├── Button/             # Reusable button with variants
│   ├── Input/              # Reusable input with validation
│   ├── TextArea/           # Reusable textarea component
│   ├── Modal/              # Modal container with animations
│   ├── Signup/             # Signup screen with Google Auth
│   ├── MainScreen/         # Main feed with header & actions
│   ├── CreatePost/         # Post creation with image upload
│   ├── PostCard/           # Individual post with likes & comments
│   ├── PostFilters/        # Search, filter, and sort UI
│   ├── Pagination/         # Page navigation component
│   ├── EditModal/          # Edit post modal
│   ├── DeleteModal/        # Delete confirmation modal
│   ├── CommentSection/     # Comments with mentions support
│   ├── MentionInput/       # Input with @mention autocomplete
│   ├── MentionTextArea/    # TextArea with @mention autocomplete
│   ├── ImageUpload/        # Image upload with preview
│   ├── ImageGallery/       # Image grid display
│   ├── ImageLightbox/      # Fullscreen image viewer
│   ├── UserProfileModal/   # User profile with stats
│   ├── NotificationBell/   # Notification dropdown
│   ├── StorageWarning/     # localStorage alert modal
│   └── LogoutModal/        # Logout confirmation modal
├── contexts/               # React contexts
│   └── UserContext.tsx     # User state & Firebase auth
├── hooks/                  # Custom React hooks (9 total)
│   ├── usePosts.ts         # React Query hooks for posts
│   ├── useLikes.ts         # Likes state management
│   ├── useComments.ts      # Comments management
│   ├── useAttachments.ts   # Image attachments
│   ├── usePostFilters.ts   # Filtering & sorting logic
│   ├── usePagination.ts    # Pagination logic
│   ├── useNotifications.ts # Mention notifications
│   ├── useStorageMonitor.ts # localStorage monitoring
│   └── useUserStats.ts     # User statistics
├── services/               # External services
│   ├── api.ts              # REST API calls
│   └── auth.ts             # Firebase authentication
├── config/                 # Configuration
│   └── firebase.ts         # Firebase setup
├── utils/                  # Utility functions
│   ├── mentions.tsx        # Mention parsing & rendering
│   └── imageUtils.ts       # Image compression & validation
├── types/                  # TypeScript types
│   └── index.ts            # Shared interfaces
├── styles/                 # Global styles
│   └── globals.css         # Global CSS & animations
├── App.tsx                 # Main app component
└── main.tsx                # Entry point
```

## 🎨 Design Highlights

- **Smooth Animations** - Fade-in effects on all components
- **Hover Effects** - Interactive feedback on buttons and cards
- **Box Shadows** - Subtle elevation for better depth
- **Color Palette** - Professional blue (#7695EC) with accents
- **Typography** - Clean Roboto font family
- **Spacing** - Consistent 8px grid system
- **Modals** - Beautiful custom modals with backdrop blur

## 📱 Responsive Breakpoints

- **Desktop** - 800px+ (default)
- **Tablet** - 768px - 800px
- **Mobile** - < 768px

All components adapt gracefully to different screen sizes.

## 💾 Local Storage Usage

The app uses localStorage for persisting data that the API doesn't support:

| Key | Description | Size Impact |
|-----|-------------|-------------|
| `codeleap_username` | Current user's username | ~50 bytes |
| `codeleap_likes` | Post likes data | ~1-5 KB |
| `codeleap_comments` | User comments | ~5-50 KB |
| `codeleap_attachments` | Base64 images | ⚠️ ~100KB-4MB |
| `codeleap_notifications` | Mention notifications | ~1-10 KB |

**Note:** Images are compressed before storage, but localStorage has a 5MB limit. The app monitors usage and alerts when approaching the limit.

## API

The application integrates with the CodeLeap test API:

- **Base URL:** `https://dev.codeleap.co.uk/careers/`
- **GET** `/?limit=100&offset=0` - Fetch posts with pagination
- **POST** `/` - Create a new post
- **PATCH** `/{id}/` - Update a post
- **DELETE** `/{id}/` - Delete a post

## 🚀 Performance Optimizations

- **React Query Caching** - Reduces unnecessary API calls
- **useMemo & useCallback** - Prevents unnecessary re-renders
- **CSS Modules** - Scoped styles for better performance
- **Lazy Evaluation** - Efficient filtering and sorting
- **Image Compression** - Reduces storage usage
- **React Portals** - Prevents z-index issues with modals
- **Debounced Updates** - Smooth mention autocomplete

## 🔐 Security Features

- ✅ Firebase credentials in environment variables
- ✅ Input validation and sanitization
- ✅ Regex escaping for mention detection
- ✅ `referrerPolicy="no-referrer"` on external images
- ✅ Error handling for all async operations

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
- ✅ ARIA labels for accessibility
- ✅ Keyboard navigation support

## 📝 License

This project was created for the CodeLeap technical challenge.
