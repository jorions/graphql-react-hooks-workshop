'use strict'

module.exports = {
  Query: {
    user: async (_, { id }) => {},
  },
  Mutation: {
    signUp: async (_, { email, password }) => {},
    logIn: async (_, { email, password }) => {},
  },
}
