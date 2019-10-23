'use strict'

// This file is used to show what the core functional schema looks like without federation

const { gql } = require('apollo-server')

const typeDefs = gql`
  type Query {
    # Get most recently-favorited songs on site
    recentFavorites: [Song]!
    # Get full song info, including lyrics
    song(id: ID!): SongResponse!
    # Get info for a user
    user(id: ID!): UserResponse!
  }

  type Mutation {
    # Add song to your favorites
    addFavorite(artist: String!, name: String!, reason: Reason!): SongResponse!
    # Update reason for song favorite
    updateFavorite(id: ID!, reason: Reason!): SongResponse!
    # Remove song from your favorites
    removeFavorite(id: ID!): SongResponse!
    # Create user account
    signUp(email: String!, password: String!): UserResponse!
    # Log user in
    logIn(email: String!, password: String!): UserResponse
  }

  type UserResponse {
    success: Boolean!
    "A failure code"
    message: String
    "A JWT-encoded token"
    token: String
    user: User
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
    user: User!
  }

  type User {
    id: ID!
    email: String!
    favorites: [Song]!
  }

  enum Reason {
    LYRICS
    SOUND
    EVERYTHING
  }
`

module.exports = typeDefs
