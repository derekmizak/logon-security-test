// Models Index
// Educational: This file initializes all Sequelize models and exports them
// This centralized approach makes it easy to import models anywhere in the app

const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

// Import all model definitions
// Each model is a function that takes (sequelize, DataTypes) and returns the model
const GeneralLog = require('./GeneralLog')(sequelize, DataTypes);
const CredentialCapture = require('./CredentialCapture')(sequelize, DataTypes);
const AdminAccessLog = require('./AdminAccessLog')(sequelize, DataTypes);
const AppConfig = require('./AppConfig')(sequelize, DataTypes);

// Educational: Define associations here if needed (none for this honeypot)
// Example: User.hasMany(Post) or Post.belongsTo(User)

// Export all models and the sequelize instance
// This allows other files to use: const { CredentialCapture } = require('./models');
module.exports = {
  sequelize,
  GeneralLog,
  CredentialCapture,
  AdminAccessLog,
  AppConfig
};
