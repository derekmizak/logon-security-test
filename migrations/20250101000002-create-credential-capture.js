// Migration: Create credential_capture table
// Educational: This migration creates the core honeypot table for capturing login attempts
// This is where all attacker credentials are stored for analysis

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('credential_capture', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      ip_address: {
        type: Sequelize.STRING(45),
        allowNull: false,
        comment: 'IP address of the attacker'
      },
      user_agent: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'User agent of the attacking client'
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'When the login attempt occurred'
      },
      username_attempted: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Username the attacker tried'
      },
      password_attempted: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Password attempted (plaintext for analysis - educational only!)'
      },
      password_length: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Length of password for pattern analysis'
      }
    });

    // Add indexes for dashboard analytics queries
    await queryInterface.addIndex('credential_capture', ['timestamp'], {
      name: 'idx_credential_timestamp'
    });

    await queryInterface.addIndex('credential_capture', ['ip_address'], {
      name: 'idx_credential_ip'
    });

    await queryInterface.addIndex('credential_capture', ['username_attempted'], {
      name: 'idx_credential_username'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('credential_capture');
  }
};
