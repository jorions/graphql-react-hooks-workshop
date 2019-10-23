'use strict'

const { gql } = require('apollo-server')

// This alternate schema shows the use of inputs and interfaces

const typeDefs = gql`
  # extend Query because we are composing multiple schemas together
  extend type Query {
    user(id: ID!): UserResponse!
  }

  # extend Mutation because we are composing multiple schemas together
  extend type Mutation {
    signUp(user: UserInput): TokenResponse!
    logIn(user: UserInput): TokenResponse!
  }

  input UserInput {
    email: String!
    password: String!
  }

  interface BaseUserResponse {
    success: Boolean!
    "A failure code"
    message: String
  }

  # The BaseUserResponse contains success and message, so we must implement them here
  type UserResponse implements BaseUserResponse {
    user: User
    success: Boolean!
    "A failure code"
    message: String
  }

  # The BaseUserResponse contains success and message, so we must implement them here
  type TokenResponse implements BaseUserResponse {
    "A JWT-encoded token"
    token: String
    success: Boolean!
    "A failure code"
    message: String
  }

  # Define user, and use the @key directive to identify that other schemas which
  # extend this type will uniquely identify a particular instance of this type
  # based on the "id" field.
  type User @key(fields: "id") {
    id: ID!
    email: String!
  }
`

/*
Can query the browser with:

query User($id: ID!) {
  user(id: $id) {
    success
    message
    user {
    	email
    }
  }
}

query LogIn($user: UserInput!) {
  logIn(user: $user) {
    success
    message
    token
  }
}

mutation SignUp($user: UserInput!) {
  signUp(user: $user) {
    success
    message
    token
  }
}

{
  "user": {
    "email": "test@email.com",
  	"password": "test"
  },
  "id": 1
}

===========

We will need to update the 2nd argument in the logIn and signUp resolvers
  from: { email, password }
  to: { user: { email, password } }

===========

We could also add fragments to our queries with something like:

fragment UserResponseFields on UserResponse {
  success
  message
}

fragment TokenResponseFields on TokenResponse {
  success
  message
}

query User($id: ID!) {
  user(id: $id) {
    ...UserResponseFields
    user {
    	email
    }
  }
}

query LogIn($user: UserInput!) {
  logIn(user: $user) {
    ...TokenResponseFields
    token
  }
}

mutation SignUp($user: UserInput!) {
  signUp(user: $user) {
    ...TokenResponseFields
    token
  }
}
*/

module.exports = typeDefs
