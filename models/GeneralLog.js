// GeneralLog Model
// Educational: This model represents the general_logs table
// Purpose: Captures every HTTP request to analyze overall traffic patterns (the "Watcher")

module.exports = (sequelize, DataTypes) => {
  const GeneralLog = sequelize.define('GeneralLog', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: 'Auto-incrementing primary key'
    },
    ipAddress: {
      type: DataTypes.STRING(45),
      allowNull: false,
      field: 'ip_address',  // Maps camelCase to snake_case in database
      validate: {
        isIP: true  // Sequelize validates this is a valid IP address
      },
      comment: 'Client IP address - useful for identifying repeat attackers (supports IPv4 and IPv6)'
    },
    userAgent: {
      type: DataTypes.TEXT,
      field: 'user_agent',
      comment: 'Browser/client user agent string'
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
      comment: 'When the request was made'
    },
    requestMethod: {
      type: DataTypes.STRING(10),
      field: 'request_method',
      comment: 'HTTP method: GET, POST, PUT, DELETE, etc.'
    },
    requestPath: {
      type: DataTypes.STRING(255),
      field: 'request_path',
      comment: 'URL path requested'
    },
    referer: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'Referrer - where did the request come from?'
    }
  }, {
    tableName: 'general_logs',
    timestamps: false,  // We manage timestamp manually
    indexes: [
      {
        name: 'idx_general_timestamp',
        fields: ['timestamp']
      },
      {
        name: 'idx_general_ip',
        fields: ['ip_address']
      },
      {
        name: 'idx_general_path',
        fields: ['request_path']
      }
    ],
    comment: 'Educational: Logs all HTTP requests to understand traffic patterns and attack surface'
  });

  // Educational: Sequelize automatically handles:
  // - SQL injection prevention (parameterized queries)
  // - Field name mapping (camelCase ↔ snake_case)
  // - Type validation (isIP validator)

  return GeneralLog;
};
