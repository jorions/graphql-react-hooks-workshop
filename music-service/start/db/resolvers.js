'use strict'

const { ForbiddenError } = require('apollo-server')

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
    addFavorite: async (_, { artist, name, reason }, { dataSources, userId }) => {
      if (!userId) throw new ForbiddenError('You do not have permission to make this change')
      const song = await dataSources.songAPI.addFavorite({ artist, name, reason, userId })
      return song.error ? { success: false, message: song.error } : { success: true, song }
    },
    updateFavorite: async (_, { id, reason }, { dataSources, userId }) => {
      if (!userId) throw new ForbiddenError('You do not have permission to make this change')
      const song = await dataSources.songAPI.updateFavorite({ id, reason, userId })
      return song.error ? { success: false, message: song.error } : { success: true, song }
    },
    removeFavorite: async (_, { id }, { dataSources, userId }) => {
      if (!userId) throw new ForbiddenError('You do not have permission to make this change')
      const song = await dataSources.songAPI.removeFavorite({ id, userId })
      return song.error ? { success: false, message: song.error } : { success: true, song }
    },
  },
  Song: {
    user: song => ({ __typeName: 'User', id: song.userId }),
  },
  User: {
    favorites: ({ id }, _, { dataSources }) => dataSources.songAPI.findByUserId({ userId: id }),
  },
}
