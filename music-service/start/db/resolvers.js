'use strict'

module.exports = {
  Query: {
    recentFavorites: (_, __, { dataSources }) => dataSources.songAPI.recentFavorites(),
    song: async (_, { id }, { dataSources }) => {
      const song = await dataSources.songAPI.findById({ id })
      if (song.error) return { success: false, message: song.error }

      const { artist, name } = song
      const lyrics = await dataSources.lyricsAPI.getLyrics({ artist, name })

      return lyrics && lyrics.error
        ? { success: false, message: lyrics.error }
        : { success: true, song: { ...song, lyrics } }
    },
  },
  Mutation: {
    addFavorite: async (_, { artist, name, reason }) => {},
    updateFavorite: async (_, { id, reason }) => {},
    removeFavorite: async (_, { id }) => {},
  },
}
