// Rate Limiter Middleware
// Educational: Prevents abuse by limiting requests per IP address
// Uses express-rate-limit package

const rateLimit = require('express-rate-limit');

/**
 * Rate limiter for login endpoint
 * Prevents brute force attacks on the honeypot itself
 * Max 5 attempts per IP per minute
 */
const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,  // 1 minute window
  max: 5,                    // Max 5 requests per window per IP
  message: {
    error: 'Too many login attempts from this IP, please try again later.'
  },
  standardHeaders: true,     // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false,      // Disable `X-RateLimit-*` headers
  // Skip successful requests (only count failed attempts)
  // Educational: This allows legitimate users to retry without being blocked
  skipSuccessfulRequests: false,  // Set to true if you want to only count failures
  // Handler when limit is exceeded
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many login attempts. Please try again later.'
    });
  }
});

/**
 * Rate limiter for admin panel
 * Stricter than login limiter
 * Max 3 PIN attempts per IP per hour
 */
const adminLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,  // 1 hour window
  max: 3,                     // Max 3 attempts per hour
  message: {
    error: 'Too many admin access attempts from this IP. Access temporarily blocked.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    // Educational: Log rate limit violations for analysis
    console.warn(`Rate limit exceeded for admin panel from IP: ${req.ip}`);
    res.status(429).json({
      error: 'Too many admin access attempts. Try again later.'
    });
  }
});

// Educational Notes:
// - Rate limiting is per IP address (tracked in memory by default)
// - For production with multiple instances, use Redis for distributed rate limiting
// - These limits prevent attackers from flooding the honeypot
// - But they're lenient enough to capture attack patterns
// - Students can adjust these values based on their threat model

module.exports = {
  loginLimiter,
  adminLimiter
};
