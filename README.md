# 🔥 React Todo List with Firebase Authentication & MySQL

This project is a **Todo List application** built with **React (Vite), Firebase Authentication, MySQL, and Cloudinary** for profile pictures. It features a modern UI with Material-UI, secure authentication, and cloud storage for user avatars.

---

## 🚀 Features
- ✅ **User Authentication**
  - Email/Password login
  - Google OAuth integration
  - Automatic account linking
  - Secure session management
- ✅ **Data Storage**
  - MySQL database for user data and tasks
  - Cloudinary for profile pictures
  - Secure file upload handling
- ✅ **Todo Management**
  - Create, read, update, delete tasks
  - Task completion tracking
  - User-specific task lists
- ✅ **User Profiles**
  - Customizable profile pictures
  - User information management
  - OAuth profile integration
- ✅ **API Documentation**
  - Swagger/OpenAPI integration
  - Interactive API testing interface
  - Comprehensive endpoint documentation

---

## 📦 Tech Stack
- **Frontend:**
  - React 18 with Vite
  - Material-UI (MUI) for styling
  - Firebase Auth for authentication
- **Backend:**
  - Node.js & Express
  - MySQL for data persistence
  - Sequelize ORM
  - Cloudinary SDK
- **Documentation:**
  - Swagger UI Express
  - OpenAPI 3.0 specifications

---

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 16 or higher
- MySQL 8.0 or higher
- Cloudinary account
- Firebase project

### 1️⃣ Environment Setup
Create `.env` files in both root and server directories:

```env
# Frontend (.env)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Backend (.env in server directory)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 2️⃣ Installation

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

### 3️⃣ Database Setup
```bash
# In server directory
node init-db.js
```

### 4️⃣ Start the Application
```bash
# Start backend server (from server directory)
npm start

# Start frontend development server (from root directory)
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- API Docs: http://localhost:5000/api-docs

---

## 📂 Project Structure
```
📦 WADS-TodoList
 ┣ 📂 src                 # Frontend source code
 ┃ ┣ 📂 components        # Reusable React components
 ┃ ┣ 📂 pages            # Page components
 ┃ ┣ 📂 assets           # Static assets
 ┃ ┣ 📄 App.jsx          # Main application component
 ┃ ┗ 📄 firebase.js      # Firebase configuration
 ┣ 📂 server             # Backend source code
 ┃ ┣ 📂 models           # Sequelize models
 ┃ ┣ 📂 routes           # Express routes
 ┃ ┣ 📄 swagger.js       # API documentation
 ┃ ┣ 📄 server.js        # Express server setup
 ┃ ┗ 📄 init-db.js       # Database initialization
 ┣ 📄 .env               # Environment variables
 ┗ 📄 package.json       # Project dependencies
```

---

## 🔐 Authentication Flow
1. **New Users:**
   - Register with email/password
   - Sign in with Google
   - Profile details stored in MySQL
   - Optional profile picture upload

2. **Existing Users:**
   - Direct login with credentials
   - OAuth provider linking if email exists
   - Automatic profile merging

3. **Profile Management:**
   - Update profile information
   - Change/delete profile picture
   - View login providers

---

## 📚 API Documentation

### Authentication Endpoints
```http
POST /api/auth/register  # Register new user
POST /api/auth/login     # Login existing user
```

### User Management
```http
GET /api/users/{userId}  # Get user profile
POST /api/users          # Update user profile
```

### Task Management
```http
GET /api/tasks          # List user's tasks
POST /api/tasks         # Create new task
PUT /api/tasks/{id}     # Update task
DELETE /api/tasks/{id}  # Delete task
```

### File Management
```http
POST /api/upload        # Upload profile picture
POST /delete-image      # Delete profile picture
```

For detailed API documentation including request/response schemas, visit the Swagger UI at `http://localhost:5000/api-docs` when the server is running.

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
