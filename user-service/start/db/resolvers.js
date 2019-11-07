'use strict'

const jwt = require('jsonwebtoken')

const { TOKEN_SECRET } = process.env

const generateToken = ({ email, id }) => jwt.sign({ data: { email, id } }, TOKEN_SECRET, { expiresIn: '24h' })

module.exports = {
  Query: {
    user: async (_, { id }, { dataSources }) => {
      const user = await dataSources.userAPI.findById({ id })
      return user.error ? { success: false, message: user.error } : { success: true, user }
    },
  },
  Mutation: {
    signUp: async (_, { email, password }, { dataSources }) => {
      const user = await dataSources.userAPI.signUp({ email, password })
      if (user.error) return { success: false, message: user.error }

      const token = await generateToken(user)

      return { success: true, token }
    },
    logIn: async (_, { email, password }, { dataSources }) => {
      const user = await dataSources.userAPI.logIn({ email, password })
      if (user.error) return { success: false, message: user.error }

      const token = await generateToken(user)

      return { success: true, token }
    },
  },
  User: {
    // eslint-disable-next-line no-underscore-dangle
    async __resolveReference(serviceObject, { dataSources }) {
      const { id } = serviceObject
      const user = await dataSources.userAPI.findById({ id })
      if (user.error) return null // When there is no match, just return null
      return { ...serviceObject, ...user }
    },
  },
}
