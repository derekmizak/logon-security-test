// AdminAccessLog Model
// Educational: This model represents the admin_access_logs table
// Purpose: Audit trail for admin panel access attempts

module.exports = (sequelize, DataTypes) => {
  const AdminAccessLog = sequelize.define('AdminAccessLog', {
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
      comment: 'IP address attempting to access admin panel'
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
      comment: 'When the access attempt occurred'
    },
    pinEntered: {
      type: DataTypes.STRING(10),
      field: 'pin_entered',
      comment: 'PIN code that was entered (for forensic analysis)'
    },
    accessGranted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'access_granted',
      comment: 'Whether the PIN was correct and access was granted'
    },
    sessionId: {
      type: DataTypes.STRING(255),
      field: 'session_id',
      allowNull: true,
      comment: 'Session ID if access was granted (for tracking admin sessions)'
    }
  }, {
    tableName: 'admin_access_logs',
    timestamps: false,
    indexes: [
      {
        name: 'idx_admin_timestamp',
        fields: ['timestamp']
      },
      {
        name: 'idx_admin_ip',
        fields: ['ip_address']
      }
    ],
    comment: 'Educational: Audit trail showing who attempted to access the admin panel'
  });

  // Educational: This table helps identify:
  // - Unauthorized access attempts to admin panel
  // - Patterns in PIN guessing attempts
  // - Need for stronger authentication (students learn why 2FA is important)

  return AdminAccessLog;
};
