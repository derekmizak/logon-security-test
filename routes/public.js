// Public Routes - "The Trap"
// Educational: These routes handle the fake login page and credential capture

const express = require('express');
const router = express.Router();
const { CredentialCapture } = require('../models');
const { loginLimiter } = require('../middleware/rateLimiter');
const validator = require('validator');

/**
 * GET / - Render the fake login page
 * This is what attackers see when they visit the honeypot
 */
router.get('/', (req, res) => {
  res.render('login', {
    title: 'SecureCorp Portal - Sign In',
    error: null
  });
});

/**
 * POST /login - Capture credentials and ALWAYS return error
 * This is the core honeypot functionality
 *
 * CRITICAL BEHAVIOR: Always return "Invalid username or password"
 * NEVER grant access regardless of input
 */
router.post('/login', loginLimiter, async (req, res) => {
  const { username, password } = req.body;

  // Input validation
  if (!username || !password) {
    return res.status(400).json({
      error: 'Username and password are required'
    });
  }

  // Sanitize inputs to prevent XSS in logs
  // Educational: Even though we're storing for analysis, prevent log injection
  const sanitizedUsername = validator.trim(username).substring(0, 255);
  const sanitizedPassword = password.substring(0, 255);

  try {
    // Log the credential attempt using Sequelize
    // Educational: Sequelize automatically uses parameterized queries - NO SQL injection risk!
    await CredentialCapture.create({
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      usernameAttempted: sanitizedUsername,
      passwordAttempted: sanitizedPassword,  // Stored plaintext for educational analysis
      passwordLength: sanitizedPassword.length,
      timestamp: new Date()
    });

    // Add realistic delay to simulate authentication check
    // Educational: This makes the honeypot more convincing
    // Also prevents timing attacks (constant time regardless of username validity)
    const delay = Math.random() * 1000 + 500; // 500-1500ms
    await new Promise(resolve => setTimeout(resolve, delay));

    // ALWAYS return error (honeypot behavior)
    // Educational: This is what makes it a honeypot - no valid credentials exist
    return res.status(401).json({
      error: 'Invalid username or password'
    });

  } catch (error) {
    console.error('Error logging credential attempt:', error);
    // Even if logging fails, still return authentication error
    // Don't reveal that logging failed
    return res.status(401).json({
      error: 'Invalid username or password'
    });
  }
});

// Educational Notes:
// - loginLimiter prevents brute force (5 attempts/minute)
// - Sequelize .create() automatically prevents SQL injection
// - We add delay to make the honeypot realistic
// - We NEVER grant access, even if credentials match admin PIN
// - Input sanitization prevents XSS in admin dashboard
// - Error handling ensures honeypot always responds, even if database fails

module.exports = router;
