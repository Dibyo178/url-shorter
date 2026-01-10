# 🔗 ZipLink - URL Shortener Service

A full-stack URL shortening application built with **React**, **Node.js**, **Express**, and **MySQL**. This service allows users to create account-based shortened links, track click analytics, and manage their links through a dashboard.

---

## 🚀 1. Setup Instructions

### Prerequisites
* **Node.js** (v16.x or higher)
* **MySQL** (v8.x)
* **NPM** or **Yarn**

### 🗄️ Database Setup
1. Open your MySQL terminal or phpMyAdmin.
2. Create a database named `url_shortener_db`.
3. Run the following SQL queries to create the necessary tables:

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

🛠️ Backend Installation

 1.Navigate to the server directory:

  cd server

2.Install dependencies:

 npm install

3.Update database credentials in db.js.
4.Update Nodemailer credentials in index.js.
5.Start the server:

node index.js

💻 Frontend Installation
 1.Navigate to the client directory:

 cd client

 2.Install dependencies:

  npm install

 3.Start the development server:

 npm run dev

 📁 2. Project Structure
 ├── server/
│   ├── db.js             # MySQL connection configuration
│   ├── index.js          # Express server and API endpoints
│   └── package.json      # Backend dependencies
├── client/
│   ├── src/
│   │   ├── components/   # UI (LoginPage, HomePage, OtpPage)
│   │   └── App.jsx       # Routing and Main Entry
│   └── package.json      # Frontend dependencies
└── README.md

 📡 3. API Documentation

Method,Endpoint,Description
POST,/api/register,Register a new user and send OTP.
POST,/api/verify-otp,Verify email via OTP and return JWT token.
POST,/api/login,Authenticate user and return JWT token.

 URL Management

Method,Endpoint,Description
POST,/api/shorten,Create a short link (Long URL + Email).
GET,/api/user-links,Retrieve all links associated with an email.
DELETE,/api/delete-link/:id,Remove a link from the database.
GET,/:short_code,Redirect to the original long URL.

💡 4. Design Decisions
 Security: Used bcryptjs for hashing and JWT for session management.

 Database: MySQL for structured data and relational mapping.
 
 UI/UX: Tailwind CSS for a clean dark-themed dashboard.

  ⚠️ 5. Known Limitations
     1. Session Persistence: Currently uses sessionStorage (clears on tab close).

     2. Analytics: Only tracks total clicks, not location or device data.

 
 
