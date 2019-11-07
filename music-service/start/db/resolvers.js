'use strict'

module.exports = {
  Query: {
    recentFavorites: (_, __, { dataSources }) => dataSources.songAPI.recentFavorites(),
    song: async (_, { id }) => {},
  },
  Mutation: {
    addFavorite: async (_, { artist, name, reason }) => {},
    updateFavorite: async (_, { id, reason }) => {},
    removeFavorite: async (_, { id }) => {},
  },
}
