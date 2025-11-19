// Basic Test Suite for CI/CD Pipeline
// Educational: Simple tests that verify core functionality
//
// Purpose:
// 1. Catch breaking changes before deployment
// 2. Demonstrate CI/CD testing phase
// 3. Provide examples for students to expand
//
// Note: This uses Node.js built-in assert module (no test framework needed)
// For production, consider Jest, Mocha, or Vitest

const assert = require('assert');
const path = require('path');

console.log('════════════════════════════════════════════════════════════');
console.log('Running Basic Test Suite');
console.log('════════════════════════════════════════════════════════════');
console.log('');

// Test counter
let passed = 0;
let failed = 0;

// Helper function to run a test
function test(description, fn) {
  try {
    fn();
    console.log(`✅ PASS: ${description}`);
    passed++;
  } catch (error) {
    console.log(`❌ FAIL: ${description}`);
    console.log(`   Error: ${error.message}`);
    failed++;
  }
}

// ============================================================================
// Test 1: Configuration Files Exist
// ============================================================================
console.log('Test Group: Configuration Files');
console.log('────────────────────────────────────────────────────────────');

test('Package.json exists and is valid JSON', () => {
  const pkg = require('../package.json');
  assert(pkg.name, 'package.json must have a name');
  assert(pkg.version, 'package.json must have a version');
  assert(pkg.dependencies, 'package.json must have dependencies');
});

test('Package.json has required dependencies', () => {
  const pkg = require('../package.json');
  const required = ['express', 'sequelize', 'pg', 'ejs', 'dotenv', 'express-session'];

  required.forEach(dep => {
    assert(pkg.dependencies[dep], `Missing dependency: ${dep}`);
  });
});

test('Package.json has required scripts', () => {
  const pkg = require('../package.json');
  const required = ['start', 'migrate', 'seed'];

  required.forEach(script => {
    assert(pkg.scripts[script], `Missing script: ${script}`);
  });
});

test('Sequelize configuration exists', () => {
  const fs = require('fs');
  assert(fs.existsSync('.sequelizerc'), '.sequelizerc file must exist');
  assert(fs.existsSync('config/config.json'), 'config/config.json must exist');
});

console.log('');

// ============================================================================
// Test 2: Sequelize Models Exist
// ============================================================================
console.log('Test Group: Sequelize Models');
console.log('────────────────────────────────────────────────────────────');

test('Models directory exists with all models', () => {
  const fs = require('fs');
  const models = [
    'models/index.js',
    'models/GeneralLog.js',
    'models/CredentialCapture.js',
    'models/AdminAccessLog.js',
    'models/AppConfig.js'
  ];

  models.forEach(model => {
    assert(fs.existsSync(model), `Model file must exist: ${model}`);
  });
});

test('Models can be required without errors', () => {
  // Educational: This test verifies Sequelize syntax is correct
  // Note: Doesn't test database connectivity (would fail in CI without DB)
  const models = require('../models');

  assert(models.sequelize, 'models/index.js must export sequelize instance');
  assert(models.GeneralLog, 'models must export GeneralLog');
  assert(models.CredentialCapture, 'models must export CredentialCapture');
  assert(models.AdminAccessLog, 'models must export AdminAccessLog');
  assert(models.AppConfig, 'models must export AppConfig');
});

console.log('');

// ============================================================================
// Test 3: Migrations Exist
// ============================================================================
console.log('Test Group: Database Migrations');
console.log('────────────────────────────────────────────────────────────');

test('Migrations directory exists with all migrations', () => {
  const fs = require('fs');
  assert(fs.existsSync('migrations'), 'migrations directory must exist');

  const files = fs.readdirSync('migrations');
  const migrationFiles = files.filter(f => f.endsWith('.js'));

  assert(migrationFiles.length >= 4, `Expected at least 4 migrations, found ${migrationFiles.length}`);
});

test('All migrations have up and down methods', () => {
  const fs = require('fs');
  const files = fs.readdirSync('migrations').filter(f => f.endsWith('.js'));

  files.forEach(file => {
    const migration = require(`../migrations/${file}`);
    assert(typeof migration.up === 'function', `${file} must have up() method`);
    assert(typeof migration.down === 'function', `${file} must have down() method`);
  });
});

console.log('');

// ============================================================================
// Test 4: Middleware Exists
// ============================================================================
console.log('Test Group: Middleware');
console.log('────────────────────────────────────────────────────────────');

test('Middleware files exist', () => {
  const fs = require('fs');
  assert(fs.existsSync('middleware/requestLogger.js'), 'requestLogger.js must exist');
  assert(fs.existsSync('middleware/rateLimiter.js'), 'rateLimiter.js must exist');
});

test('Request logger is a valid middleware function', () => {
  const requestLogger = require('../middleware/requestLogger');
  assert(typeof requestLogger === 'function', 'requestLogger must be a function');
  assert(requestLogger.length === 3, 'requestLogger must accept (req, res, next)');
});

test('Rate limiters export valid middleware', () => {
  const { loginLimiter, adminLimiter } = require('../middleware/rateLimiter');
  assert(typeof loginLimiter === 'function', 'loginLimiter must be middleware function');
  assert(typeof adminLimiter === 'function', 'adminLimiter must be middleware function');
});

console.log('');

// ============================================================================
// Test 5: Routes Exist
// ============================================================================
console.log('Test Group: Routes');
console.log('────────────────────────────────────────────────────────────');

