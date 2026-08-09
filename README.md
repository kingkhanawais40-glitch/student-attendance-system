# Student Attendance Management System

A full-stack **Student Attendance Management System** built with React, Node.js, Express, and SQLite. The system provides role-based access for administrators, teachers, and students to manage students, attendance, reports, and user accounts.

## 🚀 Features

### 🔐 Authentication & Authorization

* JWT-based authentication
* Secure password hashing with bcrypt
* Role-based access control
* Protected frontend routes
* Protected backend API routes
* Admin, Teacher, and Student roles
* Logout and token protection
* Password change functionality

### 👨‍💼 Admin

* View dashboard
* Manage students
* Manage attendance
* View attendance reports
* Manage system users/staff
* Create users
* Delete users
* Account settings

### 👨‍🏫 Teacher

* View dashboard
* View students
* Mark attendance
* View attendance reports
* Change account password

### 👨‍🎓 Student

* Access authorized student functionality
* Protected access to restricted administrative resources

### 📊 Dashboard

* Total students
* Attendance statistics
* Present/absent information
* Attendance rate

### 📋 Attendance

* Mark students as Present or Absent
* Store attendance records by date
* Track who marked attendance
* Attendance history

### 📈 Reports

* Attendance records
* Student attendance information
* Attendance status
* Attendance statistics

### 👥 User Management

* Create system users
* View users
* Delete users
* Role assignment
* Duplicate email protection

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* React Router
* Axios
* CSS

### Backend

* Node.js
* Express.js
* JWT
* bcryptjs
* better-sqlite3

### Database

* SQLite

### Development Tools

* VS Code
* Git
* GitHub
* Nodemon

## 🏗️ Project Structure

```text
student-attendance-system/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── attendanceController.js
│   │   │   ├── authController.js
│   │   │   ├── reportController.js
│   │   │   ├── studentController.js
│   │   │   └── userController.js
│   │   │
│   │   ├── middleware/
│   │   │   └── authMiddleware.js
│   │   │
│   │   ├── routes/
│   │   │   ├── attendanceRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   ├── reportRoutes.js
│   │   │   ├── studentRoutes.js
│   │   │   └── userRoutes.js
│   │   │
│   │   ├── seed.js
│   │   └── server.js
│   │
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   └── Sidebar.css
│   │   ├── page/
│   │   │   └── Dashboard.jsx
│   │   ├── pages/
│   │   │   ├── Attendance.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Reports.jsx
│   │   │   ├── Settings.jsx
│   │   │   ├── Students.jsx
│   │   │   └── Users.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
└── .gitignore
```

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/kingkhanawais40-glitch/student-attendance-system.git
cd student-attendance-system
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
JWT_SECRET=your_secret_key
```

Start the development server:

```bash
npm run dev
```

Or start the backend normally:

```bash
npm start
```

Backend runs on:

```text
http://localhost:5000
```

### 3. Frontend setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The Vite development server will provide the frontend URL in the terminal.

## 🔑 Authentication

The application uses JWT authentication.

After successful login, the authentication token is stored on the client and sent with protected API requests.

Protected resources require a valid authentication token.

## 🔒 Role-Based Access Control

| Feature       | Admin | Teacher | Student |
| ------------- | :---: | :-----: | :-----: |
| Dashboard     |   ✅   |    ✅    |    ✅    |
| Students      |   ✅   |    ✅    |    ❌    |
| Attendance    |   ✅   |    ✅    |    ❌    |
| Reports       |   ✅   |    ✅    |    ❌    |
| Users / Staff |   ✅   |    ❌    |    ❌    |
| Settings      |   ✅   |    ❌    |    ❌    |

Unauthorized API requests return:

```text
403 Forbidden
```

## 🗄️ Database

The development version uses SQLite through `better-sqlite3`.

Main database entities include:

* Users
* Students
* Attendance

The SQLite database file is intentionally excluded from Git through `.gitignore`.

## 🧪 Testing

The application has been manually tested for:

* Successful login
* Invalid password
* Protected routes
* Role-based authorization
* Student access restrictions
* Teacher access permissions
* Admin access permissions
* Attendance marking
* Attendance reports
* Dashboard statistics
* User creation
* Duplicate email protection
* User deletion
* Deleted-user login rejection
* Password change
* Logout and token removal
* Production frontend build
* Backend production startup

## 📦 Production Build

Frontend production build:

```bash
cd frontend
npm run build
```

The production files are generated inside:

```text
frontend/dist/
```

## 🔮 Future Improvements

* PostgreSQL/MySQL production database
* Cloud deployment
* Email notifications
* Attendance export to PDF/Excel
* Advanced analytics
* Student profile management
* Teacher dashboard improvements
* Attendance calendar
* Password reset through email
* Automated testing
* Docker support

## 👨‍💻 Author

**Muhammad Awais**

BS Software Engineering

### GitHub

https://github.com/kingkhanawais40-glitch

---

## 📄 License

This project is developed for educational and portfolio purposes.
