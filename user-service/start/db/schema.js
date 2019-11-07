'use strict'

const { gql } = require('apollo-server')

const typeDefs = gql`
  type Query {
    user(id: ID!): UserResponse!
  }

  type Mutation {
    signUp(email: String!, password: String!): UserResponse!
    logIn(email: String!, password: String!): UserResponse!
  }

  type UserResponse {
    success: Boolean!
    "A failure code"
    message: String
    "A JWT-encoded token"
    token: String
    user: User
  }

  type User {
    id: ID!
    email: String!
  }
`

module.exports = typeDefs
