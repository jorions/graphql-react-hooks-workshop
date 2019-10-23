'use strict'

const SQL = require('sequelize')

module.exports = () => {
  const db = new SQL('', '', '', {
    dialect: 'sqlite',
    storage: '../../store.sqlite',
    logging: false,
  })

  const users = db.define('user', {
    id: {
      type: SQL.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: SQL.STRING,
    password: SQL.STRING,
    salt: SQL.STRING,
  })

  return { users }
}
