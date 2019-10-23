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
    // This is a resolver for demonstrating the difference in behavior between using
    // a User provided by a local query, and a user provided by a query from another service.
    // Check out the User.favorites resolver below for more about this.
    localResolverTest: (_, { id }) => ({ id, test: 'THIS IS A TEST' }),
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
  // If we wanted to get the lyrics for a song other than directly through the
  // lyrics query, we would need to define a resolver for that here.
  Song: {
    // This creates the initial object for a user when getting Song.user. Fields
    // other than __typeName and id will be ignored because the __typename is always
    // provided, and id was identified as the field to match on in the User Service's
    // schema definition of the User type:
    //   type User @key(fields: "id")
    //
    // In the User Service, the User __resolveReference will receive this object,
    // and then use the ID to fetch the appropriate info from the DB. Whatever it
    // returns is what the final resolved User becomes. When running this service
    // on its own, you will at least get the minimum functionality of Song.user.id
    user: song => ({ __typeName: 'User', id: song.userId }),
  },
  User: {
    // Note that the parent which we get { id } from is the parent returned by whatever
    // query is being run to request this "favorites" key. If the client asked for:
    //   user(id: $id) { user { favorites { artist } } }
    // we would hit the "user" query defined in the User Service, and receive back:
    //   { __typename: 'User', id }
    // with the "id" returned by that user query. Note that the fields we pass
    // between services are dictated by which fields we pass to the @key attribute
    // when defining the shared schema entity. Because the User type was defined
    // as a shared entity with @key(fields: 'id') the id field is passed around.
    //
    // If we had defined it with @key(fields: 'email') then we would be passing around:
    //   { __typename: 'User', email }
    // but instead we pass around:
    //   { __typename: 'User', id }
    //
    // Similarly, if the client asked for:
    //   testLocalUser(id: $id) { id }
    // that query is defined here, not in the User Service, so instead of only receiving:
    //   { __typename: 'User', id }
    // from the User Service we would be able to resolve everything locally, and
    // receive the full object defined locally from the testLocalUser query:
    //   { id, test: "THIS IS A TEST" }
    favorites: ({ id }, _, { dataSources }) => dataSources.songAPI.findByUserId({ userId: id }),
  },
}
