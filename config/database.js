// Sequelize Database Connection Configuration
// Educational: This file initializes the Sequelize ORM connection
// Different configuration for development (local) vs production (Cloud SQL)

const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.NODE_ENV === 'production') {
  // Production: Connect to Google Cloud SQL via Unix socket
  // Educational: Cloud SQL uses Unix sockets for better performance and security
  sequelize = new Sequelize(
    process.env.DB_NAME || 'honeypot_db',
    process.env.DB_USER || 'honeypot_user',
    process.env.DB_PASS,
    {
      dialect: 'postgres',
      host: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`,
      dialectOptions: {
        socketPath: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`
      },
      logging: false,  // Disable SQL logging in production (performance)
      pool: {
        max: 5,        // Maximum number of connections in pool
        min: 0,        // Minimum number of connections in pool
        acquire: 30000, // Maximum time (ms) to get connection before throwing error
        idle: 10000    // Maximum time (ms) connection can be idle before release
      }
    }
  );
} else {
  // Development: Connect to local PostgreSQL via TCP
  // Educational: Local development uses standard TCP connection
  sequelize = new Sequelize(
    process.env.DB_NAME || 'honeypot_db',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASS || 'postgres',
    {
      dialect: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      logging: console.log,  // Show SQL queries in development (educational)
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
}

// Test the connection
// Educational: Always verify database connection on startup
sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connection established successfully.');
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  })
  .catch(err => {
    console.error('❌ Unable to connect to database:', err);
    console.error('Please check your database configuration and ensure PostgreSQL is running.');
  });

module.exports = sequelize;
