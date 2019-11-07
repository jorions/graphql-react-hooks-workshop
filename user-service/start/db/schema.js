'use strict'

const { gql } = require('apollo-server')

const typeDefs = gql`
  extend type Query {
    user(id: ID!): UserResponse!
  }

  extend type Mutation {
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

  type User @key(fields: "id") {
    id: ID!
    email: String!
  }
`

module.exports = typeDefs
