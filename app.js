// Main Express Application
// Educational Honeypot for Cloud Deployment and Security Operations
// This app demonstrates CI/CD pipelines, database operations with Sequelize ORM,
// and defensive security concepts through a working honeypot

require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');

// Import database connection (establishes connection on require)
const { sequelize } = require('./models');

// Import middleware
const requestLogger = require('./middleware/requestLogger');

// Import routes
const publicRoutes = require('./routes/public');
const adminRoutes = require('./routes/admin');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 8080;

// ============================================================================
// View Engine Setup
// ============================================================================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ============================================================================
// Middleware Setup
// ============================================================================

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies (from HTML forms)
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Trust proxy (important for getting correct IP addresses behind load balancers)
// Educational: App Engine uses proxies, so we need this to get real client IPs
app.set('trust proxy', true);

// Session configuration
// Educational: Secure session handling for admin panel
app.use(session({
  secret: process.env.SESSION_SECRET || 'change-this-in-production-use-env-var',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',  // HTTPS only in production
    httpOnly: true,                                  // Prevent XSS access to cookie
    maxAge: 15 * 60 * 1000                          // 15-minute timeout
  },
  name: 'sessionId'  // Don't use default 'connect.sid' (security through obscurity)
}));

// Global request logger - "The Watcher"
// Educational: This logs EVERY request before any route handler
app.use(requestLogger);

// ============================================================================
// Routes
// ============================================================================

// Public routes (login page, login attempt capture)
app.use('/', publicRoutes);

// Admin routes (admin panel, dashboard, API endpoints)
app.use('/', adminRoutes);

// Health check endpoint (for App Engine health checks)
// Educational: App Engine uses this to verify the app is running
// Do NOT log health checks (would create noise in logs)
app.get('/health', async (req, res) => {
  try {
    // Check database connectivity
    await sequelize.authenticate();
    res.status(200).json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      status: 'error',
      database: 'disconnected',
      error: error.message
    });
  }
});

// 404 handler - catch all unmatched routes
app.use((req, res) => {
  // Educational: Log 404s to understand scanning/probing attempts
  // These requests are already logged by requestLogger middleware
  res.status(404).send('Not Found');
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Application error:', err);

  // Don't leak error details in production
  const errorMessage = process.env.NODE_ENV === 'production'
    ? 'Internal Server Error'
    : err.message;

  res.status(500).send(errorMessage);
});

// ============================================================================
// Start Server
// ============================================================================

app.listen(PORT, () => {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║  Educational Honeypot - Logon Security Test                ║');
  console.log('║  ⚠️  FOR EDUCATIONAL USE ONLY                              ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('');
  console.log('📋 Available endpoints:');
  console.log(`   Public Login:  http://localhost:${PORT}/`);
  console.log(`   Admin Panel:   http://localhost:${PORT}/admin2430.html`);
  console.log(`   Health Check:  http://localhost:${PORT}/health`);
  console.log('');
  console.log('🔐 Default Admin PIN: 3591');
  console.log('');
  console.log('Press Ctrl+C to stop the server');
  console.log('');
});

// Graceful shutdown
// Educational: Clean up database connections on shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\nSIGINT received, shutting down gracefully...');
  await sequelize.close();
  process.exit(0);
});

// Educational Notes:
// - This file sets up the complete Express application
// - Request logger runs on EVERY request (even 404s)
// - Sessions are secure (httpOnly, HTTPS in production)
// - Health endpoint for App Engine monitoring
// - Graceful shutdown closes database connections
// - Environment-specific configuration (dev vs prod)
// - Trust proxy setting is critical for App Engine

module.exports = app;  // Export for testing
