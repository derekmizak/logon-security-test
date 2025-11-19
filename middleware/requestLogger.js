// Request Logger Middleware - "The Watcher"
// Educational: This middleware logs EVERY HTTP request to the database
// Purpose: Understand the complete attack surface and traffic patterns

const { GeneralLog } = require('../models');

/**
 * Request logging middleware
 * Fires on every request before any route handler
 * Uses fire-and-forget pattern (non-blocking) for performance
 */
async function requestLogger(req, res, next) {
  try {
    // Educational: Fire-and-forget pattern
    // We don't await this - logging happens asynchronously
    // This prevents logging from slowing down the response
    GeneralLog.create({
      ipAddress: req.ip || req.connection.remoteAddress,  // Get client IP
      userAgent: req.get('user-agent'),                   // Get browser/client info
      timestamp: new Date(),
      requestMethod: req.method,                          // GET, POST, etc.
      requestPath: req.path,                              // URL path
      referer: req.get('referer') || null                // Where they came from
    }).catch(err => {
      // Log errors but don't crash the app
      // Educational: Logging failures shouldn't break the honeypot
      console.error('Error logging request:', err);
    });

    // Continue to next middleware/route handler immediately
    // Don't wait for database write to complete
    next();
  } catch (error) {
    // If middleware itself fails, still continue
    console.error('Request logger middleware error:', error);
    next();
  }
}

// Educational Notes:
// - req.ip: Express automatically parses IP from X-Forwarded-For header (important for proxies/load balancers)
// - Fire-and-forget: We don't await the database write to keep responses fast
// - Error handling: Never crash the honeypot because logging failed
// - Sequelize automatically:
//   * Uses parameterized queries (prevents SQL injection)
//   * Maps camelCase (ipAddress) to snake_case (ip_address) in database
//   * Validates IP addresses (from model definition)

module.exports = requestLogger;
