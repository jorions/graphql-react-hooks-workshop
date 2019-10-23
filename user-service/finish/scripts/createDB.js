'use strict'

const sqlite3 = require('sqlite3')

const db = new sqlite3.Database('../../store.sqlite')

db.serialize(() => {
  db.run(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
      email TEXT NOT NULL,
      password TEXT NOT NULL,
      salt TEXT NOT NULL
    );
  `)
})

db.close()
