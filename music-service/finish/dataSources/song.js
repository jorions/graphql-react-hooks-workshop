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

  /**
   * This is a function that gets called by ApolloServer when being set up.
   * This function gets called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests
   */
  initialize(config) {
    this.context = config.context
  }

  async recentFavorites() {
    const songs = await this.store.songs.findAll({ limit: 20, order: [['createdAt', 'DESC']] })
    return songs.map(formatSong)
  }

  async findById({ id }) {
    const song = await this.store.songs.findOne({ where: { id } })
    return song ? formatSong(song) : { error: 'noSong' }
  }

  async findByUserId({ userId }) {
    const songs = await this.store.songs.findAll({ where: { userId }, order: [['createdAt', 'DESC']] })
    return songs.map(formatSong)
  }

  async addFavorite({ artist, name, reason, userId }) {
    if (!artist || !name || !reason) return { error: 'incompleteData' }
    const song = await this.store.songs.create({ artist, name, reason, userId })
    return formatSong(song)
  }

  async updateFavorite({ id, reason, userId }) {
    let song = await this.store.songs.findOne({ where: { id } })
    if (!song) return { error: 'noSong' }
    if (formatSong(song).userId !== userId) return { error: 'invalidSong' }
    song = await song.update({ reason })
    return formatSong(song)
  }

  async removeFavorite({ id, userId }) {
    let song = await this.store.songs.findOne({ where: { id } })
    if (!song) return { error: 'noSong' }
    if (formatSong(song).userId !== userId) return { error: 'invalidSong' }
    song = await song.destroy()
    return formatSong(song)
  }
}

module.exports = SongAPI
