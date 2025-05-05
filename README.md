# 🔥 Rect To-Do List with Firebase Authentication & Cloudinary

This project is a **To-Do List app** built with **React (Vite), Firebase Authentication, Firestore, and Cloudinary** for profile pictures. It supports authentication via **email/password, and Google** with automatic provider linking.

---

## 🚀 Features
- ✅ User authentication with **Firebase Authentication**
- ✅ Supports **Google OAuth** (links existing accounts)
- ✅ **MySQL** for storing user data and tasks
- ✅ **Cloudinary** for profile picture storage (changeable/deletable)
- ✅ **To-Do List** with CRUD operations
- ✅ **Swagger/OpenAPI** documentation for all endpoints

---

## 📦 Tech Stack
- **Frontend:** React (Vite), Material-UI (MUI)
- **Backend:** Node.js, Express, MySQL
- **Authentication:** Firebase Authentication
- **Storage:** Cloudinary (for profile pictures)
- **Documentation:** Swagger/OpenAPI

---

## 🛠️ Setup Instructions

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/Joe19110/WADS-TodoList.git
cd WADS-TodoList
```

### 2️⃣ Install Dependencies
```sh
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

### 3️⃣ Run the App
```sh
# Run frontend
npm run dev

# Run backend
cd server
npm start
```

### 🚀 Run using Docker Image
```sh
docker run -p 5173:5173 joelliane/wads-todolist:latest
```

---

## 📂 Project Structure
```sh
📦 WADS-TodoList
 ┣ 📂 src              # Frontend code
 ┃ ┣ 📂 assets         # Images (Google & GitHub icons)
 ┃ ┣ 📂 components     # UI components
 ┃ ┣ 📂 pages
 ┃ ┃ ┣ 📄 Login.jsx
 ┃ ┃ ┣ 📄 Register.jsx
 ┃ ┃ ┣ 📄 Profile.jsx
 ┃ ┃ ┗ 📄 TodoList.jsx
 ┃ ┣ 📄 firebase.js    # Firebase setup
 ┃ ┗ 📄 App.jsx        # Main component
 ┣ 📂 server           # Backend code
 ┃ ┣ 📂 models         # Database models
 ┃ ┣ 📂 routes         # API routes
 ┃ ┣ 📄 swagger.js     # API documentation
 ┃ ┗ 📄 index.js       # Server entry point
 ┣ 📄 .env             # Environment variables
 ┣ 📄 README.md        # This file
 ┣ 📄 package.json
 ┗ 📄 vite.config.js
```

---

## 🔧 Firebase Authentication Logic
- New Users: Redirects to register and fill in missing details.
- Existing Users (OAuth): If an email is already registered, it links the new provider instead of blocking login.
- Profile Picture: Fetched from Cloudinary, can be updated/deleted.

---

## 📚 API Documentation

The API documentation is available at `http://localhost:5000/api-docs` when the server is running. Here's an overview of the available endpoints:

### 🔐 Authentication Endpoints
```http
POST /api/auth/register
POST /api/auth/login
```

### 👤 User Endpoints
```http
GET /api/users/{userId}
POST /api/users
```

### ✅ Task Endpoints
```http
GET /api/tasks
POST /api/tasks
PUT /api/tasks/{id}
DELETE /api/tasks/{id}
```

### 📝 Detailed API Documentation

#### Authentication
- **Register User**
  - `POST /api/auth/register`
  - Required fields: `firebase_uid`, `email`, `name`
  - Optional fields: `birthdate`, `occupation`, `profile_picture`

- **Login User**
  - `POST /api/auth/login`
  - Required field: `firebase_uid`

#### Users
- **Get User**
  - `GET /api/users/{userId}`
  - Returns user details including profile picture

- **Create/Update User**
  - `POST /api/users`
  - Required field: `firebase_uid`
  - Optional field: `profile_picture`

#### Tasks
- **Get Tasks**
  - `GET /api/tasks?userId={firebase_uid}`
  - Returns all tasks for a user

- **Create Task**
  - `POST /api/tasks`
  - Required fields: `text`, `userId` (firebase_uid)

- **Update Task**
  - `PUT /api/tasks/{id}`
  - Optional fields: `text`, `completed`

- **Delete Task**
  - `DELETE /api/tasks/{id}`
  - Returns 204 on success

For detailed request/response schemas and examples, please visit the Swagger documentation at `http://localhost:5000/api-docs`.

---
