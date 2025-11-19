// Migration: Create general_logs table
// Educational: This migration creates the table for logging all HTTP requests
// Run with: npm run migrate
// Rollback with: npm run migrate:undo

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create the general_logs table
    await queryInterface.createTable('general_logs', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      ip_address: {
        type: Sequelize.STRING(45),
        allowNull: false,
        comment: 'Client IP address (IPv4 or IPv6)'
      },
      user_agent: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Browser/client user agent string'
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'When the request was made'
      },
      request_method: {
        type: Sequelize.STRING(10),
        allowNull: true,
        comment: 'HTTP method (GET, POST, etc.)'
      },
      request_path: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'URL path requested'
      },
      referer: {
        type: Sequelize.STRING(500),
        allowNull: true,
        comment: 'HTTP referer header'
      }
    });

    // Add indexes for performance
    // Educational: Indexes speed up queries but slightly slow down inserts
    await queryInterface.addIndex('general_logs', ['timestamp'], {
      name: 'idx_general_timestamp'
    });

    await queryInterface.addIndex('general_logs', ['ip_address'], {
      name: 'idx_general_ip'
    });

    await queryInterface.addIndex('general_logs', ['request_path'], {
      name: 'idx_general_path'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Rollback: Drop the table
    // Educational: Always provide a down() method to undo migrations
    await queryInterface.dropTable('general_logs');
  }
};
