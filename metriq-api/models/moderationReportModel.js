// likeModel.js

const config = require('../config')
const { Sequelize, Model, DataTypes } = require('sequelize')
const sequelize = new Sequelize(config.pgConnectionString, { logging: false })
const User = require('./userModel')

class ModerationReport extends Model {
  static associate (db) {
    db.user.hasMany(db.moderationReport)
  }
}
ModerationReport.init({
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  resolvedAt: {
    type: DataTypes.DATE
  }
}, { sequelize, modelName: 'moderationReport' })

User.hasMany(ModerationReport)

module.exports = ModerationReport
