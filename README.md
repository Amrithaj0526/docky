# Docky - Document Submission & Management System

Docky is a full-stack web application designed for users to submit documents and admins to manage them.

## 🛠 Tech Stack

- **Frontend**: React (Vite), Axios, React Router DOM
- **Backend**: Node.js, Express, Sequelize ORM
- **Database**: PostgreSQL
- **Security**: JWT, bcryptjs
- **File Handling**: Multer (Local Storage)

## 📁 Project Structure

```text
Docky/
├── backend/            # Express server & API
│   ├── config/         # Database configuration
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Auth & Upload logic
│   ├── models/         # Sequelize models
│   ├── routes/         # API endpoints
│   └── uploads/        # Local file storage
└── frontend/           # React application
    ├── src/
    │   ├── components/ # Reusable UI components
    │   ├── pages/      # View components (Login, Dashboard, etc.)
    │   └── services/   # API communication (Axios)
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL installed and running

### 1. Database Setup
Create a database named `docky` in PostgreSQL:
```sql
CREATE DATABASE docky;
```

### 2. Backend Setup
1. Go to the `backend` folder.
2. Open `.env` and update `DB_PASSWORD` with your PostgreSQL password.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm start
   ```
   - The server runs on `http://localhost:5000`.
   - Admin will be seeded automatically: `admin@docky.com` / `admin123`.

### 3. Frontend Setup
1. Go to the `frontend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React app:
   ```bash
   npm run dev
   ```
   - The app will likely run on `http://localhost:5173`.

## 🔑 Default Credentials
- **Admin**: `admin@docky.com` | `admin123`
- **User**: Register a new account via the Signup page.

## ✅ Features
- [x] Secure Authentication (JWT + Hashed Passwords).
- [x] User Dashboard: Upload PDF/DOC/DOCX files (Max 5MB).
- [x] Admin Dashboard: View all submissions, Search/Filter, and Download files.
- [x] Modern & Responsive UI.
