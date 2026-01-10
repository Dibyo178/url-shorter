const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const db = require('./db'); 

const app = express();

// 1. CORS Configuration
// Configured to allow requests from the Vite/React frontend
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true
}));
app.use(express.json());

const JWT_SECRET = 'your_super_secret_key_123'; 

// 2. Nodemailer Setup for Email Services
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, 
    auth: {
        user: 'dibyopurkayastha@gmail.com', 
        pass: 'goax rngr jfsf omwu' 
    },
    tls: { rejectUnauthorized: false }
});

// 3. Health Check Route
app.get('/', (req, res) => {
    res.send("User Shortener API Server is running successfully!");
});

// 4. User Registration Route
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;
    // Generate a 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = "INSERT INTO Users (name, email, password, otp, is_verified) VALUES (?, ?, ?, ?, FALSE)";
        
        db.query(sql, [name, email, hashedPassword, otp], (err, result) => {
            if (err) return res.status(400).json({ success: false, message: "Email already exists!" });

            // Prepare verification email
            const mailOptions = {
                from: '"URL Shortener Service" <dibyopurkayastha@gmail.com>',
                to: email,
                subject: 'Verify Your Account',
                html: `<h1>Your OTP is: ${otp}</h1>`
            };

            // Send OTP via email
            transporter.sendMail(mailOptions, (mailErr) => {
                res.status(200).json({ 
                    success: true, 
                    message: "Account Created! OTP sent to email.", 
                    email: email 
                });
            });
        });
    } catch (e) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// 5. OTP Verification Route
// Handles account activation and initial session data generation
app.post('/api/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    const sql = "SELECT * FROM Users WHERE email = ? AND otp = ?";
    db.query(sql, [email, otp], (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).json({ success: false, message: "Invalid OTP! Please check again." });
        }

        const user = results[0];
        // Set user as verified and clear the used OTP
        const updateSql = "UPDATE Users SET is_verified = TRUE, otp = NULL WHERE id = ?";
        db.query(updateSql, [user.id], (updErr) => {
            if (updErr) return res.status(500).json({ message: "Verification failed" });

            // Generate JWT Token for persistence
            const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });
            res.json({
                success: true,
                message: "Verified Successfully!",
                token,
                userName: user.name,
                userEmail: user.email 
            });
        });
    });
});

// 6. User Login Route
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    db.query("SELECT * FROM Users WHERE email = ?", [email], async (err, results) => {
        if (results.length === 0) return res.status(404).json({ message: "User not found" });
        
        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Wrong password" });

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ 
            success: true, 
            token, 
            userName: user.name,
            userEmail: user.email 
        });
    });
});

// 7. URL Shortening Route
// Includes validation for user email and a 100-link limit check
app.post('/api/shorten', (req, res) => {
    const { long_url, user_email } = req.body;

    if (!user_email) {
        return res.status(400).json({ success: false, message: "User email is missing. Please re-login." });
    }

    // Check link usage limit
    db.query("SELECT COUNT(*) as count FROM urls WHERE user_email = ?", [user_email], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: "DB Error" });
        
        if (results[0].count >= 100) {
            return res.status(400).json({ success: false, message: "Limit reached! (100/100)" });
        }

        // Generate a random 6-character hex code for the shortened URL
        const short_code = crypto.randomBytes(3).toString('hex'); 
        const sql = "INSERT INTO urls (long_url, short_code, user_email, clicks) VALUES (?, ?, ?, 0)";
        
        db.query(sql, [long_url, short_code, user_email], (err) => {
            if (err) return res.status(500).json({ success: false, message: "Error creating link" });
            res.json({ success: true, short_code });
        });
    });
});

// 8. Fetch All User Links Route
app.get('/api/user-links', (req, res) => {
    const email = req.query.email;
    const sql = "SELECT * FROM urls WHERE user_email = ? ORDER BY created_at DESC";
    db.query(sql, [email], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: "Database Error" });
        res.json({ success: true, links: results });
    });
});

// 9. Delete Shortened Link Route
app.delete('/api/delete-link/:id', (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM urls WHERE id = ?", [id], (err) => {
        if (err) return res.status(500).json({ success: false, message: "Delete failed" });
        res.json({ success: true, message: "Deleted successfully" });
    });
});

// 10. URL Redirection Handler
// This must remain at the bottom of the route definitions
app.get('/:short_code', (req, res) => {
    const { short_code } = req.params;
    const sql = "SELECT long_url FROM urls WHERE short_code = ?";
    
    db.query(sql, [short_code], (err, results) => {
        if (err || results.length === 0) return res.status(404).send("URL not found");
        
        // Increment the click counter asynchronously
        db.query("UPDATE urls SET clicks = clicks + 1 WHERE short_code = ?", [short_code]);
        // Perform the redirect
        res.redirect(results[0].long_url);
    });
});

const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));