'use strict'

module.exports = {
  Query: {
    user: async (_, { id }, { dataSources }) => {
      const user = await dataSources.userAPI.findById({ id })
      return user.error ? { success: false, message: user.error } : { success: true, user }
    },
  },
  Mutation: {
    signUp: async (_, { email, password }) => {},
    logIn: async (_, { email, password }) => {},
  },
}
