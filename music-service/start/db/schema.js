'use strict'

const { gql } = require('apollo-server')

const typeDefs = gql`
  extend type Query {
    recentFavorites: [Song]!
    song(id: ID!): SongResponse!
  }

  extend type Mutation {
    addFavorite(artist: String!, name: String!, reason: Reason!): SongResponse!
    updateFavorite(id: ID!, reason: Reason!): SongResponse!
    removeFavorite(id: ID!): SongResponse!
  }

  type SongResponse {
    success: Boolean!
    "A failure code"
    message: String
    song: Song
  }

  type Song {
    id: ID!
    artist: String!
    name: String!
    lyrics: String
    reason: Reason!
    createdAt: String
    user: User
  }

  enum Reason {
    LYRICS
    SOUND
    EVERYTHING
  }

  extend type User @key(fields: "id") {
    id: ID! @external
    favorites: [Song]!
  }
`

module.exports = typeDefs
