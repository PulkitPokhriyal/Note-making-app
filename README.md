A full-stack note-taking application with **user authentication, OTP signup verification, and CRUD operations for notes**. Built with **React**, **Node.js**, **Express**, **Prisma**, **PostgreSQL**, and **Redis**.

---

## 🔹 Features

- User signup with **email OTP verification**.  
- Login with **JWT-based authentication**.  
- Create, read, update, and delete notes.  
- Protected routes: only logged-in users can access their notes.  
- Responsive dashboard with **React components**.  
- Expand/collapse notes for better UX.  

---

## 🛠 Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, React Router  
- **Backend:** Node.js, Express, Prisma, PostgreSQL, Redis, JWT, bcrypt  
- **Email service:** Nodemailer (Gmail)  
- **Package manager:** npm or yarn  

---

## ⚡ Installation

git clone https://github.com/PulkitPokhriyal/Note-making-app.git
```bash
cd Note-making-app
```

### 2.Backend Setup
```bash
cd backend
npm install
```
Create a .env file in the backend folder:
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
REDIS_URL="redis://localhost:6379"
EMAIL_USER="your-email@gmail.com"
PASS_USER="your-email-password"
JWT_PASSWORD="your-secret"

### 3. Frontend setup
```bash
cd frontend.
npm install.
```
In config.ts change the BACKEND_URL.

### 🚀 Running the Project
### For Backend
```bash
cd backend.
npm run dev.
```
### For Frontend
```bash
cd frontend. 
npm run dev.
```
