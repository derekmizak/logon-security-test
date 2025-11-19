// Migration: Create app_config table
// Educational: This migration creates a simple key-value config table
// Used to store the admin PIN (could be extended for other configuration)

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('app_config', {
      config_key: {
        type: Sequelize.STRING(50),
        primaryKey: true,
        allowNull: false,
        comment: 'Configuration key name'
      },
      config_value: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: 'Configuration value'
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Human-readable description'
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'When this config was last updated'
      }
    });

    // Educational: No indexes needed for small config table
    // Only accessed occasionally, not in hot path
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('app_config');
  }
};
