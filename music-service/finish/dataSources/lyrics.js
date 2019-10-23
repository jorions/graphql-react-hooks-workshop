'use strict'

const { RESTDataSource } = require('apollo-datasource-rest')

// Use the RESTDataSource class to automatically get caching, deduplication, and error handling

class LyricsAPI extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = 'https://api.lyrics.ovh/v1/'
  }

  async getLyrics({ artist, name }) {
    try {
      const { lyrics } = await this.get(`${artist}/${name}`)
      return lyrics
    } catch (err) {
      // Just return nothing if we fail to fetch the lyrics because the API is down
      return err.extensions.response ? null : { error: 'noLyrics' }
    }
  }
}

module.exports = LyricsAPI
