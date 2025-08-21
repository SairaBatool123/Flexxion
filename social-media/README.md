# MERN Stack Authentication Project

A full-stack MERN (MongoDB, Express.js, React, Node.js) application with complete authentication system.

## Features

### Backend
- ✅ Node.js/Express with ES Modules (.mjs files)
- ✅ MongoDB with Mongoose
- ✅ JWT Authentication
- ✅ Password hashing with bcrypt
- ✅ User model with name, email, password, profileImage
- ✅ Protected routes with middleware
- ✅ CORS enabled

### Frontend
- ✅ React with modern hooks
- ✅ TailwindCSS for styling
- ✅ React Router for navigation
- ✅ Zustand for state management
- ✅ React Hot Toast for notifications
- ✅ Form validation
- ✅ Protected routes
- ✅ Responsive design
- ✅ User profile management
- ✅ Profile image upload
- ✅ Bio and profile editing

## Project Structure

```
neww/
├── backend/
│   ├── models/
│   │   ├── User.mjs
│   │   └── Post.mjs
│   ├── routes/
│   │   ├── auth.mjs
│   │   ├── users.mjs
│   │   └── posts.mjs
│   ├── middleware/
│   │   └── auth.mjs
│   ├── config.mjs
│   ├── server.mjs
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Feed.jsx
│   │   │   └── Profile.jsx
│   │   ├── components/
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── CreatePost.jsx
│   │   │   ├── PostCard.jsx
│   │   │   ├── CommentModal.jsx
│   │   │   └── EditProfileModal.jsx
│   │   ├── store/
│   │   │   ├── authStore.js
│   │   │   └── postStore.js
│   │   ├── utils/
│   │   │   └── validation.js
│   │   ├── App.jsx
│   │   └── index.css
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID (protected)
- `PUT /api/users/:id` - Update user profile (protected)
- `DELETE /api/users/:id` - Delete user (protected)

### Posts
- `POST /api/posts` - Create new post (protected)
- `GET /api/posts` - Get all posts with pagination (protected)
- `GET /api/posts/:id` - Get single post by ID (protected)
- `DELETE /api/posts/:id` - Delete own post (protected)
- `POST /api/posts/:id/like` - Like/unlike post (protected)
- `POST /api/posts/:id/comment` - Add comment to post (protected)
- `DELETE /api/posts/:id/comment/:commentId` - Delete comment (protected)
- `GET /api/posts/user/:userId` - Get user's posts (protected)

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mern-app
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

4. Start the development server:
```bash
npm run dev
```

The backend will be running on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be running on `http://localhost:5173`

## Usage

1. Open your browser and go to `http://localhost:5173`
2. Click "Create a new account" to register
3. Fill in your details and create an account
4. You'll be redirected to the Feed page
5. Use the logout button to sign out

## Authentication Flow

1. **Registration**: User fills out signup form → Backend validates → Creates user → Returns JWT token
2. **Login**: User enters credentials → Backend validates → Returns JWT token
3. **Protected Routes**: Frontend checks for valid token → Redirects to login if not authenticated
4. **Token Storage**: JWT tokens are stored in localStorage and Zustand store
5. **Auto-login**: App checks for existing token on load → Automatically logs in if valid

## Technologies Used

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Zustand** - State management
- **TailwindCSS** - Utility-first CSS framework
- **React Hot Toast** - Toast notifications
- **Axios** - HTTP client

## Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Protected routes
- ✅ Input validation
- ✅ CORS configuration
- ✅ Environment variables
- ✅ Error handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.
