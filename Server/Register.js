const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const nodemailer = require('nodemailer');
const db = require('./db'); 

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'your_super_secret_key_123'; 

// ১. Nodemailer সেটআপ
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

// ০. হোম রুট (টেস্ট করার জন্য)
app.get('/', (req, res) => {
    res.send("🚀 ZipLink Server is Running Successfully!");
});

// ২. রেজিস্ট্রেশন রুট (/api/register)
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = "INSERT INTO Users (name, email, password, otp, is_verified) VALUES (?, ?, ?, ?, FALSE)";
        
        db.query(sql, [name, email, hashedPassword, otp], (err, result) => {
            if (err) return res.status(400).json({ success: false, message: "Email already exists!" });

            const mailOptions = {
                from: '"ZipLink Team" <dibyopurkayastha@gmail.com>',
                to: email,
                subject: 'Verify Your Account',
                html: `<h1>Your OTP is: ${otp}</h1>`
            };

            transporter.sendMail(mailOptions, (mailErr) => {
                res.status(200).json({ 
                    success: true, 
                    message: "Account Created! OTP has been sent to your email.", 
                    email: email 
                });
            });
        });
    } catch (e) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// ৩. ওটিপি ভেরিফিকেশন রুট (/api/verify-otp)
app.post('/api/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    
    // ডাটাবেজ থেকে ওটিপি চেক
    const sql = "SELECT * FROM Users WHERE email = ? AND otp = ?";
    db.query(sql, [email, otp], (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).json({ success: false, message: "Invalid OTP! Please check again." });
        }

        const user = results[0];
        const updateSql = "UPDATE Users SET is_verified = TRUE, otp = NULL WHERE id = ?";
        db.query(updateSql, [user.id], (updErr) => {
            if (updErr) return res.status(500).json({ message: "Verification failed" });

            const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });
            res.json({
                success: true,
                message: "Verified Successfully!",
                token,
                userName: user.name
            });
        });
    });
});

// ৪. লগইন রুট
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    db.query("SELECT * FROM Users WHERE email = ?", [email], async (err, results) => {
        if (results.length === 0) return res.status(404).json({ message: "User not found" });
        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Wrong password" });

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ success: true, token, userName: user.name });
    });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));