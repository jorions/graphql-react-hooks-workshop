'use strict'

const SQL = require('sequelize')

module.exports = () => {
  const db = new SQL('', '', '', {
    dialect: 'sqlite',
    storage: '../../store.sqlite',
    logging: false,
  })

  const songs = db.define('song', {
    id: {
      type: SQL.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    artist: SQL.STRING,
    name: SQL.STRING,
    reason: SQL.STRING,
    userId: SQL.INTEGER,
  })

  return { songs }
}
