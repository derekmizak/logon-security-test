// AppConfig Model
// Educational: This model represents the app_config table
// Purpose: Application configuration (currently just admin PIN)

module.exports = (sequelize, DataTypes) => {
  const AppConfig = sequelize.define('AppConfig', {
    configKey: {
      type: DataTypes.STRING(50),
      primaryKey: true,
      field: 'config_key',
      comment: 'Configuration key (e.g., "admin_pin")'
    },
    configValue: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'config_value',
      comment: 'Configuration value'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Human-readable description of this configuration'
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'updated_at',
      comment: 'When this configuration was last updated'
    }
  }, {
    tableName: 'app_config',
    timestamps: false,
    comment: 'Educational: Simple key-value config storage (alternative to environment variables)'
  });

  // Educational: This demonstrates database-driven configuration
  // Production apps often use environment variables or secret management services
  // This pattern is useful when config needs to be changed without redeployment

  return AppConfig;
};
