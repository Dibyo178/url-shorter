URL Shortener ServiceA full-stack URL shortening application built with React, Node.js, Express, and MySQL. This service allows users to create account-based shortened links, track click analytics, and manage their links through a dashboard.1. Setup InstructionsPrerequisitesNode.js (v16.x or higher)MySQL (v8.x)NPM or YarnDatabase SetupOpen your MySQL terminal or phpMyAdmin.Create a database named url_shortener_db.Run the following SQL queries to create the necessary tables:SQLCREATE TABLE Users (
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
Backend InstallationNavigate to the server directory.Install dependencies:Bashnpm install
Update database credentials in db.js.Update Nodemailer credentials in index.js.Start the server:Bashnode index.js
Frontend InstallationNavigate to the client directory.Install dependencies:Bashnpm install
Start the development server:Bashnpm run dev
2. Project StructurePlaintext.
├── server/
│   ├── db.js             # MySQL connection configuration
│   ├── index.js          # Express server and API endpoints
│   └── package.json      # Backend dependencies
├── client/
│   ├── src/
│   │   ├── components/   # UI Pages (LoginPage, HomePage, OtpPage)
│   │   └── App.jsx       # Routing and Main Entry
│   └── package.json      # Frontend dependencies
└── README.md
3. API DocumentationAuthenticationMethodEndpointDescriptionPOST/api/registerRegister a new user and send OTP.POST/api/verify-otpVerify email via OTP and return JWT token.POST/api/loginAuthenticate user and return JWT token.URL ManagementMethodEndpointDescriptionPOST/api/shortenCreate a short link (Long URL + Email).GET/api/user-linksRetrieve all links associated with an email.DELETE/api/delete-link/:idRemove a link from the database.GET/:short_codeRedirect to the original long URL.Example Request (Shorten URL):JSON{
  "long_url": "https://www.google.com",
  "user_email": "user@example.com"
}
Example Response:JSON{
  "success": true,
  "short_code": "a1b2c3"
}
4. Design DecisionsSecurity: Used bcryptjs for password hashing and jsonwebtoken (JWT) for secure session management.Database: Selected MySQL for relational data mapping between users and their specific generated URLs.State Management: Used React's useState and useEffect for local state, and sessionStorage to persist user login status across refreshes.UI/UX: Implemented Tailwind CSS for a modern, responsive "Dark Mode" aesthetic and Lucide-React for intuitive iconography.Emailing: Integrated Nodemailer with SMTP to handle account verification via 6-digit OTPs.5. Known LimitationsLocal Storage: Currently uses sessionStorage, meaning the user is logged out if the tab is closed.Short Code Collisions: While rare with 6-character hex codes, a collision handling logic (retrying on duplicate) could be improved.Analytics: The current system tracks total clicks but does not store detailed analytics like user location, browser type, or timestamps of individual clicks.Resend OTP: The resend button is visible but the backend logic for re-triggering the email is currently a placeholder.