test('Route files exist', () => {
  const fs = require('fs');
  assert(fs.existsSync('routes/public.js'), 'public.js route must exist');
  assert(fs.existsSync('routes/admin.js'), 'admin.js route must exist');
});

test('Routes export Express routers', () => {
  const publicRoutes = require('../routes/public');
  const adminRoutes = require('../routes/admin');

  assert(typeof publicRoutes === 'function', 'public routes must export router');
  assert(typeof adminRoutes === 'function', 'admin routes must export router');
});

console.log('');

// ============================================================================
// Test 6: Services Exist
// ============================================================================
console.log('Test Group: Services');
console.log('────────────────────────────────────────────────────────────');

test('Stats service exists', () => {
  const fs = require('fs');
  assert(fs.existsSync('services/statsService.js'), 'statsService.js must exist');
});

test('Stats service exports required functions', () => {
  const statsService = require('../services/statsService');

  const required = [
    'getTimelineData',
    'getTopIPs',
    'getTopUsernames',
    'getOverviewStats',
    'getRequestDistribution',
    'getRecentAttempts'
  ];

  required.forEach(fn => {
    assert(typeof statsService[fn] === 'function', `statsService must export ${fn}()`);
  });
});

console.log('');

// ============================================================================
// Test 7: Main Application
// ============================================================================
console.log('Test Group: Main Application');
console.log('────────────────────────────────────────────────────────────');

test('App.js exists and exports Express app', () => {
  const app = require('../app');
  assert(app, 'app.js must export Express application');
  assert(typeof app.listen === 'function', 'app must be an Express instance');
});

console.log('');

// ============================================================================
// Test 8: Environment Configuration
// ============================================================================
console.log('Test Group: Environment Configuration');
console.log('────────────────────────────────────────────────────────────');

test('Environment template exists', () => {
  const fs = require('fs');
  assert(fs.existsSync('.env.template'), '.env.template must exist');
});

test('Environment template has required variables', () => {
  const fs = require('fs');
  const template = fs.readFileSync('.env.template', 'utf8');

  const required = ['DB_USER', 'DB_PASS', 'DB_NAME', 'DB_HOST', 'SESSION_SECRET'];

  required.forEach(variable => {
    assert(template.includes(variable), `.env.template must include ${variable}`);
  });
});

console.log('');

// ============================================================================
// Test 9: Security Configuration
// ============================================================================
console.log('Test Group: Security Configuration');
console.log('────────────────────────────────────────────────────────────');

test('Session configuration uses secure settings', () => {
  // Educational: This test verifies secure session configuration
  // Check app.js for session middleware setup
  const fs = require('fs');
  const appContent = fs.readFileSync('app.js', 'utf8');

  assert(appContent.includes('httpOnly: true'), 'Sessions must use httpOnly cookies');
  assert(appContent.includes("'trust proxy'"), 'App must trust proxy for correct IP addresses');
});

test('Rate limiting is configured', () => {
  const fs = require('fs');
  const publicRoutes = fs.readFileSync('routes/public.js', 'utf8');
  const adminRoutes = fs.readFileSync('routes/admin.js', 'utf8');

  assert(publicRoutes.includes('loginLimiter') || publicRoutes.includes('Limiter'),
    'Public routes should use rate limiting');
  assert(adminRoutes.includes('adminLimiter') || adminRoutes.includes('Limiter'),
    'Admin routes should use rate limiting');
});

console.log('');

// ============================================================================
// Test Summary
// ============================================================================
console.log('════════════════════════════════════════════════════════════');
console.log('Test Summary');
console.log('════════════════════════════════════════════════════════════');
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`📊 Total:  ${passed + failed}`);
console.log('');

if (failed > 0) {
  console.log('❌ Some tests failed. Fix the issues above and try again.');
  console.log('');
  process.exit(1);  // Exit with error code (stops CI/CD pipeline)
} else {
  console.log('✅ All tests passed! Ready for deployment.');
  console.log('');
  process.exit(0);  // Exit with success code (continues CI/CD pipeline)
}

// Educational Notes:
//
// 1. TEST PHILOSOPHY:
//    - These are "smoke tests" - verify basic functionality
//    - Not comprehensive (no integration tests, no database tests)
//    - Purpose: Catch obvious errors before deployment
//
// 2. WHY NO DATABASE TESTS?
//    - CI/CD environment doesn't have database access
//    - Database tests belong in integration test suite
//    - Run integration tests separately (not in build pipeline)
//
// 3. EXPANDING THIS TEST SUITE:
//    Students can add:
//    - Input validation tests (test sanitization functions)
//    - Security tests (test constant-time comparison)
//    - API tests (test route responses with supertest)
//    - Model validation tests (test Sequelize validators)
//
// 4. RUNNING TESTS LOCALLY:
//    npm test
//    (or: node test/basic.test.js)
//
// 5. RUNNING TESTS IN CI/CD:
//    Cloud Build runs: npm test
//    If exit code != 0, build fails and deployment is prevented
//
// 6. TEST FRAMEWORKS (for more advanced testing):
//    - Jest: Feature-rich, includes mocking, snapshots
//    - Mocha + Chai: Flexible, large ecosystem
//    - Vitest: Fast, modern, Vite-compatible
//    - Supertest: HTTP assertion library for API testing
//
// 7. CODE COVERAGE:
//    Add to package.json:
//    "test": "jest --coverage"
//
//    This generates coverage reports showing which code is tested
