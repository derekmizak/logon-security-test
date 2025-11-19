// Seeder: Insert default admin PIN
// Educational: Seeders insert initial data into the database
// Run with: npm run seed
// Undo with: npm run seed:undo

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Insert the default admin PIN configuration
    // Educational: In production, this should be:
    // 1. Hashed with bcrypt
    // 2. Stored in environment variables or Secret Manager
    // 3. Changed immediately after first login
    await queryInterface.bulkInsert('app_config', [
      {
        config_key: 'admin_pin',
        config_value: '3591',
        description: 'Admin panel access PIN - CHANGE THIS IN PRODUCTION!',
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the admin PIN configuration
    await queryInterface.bulkDelete('app_config', {
      config_key: 'admin_pin'
    }, {});
  }
};
