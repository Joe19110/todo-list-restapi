# 🔥 React To-Do List with Firebase Authentication & Cloudinary

This project is a **To-Do List app** built with **React (Vite), Firebase Authentication, Firestore, and Cloudinary** for profile pictures. It supports authentication via **email/password, Google, and GitHub** with automatic provider linking.

---

## 🚀 Features
- ✅ User authentication with **Firebase Authentication**
- ✅ Supports **Google OAuth** (links existing accounts)
- ✅ **Firestore** for storing user data
- ✅ **Cloudinary** for profile picture storage (changeable/deletable)
- ✅ **To-Do List** with CRUD operations

---

## 📦 Tech Stack
- **Frontend:** React (Vite), Material-UI (MUI)
- **Backend:** Firebase (Authentication & Firestore)
- **Storage:** Cloudinary (for profile pictures)

---

## 🛠️ Setup Instructions

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/Joe19110/WADS-TodoList.git
cd WADS-TodoList
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Run the App
```sh
npm run dev
```
---

## 📂 Project Structure
```sh
📦 WADS-TodoList
 ┣ 📂 src
 ┃ ┣ 📂 assets         # Images (Google & GitHub icons)
 ┃ ┣ 📂 components     # UI components
 ┃ ┣ 📂 pages
 ┃ ┃ ┣ 📄 Login.jsx
 ┃ ┃ ┣ 📄 Register.jsx
 ┃ ┃ ┗ 📄 TodoList.jsx
 ┃ ┣ 📄 firebase.js    # Firebase setup
 ┃ ┗ 📄 App.jsx        # Main component
 ┣ 📄 .env             # Environment variables (not committed)
 ┣ 📄 README.md        # This file
 ┣ 📄 package.json
 ┗ 📄 vite.config.js
```

---

## 🔧 Firebase Authentication Logic
- New Users: Redirects to register and fill in missing details.
- Existing Users (OAuth): If an email is already registered, it links the new provider instead of blocking login.
- Profile Picture: Fetched from Cloudinary, can be updated/deleted.
