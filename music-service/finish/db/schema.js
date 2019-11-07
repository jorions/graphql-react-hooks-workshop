'use strict'

const { gql } = require('apollo-server')

const typeDefs = gql`
  # extend Query because we are composing multiple schemas together
  extend type Query {
    # Get most recently-favorited songs on site
    # Don't return a SongResponse because if there is a failure it is a straight
    # up error, not something like a non-existent ID
    recentFavorites: [Song]!
    # Get full song info, including lyrics
    song(id: ID!): SongResponse!
    # This is used to demonstrate local vs remote query resolving
    localResolverTest(id: ID!): User
  }

  extend type Mutation {
    # Add song to your favorites
    addFavorite(artist: String!, name: String!, reason: Reason!): SongResponse!
    # Update reason for song favorite
    updateFavorite(id: ID!, reason: Reason!): SongResponse!
    # Remove song from your favorites
    removeFavorite(id: ID!): SongResponse!
  }

  type SongResponse {
    success: Boolean!
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

  # Define user, and use the @key directive to identify that other schemas which
  # extend this type will uniquely identify a particular instance of this type
  # based on the "id" field.
  # The @external directive identfies that the "id" comes from a different service
  extend type User @key(fields: "id") {
    id: ID! @external
    favorites: [Song]!
  }
`

module.exports = typeDefs
