'use strict'

const { DataSource } = require('apollo-datasource')

const formatSong = ({ dataValues: { createdAt, artist, name, reason, id, userId } }) => ({
  createdAt,
  artist,
  name,
  reason,
  id,
  userId,
})

// Use the DataSource class to automatically get caching, deduplication, and error handling
class SongAPI extends DataSource {
  constructor({ store }) {
    super()
    this.store = store
  }

  async recentFavorites() {
    const songs = await this.store.songs.findAll({ limit: 20, order: [['createdAt', 'DESC']] })
    return songs.map(formatSong)
  }
}

module.exports = SongAPI
