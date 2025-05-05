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

### 1️⃣ MySQL Setup
```bash
# 1. Install MySQL Server 8.0
# Windows: Download and install from https://dev.mysql.com/downloads/installer/
# Mac: brew install mysql
# Linux: sudo apt install mysql-server

# 2. Start MySQL Service
# Windows: Net start MySQL80
# Mac/Linux: sudo service mysql start

# 3. Access MySQL and create database
mysql -u root -p
# Enter your password when prompted

# 4. Create the database
CREATE DATABASE todo_app;
```

### 2️⃣ Environment Setup
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

# Database Configuration (in server/.env)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=todo_app
```

### 3️⃣ Update Database Configuration
Edit `server/config.js`:
```javascript
module.exports = {
  development: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'your_password',
    database: process.env.DB_NAME || 'todo_app',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql'
  }
  // ... other configurations
};
```

### 4️⃣ Installation

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

### 5️⃣ Database Initialization
```bash
# In server directory
node init-db.js
```

### 6️⃣ Start the Application
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

## 📤 Database Export/Import

### Export Database
```bash
# Export the database structure and data
mysqldump -u root -p todo_app > todo_app_backup.sql

# Export only the structure
mysqldump -u root -p --no-data todo_app > todo_app_structure.sql

# Export only the data
mysqldump -u root -p --no-create-info todo_app > todo_app_data.sql
```

### Import Database
```bash
# Create the database if it doesn't exist
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS todo_app"

# Import the database
mysql -u root -p todo_app < todo_app_backup.sql
```

### Common Issues
1. **MySQL Connection Error**
   - Check if MySQL service is running
   - Verify credentials in .env file
   - Ensure MySQL is running on default port (3306)

2. **Database Creation Error**
   - Make sure you have sufficient privileges
   - Check if database name already exists
   - Verify MySQL user permissions

3. **Table Creation Error**
   - Run `node init-db.js` to initialize tables
   - Check for any existing conflicting tables
   - Verify Sequelize model definitions

---

## 📂 Project Structure
```