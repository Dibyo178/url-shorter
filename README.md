# 🔗 URL Shortener Service

A full‑stack **URL Shortening Application** built with **React**, **Node.js**, **Express**, and **MySQL**.
This service allows users to create account‑based shortened links, track click analytics, and manage links from a secure dashboard.

---

## ✨ Features

* 🔐 User authentication with **Email OTP verification**
* 🔗 Create and manage shortened URLs
* 📊 Click tracking for each short link
* 🧾 User‑specific dashboard
* 🛡️ Secure password hashing and JWT authentication
* 🌙 Clean, modern **dark UI** using Tailwind CSS

---

## 🚀 1. Setup Instructions

### ✅ Prerequisites

Ensure the following are installed on your system:

* **Node.js** (v16.x or higher)
* **MySQL** (v8.x)
* **NPM** or **Yarn**

---

## 🗄️ Database Setup

1. Open **MySQL terminal** or **phpMyAdmin**
2. Create a new database:

```sql
CREATE DATABASE url_shortener_db;
```

3. Select the database and create required tables:

```sql
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    otp VARCHAR(6),
    is_verified BOOLEAN DEFAULT FALSE
);

CREATE TABLE urls (
    id INT AUTO_INCREMENT PRIMARY KEY,
    long_url TEXT,
    short_code VARCHAR(10) UNIQUE,
    user_email VARCHAR(255),
    clicks INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🛠️ Backend Installation

1. Navigate to the **server** directory:

```bash
cd server
```

2. Install dependencies:

```bash
npm install
```

3. Update database credentials in **db.js**
4. Configure **Nodemailer email & app password** inside **index.js**
5. Start the backend server:

```bash
node index.js
```

📌 Server runs by default on: `http://localhost:5001`

---

## 💻 Frontend Installation

1. Navigate to the **client** directory:

```bash
cd client
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

📌 Frontend runs by default on: `http://localhost:5173`

---

## 📁 2. Project Structure

```
├── server/
│   ├── db.js              # MySQL connection configuration
│   ├── index.js           # Express server and API endpoints
│   └── package.json       # Backend dependencies
│
├── client/
│   ├── src/
│   │   ├── components/    # UI Components (Login, Home, OTP)
│   │   └── App.jsx        # Routing & main entry
│   └── package.json       # Frontend dependencies
│
└── README.md
```

---

## 📡 3. API Documentation

### 🔐 Authentication APIs

| Method | Endpoint          | Description                |
| ------ | ----------------- | -------------------------- |
| POST   | `/api/register`   | Register user and send OTP |
| POST   | `/api/verify-otp` | Verify OTP and return JWT  |
| POST   | `/api/login`      | Login user and return JWT  |

---

### 🔗 URL Management APIs

| Method | Endpoint               | Description              |
| ------ | ---------------------- | ------------------------ |
| POST   | `/api/shorten`         | Create a short URL       |
| GET    | `/api/user-links`      | Get all links for a user |
| DELETE | `/api/delete-link/:id` | Delete a URL             |
| GET    | `/:short_code`         | Redirect to original URL |

---

## 💡 4. Design Decisions

* **Security**

  * Password hashing using **bcryptjs**
  * Authentication using **JWT tokens**

* **Database**

  * MySQL for relational data and performance

* **UI/UX**

  * Tailwind CSS
  * Minimal, responsive dark dashboard

---

## ⚠️ 5. Known Limitations

1. **Session Persistence**

   * Uses `sessionStorage` (clears on tab close)

2. **Analytics**

   * Tracks only total clicks (no geo or device info yet)

---



