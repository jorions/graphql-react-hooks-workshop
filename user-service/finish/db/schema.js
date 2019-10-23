'use strict'

const { gql } = require('apollo-server')

const typeDefs = gql`
  # extend Query because we are composing multiple schemas together
  extend type Query {
    user(id: ID!): UserResponse!
  }

  # extend Mutation because we are composing multiple schemas together
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

  # Define user, and use the @key directive to identify that other schemas which
  # extend this type will uniquely identify a particular instance of this type
  # based on the "id" field.
  # The fields we define here as the unique identifiers are the ones which will
  # be passed around between services. This is why our resolvers all receive
  #   { __typename: 'User', id }
  # If we had matched on the "email" field instead, each resolver would receive
  #   { __typename: 'User', email }
  type User @key(fields: "id") {
    id: ID!
    email: String!
    # This is used to demonstrate the use of default vs defined resolvers
    defaultResolverTest: DefaultResolverTest
  }

  # This is used to demonstrate the use of default vs defined resolvers
  type DefaultResolverTest {
    innerKey: String!
  }
`

/*
Can query the browser with

query User($id: ID!) {
  user(id: $id) {
    success
    message
    user {
    	email
      defaultResolverTest {
      	innerKey
      }
    }
  }
}

query LogIn($email: String!, $password: String!) {
  logIn(email: $email, password: $password) {
    success
    message
    token
  }
}

mutation SignUp($email: String!, $password: String!) {
  signUp(email: $email, password: $password) {
    success
    message
    token
  }
}

{
  "email": "test@email.com",
  "password": "test",
  "id": 1
}
*/

module.exports = typeDefs
