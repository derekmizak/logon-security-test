// Admin Routes - "The Monitor"
// Educational: These routes handle the admin panel for viewing captured data

const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { AppConfig, AdminAccessLog } = require('../models');
const { adminLimiter } = require('../middleware/rateLimiter');
const statsService = require('../services/statsService');

/**
 * Authentication middleware for admin routes
 * Checks if user has a valid admin session
 */
function requireAdminAuth(req, res, next) {
  if (req.session && req.session.isAdmin) {
    // Session exists and user is authenticated
    return next();
  }
  // No valid session - redirect to login
  res.redirect('/admin2430.html');
}

/**
 * Constant-time string comparison
 * Educational: Prevents timing attacks on PIN validation
 */
function safeCompare(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));

  if (bufA.length !== bufB.length) {
    // Different lengths - still do dummy comparison for constant time
    crypto.timingSafeEqual(Buffer.alloc(bufA.length), bufA);
    return false;
  }

  try {
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

/**
 * GET /admin2430.html - Display PIN entry page
 */
router.get('/admin2430.html', (req, res) => {
  // If already authenticated, redirect to dashboard
  if (req.session && req.session.isAdmin) {
    return res.redirect('/admin2430.html/dashboard');
  }

  res.render('admin-login', {
    title: 'Admin Access',
    error: null
  });
});

/**
 * POST /admin2430.html - Validate PIN and create session
 */
router.post('/admin2430.html', adminLimiter, async (req, res) => {
  const { pin } = req.body;
  const ipAddress = req.ip;

  if (!pin) {
    return res.status(400).render('admin-login', {
      title: 'Admin Access',
      error: 'PIN is required'
    });
  }

  try {
    // Fetch the admin PIN from database
    const config = await AppConfig.findOne({
      where: { configKey: 'admin_pin' }
    });

    if (!config) {
      // No admin PIN configured - this shouldn't happen after seeding
      console.error('Admin PIN not found in database!');
      await AdminAccessLog.create({
        ipAddress,
        pinEntered: pin,
        accessGranted: false,
        timestamp: new Date()
      });
      return res.status(500).render('admin-login', {
        title: 'Admin Access',
        error: 'System error - please contact administrator'
      });
    }

    const correctPin = config.configValue;

    // Use constant-time comparison to prevent timing attacks
    // Educational: Prevents attackers from guessing PIN digit-by-digit based on response time
    const isValid = safeCompare(pin, correctPin);

    // Log the access attempt
    await AdminAccessLog.create({
      ipAddress,
      pinEntered: pin,
      accessGranted: isValid,
      sessionId: isValid ? req.sessionID : null,
      timestamp: new Date()
    });

    if (isValid) {
      // PIN is correct - create admin session
      req.session.isAdmin = true;
      req.session.loginTime = new Date();

      // Redirect to dashboard
      return res.redirect('/admin2430.html/dashboard');
    } else {
      // Invalid PIN
      return res.status(401).render('admin-login', {
        title: 'Admin Access',
        error: 'Invalid PIN code'
      });
    }

  } catch (error) {
    console.error('Error during admin authentication:', error);
    return res.status(500).render('admin-login', {
      title: 'Admin Access',
      error: 'System error - please try again'
    });
  }
});

/**
 * GET /admin2430.html/dashboard - Main admin dashboard
 * Requires authentication
 */
router.get('/admin2430.html/dashboard', requireAdminAuth, async (req, res) => {
  try {
    // Fetch overview statistics
    const overviewStats = await statsService.getOverviewStats();

    res.render('admin-dashboard', {
      title: 'Admin Dashboard - Honeypot Monitor',
      stats: overviewStats,
      loginTime: req.session.loginTime
    });

  } catch (error) {
    console.error('Error loading dashboard:', error);
    res.status(500).send('Error loading dashboard');
  }
});

/**
 * GET /admin2430.html/api/stats - API endpoint for chart data
 * Returns JSON data for ECharts visualizations
 * Requires authentication
 */
router.get('/admin2430.html/api/stats', requireAdminAuth, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;

    // Fetch all chart data in parallel
    const [timeline, topIPs, topUsernames, distribution] = await Promise.all([
      statsService.getTimelineData(days),
      statsService.getTopIPs(10),
      statsService.getTopUsernames(20),
      statsService.getRequestDistribution()
    ]);

    res.json({
      timeline,
      topIPs,
      topUsernames,
      distribution
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

/**
 * GET /admin2430.html/api/recent - API endpoint for recent attempts table
 * Supports pagination
 * Requires authentication
 */
router.get('/admin2430.html/api/recent', requireAdminAuth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 25;
    const offset = parseInt(req.query.offset) || 0;

    const data = await statsService.getRecentAttempts(limit, offset);

    res.json(data);

  } catch (error) {
    console.error('Error fetching recent attempts:', error);
    res.status(500).json({ error: 'Failed to fetch recent attempts' });
  }
});

/**
 * POST /admin2430.html/logout - Destroy admin session
 */
router.post('/admin2430.html/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/admin2430.html');
  });
});

// Educational Notes:
// - requireAdminAuth middleware protects all dashboard routes
// - safeCompare prevents timing attacks on PIN validation
// - All admin access attempts are logged (successful and failed)
// - Sessions have 15-minute timeout (configured in app.js)
// - API endpoints return JSON for AJAX chart updates
// - Logout properly destroys session to prevent session fixation

module.exports = router;
