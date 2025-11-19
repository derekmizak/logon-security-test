// Migration: Create admin_access_logs table
// Educational: This migration creates the audit trail for admin panel access
// Helps identify unauthorized access attempts

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('admin_access_logs', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      ip_address: {
        type: Sequelize.STRING(45),
        allowNull: false,
        comment: 'IP attempting to access admin panel'
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'When the access attempt occurred'
      },
      pin_entered: {
        type: Sequelize.STRING(10),
        allowNull: true,
        comment: 'PIN code entered (for forensic analysis)'
      },
      access_granted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether access was granted'
      },
      session_id: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Session ID if access granted'
      }
    });

    // Indexes for audit queries
    await queryInterface.addIndex('admin_access_logs', ['timestamp'], {
      name: 'idx_admin_timestamp'
    });

    await queryInterface.addIndex('admin_access_logs', ['ip_address'], {
      name: 'idx_admin_ip'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('admin_access_logs');
  }
};
