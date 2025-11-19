// CredentialCapture Model
// Educational: This model represents the credential_capture table
// Purpose: Stores all login attempts (the "Trap" - core honeypot functionality)

module.exports = (sequelize, DataTypes) => {
  const CredentialCapture = sequelize.define('CredentialCapture', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ipAddress: {
      type: DataTypes.STRING(45),
      allowNull: false,
      field: 'ip_address',
      validate: {
        isIP: true
      },
      comment: 'IP address of the attacker attempting to log in'
    },
    userAgent: {
      type: DataTypes.TEXT,
      field: 'user_agent',
      comment: 'User agent string of the attacking client'
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
      comment: 'When the login attempt occurred'
    },
    usernameAttempted: {
      type: DataTypes.STRING(255),
      field: 'username_attempted',
      validate: {
        len: [0, 255]  // Ensure username is not too long
      },
      comment: 'Username the attacker tried to use'
    },
    passwordAttempted: {
      type: DataTypes.STRING(255),
      field: 'password_attempted',
      comment: 'WARNING: Stored in plaintext for educational analysis - NEVER do this in production systems!'
    },
    passwordLength: {
      type: DataTypes.INTEGER,
      field: 'password_length',
      comment: 'Length of attempted password - useful for pattern analysis without storing full password'
    }
  }, {
    tableName: 'credential_capture',
    timestamps: false,
    indexes: [
      {
        name: 'idx_credential_timestamp',
        fields: ['timestamp']
      },
      {
        name: 'idx_credential_ip',
        fields: ['ip_address']
      },
      {
        name: 'idx_credential_username',
        fields: ['username_attempted']
      }
    ],
    comment: 'Educational: Captures login attempts for attack pattern analysis'
  });

  // Educational Notes:
  // - This honeypot intentionally stores passwords in plaintext for analysis
  // - Production applications MUST hash passwords with bcrypt/Argon2
  // - Sequelize validators (len, isIP) provide automatic input validation
  // - Indexes improve query performance for dashboard analytics

  return CredentialCapture;
};
